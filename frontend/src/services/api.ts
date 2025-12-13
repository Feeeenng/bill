import axios from "axios";
import type {
  DashboardSummary,
  Entry,
  EntryPayload,
  VoiceEntryRequest,
  VoiceEntryResponse
} from "../types";

const client = axios.create({
  baseURL: "/api",
  timeout: 5000
});

export async function fetchEntries(date?: string): Promise<Entry[]> {
  const response = await client.get<Entry[]>("/entries", {
    params: date ? { date } : undefined
  });
  return response.data;
}

export async function createEntry(payload: EntryPayload): Promise<Entry> {
  const response = await client.post<Entry>("/entries", payload);
  return response.data;
}

export async function createVoiceEntry(
  payload: VoiceEntryRequest
): Promise<VoiceEntryResponse> {
  const response = await client.post<VoiceEntryResponse>("/entries/voice", payload);
  return response.data;
}

export async function fetchDashboard(date?: string): Promise<DashboardSummary> {
  const response = await client.get<DashboardSummary>("/dashboard/daily", {
    params: date ? { date } : undefined
  });
  return response.data;
}
