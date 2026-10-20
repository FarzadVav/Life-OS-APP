"use client";

import { useEffect, useState } from "react";
import { Field } from "@base-ui/react";
import { LoaderIcon } from "lucide-react";

import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import { RichTextEditor } from "@/features/general/components/ui/RichTextEditor/RichTextEditor";
import { SelectDialog } from "@/features/general/components/ui/SelectDialog/SelectDialog";
import { useLifeAreas } from "@/features/life-areas/hooks/useLifeAreas";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

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
  onSave: (data: {
    title: string;
    content: string;
    lifeAreaId?: number | null;
  }) => Promise<void>;
}

const UNASSIGNED_ID = 0;

export function SkillDialog({
  open,
  onOpenChange,
  initialData,
  defaultLifeAreaId,
  onSave,
}: SkillDialogProps) {
  const { t } = useLocale();
  const { lifeAreas, isLoading: isLoadingLifeAreas } = useLifeAreas();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedLifeAreaId, setSelectedLifeAreaId] = useState<number>(UNASSIGNED_ID);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitle(initialData?.title || "");
      setContent(initialData?.content || "");
      const areaId = initialData?.lifeAreaId ?? defaultLifeAreaId;
      setSelectedLifeAreaId(areaId && areaId > 0 ? areaId : UNASSIGNED_ID);
      setError(null);
    }
  }, [open, initialData, defaultLifeAreaId]);

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
        content,
        lifeAreaId: selectedLifeAreaId > 0 ? selectedLifeAreaId : null,
      });
      onOpenChange(false);
    } catch (err: unknown) {
      console.error("Save skill error:", err);
      setError((err as Error)?.message || "Failed to save skill");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEdit = Boolean(initialData?.id);

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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Dialog.Title className="title">
            {isEdit ? t("skills.edit") : t("skills.new")}
          </Dialog.Title>
          <Dialog.Description className="sub-text text-xs mt-1">
            {t("skills.subtitle")}
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
            placeholder={t("skills.titlePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
        </Field.Root>

        <div>
          <label className="block font-bold text-xs mb-1.5">
            {t("skills.selectLifeArea")}
          </label>
          <SelectDialog<number>
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

export default SkillDialog;
