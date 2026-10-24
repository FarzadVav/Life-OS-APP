"use client";

import { useEffect, useActionState, useState } from "react";
import { Field, Form } from "@base-ui/react";
import { LoaderIcon } from "lucide-react";

import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import { RichTextEditor } from "@/features/general/components/ui/RichTextEditor/RichTextEditor";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";
import {
  createLifeAreaMutation,
  updateLifeAreaMutation,
} from "../../mutations";

export interface LifeAreaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: { id?: number; title: string; vision: string } | null;
  onSaved?: () => void;
}

export function LifeAreaDialog({
  open,
  onOpenChange,
  initialData,
  onSaved,
}: LifeAreaDialogProps) {
  const { t } = useLocale();
  const isEdit = Boolean(initialData?.id);

  const [title, setTitle] = useState("");
  const [vision, setVision] = useState("");

  const [state, formAction, isSubmitting] = useActionState(
    isEdit ? updateLifeAreaMutation : createLifeAreaMutation,
    null,
  );

  useEffect(() => {
    if (open) {
      setTitle(initialData?.title || "");
      setVision(initialData?.vision || "");
    }
  }, [open, initialData]);

  useEffect(() => {
    if (!state?.success) return;

    onOpenChange(false);
    onSaved?.();
  }, [state?.success, onOpenChange, onSaved]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="w-full max-w-lg">
      <Form action={formAction} errors={state?.errors} className="flex flex-col gap-4">
        <Field.Root className="hidden" name="id">
          <Field.Control type="hidden" name="id" value={initialData?.id ?? ""} />
        </Field.Root>
        <Field.Root className="hidden" name="vision">
          <Field.Control type="hidden" name="vision" value={vision} />
        </Field.Root>

        <div>
          <Dialog.Title className="title">
            {isEdit ? t("lifeAreas.edit") : t("lifeAreas.new")}
          </Dialog.Title>
          <Dialog.Description className="sub-text text-xs mt-1">
            {t("lifeAreas.subtitle")}
          </Dialog.Description>
        </div>

        {state?.errors?.general && (
          <div
            role="alert"
            className="p-3 text-xs rounded-component bg-foreground/5 border border-foreground/15 text-foreground leading-relaxed">
            {state.errors.general.join(", ")}
          </div>
        )}

        <Field.Root name="title">
          <Field.Label className="block font-bold text-xs mb-1.5">
            {t("common.title")}
          </Field.Label>
          <Field.Control
            required
            name="title"
            className="input w-full"
            placeholder={t("lifeAreas.titlePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
          <Field.Error className="sub-text mt-0.5 text-foreground text-xs" />
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
          <Dialog.Close
            render={
              <Button type="button" variant="ghost" disabled={isSubmitting}>
                {t("common.cancel")}
              </Button>
            }
          />
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
      </Form>
    </Dialog>
  );
}
export default LifeAreaDialog;
