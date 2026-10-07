"use client";

import { ReactElement, useState } from "react";
import { ClockIcon } from "lucide-react";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import TimePicker, { TimePickerProps } from "./TimePicker";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

export type TimePickerDialogProps = {
  value: string | null;
  onChange: (time: string) => void;
  trigger?: ReactElement;
  nativeButton?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  label?: string;
  title?: string;
  description?: string;
  showIcon?: boolean;
  className?: string;
};

function LocalTimePickerDialog({
  value,
  onChange,
  trigger,
  nativeButton,
  open,
  onOpenChange,
  label,
  title,
  description,
  showIcon = true,
  className = "w-full justify-start rounded-component",
}: TimePickerDialogProps) {
  const { t } = useLocale();
  const resolvedLabel = label ?? t("timePicker.label");
  const resolvedTitle = title ?? t("timePicker.title");
  const resolvedDescription = description ?? t("timePicker.description");
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const [draftTime, setDraftTime] = useState(value || "12:00");

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && value) {
      setDraftTime(value);
    }
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const handleConfirm = () => {
    onChange(draftTime);
    handleOpenChange(false);
  };

  const displayTime = value ? value : t("timePicker.notSet");

  const computedTrigger = trigger || (
    <Button
      type="button"
      variant="outline"
      className={`${className} ${showIcon ? "gap-2" : ""}`}
    >
      {showIcon && <ClockIcon className="size-4 opacity-70" />}
      <span>
        {resolvedLabel}: {displayTime}
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
      <div className="w-80 max-w-full space-y-4">
        <div>
          <Dialog.Title className="font-bold">{resolvedTitle}</Dialog.Title>
          {resolvedDescription ? (
            <Dialog.Description className="sub-text mt-1 text-sm">
              {resolvedDescription}
            </Dialog.Description>
          ) : null}
        </div>

        <TimePicker value={draftTime} onChange={setDraftTime} />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Dialog.Close
            render={
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
            }
          />

          <Button type="button" variant="primary" onClick={handleConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

const TimePickerDialog = Object.assign(LocalTimePickerDialog, {
  Title: Dialog.Title,
  Description: Dialog.Description,
  Close: Dialog.Close,
  Trigger: Dialog.Trigger,
  Root: Dialog.Root,
  Portal: Dialog.Portal,
  Backdrop: Dialog.Backdrop,
  Popup: Dialog.Popup,
  Picker: TimePicker,
});

export default TimePickerDialog;
export type { TimePickerProps };
