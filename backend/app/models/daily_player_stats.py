from datetime import date

from sqlalchemy import Boolean, Date, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class DailyPlayerStats(Base):
    __tablename__ = "daily_player_stats"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    stat_date: Mapped[date] = mapped_column(Date)
    clicks_used: Mapped[int] = mapped_column(Integer, default=0)
    daily_quest_completed: Mapped[bool] = mapped_column(Boolean, default=False)

    __table_args__ = (
        UniqueConstraint("user_id", "stat_date", name="uq_user_stat_date"),
    )