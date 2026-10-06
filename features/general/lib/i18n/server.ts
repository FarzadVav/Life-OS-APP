import { cookies } from "next/headers";

import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, Locale } from "./config";
import { getDictionary, translate } from "./dictionary";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;

  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getTranslations() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);

  return {
    locale,
    dictionary,
    t: (key: string) => translate(dictionary, key),
  };
}
