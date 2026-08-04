/**
 * @file route.ts
 * @description API route handler exporting NextAuth authentication request handlers (GET and POST).
 */

import { handlers } from "@/auth";

/**
 * Exports NextAuth route handlers for processing authentication endpoints.
 */
export const { GET, POST } = handlers;
