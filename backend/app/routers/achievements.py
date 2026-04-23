from fastapi import APIRouter, HTTPException, Query

from app.schemas.achievement import AchievementListResponseSchema
from app.services.achievement_service import AchievementService

router = APIRouter(prefix="/achievements", tags=["Achievements"])


@router.get("", response_model=AchievementListResponseSchema)
async def get_achievements(telegram_id: int = Query(...)):
    try:
        return await AchievementService.get_user_achievements(telegram_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))