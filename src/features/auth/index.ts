// Types - safe for both client and server
export * from "./types/auth";

// Actions - for client components using useActionState
export * from "./actions/auth-actions";

// Server-only exports - DO NOT import in client components
// Use: import { getAuthFromCookie } from "@/features/auth/server"
