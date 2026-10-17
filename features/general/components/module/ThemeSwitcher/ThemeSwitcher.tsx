"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useLocale } from "../LocaleProvider/LocaleProvider";
import SelectDialog from "../../ui/SelectDialog";

type ThemeSwitcherProps = {
  className?: string;
};

function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { t } = useLocale();

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const items = [
    { value: "light", label: t("colorScheme.light") },
    { value: "dark", label: t("colorScheme.dark") },
    { value: "system", label: t("colorScheme.system") },
  ];

  return (
    <SelectDialog
      items={items}
      value={mounted ? theme : undefined}
      onChange={(nextValue) => {
        if (nextValue) {
          setTheme(nextValue);
        }
      }}
      title={t("profile.colorScheme")}
      placeholder={t("profile.colorScheme")}
      triggerClassName={className}
    />
  );
}

export default ThemeSwitcher;
