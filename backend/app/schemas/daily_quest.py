from pydantic import BaseModel


class DailyQuestResponseSchema(BaseModel):
    quest_type: str
    question: str | None = None
    options: list[str] | None = None
    is_completed: bool


class CompleteAthleteQuestSchema(BaseModel):
    telegram_id: int
    photo_attached: bool


class CompleteAnswerQuestSchema(BaseModel):
    telegram_id: int
    answer: str


class CompleteQuestResponseSchema(BaseModel):
    message: str
    is_completed: bool
    damage_boost_active: bool