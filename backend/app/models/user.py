from sqlalchemy import BigInteger, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    telegram_id: Mapped[int] = mapped_column(BigInteger, unique=True, index=True)
    username: Mapped[str | None] = mapped_column(String(100), nullable=True)
    first_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    nickname: Mapped[str | None] = mapped_column(String(100), unique=True, nullable=True)
    role: Mapped[str | None] = mapped_column(String(50), nullable=True)

    player_state = relationship(
        "PlayerState",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )