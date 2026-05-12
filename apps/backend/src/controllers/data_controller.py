from __future__ import annotations

from typing import Any

from fastapi import HTTPException

from src.services.data_service import build_summary, random_street_details


def summary_controller() -> dict[str, Any]:
    try:
        return build_summary()
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


def random_street_controller() -> dict[str, Any]:
    try:
        return random_street_details()
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
