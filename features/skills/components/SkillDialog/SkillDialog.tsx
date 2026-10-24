"use client";

import { useEffect, useActionState, useState } from "react";
import { Field, Form } from "@base-ui/react";
import { LoaderIcon } from "lucide-react";

import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import { RichTextEditor } from "@/features/general/components/ui/RichTextEditor/RichTextEditor";
import { SelectDialog } from "@/features/general/components/ui/SelectDialog/SelectDialog";
import { useLifeAreas } from "@/features/life-areas/hooks/useLifeAreas";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";
import { createSkillMutation, updateSkillMutation } from "../../mutations";

export interface SkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    id?: number;
    title: string;
    content: string;
    lifeAreaId?: number | null;
  } | null;
  defaultLifeAreaId?: number | null;
  onSaved?: () => void;
}

const UNASSIGNED_ID = 0;

export function SkillDialog({
  open,
  onOpenChange,
  initialData,
  defaultLifeAreaId,
  onSaved,
}: SkillDialogProps) {
  const { t } = useLocale();
  const isEdit = Boolean(initialData?.id);
  const { lifeAreas, isLoading: isLoadingLifeAreas } = useLifeAreas();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedLifeAreaId, setSelectedLifeAreaId] = useState<number>(UNASSIGNED_ID);

  const [state, formAction, isSubmitting] = useActionState(
    isEdit ? updateSkillMutation : createSkillMutation,
    null,
  );

  useEffect(() => {
    if (open) {
      setTitle(initialData?.title || "");
      setContent(initialData?.content || "");
      const areaId = initialData?.lifeAreaId ?? defaultLifeAreaId;
      setSelectedLifeAreaId(areaId && areaId > 0 ? areaId : UNASSIGNED_ID);
    }
  }, [open, initialData, defaultLifeAreaId]);

  useEffect(() => {
    if (!state?.success) return;

    onOpenChange(false);
    onSaved?.();
  }, [state?.success, onOpenChange, onSaved]);

  const lifeAreaItems = [
    {
      value: UNASSIGNED_ID,
      label: t("skills.unassigned") || t("lifeAreas.none") || "General",
    },
    ...lifeAreas.map((area) => ({
      value: area.id,
      label: area.title,
    })),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="w-full max-w-lg">
      <Form action={formAction} errors={state?.errors} className="flex flex-col gap-4">
        <Field.Root className="hidden" name="id">
          <Field.Control type="hidden" name="id" value={initialData?.id ?? ""} />
        </Field.Root>
        <Field.Root className="hidden" name="content">
          <Field.Control type="hidden" name="content" value={content} />
        </Field.Root>
        <Field.Root className="hidden" name="lifeAreaId">
          <Field.Control
            type="hidden"
            name="lifeAreaId"
            value={selectedLifeAreaId > 0 ? String(selectedLifeAreaId) : "none"}
          />
        </Field.Root>

        <div>
          <Dialog.Title className="title">
            {isEdit ? t("skills.edit") : t("skills.new")}
          </Dialog.Title>
          <Dialog.Description className="sub-text text-xs mt-1">
            {t("skills.subtitle")}
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
            placeholder={t("skills.titlePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
          <Field.Error className="sub-text mt-0.5 text-foreground text-xs" />
        </Field.Root>

        <div>
          <label className="block font-bold text-xs mb-1.5">
            {t("skills.selectLifeArea")}
          </label>
          <SelectDialog<number>
            name="lifeAreaSelect"
            items={lifeAreaItems}
            value={selectedLifeAreaId}
            onChange={(val) => setSelectedLifeAreaId(val)}
            title={t("skills.selectLifeArea")}
            placeholder={t("skills.selectLifeArea")}
            disabled={isSubmitting || isLoadingLifeAreas}
          />
        </div>

        <div>
          <label className="block font-bold text-xs mb-1.5">
            {t("skills.contentLabel")}
          </label>
          <div className="rounded-container border border-foreground/15 p-3 min-h-[180px] max-h-[340px] flex flex-col bg-background overflow-hidden">
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder={t("skills.contentPlaceholder")}
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

export default SkillDialog;
