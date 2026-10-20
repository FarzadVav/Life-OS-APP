"use client";

import { useEffect, useState } from "react";
import { Field } from "@base-ui/react";
import { LoaderIcon } from "lucide-react";

import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import { SelectDialog } from "@/features/general/components/ui/SelectDialog/SelectDialog";
import RepeatIntervalInput from "@/features/general/components/ui/RepeatIntervalInput";
import { useLifeAreas } from "@/features/life-areas/hooks/useLifeAreas";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

export interface HabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: {
    id?: number;
    title: string;
    description: string;
    repeatInterval: string;
    lifeAreaId?: number | null;
  } | null;
  defaultLifeAreaId?: number | null;
  onSave: (data: {
    title: string;
    description: string;
    repeatInterval: string;
    lifeAreaId?: number | null;
  }) => Promise<void>;
}

const UNASSIGNED_ID = 0;

export function HabitDialog({
  open,
  onOpenChange,
  initialData,
  defaultLifeAreaId,
  onSave,
}: HabitDialogProps) {
  const { t } = useLocale();
  const { lifeAreas, isLoading: isLoadingLifeAreas } = useLifeAreas();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repeatInterval, setRepeatInterval] = useState("Every 1 Day");
  const [selectedLifeAreaId, setSelectedLifeAreaId] = useState<number>(UNASSIGNED_ID);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitle(initialData?.title || "");
      setDescription(initialData?.description || "");
      setRepeatInterval(initialData?.repeatInterval || "Every 1 Day");
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
        description: description.trim(),
        repeatInterval: repeatInterval.trim() || "Every 1 Day",
        lifeAreaId: selectedLifeAreaId > 0 ? selectedLifeAreaId : null,
      });
      onOpenChange(false);
    } catch (err: unknown) {
      console.error("Save habit error:", err);
      setError((err as Error)?.message || "Failed to save habit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEdit = Boolean(initialData?.id);

  const lifeAreaItems = [
    {
      value: UNASSIGNED_ID,
      label: t("habits.unassigned") || t("lifeAreas.none") || "General",
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
            {isEdit ? t("habits.edit") : t("habits.new")}
          </Dialog.Title>
          <Dialog.Description className="sub-text text-xs mt-1">
            {t("habits.subtitle")}
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
            placeholder={t("habits.titlePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />
        </Field.Root>

        <div>
          <label className="block font-bold text-xs mb-1.5">
            {t("habits.selectLifeArea")}
          </label>
          <SelectDialog<number>
            items={lifeAreaItems}
            value={selectedLifeAreaId}
            onChange={(val) => setSelectedLifeAreaId(val)}
            title={t("habits.selectLifeArea")}
            placeholder={t("habits.selectLifeArea")}
            disabled={isSubmitting || isLoadingLifeAreas}
          />
        </div>

        <div>
          <label className="block font-bold text-xs mb-1.5">
            {t("habits.repeatInterval")}
          </label>
          <div className="rounded-container border border-foreground/15 p-3 bg-card/40">
            <RepeatIntervalInput
              value={repeatInterval}
              onChange={setRepeatInterval}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label className="block font-bold text-xs mb-1.5">
            {t("common.description")}
          </label>
          <textarea
            rows={3}
            className="input w-full min-h-[72px] resize-none"
            placeholder={t("habits.descPlaceholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
          />
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

export default HabitDialog;
