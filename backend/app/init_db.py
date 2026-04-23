import asyncio

from sqlalchemy import select

from app.core.constants import DEFAULT_BOSS_HP, DEFAULT_BOSS_NAME
from app.database import Base, async_session_maker, engine
from app.models import BossState

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_maker() as session:
        result = await session.execute(select(BossState))
        boss = result.scalar_one_or_none()

        if boss is None:
            boss = BossState(
                boss_name=DEFAULT_BOSS_NAME,
                current_hp=DEFAULT_BOSS_HP,
                max_hp=DEFAULT_BOSS_HP,
            )
            session.add(boss)
            await session.commit()


if __name__ == "__main__":
    asyncio.run(init_db())