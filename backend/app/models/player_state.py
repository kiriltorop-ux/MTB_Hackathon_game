from datetime import datetime, UTC

from sqlalchemy import DateTime, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class PlayerState(Base):
    __tablename__ = "player_states"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)
    total_damage: Mapped[int] = mapped_column(Integer, default=0)
    daily_click_limit: Mapped[int] = mapped_column(Integer, default=1000)
    clicks_left: Mapped[int] = mapped_column(Integer, default=1000)
    last_click_reset_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
    )

    user = relationship("User", back_populates="player_state")