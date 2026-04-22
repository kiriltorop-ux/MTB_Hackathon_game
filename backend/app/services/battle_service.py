from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.click_limit import refresh_click_limit_if_needed, refresh_daily_damage_boost
from app.core.damage_formula import calculate_damage
from app.database import async_session_maker
from app.models.boss_state import BossState
from app.models.user import User
from app.websocket.boss_manager import boss_connection_manager


class BattleService:
    @staticmethod
    async def tap_boss(telegram_id: int):
        async with async_session_maker() as session:
            user_query = (
                select(User)
                .options(selectinload(User.player_state))
                .where(User.telegram_id == telegram_id)
            )
            user_result = await session.execute(user_query)
            user = user_result.scalar_one_or_none()

            if user is None:
                raise ValueError("User not found")

            player_state = user.player_state
            if player_state is None:
                raise ValueError("Player state not found")

            boss_query = select(BossState)
            boss_result = await session.execute(boss_query)
            boss_state = boss_result.scalar_one_or_none()

            if boss_state is None:
                raise ValueError("Global boss not found")

            refresh_click_limit_if_needed(player_state)
            refresh_daily_damage_boost(player_state)

            if player_state.clicks_left <= 0:
                raise ValueError("No clicks left")

            damage, is_critical = calculate_damage(player_state)

            player_state.clicks_left -= 1
            player_state.total_damage += damage

            boss_state.current_hp -= damage
            if boss_state.current_hp < 0:
                boss_state.current_hp = 0

            await session.commit()

            await boss_connection_manager.broadcast(
                {
                    "type": "boss_update",
                    "boss_name": boss_state.boss_name,
                    "current_hp": boss_state.current_hp,
                    "max_hp": boss_state.max_hp,
                }
            )

            return {
                "damage": damage,
                "is_critical": is_critical,
                "clicks_left": player_state.clicks_left,
                "total_damage": player_state.total_damage,
                "boss_current_hp": boss_state.current_hp,
                "boss_max_hp": boss_state.max_hp,
                "is_boss_dead": boss_state.current_hp == 0,
            }