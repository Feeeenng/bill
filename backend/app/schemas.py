"""Pydantic schemas shared across the FastAPI application."""

from __future__ import annotations

from datetime import date, datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class EntryMethod(str, Enum):
    """Represents how an entry was created."""

    MANUAL = "manual"
    VOICE = "voice"


class EntryBase(BaseModel):
    amount: float = Field(gt=0, description="Positive expense amount")
    category: str = Field(min_length=1, description="Spending category, e.g. food")
    note: Optional[str] = Field(default=None, description="Optional remark for the expense")


class EntryCreate(EntryBase):
    occurred_at: Optional[datetime] = Field(
        default=None, description="Optional timestamp, defaults to now if omitted"
    )
    method: EntryMethod = Field(default=EntryMethod.MANUAL)


class Entry(EntryBase):
    id: str
    date: date
    method: EntryMethod
    occurred_at: datetime


class VoiceEntryRequest(BaseModel):
    transcript: str = Field(min_length=1, description="Speech-to-text transcript source")
    amount_hint: Optional[float] = Field(
        default=None, description="Optional amount extracted by the client"
    )
    category_hint: Optional[str] = Field(
        default=None, description="Optional category extracted by the client"
    )
    note_hint: Optional[str] = Field(
        default=None, description="Optional note extracted by the client"
    )


class VoiceEntryResponse(BaseModel):
    entry: Entry
    transcript: str
    requires_confirmation: bool = Field(
        default=True,
        description="Flag for the client to prompt the user to confirm parsed data",
    )


class CategorySummary(BaseModel):
    category: str
    amount: float
    percentage: float


class DashboardSummary(BaseModel):
    date: date
    total_spending: float
    categories: List[CategorySummary]
    top_category: Optional[str]
    entry_count: int
