"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Select } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { useLocale } from "../LocaleProvider/LocaleProvider";
import { Button } from "../../ui/Button/Button";
import { cn } from "cn";

type ThemeSwitcherProps = {
  className?: string;
};

function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { t } = useLocale();

  useEffect(() => {
    setMounted(true);
  }, []);

  const items = [
    { value: "light", label: t("colorScheme.light") },
    { value: "dark", label: t("colorScheme.dark") },
    { value: "system", label: t("colorScheme.system") },
  ];

  return (
    <Select.Root
      items={items}
      value={mounted ? theme : null}
      onValueChange={(nextValue) => {
        if (nextValue) {
          setTheme(nextValue);
        }
      }}
    >
      <Select.Trigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn("justify-between rounded-md", className)}
          >
            <Select.Value placeholder={t("profile.colorScheme")} />

            <Select.Icon>
              <ChevronDownIcon />
            </Select.Icon>
          </Button>
        }
      />

      <Select.Portal>
        <Select.Positioner className="z-small-overlay">
          <Select.Popup className="min-w-(--anchor-width) overflow-hidden rounded-md bg-card-thick p-1">
            <Select.List className="p-px">
              {items.map((item) => (
                <Select.Item
                  key={item.value}
                  value={item.value}
                  nativeButton
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full justify-between rounded-md"
                    >
                      <Select.ItemText>{item.label}</Select.ItemText>

                      <Select.ItemIndicator>
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Button>
                  }
                />
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}

export default ThemeSwitcher;
