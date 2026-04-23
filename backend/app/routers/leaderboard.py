from fastapi import APIRouter, HTTPException, Query

from app.schemas.leaderboard import LeaderboardItemSchema
from app.services.leaderboard_service import LeaderboardService

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])


@router.get("/global", response_model=list[LeaderboardItemSchema])
async def get_global_leaderboard():
    return await LeaderboardService.get_global_leaderboard()


@router.get("/friends", response_model=list[LeaderboardItemSchema])
async def get_friends_leaderboard(telegram_id: int = Query(...)):
    try:
        return await LeaderboardService.get_friends_leaderboard(telegram_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))