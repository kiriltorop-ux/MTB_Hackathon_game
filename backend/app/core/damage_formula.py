import random

from app.core.constants import BASE_DAMAGE, BOOSTED_DAMAGE
from app.models.player_state import PlayerState


def calculate_damage(player_state: PlayerState) -> tuple[int, bool]:
    if random.randint(1, 20) == 1:
        return 50, True

    if player_state.daily_damage_boost_active:
        return BOOSTED_DAMAGE, False

    return BASE_DAMAGE, False