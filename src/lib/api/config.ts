export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

export const ADMIN_TOKEN_KEY = "gigasystem_admin_token";
