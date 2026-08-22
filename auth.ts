/**
 * @file auth.ts
 * @description NextAuth configuration file setting up credentials authentication, database lookups via Drizzle, JWT sessions, custom pages, and a secure server-side sign out handler.
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

/**
 * Exports NextAuth configuration handlers, authentication state checkers, and auth methods.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /**
       * Authorizes a user by verifying their email and comparing hashed passwords from the database,
       * updating login tracking info upon success.
       *
       * @async
       * @param {Record<string, any>} [credentials] - The user credentials submitted via the sign-in form.
       * @returns {Promise<{ id: string } | null>} The authenticated user object containing the ID or null if authorization fails.
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await db.query.usersTable.findFirst({
          where: eq(usersTable.email, email),
        });

        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) return null;

        await db
          .update(usersTable)
          .set({
            lastLogin: new Date(),
            isOnline: true,
          })
          .where(eq(usersTable.id, user.id));

        return { id: String(user.id) };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    /**
     * Adds the user ID to the JWT token upon initial sign-in.
     *
     * @async
     * @param {Object} params - The JWT callback parameters.
     * @param {import("next-auth/jwt").JWT} params.token - The current JWT token.
     * @param {import("next-auth").User} [params.user] - The authenticated user object.
     * @returns {Promise<import("next-auth/jwt").JWT>} The updated JWT token.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    /**
     * Injects the user ID from the JWT token into the client session object.
     *
     * @async
     * @param {Object} params - The session callback parameters.
     * @param {import("next-auth").Session} params.session - The current session object.
     * @param {import("next-auth/jwt").JWT} params.token - The decoded JWT token.
     * @returns {Promise<import("next-auth").Session>} The updated session object.
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
