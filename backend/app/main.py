from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.users import router as users_router
from app.routers.roles import router as roles_router
from app.routers.battle import router as battle_router
from app.routers.boss import router as boss_router
from app.routers.friends import router as friends_router
from app.routers.leaderboard import router as leaderboard_router

app = FastAPI(title="MTB Game API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(roles_router)
app.include_router(battle_router)
app.include_router(boss_router)
app.include_router(friends_router)
app.include_router(leaderboard_router)


@app.get("/")
async def root():
    return {"status": "ok"}