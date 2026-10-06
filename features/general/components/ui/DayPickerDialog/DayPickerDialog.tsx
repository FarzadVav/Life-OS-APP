"use client";

import { ReactElement, useState } from "react";
import { CalendarDaysIcon } from "lucide-react";
import { enUS } from "@daypicker/persian";

import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import DayPicker, { DayPickerProps } from "./DayPicker";
import { formatPersianDate as formatPersianDateUtil } from "@/features/general/lib/utils";

export function formatPersianDate(date: Date | null): string {
  return formatPersianDateUtil(date, "Not set");
}

export type DayPickerDialogProps = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  trigger?: ReactElement;
  nativeButton?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: string;
  title?: string;
  description?: string;
  showIcon?: boolean;
  className?: string;
  dir?: "ltr" | "rtl";
  locale?: typeof enUS;
  formatDate?: (date: Date | null) => string;
};

function LocalDayPickerDialog({
  value,
  onChange,
  trigger,
  nativeButton,
  open,
  onOpenChange,
  label = "Deadline",
  title,
  description,
  showIcon = false,
  className = "w-full justify-start rounded-md",
  dir = "ltr",
  locale = enUS,
  formatDate = formatPersianDate,
}: DayPickerDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const handleSelectDate = (selectedDate: Date | null) => {
    onChange(selectedDate);
    handleOpenChange(false);
  };

  const computedTrigger = trigger || (
    <Button
      type="button"
      variant="outline"
      className={`${className} ${showIcon ? "gap-2" : ""}`}
    >
      {showIcon && <CalendarDaysIcon className="size-4 opacity-70" />}
      <span>
        {label}: {formatDate(value)}
      </span>
    </Button>
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleOpenChange}
      trigger={computedTrigger}
      nativeButton={nativeButton}
    >
      <div className="flex flex-col items-center">
        {title ? (
          <div className="mb-2 text-center">
            <Dialog.Title className="font-bold">{title}</Dialog.Title>
            {description ? (
              <Dialog.Description className="sub-text text-sm">
                {description}
              </Dialog.Description>
            ) : null}
          </div>
        ) : (
          <Dialog.Title className="sr-only">Select Date</Dialog.Title>
        )}

        <DayPicker
          dir={dir}
          locale={locale}
          value={value}
          onChange={handleSelectDate}
        />

        <div className="mt-4 flex w-full justify-center">
          <Dialog.Close
            render={
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleOpenChange(false)}
              >
                Close
              </Button>
            }
          />
        </div>
      </div>
    </Dialog>
  );
}

const DayPickerDialog = Object.assign(LocalDayPickerDialog, {
  Title: Dialog.Title,
  Description: Dialog.Description,
  Close: Dialog.Close,
  Trigger: Dialog.Trigger,
  Root: Dialog.Root,
  Portal: Dialog.Portal,
  Backdrop: Dialog.Backdrop,
  Popup: Dialog.Popup,
  Picker: DayPicker,
});

export default DayPickerDialog;
export type { DayPickerProps };
