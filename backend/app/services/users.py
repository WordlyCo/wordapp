import asyncpg
from app.models.base import PaginatedPayload, PageInfo
from app.models.user import (
    UserCreate,
    UserUpdate,
    WordProgressUpdate,
    WordProgress,
    UserStats,
    UserStatsUpdate,
    FullUserStats,
    DailyProgress,
    LearningInsights,
    UserListAlreadyExistsError,
)
from app.models.word import Word
from app.config.db import get_pool
from fastapi import Depends
from app.models.user import User, UserList, UserPreferences
from app.services.lists import ListService, get_list_service
from app.models.list import WordList
from typing import List
from datetime import datetime, timedelta
import pytz


class UserNotFoundError(Exception):
    pass


class UserAlreadyExistsError(Exception):
    pass


class UserService:
    def __init__(self, pool: asyncpg.Pool, list_service: ListService):
        self.pool = pool
        self.list_service = list_service

    async def get_user_by_username(self, username: str) -> User:
        query = "SELECT * FROM users WHERE username = $1"
        try:
            user_record = await self.pool.fetchrow(query, username)
            if user_record is None:
                raise UserNotFoundError(f"User with username '{username}' not found")
            return User(**user_record)
        except Exception as e:
            if isinstance(e, UserNotFoundError):
                raise e
            raise Exception(f"Error fetching user by username: {str(e)}")

    async def get_user_by_email(self, email: str) -> tuple[User, str]:
        query = "SELECT * FROM users WHERE email = $1"
        try:
            user_record = await self.pool.fetchrow(query, email)
            if user_record is None:
                raise UserNotFoundError(f"User with email '{email}' not found")
            user = User(
                id=user_record["id"],
                username=user_record["username"],
                email=user_record["email"],
                clerk_id=user_record["clerk_id"],
                first_name=user_record["first_name"],
                last_name=user_record["last_name"],
                created_at=user_record["created_at"],
                updated_at=user_record["updated_at"],
            )
            return user, user_record["password_hash"]
        except Exception as e:
            if isinstance(e, UserNotFoundError):
                raise e
            raise Exception(f"Error fetching user by email: {str(e)}")

    async def get_user_by_id(self, user_id: int) -> User:
        query = "SELECT * FROM users WHERE id = $1"
        preferences_query = "SELECT * FROM user_preferences WHERE user_id = $1"
        try:
            user_record = await self.pool.fetchrow(query, user_id)
            if user_record is None:
                raise UserNotFoundError(f"User with ID {user_id} not found")
            preferences_record = await self.pool.fetchrow(preferences_query, user_id)
            if preferences_record is None:
                raise UserNotFoundError(f"User preferences with ID {user_id} not found")
            full_user_stats = await self.get_user_stats(user_id)
            return User(
                **user_record,
                preferences=UserPreferences(**preferences_record),
                user_stats=full_user_stats,
            )
        except Exception as e:
            if isinstance(e, UserNotFoundError):
                raise e
            raise Exception(f"Error fetching user by ID: {str(e)}")

    async def get_user_by_clerk_id(self, clerk_id: str) -> User:
        query = "SELECT * FROM users WHERE clerk_id = $1"
        try:
            user_record = await self.pool.fetchrow(query, clerk_id)
            if user_record is None:
                raise UserNotFoundError(f"User with Clerk ID {clerk_id} not found")
            return User(
                id=user_record["id"],
                username=user_record["username"],
                email=user_record["email"],
                clerk_id=user_record["clerk_id"],
                first_name=user_record["first_name"],
                last_name=user_record["last_name"],
                profile_picture_url=user_record["profile_picture_url"],
                bio=user_record["bio"],
                created_at=user_record["created_at"],
                updated_at=user_record["updated_at"],
            )
        except Exception as e:
            if isinstance(e, UserNotFoundError):
                raise e
            raise Exception(f"Error fetching user by Clerk ID: {str(e)}")

    async def create_user(self, user: UserCreate) -> User:
        query = """
            INSERT INTO users (email, username, clerk_id, first_name, last_name) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, email, username, clerk_id, first_name, last_name, created_at, updated_at
        """
        try:
            async with self.pool.acquire() as conn:
                async with conn.transaction():
                    user_record = await conn.fetchrow(
                        query,
                        user.email,
                        user.username,
                        user.clerk_id,
                        user.first_name,
                        user.last_name,
                    )
                    if user_record is None:
                        raise Exception("Failed to create user record.")

                    user_id = user_record["id"]
                    stats_query = """
                        INSERT INTO user_stats 
                        (id, user_id, diamonds, total_words_learned, current_streak, 
                         longest_streak, total_practice_time, average_accuracy)
                        VALUES (DEFAULT, $1, 0, 0, 0, 0, 0, 0)
                    """
                    await conn.execute(stats_query, user_id)

                    preferences_query = """
                       INSERT INTO user_preferences (user_id) VALUES ($1)
                    """
                    await conn.execute(preferences_query, user_id)

                    return User(**user_record)
        except asyncpg.UniqueViolationError as e:
            if "users_email_key" in str(e):
                raise UserAlreadyExistsError(
                    f"User with email '{user.email}' already exists"
                )
            elif "users_username_key" in str(e):
                raise UserAlreadyExistsError(
                    f"User with username '{user.username}' already exists"
                )
            else:
                raise UserAlreadyExistsError(
                    f"User creation failed due to unique constraint: {e}"
                )
        except Exception as e:
            raise Exception(f"Error creating user: {str(e)}")

    async def update_user_by_clerk_id(
        self, clerk_id: str, user_update_data: UserUpdate
    ) -> User:
        update_fields = user_update_data.model_dump(exclude_unset=True)

        if not update_fields:
            return await self.get_user_by_clerk_id(clerk_id)

        params = []
        set_clauses = []
        param_index = 1

        for field, value in update_fields.items():
            if field in [
                "email",
                "username",
                "first_name",
                "last_name",
                "profile_picture_url",
                "bio",
            ]:
                set_clauses.append(f"{field} = ${param_index}")
                params.append(value)
                param_index += 1

        params.append(clerk_id)

        query = f"""
            UPDATE users
            SET {', '.join(set_clauses)}, updated_at = CURRENT_TIMESTAMP
            WHERE clerk_id = ${param_index}
            RETURNING id, clerk_id, email, username, first_name, last_name, profile_picture_url, bio, created_at, updated_at
        """

        preferences_params = []
        preferences_set_clauses = []
        for field, value in update_fields.get("preferences", {}).items():
            if field in [
                "theme",
                "difficulty_level",
                "daily_word_goal",
                "notifications_enabled",
                "time_zone",
            ]:
                preferences_set_clauses.append(f"{field} = ${param_index}")
                preferences_params.append(value)
                param_index += 1

        preferences_params.append(clerk_id)

        preferences_query = f"""
            UPDATE user_preferences
            SET {', '.join(preferences_set_clauses)}, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ${param_index}
            RETURNING user_id, theme, difficulty_level, daily_word_goal, notifications_enabled, time_zone, created_at, updated_at
        """

        try:
            user_record = await self.pool.fetchrow(query, *params)
            if user_record is None:
                raise UserNotFoundError(
                    f"User with Clerk ID {clerk_id} not found for update"
                )
            preferences_record = await self.pool.fetchrow(
                preferences_query, *preferences_params
            )
            if preferences_record is None:
                raise UserNotFoundError(
                    f"User preferences with Clerk ID {clerk_id} not found for update"
                )
            return User(
                **user_record, preferences=UserPreferences(**preferences_record)
            )
        except asyncpg.UniqueViolationError as e:
            if "users_email_key" in str(e):
                raise UserAlreadyExistsError(
                    f"Cannot update: email '{user_update_data.email}' already exists for another user."
                )
            elif "users_username_key" in str(e):
                raise UserAlreadyExistsError(
                    f"Cannot update: username '{user_update_data.username}' already exists for another user."
                )
            else:
                raise UserAlreadyExistsError(
                    f"Update failed due to unique constraint: {e}"
                )
        except Exception as e:
            if isinstance(e, UserNotFoundError):
                raise e
            raise Exception(f"Error updating user with Clerk ID {clerk_id}: {str(e)}")

    async def delete_user(self, user_id: int) -> bool:
        query = "DELETE FROM users WHERE id = $1"
        try:
            result = await self.pool.execute(query, user_id)
            if result == "DELETE 0":
                raise UserNotFoundError(
                    f"User with ID {user_id} not found for deletion"
                )
            return True
        except Exception as e:
            if isinstance(e, UserNotFoundError):
                raise e
            raise Exception(f"Error deleting user with ID {user_id}: {str(e)}")

    async def delete_user_by_clerk_id(self, clerk_id: str) -> bool:
        query = "DELETE FROM users WHERE clerk_id = $1"
        try:
            result = await self.pool.execute(query, clerk_id)
            return result == "DELETE 1"
        except Exception as e:
            raise Exception(f"Error deleting user with Clerk ID {clerk_id}: {str(e)}")

    async def create_user_list(self, user_id: int, list_id: int) -> UserList:
        query = """
            INSERT INTO user_lists (user_id, list_id)
            VALUES ($1, $2)
            RETURNING user_id, list_id, created_at, updated_at
        """
        word_ids_query = """
            SELECT word_id FROM list_words WHERE list_id = $1
        """
        word_progress_query = """
            INSERT INTO word_progress (
                user_id, 
                word_id, 
                recognition_mastery_score, 
                usage_mastery_score, 
                practice_count, 
                number_of_times_to_practice, 
                success_count,
                created_at,
                updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP - INTERVAL '30 days', CURRENT_TIMESTAMP - INTERVAL '30 days')
        """

        check_stats_query = """
            SELECT COUNT(*) FROM user_stats
            WHERE user_id = $1
        """

        try:
            async with self.pool.acquire() as conn:
                async with conn.transaction():
                    stats_count = await conn.fetchval(check_stats_query, user_id)
                    if stats_count == 0:
                        await self._create_default_user_stats(user_id)

                    user_list_record = await conn.fetchrow(query, user_id, list_id)
                    word_ids = await conn.fetch(word_ids_query, list_id)

                    for record in word_ids:
                        word_id = record["word_id"]
                        await conn.execute(
                            word_progress_query, user_id, word_id, 0, 0, 0, 5, 0
                        )

                    if user_list_record is None:
                        raise Exception("Failed to create user list record.")
                    return UserList(**user_list_record)
        except asyncpg.UniqueViolationError as e:
            raise UserListAlreadyExistsError(
                f"User list with user_id {user_id} and list_id {list_id} already exists"
            )
        except Exception as e:
            raise Exception(f"Error creating user list: {str(e)}")

    async def remove_list_from_user_lists(self, user_id: int, list_id: int) -> bool:
        query = """
            DELETE FROM user_lists
            WHERE user_id = $1 AND list_id = $2
        """
        word_progress_query = """   
            DELETE FROM word_progress
            WHERE user_id = $1
        """
        try:
            await self.pool.execute(query, user_id, list_id)
            await self.pool.execute(word_progress_query, user_id)
            return True
        except Exception as e:
            raise Exception(f"Error removing list from user lists: {str(e)}")

    async def get_user_lists(self, user_id: int) -> List[WordList]:
        query = """
            SELECT list_id
            FROM user_lists
            WHERE user_id = $1
        """
        try:
            user_list_ids = await self.pool.fetch(query, user_id)

            user_lists = []
            for record in user_list_ids:
                user_list = await self.list_service.get_list_by_id(
                    record["list_id"], user_id
                )
                user_lists.append(user_list)
            return user_lists
        except Exception as e:
            raise Exception(f"Error fetching user lists: {str(e)}")

    async def update_word_progress(
        self, user_id: int, progress_data: WordProgressUpdate
    ) -> WordProgress:
        check_query = """
            SELECT * FROM word_progress
            WHERE user_id = $1 AND word_id = $2
        """
        try:
            record = await self.pool.fetchrow(
                check_query, user_id, progress_data.word_id
            )

            if not record:
                insert_query = """
                    INSERT INTO word_progress 
                    (user_id, word_id, recognition_mastery_score, usage_mastery_score, 
                     practice_count, success_count, number_of_times_to_practice)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING *
                """
                new_record = await self.pool.fetchrow(
                    insert_query,
                    user_id,
                    progress_data.word_id,
                    progress_data.recognition_mastery_score or 0,
                    progress_data.usage_mastery_score or 0,
                    progress_data.practice_count or 0,
                    progress_data.success_count or 0,
                    progress_data.number_of_times_to_practice or 5,
                )
                return WordProgress(**new_record)

            update_fields = []
            params = [user_id, progress_data.word_id]
            param_index = 3

            if progress_data.recognition_mastery_score is not None:
                update_fields.append(f"recognition_mastery_score = ${param_index}")
                params.append(progress_data.recognition_mastery_score)
                param_index += 1

            if progress_data.usage_mastery_score is not None:
                update_fields.append(f"usage_mastery_score = ${param_index}")
                params.append(progress_data.usage_mastery_score)
                param_index += 1

            if progress_data.practice_count is not None:
                update_fields.append(f"practice_count = ${param_index}")
                params.append(progress_data.practice_count)
                param_index += 1

            if progress_data.success_count is not None:
                update_fields.append(f"success_count = ${param_index}")
                params.append(progress_data.success_count)
                param_index += 1

            if progress_data.number_of_times_to_practice is not None:
                update_fields.append(f"number_of_times_to_practice = ${param_index}")
                params.append(progress_data.number_of_times_to_practice)
                param_index += 1

            update_fields.append("updated_at = CURRENT_TIMESTAMP")

            if not update_fields:
                return WordProgress(**record)

            update_query = f"""
                UPDATE word_progress
                SET {', '.join(update_fields)}
                WHERE user_id = $1 AND word_id = $2
                RETURNING *
            """

            updated_record = await self.pool.fetchrow(update_query, *params)
            return WordProgress(**updated_record)

        except Exception as e:
            raise Exception(f"Error updating word progress: {str(e)}")

    async def get_word_progress(
        self, user_id: int, page: int = 1, per_page: int = 10
    ) -> PaginatedPayload[Word]:
        offset = (page - 1) * per_page

        query = """
            SELECT 
                wp.recognition_mastery_score, 
                wp.usage_mastery_score, 
                wp.practice_count, 
                wp.success_count, 
                wp.number_of_times_to_practice, 
                wp.created_at as wp_created_at, 
                wp.updated_at as wp_updated_at,
                w.id,
                w.word,
                w.definition,
                w.part_of_speech,
                w.difficulty_level,
                w.etymology,
                w.usage_notes,
                w.audio_url,
                w.image_url,
                w.examples,
                w.synonyms,
                w.antonyms,
                w.tags,
                w.created_at as w_created_at,
                w.updated_at as w_updated_at
            FROM word_progress wp
            JOIN words w ON wp.word_id = w.id
            WHERE wp.user_id = $1
            ORDER BY wp.updated_at DESC
            LIMIT $2 OFFSET $3
        """

        count_query = """
            SELECT COUNT(*) as total
            FROM word_progress
            WHERE user_id = $1
        """

        try:
            async with self.pool.acquire() as conn:
                total_count = await conn.fetchval(count_query, user_id)
                records = await conn.fetch(query, user_id, per_page, offset)

                items = []
                for record in records:
                    progress = WordProgress(
                        user_id=user_id,
                        word_id=record["id"],
                        recognition_mastery_score=record["recognition_mastery_score"],
                        usage_mastery_score=record["usage_mastery_score"],
                        practice_count=record["practice_count"],
                        success_count=record["success_count"],
                        number_of_times_to_practice=record[
                            "number_of_times_to_practice"
                        ],
                        created_at=record["wp_created_at"],
                        updated_at=record["wp_updated_at"],
                    )
                    word = Word(
                        id=record["id"],
                        word=record["word"],
                        definition=record["definition"],
                        part_of_speech=record["part_of_speech"],
                        difficulty_level=record["difficulty_level"],
                        word_progress=progress,
                        etymology=record["etymology"],
                        usage_notes=record["usage_notes"],
                        audio_url=record["audio_url"],
                        image_url=record["image_url"],
                        examples=record["examples"],
                        synonyms=record["synonyms"],
                        antonyms=record["antonyms"],
                        tags=record["tags"],
                        created_at=record["w_created_at"],
                        updated_at=record["w_updated_at"],
                    )
                    items.append(word)

                total_pages = (total_count + per_page - 1) // per_page
                page_info = PageInfo(
                    page=page,
                    per_page=per_page,
                    total_items=total_count,
                    total_pages=total_pages,
                    has_previous_page=page > 1,
                    has_next_page=page < total_pages,
                )

                return PaginatedPayload(items=items, page_info=page_info)
        except Exception as e:
            raise Exception(f"Error retrieving word progress: {str(e)}")

    async def get_user_stats(self, user_id: int) -> FullUserStats:
        stats_query = """
            SELECT * FROM user_stats
            WHERE user_id = $1
        """

        last_active_query = """
            SELECT MAX(updated_at) as last_active 
            FROM word_progress 
            WHERE user_id = $1
        """

        words_mastered_query = """
            SELECT COUNT(*) 
            FROM word_progress 
            WHERE user_id = $1 AND recognition_mastery_score >= 5
        """

        today_practiced_query = """
            SELECT COUNT(*) 
            FROM word_progress 
            WHERE user_id = $1 
              AND DATE(updated_at) = CURRENT_DATE
              AND practice_count > 0
        """

        today_time_query = """
            SELECT COALESCE(SUM(practice_time), 0) as practice_time
            FROM user_practice_sessions 
            WHERE user_id = $1 AND DATE(created_at) = CURRENT_DATE
        """

        try:
            stats_record = await self.pool.fetchrow(stats_query, user_id)
            if not stats_record:
                stats_record = await self._create_default_user_stats(user_id)

            last_active_record = await self.pool.fetchrow(last_active_query, user_id)
            last_active = (
                last_active_record["last_active"] if last_active_record else None
            )

            words_mastered_record = await self.pool.fetchrow(
                words_mastered_query, user_id
            )
            words_mastered = (
                words_mastered_record["count"] if words_mastered_record else 0
            )

            today_practiced_record = await self.pool.fetchrow(
                today_practiced_query, user_id
            )
            words_practiced_today = (
                today_practiced_record["count"] if today_practiced_record else 0
            )

            try:
                today_time_record = await self.pool.fetchrow(today_time_query, user_id)
                practice_time_today = (
                    today_time_record["practice_time"] if today_time_record else 0
                )
            except:
                practice_time_today = 0

            return FullUserStats(
                diamonds=stats_record["diamonds"],
                streak=stats_record["current_streak"],
                lastActive=last_active,
                dailyProgress=DailyProgress(
                    wordsPracticed=words_practiced_today,
                    totalWordsGoal=10,
                    practiceTime=practice_time_today,
                    practiceTimeGoal=30,
                ),
                learningInsights=LearningInsights(
                    wordsMastered=words_mastered,
                    accuracy=stats_record["average_accuracy"],
                ),
            )
        except Exception as e:
            raise Exception(f"Error fetching user stats: {str(e)}")

    async def _create_default_user_stats(self, user_id: int) -> dict:
        query = """
            INSERT INTO user_stats 
            (id, user_id, diamonds, total_words_learned, current_streak, longest_streak, 
             total_practice_time, average_accuracy)
            VALUES (DEFAULT, $1, 0, 0, 0, 0, 0, 0)
            RETURNING *
        """
        try:
            return await self.pool.fetchrow(query, user_id)
        except Exception as e:
            try:
                seq_query = "SELECT nextval('user_stats_id_seq')"
                seq_result = await self.pool.fetchval(seq_query)

                alt_query = """
                    INSERT INTO user_stats 
                    (id, user_id, diamonds, total_words_learned, current_streak, longest_streak, 
                     total_practice_time, average_accuracy)
                    VALUES ($1, $2, 0, 0, 0, 0, 0, 0)
                    RETURNING *
                """
                return await self.pool.fetchrow(alt_query, seq_result, user_id)
            except Exception as inner_e:
                raise Exception(
                    f"Error creating default user stats: {str(e)}, tried alternate approach: {str(inner_e)}"
                )

    async def update_user_stats(
        self, user_id: int, stats_update: UserStatsUpdate
    ) -> UserStats:
        check_query = """
            SELECT * FROM user_stats
            WHERE user_id = $1
        """

        try:
            record = await self.pool.fetchrow(check_query, user_id)

            if not record:
                record = await self._create_default_user_stats(user_id)

            update_fields = []
            params = [user_id]
            param_index = 2

            update_dict = stats_update.model_dump(exclude_unset=True)
            for field, value in update_dict.items():
                if value is not None:
                    update_fields.append(f"{field} = ${param_index}")
                    params.append(value)
                    param_index += 1

            if not update_fields:
                return UserStats(**record)

            update_fields.append("updated_at = CURRENT_TIMESTAMP")

            update_query = f"""
                UPDATE user_stats
                SET {', '.join(update_fields)}
                WHERE user_id = $1
                RETURNING *
            """

            updated_record = await self.pool.fetchrow(update_query, *params)
            return UserStats(**updated_record)

        except Exception as e:
            raise Exception(f"Error updating user stats: {str(e)}")

    async def increment_diamonds(self, user_id: int, amount: int) -> UserStats:
        check_query = """
            SELECT COUNT(*) FROM user_stats
            WHERE user_id = $1
        """

        try:
            count = await self.pool.fetchval(check_query, user_id)

            if count == 0:
                await self._create_default_user_stats(user_id)

            query = """
                UPDATE user_stats
                SET diamonds = diamonds + $2, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = $1
                RETURNING *
            """

            record = await self.pool.fetchrow(query, user_id, amount)
            return UserStats(**record)
        except Exception as e:
            raise Exception(f"Error incrementing diamonds: {str(e)}")

    async def update_user_streak(self, user_id: int) -> UserStats:
        stats_query = """
            SELECT * FROM user_stats
            WHERE user_id = $1
        """

        check_query = """
            SELECT COUNT(*) FROM user_stats
            WHERE user_id = $1
        """

        last_activity_query = """
            SELECT MAX(updated_at) as last_active 
            FROM word_progress 
            WHERE user_id = $1
        """

        timezone_query = """
            SELECT time_zone
            FROM user_preferences
            WHERE user_id = $1
        """

        try:
            count = await self.pool.fetchval(check_query, user_id)
            if count == 0:
                stats_record = await self._create_default_user_stats(user_id)
            else:
                stats_record = await self.pool.fetchrow(stats_query, user_id)

            timezone_record = await self.pool.fetchrow(timezone_query, user_id)
            user_timezone = timezone_record["time_zone"] if timezone_record else "UTC"

            tz = pytz.timezone(user_timezone)

            current_date = datetime.now(tz).date()

            last_activity = await self.pool.fetchrow(last_activity_query, user_id)

            current_streak = stats_record["current_streak"]
            longest_streak = stats_record["longest_streak"]

            # Default to current date if no previous activity (new user)
            if not last_activity or not last_activity["last_active"]:
                # This is the user's first activity, set streak to 1
                current_streak = 1
            else:
                last_active_utc = last_activity["last_active"].replace(tzinfo=pytz.UTC)
                last_active_date = last_active_utc.astimezone(tz).date()

                # If last active was today, maintain current streak but ensure it's at least 1
                if last_active_date == current_date:
                    current_streak = max(current_streak, 1)
                # If last active was yesterday, increment streak
                elif last_active_date == current_date - timedelta(days=1):
                    current_streak += 1
                # If last active was before yesterday, reset streak to 1
                elif last_active_date < current_date - timedelta(days=1):
                    current_streak = 1

            # Update longest streak if needed
            if current_streak > longest_streak:
                longest_streak = current_streak

            update_query = """
                UPDATE user_stats
                SET current_streak = $2, longest_streak = $3, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = $1
                RETURNING *
            """

            updated_record = await self.pool.fetchrow(
                update_query, user_id, current_streak, longest_streak
            )
            return UserStats(**updated_record)

        except Exception as e:
            raise Exception(f"Error updating user streak: {str(e)}")

    async def record_practice_session(
        self, user_id: int, practice_time: int, session_type: str
    ) -> None:
        insert_query = """
            INSERT INTO user_practice_sessions 
            (user_id, practice_time, session_type)
            VALUES ($1, $2, $3)
        """

        update_stats_query = """
            UPDATE user_stats
            SET total_practice_time = total_practice_time + $2
            WHERE user_id = $1
        """

        try:
            await self.pool.execute(insert_query, user_id, practice_time, session_type)
            await self.pool.execute(update_stats_query, user_id, practice_time)
            await self.update_user_streak(user_id)
        except Exception as e:
            raise Exception(f"Error recording practice session: {str(e)}")

    async def update_user_preferences(
        self, user_id: int, preferences: UserPreferences
    ) -> UserPreferences:
        query = """
            UPDATE user_preferences
            SET preferences = $2
            WHERE user_id = $1
        """
        try:
            await self.pool.execute(query, user_id, preferences)
        except Exception as e:
            raise Exception(f"Error updating user preferences: {str(e)}")


async def get_user_service(
    pool: asyncpg.Pool = Depends(get_pool),
    list_service: ListService = Depends(get_list_service),
) -> UserService:
    service = UserService(pool=pool, list_service=list_service)
    return service
