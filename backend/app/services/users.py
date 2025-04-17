import asyncpg
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
from app.config.db import get_pool
from fastapi import Depends
from app.models.user import User, UserList
from app.services.lists import ListService, get_list_service
from app.models.list import WordList
from typing import List, Optional
from datetime import datetime, date, timedelta


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
        try:
            user_record = await self.pool.fetchrow(query, user_id)
            if user_record is None:
                raise UserNotFoundError(f"User with ID {user_id} not found")
            return User(**user_record)
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
        try:
            user_record = await self.pool.fetchrow(query, *params)
            if user_record is None:
                raise UserNotFoundError(
                    f"User with Clerk ID {clerk_id} not found for update"
                )
            return User(**user_record)
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
            INSERT INTO word_progress (user_id, word_id, recognition_mastery_score, usage_mastery_score, practice_count, number_of_times_to_practice, success_count)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        """
        # Check if user stats exist
        check_stats_query = """
            SELECT COUNT(*) FROM user_stats
            WHERE user_id = $1
        """

        try:
            async with self.pool.acquire() as conn:
                async with conn.transaction():
                    # Ensure user stats exist
                    stats_count = await conn.fetchval(check_stats_query, user_id)
                    if stats_count == 0:
                        await self._create_default_user_stats(user_id)

                    # Create the user list
                    user_list_record = await conn.fetchrow(query, user_id, list_id)
                    word_ids = await conn.fetch(word_ids_query, list_id)

                    # Create word progress for each word
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
        try:
            await self.pool.execute(query, user_id, list_id)
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
        """Update a user's progress for a specific word.

        This handles direct value updates with integer values.
        """
        # First check if the word progress record exists
        check_query = """
            SELECT * FROM word_progress
            WHERE user_id = $1 AND word_id = $2
        """
        try:
            record = await self.pool.fetchrow(
                check_query, user_id, progress_data.word_id
            )

            if not record:
                # Create a new progress record if it doesn't exist
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

            # Build update query dynamically based on provided fields
            update_fields = []
            params = [user_id, progress_data.word_id]  # Start with user_id and word_id
            param_index = 3  # Start from 3 since we already have two parameters

            # Process each field
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

            # Handle number_of_times_to_practice
            if progress_data.number_of_times_to_practice is not None:
                update_fields.append(f"number_of_times_to_practice = ${param_index}")
                params.append(progress_data.number_of_times_to_practice)
                param_index += 1

            # Add updated_at
            update_fields.append("updated_at = CURRENT_TIMESTAMP")

            # If there are no fields to update, just return the current record
            if not update_fields:
                return WordProgress(**record)

            # Create update query
            update_query = f"""
                UPDATE word_progress
                SET {', '.join(update_fields)}
                WHERE user_id = $1 AND word_id = $2
                RETURNING *
            """

            # Execute update
            updated_record = await self.pool.fetchrow(update_query, *params)
            return WordProgress(**updated_record)

        except Exception as e:
            raise Exception(f"Error updating word progress: {str(e)}")

    async def get_user_stats(self, user_id: int) -> FullUserStats:
        """Get a user's stats formatted for the frontend."""
        stats_query = """
            SELECT * FROM user_stats
            WHERE user_id = $1
        """

        # Query for last practiced time
        last_active_query = """
            SELECT MAX(updated_at) as last_active 
            FROM word_progress 
            WHERE user_id = $1
        """

        # Query for words mastered
        words_mastered_query = """
            SELECT COUNT(*) 
            FROM word_progress 
            WHERE user_id = $1 AND recognition_mastery_score >= 3
        """

        # Query for today's practice count
        today_practiced_query = """
            SELECT COUNT(*) 
            FROM word_progress 
            WHERE user_id = $1 AND DATE(updated_at) = CURRENT_DATE
        """

        # Query for today's practice time (assume we store this in minutes)
        today_time_query = """
            SELECT COALESCE(SUM(practice_time), 0) as practice_time
            FROM user_practice_sessions 
            WHERE user_id = $1 AND DATE(created_at) = CURRENT_DATE
        """

        try:
            # Get basic stats
            stats_record = await self.pool.fetchrow(stats_query, user_id)
            if not stats_record:
                # If no stats exist yet, create a default record
                stats_record = await self._create_default_user_stats(user_id)

            # Get last active date
            last_active_record = await self.pool.fetchrow(last_active_query, user_id)
            last_active = (
                last_active_record["last_active"] if last_active_record else None
            )

            # Get words mastered count
            words_mastered_record = await self.pool.fetchrow(
                words_mastered_query, user_id
            )
            words_mastered = (
                words_mastered_record["count"] if words_mastered_record else 0
            )

            # Get today's practice stats
            today_practiced_record = await self.pool.fetchrow(
                today_practiced_query, user_id
            )
            words_practiced_today = (
                today_practiced_record["count"] if today_practiced_record else 0
            )

            # Try to get practice time, but don't fail if table doesn't exist yet
            try:
                today_time_record = await self.pool.fetchrow(today_time_query, user_id)
                practice_time_today = (
                    today_time_record["practice_time"] if today_time_record else 0
                )
            except:
                practice_time_today = 0

            # Build the response object
            return FullUserStats(
                diamonds=stats_record["diamonds"],
                streak=stats_record["current_streak"],
                lastActive=last_active,
                dailyProgress=DailyProgress(
                    wordsPracticed=words_practiced_today,
                    totalWordsGoal=10,  # Default goal, could be customized per user
                    practiceTime=practice_time_today,
                    practiceTimeGoal=30,  # Default goal, could be customized per user
                ),
                learningInsights=LearningInsights(
                    wordsMastered=words_mastered,
                    accuracy=stats_record["average_accuracy"],
                ),
            )
        except Exception as e:
            raise Exception(f"Error fetching user stats: {str(e)}")

    async def _create_default_user_stats(self, user_id: int) -> dict:
        """Create default stats for a user if they don't exist yet."""
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
            # Try a slightly different approach if previous one fails
            try:
                # Get the next sequence value for id manually
                seq_query = "SELECT nextval('user_stats_id_seq')"
                seq_result = await self.pool.fetchval(seq_query)

                # Insert with explicit ID
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
        """Update a user's stats."""
        # First check if the stats record exists
        check_query = """
            SELECT * FROM user_stats
            WHERE user_id = $1
        """

        try:
            record = await self.pool.fetchrow(check_query, user_id)

            if not record:
                # Create default record if it doesn't exist
                record = await self._create_default_user_stats(user_id)

            # Build update query dynamically based on provided fields
            update_fields = []
            params = [user_id]  # Start with user_id
            param_index = 2  # Start from 2 since we already have user_id

            update_dict = stats_update.model_dump(exclude_unset=True)
            for field, value in update_dict.items():
                if value is not None:
                    update_fields.append(f"{field} = ${param_index}")
                    params.append(value)
                    param_index += 1

            # If there are no fields to update, just return the current record
            if not update_fields:
                return UserStats(**record)

            # Add updated_at
            update_fields.append("updated_at = CURRENT_TIMESTAMP")

            # Create update query
            update_query = f"""
                UPDATE user_stats
                SET {', '.join(update_fields)}
                WHERE user_id = $1
                RETURNING *
            """

            # Execute update
            updated_record = await self.pool.fetchrow(update_query, *params)
            return UserStats(**updated_record)

        except Exception as e:
            raise Exception(f"Error updating user stats: {str(e)}")

    async def increment_diamonds(self, user_id: int, amount: int) -> UserStats:
        """Increment a user's diamonds by the specified amount."""
        # First check if user stats exist
        check_query = """
            SELECT COUNT(*) FROM user_stats
            WHERE user_id = $1
        """

        try:
            # Check if stats exist
            count = await self.pool.fetchval(check_query, user_id)

            if count == 0:
                # Create default stats first
                await self._create_default_user_stats(user_id)

            # Update diamonds
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
        """Update a user's streak based on activity."""
        # Get current stats
        stats_query = """
            SELECT * FROM user_stats
            WHERE user_id = $1
        """

        # Check if stats exist
        check_query = """
            SELECT COUNT(*) FROM user_stats
            WHERE user_id = $1
        """

        # Get last activity date
        last_activity_query = """
            SELECT MAX(updated_at) as last_active 
            FROM word_progress 
            WHERE user_id = $1
        """

        try:
            # Check if stats exist
            count = await self.pool.fetchval(check_query, user_id)
            if count == 0:
                # Create default stats first
                stats_record = await self._create_default_user_stats(user_id)
            else:
                stats_record = await self.pool.fetchrow(stats_query, user_id)

            last_activity = await self.pool.fetchrow(last_activity_query, user_id)

            # Default to today if no activity found
            last_active_date = (
                last_activity["last_active"].date()
                if last_activity["last_active"]
                else date.today()
            )
            current_date = date.today()

            current_streak = stats_record["current_streak"]
            longest_streak = stats_record["longest_streak"]

            # If last active was yesterday, increment streak
            if last_active_date == current_date - timedelta(days=1):
                current_streak += 1
            # If last active was before yesterday, reset streak to 1
            elif last_active_date < current_date - timedelta(days=1):
                current_streak = 1
            # If already active today, do nothing

            # Update longest streak if needed
            if current_streak > longest_streak:
                longest_streak = current_streak

            # Update the streak in the database
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
        """Record a user's practice session.

        Args:
            user_id: The ID of the user
            practice_time: Time spent practicing, in minutes
            session_type: Type of session (e.g., 'quiz', 'flashcard')
        """
        # Insert practice session record
        insert_query = """
            INSERT INTO user_practice_sessions 
            (user_id, practice_time, session_type)
            VALUES ($1, $2, $3)
        """

        # Update total practice time in user_stats
        update_stats_query = """
            UPDATE user_stats
            SET total_practice_time = total_practice_time + $2
            WHERE user_id = $1
        """

        try:
            # Record the practice session
            await self.pool.execute(insert_query, user_id, practice_time, session_type)

            # Update the total practice time in user_stats
            await self.pool.execute(update_stats_query, user_id, practice_time)

            # Make sure we update the streak as well
            await self.update_user_streak(user_id)
        except Exception as e:
            raise Exception(f"Error recording practice session: {str(e)}")


async def get_user_service(
    pool: asyncpg.Pool = Depends(get_pool),
    list_service: ListService = Depends(get_list_service),
) -> UserService:
    service = UserService(pool=pool, list_service=list_service)
    return service
