"use client";

import { useState, useEffect } from "react";
import { Dialog as BaseUIDialog } from "@base-ui/react";
import { CheckIcon, XIcon } from "lucide-react";
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
      setDraft(value);
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
          className="fixed inset-0 z-big-overlay flex h-dvh w-screen flex-col bg-background text-foreground outline-none transition-all duration-200 data-ending-style:opacity-0 data-ending-style:scale-95 data-starting-style:opacity-0 data-starting-style:scale-95"
        >
          {/* Header */}
          <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card/40 px-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                square
                onClick={handleCancelAndClose}
                aria-label={t("common.close") || "Close"}
                title={t("common.close") || "Close"}
                className="size-9"
              >
                <XIcon className="size-5" />
              </Button>

              <BaseUIDialog.Title className="text-base font-bold text-foreground">
                {title || t("editor.fullscreen") || t("common.content")}
              </BaseUIDialog.Title>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="primary"
                onClick={handleSaveAndClose}
                className="h-9 gap-1.5 px-4 text-sm font-semibold"
              >
                <CheckIcon className="size-4" />
                <span>{t("editor.done") || t("common.save") || "Done"}</span>
              </Button>
            </div>
          </header>

          {/* Full Screen TipTap Rich Text Editor */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <RichTextEditor
              value={draft}
              onChange={setDraft}
              placeholder={placeholder}
              autoFocus
            />
          </div>
        </BaseUIDialog.Popup>
      </BaseUIDialog.Portal>
    </BaseUIDialog.Root>
  );
}

export default RichTextDialog;
