from pydantic import BaseModel


class TapBossSchema(BaseModel):
    telegram_id: int


class BattleResponseSchema(BaseModel):
    damage: int
    click_damage: int
    achievement_damage_bonus: int
    is_critical: bool
    clicks_left: int
    total_damage: int
    boss_current_hp: int
    boss_max_hp: int
    is_boss_dead: bool