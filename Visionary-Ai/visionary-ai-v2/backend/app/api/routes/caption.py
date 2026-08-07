import os
import uuid

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.caption_model import caption_model
from app.services.gemini_service import gemini_service

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/generate")
async def generate_caption(file: UploadFile = File(...)):

    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Please upload an image."
        )

    filename = f"{uuid.uuid4()}.jpg"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(await file.read())

    try:
        # Step 1: Generate base caption
        base_caption = caption_model.generate(filepath)

        print("BLIP:", base_caption)

        # Step 2: Enhance using Gemini
        try:
            captions = gemini_service.enhance_caption(base_caption)
            captions["ai_enhanced"] = True

        except Exception as e:
            print("Gemini Error:", e)

            captions = {
                "professional": base_caption,
                "creative": base_caption,
                "detailed": base_caption,
                "social": base_caption,
                "ai_enhanced": False,
            }

        return captions

    finally:
        if os.path.exists(filepath):
            os.remove(filepath)