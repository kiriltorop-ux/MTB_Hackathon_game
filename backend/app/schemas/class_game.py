from pydantic import BaseModel


class ClassGameStartSchema(BaseModel):
    telegram_id: int


class ClassGameStartResponseSchema(BaseModel):
    game_type: str
    role: str
    payload: dict


class AthleteGameFinishSchema(BaseModel):
    telegram_id: int
    selected_exercises: list[str]


class GourmetGameFinishSchema(BaseModel):
    telegram_id: int
    distribution: dict


class StylistGameFinishSchema(BaseModel):
    telegram_id: int
    assignments: dict
    finished_in_time: bool


class TravelerGameFinishSchema(BaseModel):
    telegram_id: int
    route: list[str]
    completed_in_seconds: int


class ClassGameFinishResponseSchema(BaseModel):
    message: str
    reward_clicks: int
    clicks_left: int
    score: float