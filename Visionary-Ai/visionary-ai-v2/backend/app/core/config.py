from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Visionary AI"
    VERSION: str = "2.0.0"

    GEMINI_API_KEY: str = ""

    class Config:
        env_file = ".env"


settings = Settings()