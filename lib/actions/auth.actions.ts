/**
 * @file app/lib/actions/auth.actions.ts
 * @description Server actions for handling user logout and status updates.
 */

"use server";

import { auth, signOut } from "@/auth";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Handles user sign-out by updating the user's online status to offline in the database
 * and terminating the active session, redirecting to the homepage.
 *
 * @async
 * @returns {Promise<void>} Resolves when the user is signed out and redirected.
 */
export async function handleSignOut() {
  const session = await auth();

  if (session?.user?.id) {
    await db
      .update(usersTable)
      .set({ isOnline: false })
      .where(eq(usersTable.id, session.user.id));
  }

  await signOut({ redirectTo: "/" });
}
