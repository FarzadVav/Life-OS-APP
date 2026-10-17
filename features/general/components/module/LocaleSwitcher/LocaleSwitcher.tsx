"use client";

import { changeLocale } from "@/features/general/actions/locale";
import { useLocale } from "../LocaleProvider/LocaleProvider";
import { Locale } from "@/features/general/lib/i18n/config";
import SelectDialog from "../../ui/SelectDialog";

type LocaleSwitcherProps = {
  className?: string;
};

function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const { locale, t } = useLocale();

  const items = [
    { value: "en" as const, label: t("language.english") },
    { value: "fa" as const, label: t("language.persian") },
  ];

  return (
    <SelectDialog
      items={items}
      value={locale}
      onChange={(nextValue) => {
        if (nextValue) {
          changeLocale(nextValue as Locale);
        }
      }}
      title={t("profile.language")}
      placeholder={t("profile.language")}
      triggerClassName={className}
    />
  );
}

export default LocaleSwitcher;
