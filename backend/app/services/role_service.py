from sqlalchemy import select

from app.core.role_coefficients import ROLES
from app.database import async_session_maker
from app.models.user import User


class RoleService:
    @staticmethod
    async def get_roles():
        return [
            {
                "code": code,
                "name": data["name"],
                "description": data["description"],
            }
            for code, data in ROLES.items()
        ]

    @staticmethod
    async def select_role(telegram_id: int, role: str):
        if role not in ROLES:
            raise ValueError("Invalid role")

        async with async_session_maker() as session:
            query = select(User).where(User.telegram_id == telegram_id)
            result = await session.execute(query)
            user = result.scalar_one_or_none()

            if user is None:
                raise ValueError("User not found")

            user.role = role
            await session.commit()

            return {
                "message": "Role selected successfully",
                "role": role,
            }