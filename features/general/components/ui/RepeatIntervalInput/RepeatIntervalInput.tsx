"use client";

import { useEffect, useState } from "react";
import { Select } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "cn";
import { NumberField } from "../NumberField";
import { Button } from "../Button/Button";

export type RepeatIntervalUnit = "Day" | "Week" | "Month";

export function parseRepeatInterval(val?: string | null): {
  count: number;
  unit: RepeatIntervalUnit;
} {
  if (!val || !val.trim()) {
    return { count: 1, unit: "Day" };
  }

  const clean = val.trim();
  const lower = clean.toLowerCase();

  if (lower === "daily") return { count: 1, unit: "Day" };
  if (lower === "weekly") return { count: 1, unit: "Week" };
  if (lower === "monthly") return { count: 1, unit: "Month" };

  const match = clean.match(/every\s+(\d+)\s+(day|days|week|weeks|month|months)/i);
  if (match) {
    const parsedCount = parseInt(match[1], 10);
    const count = Number.isFinite(parsedCount) && parsedCount >= 1 ? parsedCount : 1;
    const rawUnit = match[2].toLowerCase();

    let unit: RepeatIntervalUnit = "Day";
    if (rawUnit.startsWith("week")) unit = "Week";
    else if (rawUnit.startsWith("month")) unit = "Month";

    return { count, unit };
  }

  const numMatch = clean.match(/\d+/);
  if (numMatch) {
    const parsedCount = parseInt(numMatch[0], 10);
    const count = Number.isFinite(parsedCount) && parsedCount >= 1 ? parsedCount : 1;

    if (lower.includes("week")) return { count, unit: "Week" };
    if (lower.includes("month")) return { count, unit: "Month" };
    return { count, unit: "Day" };
  }

  return { count: 1, unit: "Day" };
}

export function formatRepeatInterval(
  count: number,
  unit: RepeatIntervalUnit,
): string {
  const safeCount = Number.isFinite(count) && count >= 1 ? Math.round(count) : 1;
  const unitLabel = safeCount > 1 ? `${unit}s` : unit;
  return `Every ${safeCount} ${unitLabel}`;
}

export type RepeatIntervalInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  name?: string;
};

const UNITS: { value: RepeatIntervalUnit; label: string; pluralLabel: string }[] = [
  { value: "Day", label: "Day", pluralLabel: "Days" },
  { value: "Week", label: "Week", pluralLabel: "Weeks" },
  { value: "Month", label: "Month", pluralLabel: "Months" },
];

export default function RepeatIntervalInput({
  value,
  onChange,
  disabled = false,
  className,
  name,
}: RepeatIntervalInputProps) {
  const parsed = parseRepeatInterval(value);
  const [count, setCount] = useState<number>(parsed.count);
  const [unit, setUnit] = useState<RepeatIntervalUnit>(parsed.unit);

  useEffect(() => {
    const nextParsed = parseRepeatInterval(value);
    setCount(nextParsed.count);
    setUnit(nextParsed.unit);
  }, [value]);

  function handleCountChange(nextCount: number | null) {
    const validCount =
      nextCount !== null && Number.isFinite(nextCount) && nextCount >= 1
        ? Math.round(nextCount)
        : 1;

    setCount(validCount);
    onChange?.(formatRepeatInterval(validCount, unit));
  }

  function handleUnitChange(nextUnit: RepeatIntervalUnit) {
    setUnit(nextUnit);
    onChange?.(formatRepeatInterval(count, nextUnit));
  }

  const unitItems = UNITS.map((u) => ({
    value: u.value,
    label: count > 1 ? u.pluralLabel : u.label,
  }));

  const activeUnitLabel = count > 1 ? `${unit}s` : unit;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2.5 sm:gap-3",
        className,
      )}
    >
      <span className="text-sm font-semibold text-foreground/80 select-none shrink-0">
        Every
      </span>

      <NumberField
        min={1}
        max={365}
        value={count}
        onValueChange={(val) => handleCountChange(val)}
        size="md"
        disabled={disabled}
        className="shrink-0"
      />

      <Select.Root
        items={unitItems}
        value={unit}
        onValueChange={(nextVal) => {
          if (nextVal) {
            handleUnitChange(nextVal as RepeatIntervalUnit);
          }
        }}
        disabled={disabled}
      >
        <Select.Trigger
          render={
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              className="h-10 min-w-[120px] flex-1 sm:flex-initial justify-between rounded-component px-3 font-medium"
            >
              <span>{activeUnitLabel}</span>
              <Select.Icon>
                <ChevronDownIcon className="size-4 opacity-60" />
              </Select.Icon>
            </Button>
          }
        />

        <Select.Portal>
          <Select.Positioner className="z-small-overlay">
            <Select.Popup className="min-w-(--anchor-width) overflow-hidden rounded-component bg-card-thick p-1 shadow-lg border border-foreground/10">
              <Select.List className="p-px">
                {unitItems.map((item) => (
                  <Select.Item
                    key={item.value}
                    value={item.value}
                    nativeButton
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-between rounded-component text-sm"
                      >
                        <Select.ItemText>{item.label}</Select.ItemText>
                        <Select.ItemIndicator>
                          <CheckIcon className="size-4" />
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

      {name && (
        <input
          type="hidden"
          name={name}
          value={formatRepeatInterval(count, unit)}
        />
      )}
    </div>
  );
}
