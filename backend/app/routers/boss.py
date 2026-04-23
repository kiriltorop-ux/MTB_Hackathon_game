from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect

from app.schemas.boss import BossResponseSchema
from app.services.boss_service import BossService
from app.websocket.boss_manager import boss_connection_manager

router = APIRouter(prefix="/boss", tags=["Boss"])


@router.get("/current", response_model=BossResponseSchema)
async def get_current_boss():
    try:
        return await BossService.get_current_boss()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.websocket("/ws")
async def boss_ws(websocket: WebSocket):
    await boss_connection_manager.connect(websocket)

    try:
        boss = await BossService.get_current_boss()
        await websocket.send_json(
            {
                "type": "boss_update",
                "boss_name": boss.boss_name,
                "current_hp": boss.current_hp,
                "max_hp": boss.max_hp,
            }
        )

        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        boss_connection_manager.disconnect(websocket)
    except Exception:
        boss_connection_manager.disconnect(websocket)