from datetime import datetime, UTC

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class PlayerState(Base):
    __tablename__ = "player_states"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)

    total_damage: Mapped[int] = mapped_column(Integer, default=0)

    daily_click_limit: Mapped[int] = mapped_column(Integer, default=100)
    clicks_left: Mapped[int] = mapped_column(Integer, default=100)

    last_click_restore_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
    )

    daily_damage_boost_active: Mapped[bool] = mapped_column(Boolean, default=False)
    daily_damage_boost_expires_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    achievement_damage_bonus: Mapped[int] = mapped_column(Integer, default=0)
    coins: Mapped[int] = mapped_column(Integer, default=0)

    user = relationship("User", back_populates="player_state")