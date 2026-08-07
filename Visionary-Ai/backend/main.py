from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.health import router as health_router
from app.api.routes.caption import router as caption_router


app = FastAPI(
    title="Visionary AI API",
    description="Professional AI Image Captioning API",
    version="2.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    health_router,
    prefix="/api/v1",
    tags=["Health"],
)

app.include_router(
    caption_router,
    prefix="/api/v1/caption",
    tags=["Caption"],
)


@app.get("/")
def root():
    return {
        "message": "Visionary AI Backend Running",
        "status": "success",
        "version": "2.0.0",
    }