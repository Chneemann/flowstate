import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.email === "test@flowstate.io" &&
          credentials?.password === "password"
        ) {
          return { id: "1", name: "Charlotte W.", email: "test@flowstate.io" };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});
