import "server-only";

export type SessionPayload = {
  userId: string;
  username: string;
  expiresAt: Date;
};

// Demo credentials — replace with a real user store / auth provider.
export const DEMO_USER = {
  id: "1",
  username: "admin",
  password: "password123",
};
