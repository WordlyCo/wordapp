"""user_tables

Revision ID: a9057b0f2597
Revises:
Create Date: 2025-04-08 02:06:47.395399

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "a9057b0f2597"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("clerk_id", sa.String(length=255), nullable=False),
        sa.Column("username", sa.String(length=50), nullable=False),
        sa.Column("email", sa.String(length=100), nullable=False),
        sa.Column("first_name", sa.String(length=50), nullable=True),
        sa.Column("last_name", sa.String(length=50), nullable=True),
        sa.Column("profile_picture_url", sa.String(length=255), nullable=True),
        sa.Column("bio", sa.String(length=255), nullable=True),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.func.now(),
            onupdate=sa.func.now(),
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("username"),
        sa.UniqueConstraint("email"),
        sa.UniqueConstraint("clerk_id"),
    )

    op.create_table(
        "user_preferences",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("daily_word_goal", sa.Integer(), nullable=False, server_default="10"),
        sa.Column(
            "difficulty_level",
            sa.String(length=20),
            nullable=False,
            server_default="beginner",
        ),
        sa.Column(
            "notifications_enabled",
            sa.Boolean(),
            nullable=False,
            server_default="false",
        ),
        sa.Column(
            "time_zone",
            sa.String(length=20),
            nullable=False,
            server_default="America/Los_Angeles",
        ),
        sa.Column("theme", sa.String(length=20), nullable=False, server_default="dark"),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.func.now(),
            onupdate=sa.func.now(),
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )

    op.create_table(
        "user_stats",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("diamonds", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "total_words_learned", sa.Integer(), nullable=False, server_default="0"
        ),
        sa.Column("current_streak", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "last_streak_updated_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.Column("longest_streak", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "total_practice_time", sa.Integer(), nullable=False, server_default="0"
        ),
        sa.Column("average_accuracy", sa.Float(), nullable=False, server_default="0"),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.func.now(),
            onupdate=sa.func.now(),
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )

    op.create_table(
        "user_practice_sessions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column(
            "practice_time",
            sa.Integer(),
            nullable=False,
            comment="Practice time in minutes",
        ),
        sa.Column(
            "session_type",
            sa.String(length=50),
            nullable=False,
            comment="Type of practice session (e.g., quiz, flashcard)",
        ),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.func.now(),
            onupdate=sa.func.now(),
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )

    op.create_index(
        "idx_user_practice_sessions_user_id",
        "user_practice_sessions",
        ["user_id"],
        unique=False,
    )

    op.create_index(
        "idx_user_preferences_user_id",
        "user_preferences",
        ["user_id"],
        unique=False,
    )

    op.create_index(
        "idx_user_stats_user_id",
        "user_stats",
        ["user_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("idx_user_stats_user_id")
    op.drop_index("idx_user_preferences_user_id")
    op.drop_index("idx_user_practice_sessions_user_id")
    op.drop_table("user_practice_sessions")
    op.drop_table("user_stats")
    op.drop_table("user_preferences")
    op.drop_table("users")
