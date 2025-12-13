"""In-memory persistence layer for demo purposes."""

from __future__ import annotations

from collections import defaultdict
from datetime import date, datetime
from typing import Dict, List, Optional
from uuid import uuid4

from .schemas import (
    CategorySummary,
    DashboardSummary,
    Entry,
    EntryCreate,
)


class EntryRepository:
    """A naive in-memory store. Replace with a database in production."""

    def __init__(self) -> None:
        self._entries: Dict[str, Entry] = {}

    def add_entry(self, payload: EntryCreate) -> Entry:
        occurred_at = payload.occurred_at or datetime.utcnow()
        entry = Entry(
            id=str(uuid4()),
            amount=payload.amount,
            category=payload.category,
            note=payload.note,
            method=payload.method,
            occurred_at=occurred_at,
            date=occurred_at.date(),
        )
        self._entries[entry.id] = entry
        return entry

    def list_entries(self, target_date: Optional[date] = None) -> List[Entry]:
        entries = list(self._entries.values())
        if target_date is not None:
            entries = [entry for entry in entries if entry.date == target_date]
        return sorted(entries, key=lambda entry: entry.occurred_at, reverse=True)

    def summarize_day(self, target_date: date) -> DashboardSummary:
        entries = self.list_entries(target_date)
        total = sum(entry.amount for entry in entries)
        category_totals: Dict[str, float] = defaultdict(float)
        for entry in entries:
            category_totals[entry.category] += entry.amount
        categories: List[CategorySummary] = []
        for category, amount in category_totals.items():
            percentage = (amount / total * 100) if total else 0
            categories.append(
                CategorySummary(category=category, amount=amount, percentage=percentage)
            )
        categories.sort(key=lambda c: c.amount, reverse=True)
        top_category = categories[0].category if categories else None
        return DashboardSummary(
            date=target_date,
            total_spending=total,
            categories=categories,
            top_category=top_category,
            entry_count=len(entries),
        )
