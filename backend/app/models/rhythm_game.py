from datetime import datetime, UTC

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, JSON
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class RhythmGame(Base):
    __tablename__ = "rhythm_games"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)

    duration_seconds: Mapped[int] = mapped_column(Integer, default=30)
    notes: Mapped[list] = mapped_column(MutableList.as_mutable(JSON))
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
    )