from aiogram import Router
from aiogram.filters import CommandStart
from aiogram.types import Message
from keyboards.webapp import get_webapp_keyboard

router = Router()


@router.message(CommandStart())
async def cmd_start(message: Message):
    await message.answer(
        "Нажми кнопку ниже, чтобы открыть игру.",
        reply_markup=get_webapp_keyboard()
    )