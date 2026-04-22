from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.users import router as users_router
from app.routers.roles import router as roles_router
from app.routers.battle import router as battle_router
from app.routers.boss import router as boss_router
from app.routers.friends import router as friends_router
from app.routers.leaderboard import router as leaderboard_router
from app.routers.memory_game import router as memory_game_router
from app.routers.daily_quest import router as daily_quest_router
from app.routers.rhythm_game import router as rhythm_game_router
from app.routers.class_game import router as class_game_router
from app.routers.mini_game import router as mini_game_router

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
app.include_router(memory_game_router)
app.include_router(daily_quest_router)
app.include_router(rhythm_game_router)
app.include_router(class_game_router)
app.include_router(mini_game_router)


@app.get("/")
async def root():
    return {"status": "ok"}