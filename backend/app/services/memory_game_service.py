import random

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import async_session_maker
from app.models.memory_game import MemoryGame
from app.models.user import User
from app.core.constants import MEMORY_REWARD_CLICKS
from app.core.click_limit import add_clicks_with_cap


class MemoryGameService:
    @staticmethod
    def _generate_board() -> list[int]:
        values = list(range(1, 9)) * 2
        random.shuffle(values)
        return values

    @staticmethod
    def _build_state(game: MemoryGame):
        cards = []
        for idx, value in enumerate(game.board):
            is_open = idx in game.opened_indices or idx in game.matched_indices
            cards.append(
                {
                    "index": idx,
                    "is_open": is_open,
                    "value": value if is_open else None,
                }
            )

        return {
            "cards": cards,
            "moves_count": game.moves_count,
            "opened_indices": game.opened_indices,
            "matched_indices": game.matched_indices,
            "is_completed": game.is_completed,
        }

    @staticmethod
    async def start_game(telegram_id: int):
        async with async_session_maker() as session:
            user_result = await session.execute(
                select(User)
                .options(selectinload(User.player_state))
                .where(User.telegram_id == telegram_id)
            )
            user = user_result.scalar_one_or_none()

            if user is None:
                raise ValueError("User not found")

            game_result = await session.execute(
                select(MemoryGame).where(MemoryGame.user_id == user.id)
            )
            game = game_result.scalar_one_or_none()

            if game is None:
                game = MemoryGame(
                    user_id=user.id,
                    board=MemoryGameService._generate_board(),
                    opened_indices=[],
                    matched_indices=[],
                    moves_count=0,
                    is_completed=False,
                )
                session.add(game)
            else:
                game.board = MemoryGameService._generate_board()
                game.opened_indices = []
                game.matched_indices = []
                game.moves_count = 0
                game.is_completed = False

            await session.commit()
            await session.refresh(game)

            return {
                "game_type": "memory",
                "state": MemoryGameService._build_state(game),
            }

    @staticmethod
    async def flip_card(telegram_id: int, index: int):
        async with async_session_maker() as session:
            user_result = await session.execute(
                select(User)
                .options(selectinload(User.player_state))
                .where(User.telegram_id == telegram_id)
            )
            user = user_result.scalar_one_or_none()

            if user is None:
                raise ValueError("User not found")

            game_result = await session.execute(
                select(MemoryGame).where(MemoryGame.user_id == user.id)
            )
            game = game_result.scalar_one_or_none()

            if game is None:
                raise ValueError("Game not started")

            if game.is_completed:
                raise ValueError("Game already completed")

            if index < 0 or index >= 16:
                raise ValueError("Invalid card index")

            if index in game.matched_indices:
                raise ValueError("Card already matched")

            if index in game.opened_indices:
                raise ValueError("Card already opened")

            if len(game.opened_indices) >= 2:
                raise ValueError("Two cards are already opened")

            game.opened_indices = [*game.opened_indices, index]

            pair_matched = None
            clicks_restored = False

            if len(game.opened_indices) == 2:
                first_idx, second_idx = game.opened_indices
                first_value = game.board[first_idx]
                second_value = game.board[second_idx]

                game.moves_count += 1

                if first_value == second_value:
                    game.matched_indices = [
                        *game.matched_indices,
                        first_idx,
                        second_idx,
                    ]
                    game.opened_indices = []
                    pair_matched = True

                    if len(game.matched_indices) == 16:
                        game.is_completed = True
                        added_clicks = add_clicks_with_cap(user.player_state, MEMORY_REWARD_CLICKS)
                        clicks_restored = added_clicks > 0
                else:
                    game.opened_indices = []
                    game.matched_indices = []
                    pair_matched = False

            await session.commit()
            await session.refresh(game)

            return {
                "state": MemoryGameService._build_state(game),
                "pair_matched": pair_matched,
                "clicks_restored": clicks_restored,
            }