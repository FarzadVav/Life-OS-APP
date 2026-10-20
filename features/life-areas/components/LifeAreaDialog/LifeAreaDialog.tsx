"use client";

import { useEffect, useState } from "react";
import { Field } from "@base-ui/react";
import { LoaderIcon } from "lucide-react";

import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import { RichTextEditor } from "@/features/general/components/ui/RichTextEditor/RichTextEditor";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

export interface LifeAreaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: { id?: number; title: string; vision: string } | null;
  onSave: (data: { title: string; vision: string }) => Promise<void>;
}

export function LifeAreaDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: LifeAreaDialogProps) {
  const { t } = useLocale();
  const [title, setTitle] = useState("");
  const [vision, setVision] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitle(initialData?.title || "");
      setVision(initialData?.vision || "");
      setError(null);
    }
  }, [open, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(t("common.titleRequired") || "Title is required");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        title: title.trim(),
        vision,
      });
      onOpenChange(false);
    } catch (err: unknown) {
      console.error("Save life area error:", err);
      setError((err as Error)?.message || "Failed to save life area");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEdit = Boolean(initialData?.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="w-full max-w-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Dialog.Title className="title">
            {isEdit ? t("lifeAreas.edit") : t("lifeAreas.new")}
          </Dialog.Title>
          <Dialog.Description className="sub-text text-xs mt-1">
            {t("lifeAreas.subtitle")}
          </Dialog.Description>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3 text-xs rounded-component bg-foreground/5 border border-foreground/15 text-foreground leading-relaxed"
          >
            {error}
          </div>
        )}

        <Field.Root name="title">
          <Field.Label className="block font-bold text-xs mb-1.5">
            {t("common.title")}
          </Field.Label>
          <Field.Control
            required
            className="input w-full"
            placeholder={t("lifeAreas.titlePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
        </Field.Root>

        <div>
          <label className="block font-bold text-xs mb-1.5">
            {t("lifeAreas.visionLabel")}
          </label>
          <div className="rounded-container border border-foreground/15 p-3 min-h-[180px] max-h-[340px] flex flex-col bg-background overflow-hidden">
            <RichTextEditor
              value={vision}
              onChange={setVision}
              placeholder={t("lifeAreas.visionPlaceholder")}
              autoFocus={false}
              showToolbar={true}
              className="flex-1"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-foreground/10">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {t("common.cancel")}
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-1.5">
                <LoaderIcon className="size-4 animate-spin" />
                <span>{t("common.loading")}</span>
              </span>
            ) : (
              <span>{t("common.save")}</span>
            )}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
export default LifeAreaDialog;
