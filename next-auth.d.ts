import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    idToken?: string;
    // Add any other custom token fields here
  }
}

// Extend the Session type
declare module "next-auth" {
  interface Session {
    idToken?: string; // Add the custom idToken field
    user?: {
      id?: string | null; // You might want to add user ID if needed
    } & DefaultSession["user"]; // Keep existing user fields
  }

  // Optional: Extend the User type if needed
  // interface User extends DefaultUser {
  //   // Add custom user fields here
  // }
} 