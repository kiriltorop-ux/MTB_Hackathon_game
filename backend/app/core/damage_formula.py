import random

from app.core.role_coefficients import ROLES


def calculate_damage(role: str | None) -> tuple[int, bool]:
    if random.randint(1, 20) == 1:
        return 50, True

    base_damage = 10

    if role is None:
        return base_damage, False

    role_data = ROLES.get(role)
    if role_data is None:
        return base_damage, False

    damage_multiplier = role_data["damage_multiplier"]
    return int(base_damage * damage_multiplier), False