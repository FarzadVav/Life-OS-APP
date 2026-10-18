export type SessionPayload = {
  userId: string;
  username: string;
  expiresAt: Date;
};

export type AuthUser = {
  id: number;
  username: string;
  name?: string | null;
  email?: string | null;
  locale: string;
  colorScheme: string;
  createdAt: string;
};

export type LoginFormState =
  | {
      errors?: {
        username?: string[];
        password?: string[];
      };
      message?: string;
      inputs?: {
        username?: string;
      };
      success?: boolean;
    }
  | undefined;

export type LogoutFormState =
  | {
      message?: string;
      success?: boolean;
    }
  | undefined;
