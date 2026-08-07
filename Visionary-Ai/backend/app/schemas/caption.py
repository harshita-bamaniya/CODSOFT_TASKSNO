from pydantic import BaseModel


class CaptionResponse(BaseModel):
    professional: str
    creative: str
    detailed: str
    social: str
    