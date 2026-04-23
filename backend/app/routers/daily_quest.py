from fastapi import APIRouter, HTTPException, Query

from app.schemas.daily_quest import (
    CompleteAnswerQuestSchema,
    CompleteAthleteQuestSchema,
    CompleteQuestResponseSchema,
    DailyQuestResponseSchema,
)
from app.services.daily_quest_service import DailyQuestService

router = APIRouter(prefix="/daily-quest", tags=["Daily Quest"])


@router.get("", response_model=DailyQuestResponseSchema)
async def get_daily_quest(telegram_id: int = Query(...)):
    try:
        return await DailyQuestService.get_daily_quest(telegram_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/complete-athlete", response_model=CompleteQuestResponseSchema)
async def complete_athlete_quest(data: CompleteAthleteQuestSchema):
    try:
        return await DailyQuestService.complete_athlete_quest(
            telegram_id=data.telegram_id,
            photo_attached=data.photo_attached,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/complete-answer", response_model=CompleteQuestResponseSchema)
async def complete_answer_quest(data: CompleteAnswerQuestSchema):
    try:
        return await DailyQuestService.complete_answer_quest(
            telegram_id=data.telegram_id,
            answer=data.answer,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))