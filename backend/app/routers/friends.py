from fastapi import APIRouter, HTTPException, Query

from app.schemas.friendship import (
    AddFriendResponseSchema,
    AddFriendSchema,
    FriendItemSchema,
)
from app.services.friendship_service import FriendshipService

router = APIRouter(prefix="/friends", tags=["Friends"])


@router.post("/add", response_model=AddFriendResponseSchema)
async def add_friend(data: AddFriendSchema):
    try:
        return await FriendshipService.add_friend(
            telegram_id=data.telegram_id,
            friend_nickname=data.friend_nickname,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/list", response_model=list[FriendItemSchema])
async def get_friends(telegram_id: int = Query(...)):
    try:
        return await FriendshipService.get_friends(telegram_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))