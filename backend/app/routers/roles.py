from fastapi import APIRouter, HTTPException

from app.schemas.role import (
    RoleItemSchema,
    RoleSelectResponseSchema,
    RoleSelectSchema,
)
from app.services.role_service import RoleService

router = APIRouter(prefix="/roles", tags=["Roles"])


@router.get("", response_model=list[RoleItemSchema])
async def get_roles():
    return await RoleService.get_roles()


@router.post("/select", response_model=RoleSelectResponseSchema)
async def select_role(data: RoleSelectSchema):
    try:
        return await RoleService.select_role(
            telegram_id=data.telegram_id,
            role=data.role,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))