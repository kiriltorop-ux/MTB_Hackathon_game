from sqlalchemy import and_, select
from sqlalchemy.orm import aliased

from app.database import async_session_maker
from app.models.friendship import Friendship
from app.models.player_state import PlayerState
from app.models.user import User


class LeaderboardService:
    @staticmethod
    async def get_global_leaderboard():
        async with async_session_maker() as session:
            query = (
                select(User, PlayerState)
                .join(PlayerState, PlayerState.user_id == User.id)
                .order_by(PlayerState.total_damage.desc(), User.id.asc())
            )

            result = await session.execute(query)
            rows = result.all()

            leaderboard = []
            for index, (user, player_state) in enumerate(rows, start=1):
                leaderboard.append(
                    {
                        "id": user.id,
                        "telegram_id": user.telegram_id,
                        "nickname": user.nickname,
                        "role": user.role,
                        "total_damage": player_state.total_damage,
                        "place": index,
                    }
                )

            return leaderboard

    @staticmethod
    async def get_friends_leaderboard(telegram_id: int):
        async with async_session_maker() as session:
            user_query = select(User).where(User.telegram_id == telegram_id)
            user_result = await session.execute(user_query)
            current_user = user_result.scalar_one_or_none()

            if current_user is None:
                raise ValueError("User not found")

            f1 = aliased(Friendship)
            f2 = aliased(Friendship)

            query = (
                select(User, PlayerState)
                .join(PlayerState, PlayerState.user_id == User.id)
                .join(f1, f1.friend_id == User.id)
                .join(
                    f2,
                    and_(
                        f2.user_id == User.id,
                        f2.friend_id == current_user.id,
                    ),
                )
                .where(f1.user_id == current_user.id)
                .order_by(PlayerState.total_damage.desc(), User.id.asc())
            )

            result = await session.execute(query)
            rows = result.all()

            leaderboard = []
            for index, (user, player_state) in enumerate(rows, start=1):
                leaderboard.append(
                    {
                        "id": user.id,
                        "telegram_id": user.telegram_id,
                        "nickname": user.nickname,
                        "role": user.role,
                        "total_damage": player_state.total_damage,
                        "place": index,
                    }
                )

            return leaderboard