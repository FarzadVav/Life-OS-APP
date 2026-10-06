"use server";

import { redirect } from "next/navigation";

import { createSession, deleteSession } from "../lib/session";
import { DEMO_USER } from "../lib/definitions";

export type LoginFormState =
  | {
      errors?: {
        username?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export async function login(
  state: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const errors: NonNullable<LoginFormState>["errors"] = {};

  if (!username || username.length < 3) {
    errors.username = ["Username must be at least 3 characters long."];
  }

  if (!password || password.length < 6) {
    errors.password = ["Password must be at least 6 characters long."];
  }

  if (errors.username || errors.password) {
    return { errors };
  }

  if (username !== DEMO_USER.username || password !== DEMO_USER.password) {
    return { message: "Invalid username or password." };
  }

  await createSession({ userId: DEMO_USER.id, username: DEMO_USER.username });

  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
