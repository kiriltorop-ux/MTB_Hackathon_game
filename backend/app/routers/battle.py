from fastapi import APIRouter, HTTPException

from app.schemas.battle import BattleResponseSchema, TapBossSchema
from app.services.battle_service import BattleService

router = APIRouter(prefix="/battle", tags=["Battle"])


@router.post("/tap", response_model=BattleResponseSchema)
async def tap_boss(data: TapBossSchema):
    try:
        return await BattleService.tap_boss(data.telegram_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))