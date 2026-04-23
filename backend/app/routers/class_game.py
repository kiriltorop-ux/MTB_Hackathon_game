from fastapi import APIRouter, HTTPException

from app.schemas.class_game import (
    AthleteGameFinishSchema,
    ClassGameFinishResponseSchema,
    ClassGameStartResponseSchema,
    ClassGameStartSchema,
    GourmetGameFinishSchema,
    StylistGameFinishSchema,
    TravelerGameFinishSchema,
)
from app.services.class_game_service import ClassGameService

router = APIRouter(prefix="/mini-games/class", tags=["Class Game"])


@router.post("/start", response_model=ClassGameStartResponseSchema)
async def start_class_game(data: ClassGameStartSchema):
    try:
        return await ClassGameService.start_game(data.telegram_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/finish-athlete", response_model=ClassGameFinishResponseSchema)
async def finish_athlete_game(data: AthleteGameFinishSchema):
    try:
        return await ClassGameService.finish_athlete_game(
            telegram_id=data.telegram_id,
            selected_exercises=data.selected_exercises,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/finish-gourmet", response_model=ClassGameFinishResponseSchema)
async def finish_gourmet_game(data: GourmetGameFinishSchema):
    try:
        return await ClassGameService.finish_gourmet_game(
            telegram_id=data.telegram_id,
            distribution=data.distribution,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/finish-stylist", response_model=ClassGameFinishResponseSchema)
async def finish_stylist_game(data: StylistGameFinishSchema):
    try:
        return await ClassGameService.finish_stylist_game(
            telegram_id=data.telegram_id,
            assignments=data.assignments,
            finished_in_time=data.finished_in_time,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/finish-traveler", response_model=ClassGameFinishResponseSchema)
async def finish_traveler_game(data: TravelerGameFinishSchema):
    try:
        return await ClassGameService.finish_traveler_game(
            telegram_id=data.telegram_id,
            route=data.route,
            completed_in_seconds=data.completed_in_seconds,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))