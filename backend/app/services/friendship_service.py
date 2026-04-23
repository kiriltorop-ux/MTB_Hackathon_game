from sqlalchemy import and_, select
from sqlalchemy.orm import aliased

from app.database import async_session_maker
from app.models.friendship import Friendship
from app.models.user import User


class FriendshipService:
    @staticmethod
    async def add_friend(telegram_id: int, friend_nickname: str):
        async with async_session_maker() as session:
            user_query = select(User).where(User.telegram_id == telegram_id)
            user_result = await session.execute(user_query)
            user = user_result.scalar_one_or_none()

            if user is None:
                raise ValueError("User not found")

            friend_query = select(User).where(User.nickname == friend_nickname)
            friend_result = await session.execute(friend_query)
            friend = friend_result.scalar_one_or_none()

            if friend is None:
                raise ValueError("Friend not found")

            if user.id == friend.id:
                raise ValueError("You cannot add yourself")

            existing_query = select(Friendship).where(
                and_(
                    Friendship.user_id == user.id,
                    Friendship.friend_id == friend.id,
                )
            )
            existing_result = await session.execute(existing_query)
            existing_friendship = existing_result.scalar_one_or_none()

            if existing_friendship is not None:
                raise ValueError("Friend already added")

            friendship = Friendship(
                user_id=user.id,
                friend_id=friend.id,
            )
            session.add(friendship)
            await session.commit()

            reverse_query = select(Friendship).where(
                and_(
                    Friendship.user_id == friend.id,
                    Friendship.friend_id == user.id,
                )
            )
            reverse_result = await session.execute(reverse_query)
            reverse_friendship = reverse_result.scalar_one_or_none()

            if reverse_friendship is not None:
                return {"message": "Friend added successfully. Friendship is mutual"}

            return {"message": "Friend added successfully. Waiting for mutual add"}

    @staticmethod
    async def get_friends(telegram_id: int):
        async with async_session_maker() as session:
            user_query = select(User).where(User.telegram_id == telegram_id)
            user_result = await session.execute(user_query)
            user = user_result.scalar_one_or_none()

            if user is None:
                raise ValueError("User not found")

            f1 = aliased(Friendship)
            f2 = aliased(Friendship)

            mutual_friends_query = (
                select(User)
                .join(f1, f1.friend_id == User.id)
                .join(
                    f2,
                    and_(
                        f2.user_id == User.id,
                        f2.friend_id == user.id,
                    ),
                )
                .where(f1.user_id == user.id)
            )

            result = await session.execute(mutual_friends_query)
            friends = result.scalars().all()

            return friends