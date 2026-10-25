"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useActionState } from "react";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

import { Form } from "@base-ui/react";
import Field from "@/features/general/components/ui/Field";
import { CreateHabitSchema, UpdateHabitSchema } from "@/features/habits/types";
import { LoaderIcon, Trash2Icon } from "lucide-react";
import SelectDialog from "@/features/general/components/ui/SelectDialog";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import RepeatIntervalInput from "@/features/general/components/ui/RepeatIntervalInput";

import { useHabit } from "@/features/habits/hooks/useHabit";
import {
  createHabitMutation,
  deleteHabitMutation,
  updateHabitMutation,
} from "@/features/habits/mutations";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import { useLifeAreas } from "@/features/life-areas/hooks";

function LifeAreaSelect({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  const { t } = useLocale();
  const { lifeAreas = [] } = useLifeAreas();

  const items = [
    { value: "none", label: t("habits.unassigned") || t("lifeAreas.none") || "General" },
    ...lifeAreas.map((la) => ({
      value: String(la.id),
      label: la.title,
    })),
  ];

  return (
    <Field.Root name="lifeAreaId">
      <Field.Label className="mb-1 font-bold">
        {t("habits.selectLifeArea") || t("lifeAreas.title") || "Life Area"}
      </Field.Label>

      <SelectDialog
        name="lifeAreaSelect"
        items={items}
        value={value ? String(value) : "none"}
        onChange={(next) => onChange(next === "none" || !next ? null : Number(next))}
        title={t("habits.selectLifeArea") || "Select Life Area"}
        placeholder={t("habits.selectLifeArea") || "Select Life Area"}
      />

      <Field.Error className="sub-text mt-0.5 text-foreground text-xs" />
    </Field.Root>
  );
}

function NewHabitPage() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const lifeAreaParam = searchParams.get("lifeAreaId");
  const isEditMode = Boolean(editId);

  const { habit, isLoading: isHabitLoading } = useHabit(editId ? Number(editId) : null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [repeatInterval, setRepeatInterval] = useState("Every 1 Day");
  const [lifeAreaId, setLifeAreaId] = useState<number | null>(
    lifeAreaParam && lifeAreaParam !== "none" ? Number(lifeAreaParam) : null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [state, formAction, pending] = useActionState(
    isEditMode ? updateHabitMutation : createHabitMutation,
    null,
  );

  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteHabitMutation,
    undefined,
  );

  useEffect(() => {
    if (state?.success) {
      router.push("/habits");
      router.refresh();
    }
  }, [state?.success, router]);

  useEffect(() => {
    if (!deleteState?.success) return;

    router.push("/habits");
    router.refresh();
  }, [deleteState, router]);

  useEffect(() => {
    if (!editId) {
      queueMicrotask(() => {
        setTitle("");
        setDescription("");
        setRepeatInterval("Every 1 Day");
        setLifeAreaId(lifeAreaParam && lifeAreaParam !== "none" ? Number(lifeAreaParam) : null);
      });
      return;
    }

    if (habit) {
      queueMicrotask(() => {
        setTitle(habit.title);
        setDescription(habit.description || "");
        setRepeatInterval(habit.repeatInterval || "Every 1 Day");
        setLifeAreaId(habit.lifeAreaId ?? null);
      });
    }
  }, [editId, habit, lifeAreaParam]);

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>
          {isEditMode ? t("habits.edit") || "Edit Habit" : t("habits.new") || "New Habit"}
        </TopBar.Title>
        <TopBar.Btn backIcon href="/habits" position="left" />

        {isEditMode ? (
          <TopBar.Btn
            position="right"
            onClick={() => setDeleteDialogOpen(true)}
            aria-label={t("common.delete")}
            className="text-foreground/70 hover:text-foreground"
          >
            <Trash2Icon className="size-5" />
          </TopBar.Btn>
        ) : (
          <TopBar.HelpBtn position="right" />
        )}
      </TopBar>

      {isEditMode && isHabitLoading && !habit ? (
        <div className="flex w-full items-center justify-center p-12 text-foreground/40 gap-2">
          <LoaderIcon className="size-5 animate-spin" />
          <span className="text-xs sub-text">{t("common.loading")}</span>
        </div>
      ) : (
        <Form
          id="habit-form"
          className="w-full space-y-6"
          aria-label={isEditMode ? t("habits.edit") : t("habits.new")}
          action={formAction}
          errors={state?.errors}
        >
          {isEditMode && <Field type="hidden" name="id" value={editId ?? ""} />}
          <Field
            type="hidden"
            name="lifeAreaId"
            value={lifeAreaId ? String(lifeAreaId) : "none"}
          />

          <Field
            name="title"
            label={t("common.title")}
            required
            minLength={1}
            value={title}
            disabled={pending}
            placeholder={t("habits.titlePlaceholder")}
            onChange={(event) => setTitle(event.target.value)}
            schema={isEditMode ? UpdateHabitSchema : CreateHabitSchema}
          />

          <LifeAreaSelect value={lifeAreaId} onChange={setLifeAreaId} />

          <Field.Root name="repeatInterval" schema={isEditMode ? UpdateHabitSchema : CreateHabitSchema}>
            <Field.Label>{t("habits.repeatInterval")}</Field.Label>
            <div className="rounded-container border border-foreground/15 p-3 bg-card/40">
              <RepeatIntervalInput name="repeatInterval" value={repeatInterval} onChange={setRepeatInterval} disabled={pending} />
            </div>
            <Field.Error />
          </Field.Root>

          <Field
            multiline
            rows={3}
            name="description"
            label={t("common.description")}
            placeholder={t("habits.descPlaceholder")}
            value={description}
            disabled={pending}
            onChange={(event) => setDescription(event.target.value)}
            schema={isEditMode ? UpdateHabitSchema : CreateHabitSchema}
          />

          <Field.FormError
            errors={state?.errors}
            knownFields={["title", "description", "repeatInterval", "lifeAreaId"]}
          />

          <PageActionBtn submit disabled={pending} form="habit-form" />
        </Form>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <div className="p-1 space-y-4">
          <div>
            <Dialog.Title className="font-bold">{t("common.delete")}</Dialog.Title>
            <Dialog.Description className="sub-text text-xs mt-1">
              {t("habits.deleteConfirm") || "Are you sure you want to delete this habit?"}
            </Dialog.Description>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Dialog.Close
              render={
                <Button type="button" variant="ghost" disabled={isDeleting}>
                  {t("common.cancel")}
                </Button>
              }
            />
            <form
              action={deleteAction}
              onSubmit={() => setDeleteDialogOpen(false)}>
              <Field type="hidden" name="id" value={editId ?? ""} />
              <Button
                type="submit"
                variant="primary"
                disabled={isDeleting || !isEditMode}
                className="bg-red-600 text-white hover:bg-red-700">
                {isDeleting ? t("common.loading") : t("common.delete")}
              </Button>
            </form>
          </div>
        </div>
      </Dialog>
    </PageWrapper>
  );
}

export default NewHabitPage;
