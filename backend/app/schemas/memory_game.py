from pydantic import BaseModel


class MemoryGameStartSchema(BaseModel):
    telegram_id: int


class MemoryGameFlipSchema(BaseModel):
    telegram_id: int
    index: int


class MemoryGameCardSchema(BaseModel):
    index: int
    is_open: bool
    value: int | None = None


class MemoryGameStateSchema(BaseModel):
    cards: list[MemoryGameCardSchema]
    moves_count: int
    opened_indices: list[int]
    matched_indices: list[int]
    is_completed: bool


class MemoryGameStartResponseSchema(BaseModel):
    game_type: str
    state: MemoryGameStateSchema


class MemoryGameFlipResponseSchema(BaseModel):
    state: MemoryGameStateSchema
    pair_matched: bool | None = None
    clicks_restored: bool = False