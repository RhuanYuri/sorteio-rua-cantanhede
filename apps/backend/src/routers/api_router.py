from fastapi import APIRouter

from src.routers.data_router import router as data_router
from src.routers.health_router import router as health_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(data_router)
