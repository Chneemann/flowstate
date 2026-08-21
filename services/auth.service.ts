/**
 * @file services/auth.service.ts
 * @description Authentication service providing helper functions for retrieving authentication details such as guest credentials from environment variables.
 */

/**
 * Retrieves configured guest account credentials from server or public environment variables.
 *
 * @async
 * @returns {Promise<{ email?: string; password?: string; error?: string }>} An object containing the guest email and password, or an error message if unconfigured.
 */
export async function getGuestCredentials() {
  const email = process.env.GUEST_EMAIL || process.env.NEXT_PUBLIC_GUEST_EMAIL;
  const password =
    process.env.GUEST_PASSWORD || process.env.NEXT_PUBLIC_GUEST_PASSWORD;

  if (!email || !password) {
    return { error: "Guest login is not configured on the server." };
  }

  return { email, password };
}
