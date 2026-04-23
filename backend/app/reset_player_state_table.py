import asyncio

from sqlalchemy import text

from app.database import async_session_maker


async def reset_player_state_table():
    async with async_session_maker() as session:
        await session.execute(text("DROP TABLE IF EXISTS player_states CASCADE;"))
        await session.commit()


if __name__ == "__main__":
    asyncio.run(reset_player_state_table())