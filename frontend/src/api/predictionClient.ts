import type { PredictionRequest, PredictionResponse } from "../types/prediction";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export async function getLocations(): Promise<string[]> {
  // locations.json lives in the frontend's public/ folder (copied from the notebook output),
  // so it is served from the frontend's own origin, not the API.
  const res = await fetch("/locations.json");
  if (!res.ok) {
    throw new Error("Could not load the locations list");
  }
  return res.json();
}

export async function predictPrice(
  payload: PredictionRequest
): Promise<PredictionResponse> {
  const res = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    throw new Error(detail?.detail ? JSON.stringify(detail.detail) : "Prediction failed");
  }

  return res.json();
}
