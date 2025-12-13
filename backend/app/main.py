"""FastAPI entrypoint for the bill tracker backend."""

from __future__ import annotations

import re
from datetime import date
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .schemas import (
    DashboardSummary,
    Entry,
    EntryCreate,
    EntryMethod,
    VoiceEntryRequest,
    VoiceEntryResponse,
)
from .storage import EntryRepository


app = FastAPI(title="Bill Tracker API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

repository = EntryRepository()


@app.get("/api/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/entries", response_model=Entry, status_code=201)
def create_entry(payload: EntryCreate) -> Entry:
    return repository.add_entry(payload)


@app.post("/api/entries/voice", response_model=VoiceEntryResponse, status_code=201)
def create_voice_entry(payload: VoiceEntryRequest) -> VoiceEntryResponse:
    amount = _infer_amount(payload.transcript, payload.amount_hint)
    category = _infer_category(payload.transcript, payload.category_hint)
    note = payload.note_hint or payload.transcript[:120]
    entry = repository.add_entry(
        EntryCreate(
            amount=amount,
            category=category,
            note=note,
            method=EntryMethod.VOICE,
        )
    )
    return VoiceEntryResponse(entry=entry, transcript=payload.transcript)


@app.get("/api/entries", response_model=List[Entry])
def list_entries(target_date: Optional[date] = Query(default=None, alias="date")) -> List[Entry]:
    return repository.list_entries(target_date)


@app.get("/api/dashboard/daily", response_model=DashboardSummary)
def daily_dashboard(target_date: Optional[date] = Query(default=None, alias="date")) -> DashboardSummary:
    day = target_date or date.today()
    return repository.summarize_day(day)


def _infer_amount(transcript: str, amount_hint: Optional[float]) -> float:
    if amount_hint:
        return amount_hint
    match = re.search(r"(\d+(?:\.\d+)?)", transcript)
    if not match:
        raise HTTPException(
            status_code=422, detail="Unable to detect an amount from the voice transcript."
        )
    return float(match.group(1))


def _infer_category(transcript: str, category_hint: Optional[str]) -> str:
    if category_hint:
        return category_hint
    lowered = transcript.lower()
    keyword_map = {
        "coffee": "coffee",
        "drink": "beverage",
        "taxi": "transport",
        "bus": "transport",
        "metro": "transport",
        "uber": "transport",
        "train": "transport",
        "food": "food",
        "lunch": "food",
        "dinner": "food",
        "grocery": "groceries",
        "market": "groceries",
        "rent": "housing",
    }
    for keyword, category in keyword_map.items():
        if keyword in lowered:
            return category
    return "others"
