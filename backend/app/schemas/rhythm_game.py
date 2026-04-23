from pydantic import BaseModel, Field


class RhythmNoteSchema(BaseModel):
    index: int
    lane: int
    hit_at_sec: float


class RhythmGameStartSchema(BaseModel):
    telegram_id: int


class RhythmGameStartResponseSchema(BaseModel):
    game_type: str
    duration_seconds: int
    lanes_count: int
    speed_phases: list[float]
    notes: list[RhythmNoteSchema]


class RhythmHitSchema(BaseModel):
    note_index: int
    hit_at_sec: float


class RhythmGameFinishSchema(BaseModel):
    telegram_id: int
    hits: list[RhythmHitSchema]


class RhythmGameFinishResponseSchema(BaseModel):
    message: str
    total_notes: int
    matched_notes: int
    accuracy_percent: float
    reward_clicks: int
    clicks_left: int