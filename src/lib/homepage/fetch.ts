import { serverGetJson } from "@/lib/api/server-fetch";
import type { HomepagePayload } from "./types";

const EMPTY_HOMEPAGE: HomepagePayload = { sections: [], deals: [] };

export async function fetchHomepage(): Promise<HomepagePayload> {
  return serverGetJson<HomepagePayload>("/v1/homepage", EMPTY_HOMEPAGE, {
    next: { revalidate: 60 },
  });
}
