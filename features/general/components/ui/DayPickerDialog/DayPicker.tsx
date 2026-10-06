"use client";

import { ComponentProps } from "react";
import { DayPicker as PersianDayPicker, enUS } from "@daypicker/persian";
import "@daypicker/react/style.css";
import "./datepicker.css";

export type DayPickerProps = Omit<
  ComponentProps<typeof PersianDayPicker>,
  "mode" | "selected" | "onSelect"
> & {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
};

export default function DayPicker({
  value,
  onChange,
  animate = true,
  dir = "ltr",
  locale = enUS,
  numerals = "latn",
  className,
  ...rest
}: DayPickerProps) {
  return (
    <PersianDayPicker
      animate={animate}
      dir={dir}
      mode="single"
      locale={locale}
      numerals={numerals}
      selected={value ?? undefined}
      onSelect={(date) => {
        onChange?.((date as Date) ?? null);
      }}
      className={className}
      {...rest}
    />
  );
}
