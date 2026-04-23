from sqlalchemy import Boolean, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Achievement(Base):
    __tablename__ = "achievements"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(String(500))
    category: Mapped[str] = mapped_column(String(50))

    reward_damage_bonus: Mapped[int] = mapped_column(Integer, default=0)
    reward_coins: Mapped[int] = mapped_column(Integer, default=0)
    reward_note: Mapped[str | None] = mapped_column(String(255), nullable=True)

    is_hidden: Mapped[bool] = mapped_column(Boolean, default=False)
    is_implemented: Mapped[bool] = mapped_column(Boolean, default=True)