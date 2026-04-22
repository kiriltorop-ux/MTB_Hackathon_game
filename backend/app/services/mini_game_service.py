import random

from sqlalchemy import select

from app.database import async_session_maker
from app.models.user import User
from app.services.class_game_service import ClassGameService
from app.services.memory_game_service import MemoryGameService
from app.services.rhythm_game_service import RhythmGameService


class MiniGameService:
    @staticmethod
    async def get_random_game(telegram_id: int):
        async with async_session_maker() as session:
            result = await session.execute(
                select(User).where(User.telegram_id == telegram_id)
            )
            user = result.scalar_one_or_none()

            if user is None:
                raise ValueError("User not found")

            if user.role is None:
                raise ValueError("User role is not selected")

        game_type = random.choice(["memory", "rhythm", "class_game"])

        if game_type == "memory":
            return await MemoryGameService.start_game(telegram_id)

        if game_type == "rhythm":
            return await RhythmGameService.start_game(telegram_id)

        return await ClassGameService.start_game(telegram_id)