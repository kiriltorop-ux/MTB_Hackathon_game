from fastapi import APIRouter, HTTPException, Query

from app.services.user_service import UserService
from app.schemas.user import (
    InitResponseSchema,
    SetNicknameResponseSchema,
    SetNicknameSchema,
    UserInitSchema,
)

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/init", response_model=InitResponseSchema)
async def init_user(data: UserInitSchema):
    return await UserService.init_user(data)


@router.post("/set-nickname", response_model=SetNicknameResponseSchema)
async def set_nickname(data: SetNicknameSchema):
    try:
        return await UserService.set_nickname(
            telegram_id=data.telegram_id,
            nickname=data.nickname,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.get("/me", response_model=InitResponseSchema)
async def get_me(telegram_id: int = Query(...)):
    try:
        return await UserService.get_me(telegram_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))