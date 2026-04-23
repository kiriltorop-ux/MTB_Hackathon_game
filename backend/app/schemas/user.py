from pydantic import BaseModel


class UserInitSchema(BaseModel):
    telegram_id: int
    username: str | None = None
    first_name: str | None = None


class UserResponseSchema(BaseModel):
    id: int
    telegram_id: int
    username: str | None = None
    first_name: str | None = None
    nickname: str | None = None
    role: str | None = None

    class Config:
        from_attributes = True


class PlayerStateResponseSchema(BaseModel):
    total_damage: int
    daily_click_limit: int
    clicks_left: int

    class Config:
        from_attributes = True


class InitResponseSchema(BaseModel):
    user: UserResponseSchema
    player_state: PlayerStateResponseSchema


class SetNicknameSchema(BaseModel):
    telegram_id: int
    nickname: str


class SetNicknameResponseSchema(BaseModel):
    message: str
    nickname: str