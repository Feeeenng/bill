export type EntryMethod = "manual" | "voice";

export interface Entry {
  id: string;
  amount: number;
  category: string;
  note?: string | null;
  method: EntryMethod;
  occurred_at: string;
  date: string;
}

export interface EntryPayload {
  amount: number;
  category: string;
  note?: string;
  occurred_at?: string;
  method?: EntryMethod;
}

export interface VoiceEntryRequest {
  transcript: string;
  amount_hint?: number;
  category_hint?: string;
  note_hint?: string;
}

export interface VoiceEntryResponse {
  entry: Entry;
  transcript: string;
  requires_confirmation: boolean;
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
}

export interface DashboardSummary {
  date: string;
  total_spending: number;
  categories: CategorySummary[];
  top_category?: string | null;
  entry_count: number;
}
