from datetime import UTC, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import async_session_maker
from app.models.daily_quest import DailyQuest
from app.models.user import User


class DailyQuestService:
    @staticmethod
    def _get_end_of_day() -> datetime:
        now = datetime.now(UTC)
        next_day = now.date() + timedelta(days=1)
        return datetime.combine(next_day, datetime.min.time(), tzinfo=UTC)

    @staticmethod
    def _build_quest_by_role(role: str):
        if role == "athlete":
            return {
                "quest_type": "athlete_upload",
                "question": "Прикрепите фото или скрин любой активности",
                "options": None,
                "correct_answer": None,
            }

        if role == "gourmet":
            return {
                "quest_type": "gourmet_quiz",
                "question": "Какая это кухня?",
                "options": ["Итальянская", "Японская", "Грузинская", "Мексиканская"],
                "correct_answer": "Японская",
            }

        if role == "stylist":
            return {
                "quest_type": "stylist_quiz",
                "question": "Какой это бренд?",
                "options": ["Zara", "H&M", "Nike", "Adidas"],
                "correct_answer": "Nike",
            }

        if role == "traveler":
            return {
                "quest_type": "traveler_quiz",
                "question": "Какой это город?",
                "options": ["Минск", "Прага", "Париж", "Рим"],
                "correct_answer": "Прага",
            }

        raise ValueError("User role is not selected")

    @staticmethod
    async def get_daily_quest(telegram_id: int):
        async with async_session_maker() as session:
            user_result = await session.execute(
                select(User).where(User.telegram_id == telegram_id)
            )
            user = user_result.scalar_one_or_none()

            if user is None:
                raise ValueError("User not found")

            if user.role is None:
                raise ValueError("User role is not selected")

            quest_result = await session.execute(
                select(DailyQuest).where(DailyQuest.user_id == user.id)
            )
            quest = quest_result.scalar_one_or_none()

            now = datetime.now(UTC)

            if quest is None or now >= quest.expires_at:
                quest_data = DailyQuestService._build_quest_by_role(user.role)

                if quest is None:
                    quest = DailyQuest(
                        user_id=user.id,
                        quest_type=quest_data["quest_type"],
                        question=quest_data["question"],
                        options=quest_data["options"],
                        correct_answer=quest_data["correct_answer"],
                        is_completed=False,
                        expires_at=DailyQuestService._get_end_of_day(),
                    )
                    session.add(quest)
                else:
                    quest.quest_type = quest_data["quest_type"]
                    quest.question = quest_data["question"]
                    quest.options = quest_data["options"]
                    quest.correct_answer = quest_data["correct_answer"]
                    quest.is_completed = False
                    quest.created_at = now
                    quest.expires_at = DailyQuestService._get_end_of_day()

                await session.commit()
                await session.refresh(quest)

            return {
                "quest_type": quest.quest_type,
                "question": quest.question,
                "options": quest.options,
                "is_completed": quest.is_completed,
            }

    @staticmethod
    async def complete_athlete_quest(telegram_id: int, photo_attached: bool):
        async with async_session_maker() as session:
            user_result = await session.execute(
                select(User)
                .options(selectinload(User.player_state))
                .where(User.telegram_id == telegram_id)
            )
            user = user_result.scalar_one_or_none()

            if user is None:
                raise ValueError("User not found")

            quest_result = await session.execute(
                select(DailyQuest).where(DailyQuest.user_id == user.id)
            )
            quest = quest_result.scalar_one_or_none()

            if quest is None:
                raise ValueError("Daily quest not found")

            if quest.quest_type != "athlete_upload":
                raise ValueError("Invalid quest type for athlete endpoint")

            if not photo_attached:
                raise ValueError("Photo was not attached")

            quest.is_completed = True
            user.player_state.daily_damage_boost_active = True
            user.player_state.daily_damage_boost_expires_at = quest.expires_at

            await session.commit()

            return {
                "message": "Daily quest completed",
                "is_completed": True,
                "damage_boost_active": True,
            }

    @staticmethod
    async def complete_answer_quest(telegram_id: int, answer: str):
        async with async_session_maker() as session:
            user_result = await session.execute(
                select(User)
                .options(selectinload(User.player_state))
                .where(User.telegram_id == telegram_id)
            )
            user = user_result.scalar_one_or_none()

            if user is None:
                raise ValueError("User not found")

            quest_result = await session.execute(
                select(DailyQuest).where(DailyQuest.user_id == user.id)
            )
            quest = quest_result.scalar_one_or_none()

            if quest is None:
                raise ValueError("Daily quest not found")

            if quest.quest_type == "athlete_upload":
                raise ValueError("Use athlete completion endpoint")

            if quest.is_completed:
                return {
                    "message": "Daily quest already completed",
                    "is_completed": True,
                    "damage_boost_active": True,
                }

            if answer != quest.correct_answer:
                raise ValueError("Wrong answer")

            quest.is_completed = True
            user.player_state.daily_damage_boost_active = True
            user.player_state.daily_damage_boost_expires_at = quest.expires_at

            await session.commit()

            return {
                "message": "Daily quest completed",
                "is_completed": True,
                "damage_boost_active": True,
            }