# 1. Перейти в папку бэкенда

cd ./YOUR_FOLDER/

# 2. Активировать виртуальное окружение

.venv\Scripts\activate

# 3. Установить зависимости (если ещё не)

pip install fastapi uvicorn sqlalchemy asyncpg alembic pydantic pydantic-settings python-dotenv aiosqlite

# 4. Создать файл .env (если нет) с содержимым:

# DB_HOST=localhost

# DB_PORT=5432

# DB_NAME=clicker_db

# DB_USER=postgres

# DB_PASS=postgres

# 5. Запустить сервер

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
