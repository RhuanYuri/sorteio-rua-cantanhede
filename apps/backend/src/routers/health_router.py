from fastapi import APIRouter

from src.controllers.health_controller import health_controller

router = APIRouter()


@router.get('/health')
def health() -> dict[str, str]:
    return health_controller()
