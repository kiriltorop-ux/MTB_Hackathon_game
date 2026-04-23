from aiogram.types import KeyboardButton, ReplyKeyboardMarkup, WebAppInfo
from config import WEB_APP_URL


def get_webapp_keyboard():
    return ReplyKeyboardMarkup(
        keyboard=[
            [
                KeyboardButton(
                    text="Открыть игру",
                    web_app=WebAppInfo(url=WEB_APP_URL)
                )
            ]
        ],
        resize_keyboard=True
    )