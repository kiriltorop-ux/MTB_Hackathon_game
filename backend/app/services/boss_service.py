from sqlalchemy import select

from app.database import async_session_maker
from app.models.boss_state import BossState


class BossService:
    @staticmethod
    async def get_current_boss():
        async with async_session_maker() as session:
            query = select(BossState)
            result = await session.execute(query)
            boss = result.scalar_one_or_none()

            if boss is None:
                raise ValueError("Global boss not found")

            return boss