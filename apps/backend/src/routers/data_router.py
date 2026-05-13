from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Query

from src.controllers.data_controller import random_street_controller, summary_controller

router = APIRouter(tags=['data'])


@router.get('/summary')
def summary(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=25, ge=1, le=200),
    filter_text: str = Query(default='', alias='filter'),
) -> dict[str, Any]:
    return summary_controller(page=page, page_size=page_size, filter_text=filter_text)


@router.get('/random')
def random_street() -> dict[str, Any]:
    return random_street_controller()
