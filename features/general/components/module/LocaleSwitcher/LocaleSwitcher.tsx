"use client";

import { Select } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { changeLocale } from "@/features/general/actions/locale";
import { useLocale } from "../LocaleProvider/LocaleProvider";
import { Button } from "../../ui/Button/Button";
import { cn } from "cn";

type LocaleSwitcherProps = {
  className?: string;
};

function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const { locale, t } = useLocale();

  const items = [
    { value: "en", label: t("language.english") },
    { value: "fa", label: t("language.persian") },
  ];

  return (
    <Select.Root
      items={items}
      value={locale}
      onValueChange={(nextValue) => {
        if (nextValue) {
          changeLocale(nextValue);
        }
      }}
    >
      <Select.Trigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn("justify-between rounded-component", className)}
          >
            <Select.Value placeholder={t("profile.language")} />

            <Select.Icon>
              <ChevronDownIcon />
            </Select.Icon>
          </Button>
        }
      />

      <Select.Portal>
        <Select.Positioner className="z-small-overlay">
          <Select.Popup className="min-w-(--anchor-width) overflow-hidden rounded-component bg-card-thick p-1">
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
                      className="w-full justify-between rounded-component"
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

export default LocaleSwitcher;
