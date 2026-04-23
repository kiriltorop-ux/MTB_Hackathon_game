from fastapi import APIRouter, HTTPException

from app.schemas.memory_game import (
    MemoryGameFlipResponseSchema,
    MemoryGameFlipSchema,
    MemoryGameStartResponseSchema,
    MemoryGameStartSchema,
)
from app.services.memory_game_service import MemoryGameService

router = APIRouter(prefix="/mini-games/memory", tags=["Memory Game"])


@router.post("/start", response_model=MemoryGameStartResponseSchema)
async def start_memory_game(data: MemoryGameStartSchema):
    try:
        return await MemoryGameService.start_game(data.telegram_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/flip", response_model=MemoryGameFlipResponseSchema)
async def flip_memory_card(data: MemoryGameFlipSchema):
    try:
        return await MemoryGameService.flip_card(data.telegram_id, data.index)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))