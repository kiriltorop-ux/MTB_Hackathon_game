from pydantic import BaseModel


class BossResponseSchema(BaseModel):
    boss_name: str
    current_hp: int
    max_hp: int

    class Config:
        from_attributes = True