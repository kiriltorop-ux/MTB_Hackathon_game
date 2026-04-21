# app/config.py
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    app_name: str = "Boss Clicker Game"
    debug: bool = True
    
    # Временно сделаем необязательными
    DB_HOST: str = "localhost"
    DB_PORT: str = "5432"
    DB_NAME: str = "clicker_db"
    DB_USER: str = "postgres"
    DB_PASS: str = "postgres"
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
    
    class Config:
        env_file = ".env"
        extra = "ignore"  # игнорировать лишние переменные

settings = Settings()