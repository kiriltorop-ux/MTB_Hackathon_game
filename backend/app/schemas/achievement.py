from pydantic import BaseModel


class AchievementItemSchema(BaseModel):
    code: str
    title: str
    description: str
    category: str
    reward_damage_bonus: int
    reward_coins: int
    reward_note: str | None = None
    is_hidden: bool
    is_implemented: bool
    is_unlocked: bool


class AchievementListResponseSchema(BaseModel):
    achievements: list[AchievementItemSchema]
    achievement_damage_bonus: int
    coins: int