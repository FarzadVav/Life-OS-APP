"use client";

import { LanguagesIcon } from "lucide-react";

import { setLocale } from "@/features/general/actions/locale";
import { useLocale } from "../LocaleProvider/LocaleProvider";

function LocaleSwitcher() {
  const { locale, t } = useLocale();

  return (
    <form action={setLocale}>
      <input type="hidden" name="locale" value={locale === "en" ? "fa" : "en"} />
      <button
        type="submit"
        aria-label={t("profile.language")}
        className="flex h-10 items-center gap-2 rounded-full bg-card-thick px-4 text-sm font-medium"
      >
        <LanguagesIcon className="size-4" />
        {locale === "en" ? "فارسی" : "English"}
      </button>
    </form>
  );
}

export default LocaleSwitcher;
