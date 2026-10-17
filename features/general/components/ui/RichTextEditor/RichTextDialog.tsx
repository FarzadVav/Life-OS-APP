"use client";

import { useState, useEffect } from "react";
import { Dialog as BaseUIDialog } from "@base-ui/react";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";
import { RichTextEditor } from "./RichTextEditor";
import { isRichTextEmpty } from "@/features/general/lib/richText";

export type RichTextDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (value: string) => void;
  title?: string;
  placeholder?: string;
};

export function RichTextDialog({
  open,
  onOpenChange,
  value,
  onChange,
  title,
  placeholder,
}: RichTextDialogProps) {
  const { t } = useLocale();
  const [draft, setDraft] = useState(value);

  // Sync draft when opened or when value changes from parent
  useEffect(() => {
    if (open) {
      queueMicrotask(() => setDraft(value));
    }
  }, [open, value]);

  const handleSaveAndClose = () => {
    const finalValue = isRichTextEmpty(draft) ? "" : draft;
    onChange(finalValue);
    onOpenChange(false);
  };

  const handleCancelAndClose = () => {
    // Save current changes on close as well so user doesn't lose their input
    const finalValue = isRichTextEmpty(draft) ? "" : draft;
    onChange(finalValue);
    onOpenChange(false);
  };

  return (
    <BaseUIDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseUIDialog.Portal>
        <BaseUIDialog.Backdrop
          className="fixed inset-0 z-big-overlay bg-background/80 backdrop-blur-xs transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0"
        />

        <BaseUIDialog.Popup
          className="fixed inset-0 z-big-overlay h-dvh w-screen bg-background text-foreground outline-none transition-all duration-200 data-ending-style:opacity-0 data-ending-style:scale-95 data-starting-style:opacity-0 data-starting-style:scale-95"
        >
          <div className="mx-auto max-w-3xl flex flex-col h-full">
            {/* Header */}
            <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card/40 px-4 sm:px-6 backdrop-blur-md">
              <BaseUIDialog.Title className="text-base font-bold text-foreground">
                {title || t("editor.fullscreen") || t("common.content")}
              </BaseUIDialog.Title>
            </header>

            {/* Full Screen TipTap Rich Text Editor */}
            <RichTextEditor
              autoFocus
              value={draft}
              onChange={setDraft}
              placeholder={placeholder}
            />

            {/* Footer with Close and Done actions */}
            <footer className="flex h-14 shrink-0 items-center justify-end gap-3 border-t bg-card/40 px-4 sm:px-6 backdrop-blur-md [&>button]:w-1/2">
              <Button
                type="button"
                variant="card"
                onClick={handleCancelAndClose}
                className="h-9 px-4 text-sm font-medium"
              >
                <span>{t("editor.close") || "Close"}</span>
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={handleSaveAndClose}
                className="h-9 px-5 text-sm font-semibold"
              >
                <span>{t("editor.done") || "Done"}</span>
              </Button>
            </footer>
          </div>
        </BaseUIDialog.Popup>
      </BaseUIDialog.Portal>
    </BaseUIDialog.Root>
  );
}

export default RichTextDialog;
