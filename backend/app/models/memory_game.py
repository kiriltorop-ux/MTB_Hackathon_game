from sqlalchemy import ForeignKey, Integer, JSON, Boolean
from sqlalchemy.ext.mutable import MutableList
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class MemoryGame(Base):
    __tablename__ = "memory_games"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True)

    board: Mapped[list] = mapped_column(MutableList.as_mutable(JSON))
    opened_indices: Mapped[list] = mapped_column(MutableList.as_mutable(JSON), default=list)
    matched_indices: Mapped[list] = mapped_column(MutableList.as_mutable(JSON), default=list)

    moves_count: Mapped[int] = mapped_column(Integer, default=0)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)