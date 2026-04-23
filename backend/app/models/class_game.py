from datetime import datetime, UTC

from sqlalchemy import Boolean, DateTime, ForeignKey, JSON, String
from sqlalchemy.ext.mutable import MutableDict
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ClassGame(Base):
    __tablename__ = "class_games"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)

    role: Mapped[str] = mapped_column(String(50))
    game_type: Mapped[str] = mapped_column(String(50))
    payload: Mapped[dict] = mapped_column(MutableDict.as_mutable(JSON))
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
    )