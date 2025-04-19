import { NextAuthOptions, Account } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("Missing GOOGLE_CLIENT_ID environment variable");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing GOOGLE_CLIENT_SECRET environment variable");
}

// Define the max age in seconds (30 days)
const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60;

/**
 * Helper function to refresh an expired access token using the refresh token
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    // Use Google's token endpoint directly
    const url = "https://oauth2.googleapis.com/token";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      console.error("Error refreshing access token", refreshedTokens);
      // Return the token we have - it might still work, or session will be invalidated
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }

    console.log("Successfully refreshed access token");

    // Calculate new expiry time - default to 1 hour (3600 seconds) if not provided
    const expiresIn = refreshedTokens.expires_in ?? 3600;
    const accessTokenExpires = Date.now() + expiresIn * 1000;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      idToken: refreshedTokens.id_token ?? token.idToken, // Keep previous if not provided
      accessTokenExpires,
      // Don't update refresh token - Google sends a new one only if necessary
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      error: undefined, // Clear any previous errors
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
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
    maxAge: THIRTY_DAYS_IN_SECONDS, // Set session max age to 30 days
  },
  jwt: {
    maxAge: THIRTY_DAYS_IN_SECONDS, // Set JWT max age to 30 days
  },
  callbacks: {
    // Handle JWT operations including token refresh
    async jwt({ token, account }: { token: JWT; account: Account | null }): Promise<JWT> {
      // Initial sign-in: save all relevant token info
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          idToken: account.id_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at 
            ? account.expires_at * 1000 // convert to milliseconds
            : Date.now() + 3600 * 1000, // default 1 hour
          providerAccountId: account.providerAccountId,
        };
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && typeof token.accessTokenExpires === 'number' && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to refresh it
      return refreshAccessToken(token);
    },
    
    // Make token information available in the client-side session
    async session({ session, token }: { session: any; token: JWT }): Promise<any> {
      // Send properties to the client
      session.accessToken = token.accessToken;
      session.idToken = token.idToken;
      session.error = token.error;
      
      if (token.providerAccountId) {
        session.user.id = token.providerAccountId;
      }

      return session;
    },
  },
  // Add other configurations here if needed
  pages: {
    signIn: '/login',
    error: '/api/auth/error',
  },
}; 