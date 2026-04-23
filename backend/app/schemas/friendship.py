from pydantic import BaseModel


class AddFriendSchema(BaseModel):
    telegram_id: int
    friend_nickname: str


class AddFriendResponseSchema(BaseModel):
    message: str


class FriendItemSchema(BaseModel):
    id: int
    telegram_id: int
    username: str | None = None
    first_name: str | None = None
    nickname: str | None = None
    role: str | None = None

    class Config:
        from_attributes = True