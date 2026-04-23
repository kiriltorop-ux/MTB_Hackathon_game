import asyncio

from app.services.achievement_service import AchievementService


async def main():
    await AchievementService.seed_achievements()
    print("Achievements seeded successfully")


if __name__ == "__main__":
    asyncio.run(main())