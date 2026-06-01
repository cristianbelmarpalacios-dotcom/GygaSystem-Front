import { API_BASE_URL } from "@/lib/api/config";
import type { HomepagePayload } from "./types";

export async function fetchHomepage(): Promise<HomepagePayload> {
  const res = await fetch(`${API_BASE_URL}/v1/homepage`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    return { sections: [], deals: [] };
  }
  return res.json() as Promise<HomepagePayload>;
}
