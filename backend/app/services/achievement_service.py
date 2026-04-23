from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import async_session_maker
from app.models.achievement import Achievement
from app.models.user import User
from app.models.user_achievement import UserAchievement


class AchievementService:
    ACHIEVEMENTS_DATA = [
        # АКТИВНОСТЬ
        {
            "code": "first_step",
            "title": "Первый шаг",
            "description": "Сделай 1 клик",
            "category": "activity",
            "reward_damage_bonus": 0,
            "reward_coins": 50,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": True,
        },
        {
            "code": "charged",
            "title": "Заряженный",
            "description": "Сделай 100 кликов за 1 день",
            "category": "activity",
            "reward_damage_bonus": 100,
            "reward_coins": 0,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": True,
        },
        {
            "code": "streak_3_days",
            "title": "3 дня подряд",
            "description": "Держи стрик 3 дня подряд",
            "category": "activity",
            "reward_damage_bonus": 150,
            "reward_coins": 20,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": True,
        },
        {
            "code": "week_no_mercy",
            "title": "Неделя без пощады",
            "description": "7 дней подряд делай 50+ кликов",
            "category": "activity",
            "reward_damage_bonus": 300,
            "reward_coins": 0,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": True,
        },
        {
            "code": "quest_sniper",
            "title": "Снайпер квестов",
            "description": "14 квестов дня подряд",
            "category": "activity",
            "reward_damage_bonus": 400,
            "reward_coins": 50,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": True,
        },
        {
            "code": "iron_will",
            "title": "Железная воля",
            "description": "30 дней подряд: 100 кликов + квест",
            "category": "activity",
            "reward_damage_bonus": 0,
            "reward_coins": 200,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": True,
        },

        # БАНКОВСКИЕ
        {
            "code": "first_transaction",
            "title": "Первая транзакция",
            "description": "Оплата картой МТБ",
            "category": "banking",
            "reward_damage_bonus": 50,
            "reward_coins": 0,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": False,
        },
        {
            "code": "halva_debut",
            "title": "Халва дебютант",
            "description": "Первая покупка в рассрочку",
            "category": "banking",
            "reward_damage_bonus": 300,
            "reward_coins": 0,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": False,
        },
        {
            "code": "installment_master",
            "title": "Мастер рассрочки",
            "description": "5 Халва-покупок у разных партнёров",
            "category": "banking",
            "reward_damage_bonus": 0,
            "reward_coins": 0,
            "reward_note": "30 дней рассрочки в подарок",
            "is_hidden": False,
            "is_implemented": False,
        },
        {
            "code": "piggy_bank",
            "title": "Копилка",
            "description": "Накопи 200 маничек за сезон",
            "category": "banking",
            "reward_damage_bonus": 250,
            "reward_coins": 0,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": False,
        },

        # СОЦИАЛЬНЫЕ
        {
            "code": "first_friend",
            "title": "Первый друг",
            "description": "1 активный реферал",
            "category": "social",
            "reward_damage_bonus": 0,
            "reward_coins": 0,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": False,
        },
        {
            "code": "own_company",
            "title": "Своя компания",
            "description": "3 реферала",
            "category": "social",
            "reward_damage_bonus": 100,
            "reward_coins": 0,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": False,
        },
        {
            "code": "commander",
            "title": "Командир",
            "description": "5 рефералов",
            "category": "social",
            "reward_damage_bonus": 200,
            "reward_coins": 0,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": False,
        },
        {
            "code": "team_fighter",
            "title": "Боец команды",
            "description": "1 командный удар с 2 друзьями",
            "category": "social",
            "reward_damage_bonus": 150,
            "reward_coins": 0,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": False,
        },
        {
            "code": "influencer",
            "title": "Инфлюэнсер",
            "description": "5 шерингов результатов за сезон",
            "category": "social",
            "reward_damage_bonus": 300,
            "reward_coins": 0,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": False,
        },

        # КЛАССОВЫЕ
        {
            "code": "class_oath",
            "title": "Принял присягу",
            "description": "Выбор класса",
            "category": "class",
            "reward_damage_bonus": 100,
            "reward_coins": 0,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": True,
        },
        {
            "code": "class_master",
            "title": "Мастер класса",
            "description": "Играй выбранным классом 30 дней",
            "category": "class",
            "reward_damage_bonus": 500,
            "reward_coins": 80,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": False,
        },
        {
            "code": "explorer",
            "title": "Исследователь",
            "description": "Попробуй все 4 класса",
            "category": "class",
            "reward_damage_bonus": 400,
            "reward_coins": 0,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": False,
        },

        # БОСС-ФАЙТ
        {
            "code": "contributor_1000",
            "title": "Внёс вклад",
            "description": "Нанеси 1 000 HP урона за сезон",
            "category": "boss",
            "reward_damage_bonus": 200,
            "reward_coins": 0,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": True,
        },
        {
            "code": "strike_force_50000",
            "title": "Ударная сила",
            "description": "Нанеси 50 000 HP урона за сезон",
            "category": "boss",
            "reward_damage_bonus": 500,
            "reward_coins": 60,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": True,
        },
        {
            "code": "destroyer_top5",
            "title": "Разрушитель",
            "description": "Нанеси 200 000 HP урона за сезон (топ-5% сервера)",
            "category": "boss",
            "reward_damage_bonus": 0,
            "reward_coins": 150,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": False,
        },
        {
            "code": "final_wave",
            "title": "Финальная волна",
            "description": "Сделай хотя бы 1 удар в последние 15% HP босса",
            "category": "boss",
            "reward_damage_bonus": 300,
            "reward_coins": 0,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": True,
        },
        {
            "code": "season_killer",
            "title": "Киллер сезона",
            "description": "Нанеси последний удар боссу",
            "category": "boss",
            "reward_damage_bonus": 2000,
            "reward_coins": 300,
            "reward_note": None,
            "is_hidden": False,
            "is_implemented": False,
        },
        {
            "code": "loyal_soldier",
            "title": "Верный солдат",
            "description": "Участие в 3 сезонах подряд",
            "category": "boss",
            "reward_damage_bonus": 0,
            "reward_coins": 0,
            "reward_note": "+5% к урону навсегда",
            "is_hidden": False,
            "is_implemented": False,
        },

        # СЕКРЕТНЫЕ
        {
            "code": "sleepwalker",
            "title": "Лунатик",
            "description": "Играй в 00:00 в Новый год",
            "category": "secret",
            "reward_damage_bonus": 0,
            "reward_coins": 0,
            "reward_note": None,
            "is_hidden": True,
            "is_implemented": True,
        },
        {
            "code": "one_against_all",
            "title": "Один против всех",
            "description": "Нанеси 1% от общего урона",
            "category": "secret",
            "reward_damage_bonus": 0,
            "reward_coins": 0,
            "reward_note": None,
            "is_hidden": True,
            "is_implemented": False,
        },
    ]

    @staticmethod
    async def seed_achievements():
        async with async_session_maker() as session:
            for item in AchievementService.ACHIEVEMENTS_DATA:
                result = await session.execute(
                    select(Achievement).where(Achievement.code == item["code"])
                )
                existing = result.scalar_one_or_none()

                if existing is None:
                    achievement = Achievement(**item)
                    session.add(achievement)

            await session.commit()

    @staticmethod
    async def get_user_achievements(telegram_id: int):
        async with async_session_maker() as session:
            user_result = await session.execute(
                select(User)
                .options(selectinload(User.player_state))
                .where(User.telegram_id == telegram_id)
            )
            user = user_result.scalar_one_or_none()
            if user is None:
                raise ValueError("User not found")

            achievements_result = await session.execute(
                select(Achievement).order_by(Achievement.id)
            )
            achievements = achievements_result.scalars().all()

            unlocked_result = await session.execute(
                select(UserAchievement).where(UserAchievement.user_id == user.id)
            )
            unlocked = unlocked_result.scalars().all()
            unlocked_ids = {item.achievement_id for item in unlocked}

            player_state_result = await session.execute(
                select(User).where(User.id == user.id)
            )

            achievements_list = []
            for achievement in achievements:
                is_unlocked = achievement.id in unlocked_ids

                title = achievement.title
                description = achievement.description

                if achievement.is_hidden and not is_unlocked:
                    title = "???"
                    description = "???"

                achievements_list.append(
                    {
                        "code": achievement.code,
                        "title": title,
                        "description": description,
                        "category": achievement.category,
                        "reward_damage_bonus": achievement.reward_damage_bonus,
                        "reward_coins": achievement.reward_coins,
                        "reward_note": achievement.reward_note,
                        "is_hidden": achievement.is_hidden,
                        "is_implemented": achievement.is_implemented,
                        "is_unlocked": is_unlocked,
                    }
                )

            return {
                "achievements": achievements_list,
                "achievement_damage_bonus": user.player_state.achievement_damage_bonus,
                "coins": user.player_state.coins,
            }