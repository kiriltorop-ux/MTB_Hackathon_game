from pydantic import BaseModel


class LeaderboardItemSchema(BaseModel):
    id: int
    telegram_id: int
    nickname: str | None = None
    role: str | None = None
    total_damage: int
    place: int