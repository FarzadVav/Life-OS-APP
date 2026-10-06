"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { isLocale, LOCALE_COOKIE } from "@/features/general/lib/i18n/config";

export async function changeLocale(locale: string) {
  if (isLocale(locale)) {
    const cookieStore = await cookies();
    cookieStore.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  revalidatePath("/", "layout");
}

export async function setLocale(formData: FormData) {
  const locale = formData.get("locale");

  if (typeof locale === "string" && isLocale(locale)) {
    const cookieStore = await cookies();
    cookieStore.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  revalidatePath("/", "layout");
}
