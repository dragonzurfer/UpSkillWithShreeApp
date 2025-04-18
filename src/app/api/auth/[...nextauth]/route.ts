import NextAuth, { NextAuthOptions, Account, Profile } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
// Import User type if needed from next-auth

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("Missing GOOGLE_CLIENT_ID environment variable");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing GOOGLE_CLIENT_SECRET environment variable");
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Request the 'id_token' in the authorization scope
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          // Request id_token along with other scopes
          scope: "openid email profile",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Use JWT strategy to handle tokens
  },
  callbacks: {
    // Include Google ID token in the JWT
    async jwt({ token, account }: { token: JWT; account: Account | null }): Promise<JWT> {
      // Persist the id_token to the token right after sign in
      if (account) {
        token.idToken = account.id_token; // Add id_token
      }
      return token;
    },
    // Make ID token available in the client-side session object (use with caution)
    async session({ session, token }: { session: any; token: JWT }): Promise<any> {
       // Send properties to the client, like an access_token and user id from a provider.
      session.idToken = token.idToken; // Add id_token to session
      return session;
    },
  },
  // Add other configurations here if needed
  pages: {
    signIn: '/login',
    error: '/api/auth/error',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };