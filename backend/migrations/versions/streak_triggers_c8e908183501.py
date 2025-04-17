"""streak_triggers

Revision ID: c8e908183501
Revises: ad371804b586
Create Date: 2025-04-16 22:01:31.478229

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import text


revision: str = "c8e908183501"
down_revision: Union[str, None] = "ad371804b586"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create a more basic logging table for debugging
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS streak_logs (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            action TEXT NOT NULL,
            old_streak INTEGER,
            new_streak INTEGER,
            user_timezone TEXT,
            user_local_date DATE,
            last_update_date DATE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        """
    )

    # Create a streak update tracking table to prevent multiple updates on the same day
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS streak_daily_tracker (
            user_id INTEGER PRIMARY KEY,
            last_processed_date DATE NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        """
    )

    # Create function to update user streaks - simplified and more robust
    op.execute(
        """
        CREATE OR REPLACE FUNCTION update_user_streak()
        RETURNS TRIGGER AS $$
        DECLARE
            user_tz TEXT;
            user_local_date DATE;
            last_update_date DATE;
            current_streak_val INTEGER;
            already_processed BOOLEAN;
        BEGIN
            -- Get user's timezone from preferences
            SELECT time_zone INTO user_tz
            FROM user_preferences
            WHERE user_id = NEW.user_id;
            
            -- If no timezone found, use default
            IF user_tz IS NULL THEN
                user_tz := 'America/Los_Angeles';
            END IF;
            
            -- Calculate current date in user's timezone
            user_local_date := (CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AT TIME ZONE user_tz)::DATE;
            
            -- CRITICAL: Check if we already processed today for this user
            -- We need to lock the row to prevent race conditions
            SELECT EXISTS (
                SELECT 1 FROM streak_daily_tracker 
                WHERE user_id = NEW.user_id AND last_processed_date = user_local_date
                FOR UPDATE
            ) INTO already_processed;
            
            -- If we already processed today, just exit
            IF already_processed THEN
                INSERT INTO streak_logs 
                (user_id, action, user_timezone, user_local_date)
                VALUES 
                (NEW.user_id, 'ALREADY_PROCESSED_TODAY', user_tz, user_local_date);
                RETURN NEW;
            END IF;
            
            -- Get user stats - handle the case of a new user with no stats yet
            SELECT 
                current_streak,
                (last_streak_updated_at AT TIME ZONE 'UTC' AT TIME ZONE user_tz)::DATE
            INTO 
                current_streak_val,
                last_update_date
            FROM user_stats
            WHERE user_id = NEW.user_id
            FOR UPDATE;  -- Lock the row until transaction completes
            
            -- Insert user stats record if it doesn't exist
            IF current_streak_val IS NULL THEN
                INSERT INTO user_stats 
                (user_id, diamonds, total_words_learned, current_streak, 
                 longest_streak, total_practice_time, average_accuracy, last_streak_updated_at)
                VALUES 
                (NEW.user_id, 0, 0, 0, 0, 0, 0.0, CURRENT_TIMESTAMP)
                ON CONFLICT (user_id) DO NOTHING;
                
                -- Get values again
                SELECT current_streak, (last_streak_updated_at AT TIME ZONE 'UTC' AT TIME ZONE user_tz)::DATE
                INTO current_streak_val, last_update_date
                FROM user_stats 
                WHERE user_id = NEW.user_id;
            END IF;
            
            -- Log initial state
            INSERT INTO streak_logs 
            (user_id, action, old_streak, user_timezone, user_local_date, last_update_date)
            VALUES 
            (NEW.user_id, 'TRIGGER_START', current_streak_val, user_tz, user_local_date, last_update_date);
            
            -- Only update streak if this is the first activity of the day
            IF last_update_date IS NULL OR last_update_date < user_local_date THEN
                -- Did they practice yesterday or is this a new streak?
                IF last_update_date IS NULL OR last_update_date = user_local_date - INTERVAL '1 day' THEN
                    -- Increment streak - it's consecutive
                    UPDATE user_stats
                    SET 
                        current_streak = current_streak + 1,
                        longest_streak = GREATEST(current_streak + 1, longest_streak),
                        last_streak_updated_at = CURRENT_TIMESTAMP
                    WHERE user_id = NEW.user_id
                    RETURNING current_streak INTO current_streak_val;
                    
                    -- Log the increment
                    INSERT INTO streak_logs 
                    (user_id, action, old_streak, new_streak, user_timezone, user_local_date, last_update_date)
                    VALUES 
                    (NEW.user_id, 'STREAK_INCREMENTED', current_streak_val - 1, current_streak_val, 
                     user_tz, user_local_date, last_update_date);
                ELSE
                    -- Reset streak - they missed a day
                    UPDATE user_stats
                    SET 
                        current_streak = 1,
                        last_streak_updated_at = CURRENT_TIMESTAMP
                    WHERE user_id = NEW.user_id;
                    
                    -- Log the reset
                    INSERT INTO streak_logs 
                    (user_id, action, old_streak, new_streak, user_timezone, user_local_date, last_update_date)
                    VALUES 
                    (NEW.user_id, 'STREAK_RESET', current_streak_val, 1, 
                     user_tz, user_local_date, last_update_date);
                END IF;
                
                -- Record that we processed this user today to prevent multiple updates
                INSERT INTO streak_daily_tracker (user_id, last_processed_date) 
                VALUES (NEW.user_id, user_local_date)
                ON CONFLICT (user_id) DO UPDATE 
                SET last_processed_date = user_local_date,
                    updated_at = CURRENT_TIMESTAMP;
                
            ELSE
                -- No streak update needed - already updated today
                INSERT INTO streak_logs 
                (user_id, action, old_streak, new_streak, user_timezone, user_local_date, last_update_date)
                VALUES 
                (NEW.user_id, 'NO_UPDATE_NEEDED', current_streak_val, current_streak_val, 
                 user_tz, user_local_date, last_update_date);
            END IF;
            
            RETURN NEW;
        EXCEPTION WHEN OTHERS THEN
            -- Log any errors
            INSERT INTO streak_logs 
            (user_id, action)
            VALUES 
            (NEW.user_id, 'ERROR: ' || SQLERRM);
            
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        """
    )

    # Create trigger on word_progress table
    op.execute(
        """
        DROP TRIGGER IF EXISTS word_progress_streak_trigger ON word_progress;
        CREATE TRIGGER word_progress_streak_trigger
        AFTER UPDATE ON word_progress
        FOR EACH ROW
        WHEN (NEW.practice_count <> OLD.practice_count)
        EXECUTE FUNCTION update_user_streak();
        """
    )

    # Also trigger on insert
    op.execute(
        """
        DROP TRIGGER IF EXISTS word_progress_insert_trigger ON word_progress;
        CREATE TRIGGER word_progress_insert_trigger
        AFTER INSERT ON word_progress
        FOR EACH ROW
        EXECUTE FUNCTION update_user_streak();
        """
    )

    # Add utility function to reset for testing
    op.execute(
        """
        CREATE OR REPLACE FUNCTION reset_for_streak_testing(user_id_param INTEGER)
        RETURNS VOID AS $$
        BEGIN
            -- Set last streak update to yesterday
            UPDATE user_stats
            SET last_streak_updated_at = (CURRENT_TIMESTAMP - INTERVAL '1 day')
            WHERE user_id = user_id_param;
            
            -- Clear the daily tracker
            DELETE FROM streak_daily_tracker WHERE user_id = user_id_param;
        END;
        $$ LANGUAGE plpgsql;
        """
    )

    # Add utility function to view streak info
    op.execute(
        """
        CREATE OR REPLACE FUNCTION get_streak_info(user_id_param INTEGER)
        RETURNS TABLE(
            current_streak INTEGER,
            longest_streak INTEGER,
            last_update TIMESTAMP WITH TIME ZONE,
            local_date DATE,
            user_timezone TEXT,
            processed_today BOOLEAN
        ) AS $$
        DECLARE
            user_tz TEXT;
            today DATE;
        BEGIN
            -- Get user timezone
            SELECT time_zone INTO user_tz
            FROM user_preferences
            WHERE user_id = user_id_param;
            
            -- Default timezone if not found
            IF user_tz IS NULL THEN
                user_tz := 'America/Los_Angeles';
            END IF;
            
            -- Get today's date in user's timezone
            today := (CURRENT_TIMESTAMP AT TIME ZONE 'UTC' AT TIME ZONE user_tz)::DATE;
            
            -- Return streak info
            RETURN QUERY
            SELECT 
                us.current_streak,
                us.longest_streak,
                us.last_streak_updated_at,
                (us.last_streak_updated_at AT TIME ZONE 'UTC' AT TIME ZONE user_tz)::DATE,
                user_tz,
                EXISTS (SELECT 1 FROM streak_daily_tracker 
                       WHERE user_id = user_id_param AND last_processed_date = today)
            FROM user_stats us
            WHERE us.user_id = user_id_param;
        END;
        $$ LANGUAGE plpgsql;
        """
    )


def downgrade() -> None:
    # Drop triggers
    op.execute("DROP TRIGGER IF EXISTS word_progress_streak_trigger ON word_progress;")
    op.execute("DROP TRIGGER IF EXISTS word_progress_insert_trigger ON word_progress;")

    # Drop functions
    op.execute("DROP FUNCTION IF EXISTS update_user_streak();")
    op.execute("DROP FUNCTION IF EXISTS reset_for_streak_testing(INTEGER);")
    op.execute("DROP FUNCTION IF EXISTS get_streak_info(INTEGER);")

    # Drop tables
    op.execute("DROP TABLE IF EXISTS streak_logs;")
    op.execute("DROP TABLE IF EXISTS streak_daily_tracker;")
