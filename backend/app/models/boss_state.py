from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class BossState(Base):
    __tablename__ = "boss_states"

    id: Mapped[int] = mapped_column(primary_key=True)
    boss_name: Mapped[str] = mapped_column(String(100), default="Главный босс")
    current_hp: Mapped[int] = mapped_column(Integer, default=100000)
    max_hp: Mapped[int] = mapped_column(Integer, default=100000)