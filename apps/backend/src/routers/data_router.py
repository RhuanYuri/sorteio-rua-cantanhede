from __future__ import annotations

from typing import Any

from fastapi import APIRouter

from src.controllers.data_controller import random_street_controller, summary_controller

router = APIRouter(prefix='/api', tags=['data'])


@router.get('/summary')
def summary() -> dict[str, Any]:
    return summary_controller()


@router.get('/random')
def random_street() -> dict[str, Any]:
    return random_street_controller()
