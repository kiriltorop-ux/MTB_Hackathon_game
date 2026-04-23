from fastapi import APIRouter, HTTPException

from pydantic import BaseModel

from app.services.mini_game_service import MiniGameService

router = APIRouter(prefix="/mini-games", tags=["Mini Games"])


class RandomMiniGameSchema(BaseModel):
    telegram_id: int


@router.post("/random")
async def get_random_game(data: RandomMiniGameSchema):
    try:
        return await MiniGameService.get_random_game(data.telegram_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))