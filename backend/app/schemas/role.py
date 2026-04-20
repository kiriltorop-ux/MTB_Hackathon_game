from pydantic import BaseModel


class RoleItemSchema(BaseModel):
    code: str
    name: str
    description: str


class RoleSelectSchema(BaseModel):
    telegram_id: int
    role: str


class RoleSelectResponseSchema(BaseModel):
    message: str
    role: str