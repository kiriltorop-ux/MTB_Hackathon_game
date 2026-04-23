from fastapi import APIRouter, HTTPException

from app.schemas.rhythm_game import (
    RhythmGameFinishResponseSchema,
    RhythmGameFinishSchema,
    RhythmGameStartResponseSchema,
    RhythmGameStartSchema,
)
from app.services.rhythm_game_service import RhythmGameService

router = APIRouter(prefix="/mini-games/rhythm", tags=["Rhythm Game"])


@router.post("/start", response_model=RhythmGameStartResponseSchema)
async def start_rhythm_game(data: RhythmGameStartSchema):
    try:
        return await RhythmGameService.start_game(data.telegram_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/finish", response_model=RhythmGameFinishResponseSchema)
async def finish_rhythm_game(data: RhythmGameFinishSchema):
    try:
        hits = [{"note_index": hit.note_index, "hit_at_sec": hit.hit_at_sec} for hit in data.hits]
        return await RhythmGameService.finish_game(
            telegram_id=data.telegram_id,
            hits=hits,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))