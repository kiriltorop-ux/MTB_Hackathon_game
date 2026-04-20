from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.constants import DEFAULT_DAILY_CLICK_LIMIT
from app.database import async_session_maker
from app.models.player_state import PlayerState
from app.models.user import User
from app.schemas.user import UserInitSchema


class UserService:
    @staticmethod
    async def init_user(data: UserInitSchema):
        async with async_session_maker() as session:
            query = (
                select(User)
                .options(
                    selectinload(User.player_state),
                )
                .where(User.telegram_id == data.telegram_id)
            )
            result = await session.execute(query)
            user = result.scalar_one_or_none()

            if user is None:
                user = User(
                    telegram_id=data.telegram_id,
                    username=data.username,
                    first_name=data.first_name,
                )
                session.add(user)
                await session.flush()

                player_state = PlayerState(
                    user_id=user.id,
                    total_damage=0,
                    daily_click_limit=DEFAULT_DAILY_CLICK_LIMIT,
                    clicks_left=DEFAULT_DAILY_CLICK_LIMIT,
                )
                session.add(player_state)
                await session.commit()

                await session.refresh(user)

                query = (
                    select(User)
                    .options(
                        selectinload(User.player_state),
                    )
                    .where(User.id == user.id)
                )
                result = await session.execute(query)
                user = result.scalar_one()

            return {
                "user": user,
                "player_state": user.player_state,
            }

    @staticmethod
    async def set_nickname(telegram_id: int, nickname: str):
        async with async_session_maker() as session:
            existing_nickname_query = select(User).where(User.nickname == nickname)
            existing_nickname_result = await session.execute(existing_nickname_query)
            existing_nickname_user = existing_nickname_result.scalar_one_or_none()

            if existing_nickname_user is not None and existing_nickname_user.telegram_id != telegram_id:
                raise ValueError("Nickname already taken")

            query = select(User).where(User.telegram_id == telegram_id)
            result = await session.execute(query)
            user = result.scalar_one_or_none()

            if user is None:
                raise ValueError("User not found")

            user.nickname = nickname
            await session.commit()

            return {
                "message": "Nickname set successfully",
                "nickname": nickname,
            }

    @staticmethod
    async def get_me(telegram_id: int):
        async with async_session_maker() as session:
            query = (
                select(User)
                .options(
                    selectinload(User.player_state),
                )
                .where(User.telegram_id == telegram_id)
            )
            result = await session.execute(query)
            user = result.scalar_one_or_none()

            if user is None:
                raise ValueError("User not found")

            return {
                "user": user,
                "player_state": user.player_state,
            }