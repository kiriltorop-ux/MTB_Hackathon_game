import random

from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.core.click_limit import add_clicks_with_cap
from app.database import async_session_maker
from app.models.rhythm_game import RhythmGame
from app.models.user import User


class RhythmGameService:
    LANES_COUNT = 3
    DURATION_SECONDS = 30
    HIT_WINDOW = 0.18

    @staticmethod
    def _generate_notes() -> list[dict]:
        notes = []
        note_index = 0

        current_time = 1.0
        while current_time <= RhythmGameService.DURATION_SECONDS - 1:
            lane = random.randint(0, RhythmGameService.LANES_COUNT - 1)
            notes.append(
                {
                    "index": note_index,
                    "lane": lane,
                    "hit_at_sec": round(current_time, 2),
                }
            )
            note_index += 1
            current_time += random.uniform(0.55, 1.0)

        return notes

    @staticmethod
    def _speed_phases() -> list[float]:
        return [1.0, 1.1, 1.21]

    @staticmethod
    def _calculate_reward(accuracy_percent: float) -> int:
        if accuracy_percent < 40:
            return 10
        if accuracy_percent < 80:
            return 30
        return 40

    @staticmethod
    async def start_game(telegram_id: int):
        async with async_session_maker() as session:
            user_result = await session.execute(
                select(User).where(User.telegram_id == telegram_id)
            )
            user = user_result.scalar_one_or_none()

            if user is None:
                raise ValueError("User not found")

            game_result = await session.execute(
                select(RhythmGame).where(RhythmGame.user_id == user.id)
            )
            game = game_result.scalar_one_or_none()

            notes = RhythmGameService._generate_notes()

            if game is None:
                game = RhythmGame(
                    user_id=user.id,
                    duration_seconds=RhythmGameService.DURATION_SECONDS,
                    notes=notes,
                    is_completed=False,
                )
                session.add(game)
            else:
                game.duration_seconds = RhythmGameService.DURATION_SECONDS
                game.notes = notes
                game.is_completed = False

            await session.commit()
            await session.refresh(game)

            return {
                "game_type": "rhythm",
                "duration_seconds": game.duration_seconds,
                "lanes_count": RhythmGameService.LANES_COUNT,
                "speed_phases": RhythmGameService._speed_phases(),
                "notes": game.notes,
            }

    @staticmethod
    async def finish_game(telegram_id: int, hits: list[dict]):
        async with async_session_maker() as session:
            user_result = await session.execute(
                select(User)
                .options(selectinload(User.player_state))
                .where(User.telegram_id == telegram_id)
            )
            user = user_result.scalar_one_or_none()

            if user is None:
                raise ValueError("User not found")

            if user.player_state is None:
                raise ValueError("Player state not found")

            game_result = await session.execute(
                select(RhythmGame).where(RhythmGame.user_id == user.id)
            )
            game = game_result.scalar_one_or_none()

            if game is None:
                raise ValueError("Rhythm game not started")

            if game.is_completed:
                raise ValueError("Rhythm game already completed")

            notes_by_index = {note["index"]: note for note in game.notes}
            used_notes = set()
            matched_notes = 0

            for hit in hits:
                note_index = hit["note_index"]
                hit_at_sec = hit["hit_at_sec"]

                note = notes_by_index.get(note_index)
                if note is None:
                    continue

                if note_index in used_notes:
                    continue

                expected_time = note["hit_at_sec"]
                if abs(hit_at_sec - expected_time) <= RhythmGameService.HIT_WINDOW:
                    matched_notes += 1
                    used_notes.add(note_index)

            total_notes = len(game.notes)
            accuracy_percent = 0.0
            if total_notes > 0:
                accuracy_percent = round((matched_notes / total_notes) * 100, 2)

            reward = RhythmGameService._calculate_reward(accuracy_percent)
            actual_added = add_clicks_with_cap(user.player_state, reward)

            game.is_completed = True

            await session.commit()

            return {
                "message": "Rhythm game finished",
                "total_notes": total_notes,
                "matched_notes": matched_notes,
                "accuracy_percent": accuracy_percent,
                "reward_clicks": actual_added,
                "clicks_left": user.player_state.clicks_left,
            }