from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.click_limit import add_clicks_with_cap
from app.database import async_session_maker
from app.models.class_game import ClassGame
from app.models.user import User


class ClassGameService:
    ATHLETE_EXERCISES = [
        {"name": "Жим лёжа", "muscle": "chest", "cost": 120, "progress": 18},
        {"name": "Присед", "muscle": "legs", "cost": 150, "progress": 25},
        {"name": "Тяга штанги", "muscle": "back", "cost": 130, "progress": 20},
        {"name": "Планка", "muscle": "abs", "cost": 70, "progress": 10},
        {"name": "Армейский жим", "muscle": "shoulders", "cost": 110, "progress": 15},
    ]

    ATHLETE_SYNERGY = {
        frozenset(["legs", "back"]): 0.25,
        frozenset(["chest", "shoulders"]): 0.20,
        frozenset(["abs", "back"]): 0.15,
        frozenset(["shoulders", "legs"]): 0.10,
    }

    @staticmethod
    async def start_game(telegram_id: int):
        async with async_session_maker() as session:
            result = await session.execute(
                select(User).where(User.telegram_id == telegram_id)
            )
            user = result.scalar_one_or_none()

            if user is None:
                raise ValueError("User not found")

            if user.role is None:
                raise ValueError("User role is not selected")

            payload = ClassGameService._build_payload_for_role(user.role)

            game_result = await session.execute(
                select(ClassGame).where(ClassGame.user_id == user.id)
            )
            game = game_result.scalar_one_or_none()

            if game is None:
                game = ClassGame(
                    user_id=user.id,
                    role=user.role,
                    game_type="class_game",
                    payload=payload,
                    is_completed=False,
                )
                session.add(game)
            else:
                game.role = user.role
                game.game_type = "class_game"
                game.payload = payload
                game.is_completed = False

            await session.commit()
            await session.refresh(game)

            return {
                "game_type": "class_game",
                "role": user.role,
                "payload": game.payload,
            }

    @staticmethod
    def _build_payload_for_role(role: str) -> dict:
        if role == "athlete":
            return {
                "energy_limit": 500,
                "exercises": ClassGameService.ATHLETE_EXERCISES,
                "synergy_rules": [
                    {"pair": ["legs", "back"], "bonus": 0.25},
                    {"pair": ["chest", "shoulders"], "bonus": 0.20},
                    {"pair": ["abs", "back"], "bonus": 0.15},
                    {"pair": ["shoulders", "legs"], "bonus": 0.10},
                ],
            }

        if role == "gourmet":
            return {
                "receipt_total": 47.60,
                "friends": ["Маша", "Петя", "Оля", "Игорь"],
                "items": [
                    {"name": "Пицца", "price": 15.0},
                    {"name": "Пиво", "price": 6.0},
                    {"name": "Паста", "price": 12.0},
                    {"name": "Салат", "price": 5.6},
                    {"name": "Колa", "price": 4.0},
                    {"name": "Десерт", "price": 5.0},
                ],
                "correct_distribution": {
                    "Пицца": "Маша",
                    "Пиво": "Петя",
                    "Паста": "Оля",
                    "Салат": "Игорь",
                    "Колa": "Петя",
                    "Десерт": "Маша",
                },
            }

        if role == "stylist":
            return {
                "categories": ["top", "bottom", "shoes", "accessories", "sale"],
                "items": [
                    {"name": "Куртка", "correct": "top"},
                    {"name": "Кроссовки", "correct": "shoes"},
                    {"name": "Ремень", "correct": "accessories"},
                    {"name": "Джинсы", "correct": "bottom"},
                    {"name": "Платье", "correct": "top"},
                    {"name": "Ботинки", "correct": "shoes"},
                    {"name": "Сумка", "correct": "accessories"},
                    {"name": "Юбка", "correct": "bottom"},
                    {"name": "Футболка", "correct": "top"},
                    {"name": "Кеды", "correct": "shoes"},
                    {"name": "Очки", "correct": "accessories"},
                    {"name": "Брюки", "correct": "bottom"},
                    {"name": "SALE_Пальто", "correct": "sale"},
                    {"name": "SALE_Туфли", "correct": "sale"},
                    {"name": "SALE_Шарф", "correct": "sale"},
                    {"name": "Шорты", "correct": "bottom"},
                ],
            }

        if role == "traveler":
            return {
                "fuel_limit": 40,
                "points": ["Дом", "Работа", "Белоруснефть", "Кафе", "Магазин"],
                "distances": {
                    "Дом": {"Работа": 10, "Белоруснефть": 8, "Кафе": 6, "Магазин": 7},
                    "Работа": {"Дом": 10, "Белоруснефть": 5, "Кафе": 7, "Магазин": 6},
                    "Белоруснефть": {"Дом": 8, "Работа": 5, "Кафе": 4, "Магазин": 3},
                    "Кафе": {"Дом": 6, "Работа": 7, "Белоруснефть": 4, "Магазин": 5},
                    "Магазин": {"Дом": 7, "Работа": 6, "Белоруснефть": 3, "Кафе": 5},
                },
                "optimal_route": ["Дом", "Белоруснефть", "Магазин", "Кафе", "Работа"],
                "optimal_cost": 23,
            }

        raise ValueError("Unsupported role")

    @staticmethod
    async def finish_athlete_game(telegram_id: int, selected_exercises: list[str]):
        async with async_session_maker() as session:
            result = await session.execute(
                select(User)
                .options(selectinload(User.player_state))
                .where(User.telegram_id == telegram_id)
            )
            user = result.scalar_one_or_none()

            if user is None:
                raise ValueError("User not found")

            game_result = await session.execute(
                select(ClassGame).where(ClassGame.user_id == user.id)
            )
            game = game_result.scalar_one_or_none()

            if game is None or game.role != "athlete":
                raise ValueError("Athlete class game not started")

            exercise_map = {item["name"]: item for item in ClassGameService.ATHLETE_EXERCISES}
            chosen = [exercise_map[name] for name in selected_exercises if name in exercise_map]

            total_cost = sum(item["cost"] for item in chosen)
            if total_cost > 500:
                raise ValueError("Energy limit exceeded")

            base_progress = sum(item["progress"] for item in chosen)
            muscles = {item["muscle"] for item in chosen}

            bonus = 0.0
            for pair, pair_bonus in ClassGameService.ATHLETE_SYNERGY.items():
                if pair.issubset(muscles):
                    bonus += pair_bonus

            final_score = round(base_progress * (1 + bonus), 2)

            if final_score < 40:
                reward = 10
            elif final_score < 60:
                reward = 20
            elif final_score < 80:
                reward = 35
            else:
                reward = 50

            actual_added = add_clicks_with_cap(user.player_state, reward)
            game.is_completed = True

            await session.commit()

            return {
                "message": "Athlete class game finished",
                "reward_clicks": actual_added,
                "clicks_left": user.player_state.clicks_left,
                "score": final_score,
            }

    @staticmethod
    async def finish_gourmet_game(telegram_id: int, distribution: dict):
        async with async_session_maker() as session:
            result = await session.execute(
                select(User)
                .options(selectinload(User.player_state))
                .where(User.telegram_id == telegram_id)
            )
            user = result.scalar_one_or_none()

            if user is None:
                raise ValueError("User not found")

            game_result = await session.execute(
                select(ClassGame).where(ClassGame.user_id == user.id)
            )
            game = game_result.scalar_one_or_none()

            if game is None or game.role != "gourmet":
                raise ValueError("Gourmet class game not started")

            correct_distribution = game.payload["correct_distribution"]
            total_items = len(correct_distribution)

            correct_count = 0
            for item_name, correct_owner in correct_distribution.items():
                if distribution.get(item_name) == correct_owner:
                    correct_count += 1

            accuracy = (correct_count / total_items) * 100 if total_items else 0

            if accuracy == 100:
                reward = 40
            elif accuracy >= 80:
                reward = 25
            else:
                reward = 10

            actual_added = add_clicks_with_cap(user.player_state, reward)
            game.is_completed = True

            await session.commit()

            return {
                "message": "Gourmet class game finished",
                "reward_clicks": actual_added,
                "clicks_left": user.player_state.clicks_left,
                "score": round(accuracy, 2),
            }

    @staticmethod
    async def finish_stylist_game(telegram_id: int, assignments: dict, finished_in_time: bool):
        async with async_session_maker() as session:
            result = await session.execute(
                select(User)
                .options(selectinload(User.player_state))
                .where(User.telegram_id == telegram_id)
            )
            user = result.scalar_one_or_none()

            if user is None:
                raise ValueError("User not found")

            game_result = await session.execute(
                select(ClassGame).where(ClassGame.user_id == user.id)
            )
            game = game_result.scalar_one_or_none()

            if game is None or game.role != "stylist":
                raise ValueError("Stylist class game not started")

            items = game.payload["items"]
            correct_count = 0

            for item in items:
                if assignments.get(item["name"]) == item["correct"]:
                    correct_count += 1

            if correct_count < 10:
                reward = 10
            elif correct_count < 16:
                reward = 20
            elif correct_count == 16 and finished_in_time:
                reward = 35
            else:
                reward = 20

            actual_added = add_clicks_with_cap(user.player_state, reward)
            game.is_completed = True

            await session.commit()

            return {
                "message": "Stylist class game finished",
                "reward_clicks": actual_added,
                "clicks_left": user.player_state.clicks_left,
                "score": float(correct_count),
            }

    @staticmethod
    async def finish_traveler_game(telegram_id: int, route: list[str], completed_in_seconds: int):
        async with async_session_maker() as session:
            result = await session.execute(
                select(User)
                .options(selectinload(User.player_state))
                .where(User.telegram_id == telegram_id)
            )
            user = result.scalar_one_or_none()

            if user is None:
                raise ValueError("User not found")

            game_result = await session.execute(
                select(ClassGame).where(ClassGame.user_id == user.id)
            )
            game = game_result.scalar_one_or_none()

            if game is None or game.role != "traveler":
                raise ValueError("Traveler class game not started")

            distances = game.payload["distances"]
            optimal_cost = game.payload["optimal_cost"]

            if len(route) < 2:
                raise ValueError("Invalid route")

            route_cost = 0
            for i in range(len(route) - 1):
                start = route[i]
                end = route[i + 1]
                if start not in distances or end not in distances[start]:
                    raise ValueError("Invalid route point")
                route_cost += distances[start][end]

            efficiency = round((optimal_cost / route_cost) * 100, 2) if route_cost > 0 else 0

            if efficiency < 70:
                reward = 20
            elif efficiency < 90:
                reward = 35
            else:
                reward = 55

            if route == game.payload["optimal_route"] and completed_in_seconds <= 20:
                reward += 5

            actual_added = add_clicks_with_cap(user.player_state, reward)
            game.is_completed = True

            await session.commit()

            return {
                "message": "Traveler class game finished",
                "reward_clicks": actual_added,
                "clicks_left": user.player_state.clicks_left,
                "score": efficiency,
            }