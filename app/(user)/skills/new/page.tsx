"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useActionState } from "react";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

import { Field, Form } from "@base-ui/react";
import { LoaderIcon, Trash2Icon } from "lucide-react";
import SelectDialog from "@/features/general/components/ui/SelectDialog";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";

import { useSkill } from "@/features/skills/hooks/useSkill";
import {
  createSkillMutation,
  updateSkillMutation,
  deleteSkillMutation,
} from "@/features/skills/mutations";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import { RichTextarea } from "@/features/general/components/ui/RichTextEditor";
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
    { value: "none", label: t("skills.unassigned") || t("lifeAreas.none") || "General" },
    ...lifeAreas.map((la) => ({
      value: String(la.id),
      label: la.title,
    })),
  ];

  return (
    <Field.Root name="lifeAreaId">
      <Field.Label className="mb-1 font-bold">
        {t("skills.selectLifeArea") || t("lifeAreas.title") || "Life Area"}
      </Field.Label>

      <SelectDialog
        name="lifeAreaSelect"
        items={items}
        value={value ? String(value) : "none"}
        onChange={(next) => onChange(next === "none" || !next ? null : Number(next))}
        title={t("skills.selectLifeArea") || "Select Life Area"}
        placeholder={t("skills.selectLifeArea") || "Select Life Area"}
      />

      <Field.Error className="sub-text mt-0.5 text-foreground text-xs" />
    </Field.Root>
  );
}

function NewSkillPage() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const lifeAreaParam = searchParams.get("lifeAreaId");
  const isEditMode = Boolean(editId);

  const { skill, isLoading: isSkillLoading } = useSkill(editId ? Number(editId) : null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [lifeAreaId, setLifeAreaId] = useState<number | null>(
    lifeAreaParam && lifeAreaParam !== "none" ? Number(lifeAreaParam) : null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [state, formAction, pending] = useActionState(
    isEditMode ? updateSkillMutation : createSkillMutation,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      router.push("/skills");
      router.refresh();
    }
  }, [state?.success, router]);

  useEffect(() => {
    if (!editId) {
      queueMicrotask(() => {
        setTitle("");
        setContent("");
        setLifeAreaId(lifeAreaParam && lifeAreaParam !== "none" ? Number(lifeAreaParam) : null);
      });
      return;
    }

    if (skill) {
      queueMicrotask(() => {
        setTitle(skill.title);
        setContent(skill.content || "");
        setLifeAreaId(skill.lifeAreaId ?? null);
      });
    }
  }, [editId, skill, lifeAreaParam]);

  const handleDelete = async () => {
    if (!editId) return;
    setIsDeleting(true);
    try {
      const res = await deleteSkillMutation(Number(editId));
      if (res.success) {
        setDeleteDialogOpen(false);
        router.push("/skills");
        router.refresh();
      }
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>
          {isEditMode ? t("skills.edit") || "Edit Skill" : t("skills.new") || "New Skill"}
        </TopBar.Title>
        <TopBar.Btn backIcon href="/skills" position="left" />

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

      {isEditMode && isSkillLoading && !skill ? (
        <div className="flex w-full items-center justify-center p-12 text-foreground/40 gap-2">
          <LoaderIcon className="size-5 animate-spin" />
          <span className="text-xs sub-text">{t("common.loading")}</span>
        </div>
      ) : (
        <Form
          id="skill-form"
          className="w-full space-y-6"
          aria-label={isEditMode ? t("skills.edit") : t("skills.new")}
          action={formAction}
          errors={state?.errors}
        >
          {state?.errors?.general && (
            <div
              role="alert"
              className="p-3 text-xs rounded-component bg-foreground/5 border border-foreground/15 text-foreground leading-relaxed"
            >
              {state.errors.general.join(", ")}
            </div>
          )}

          {isEditMode && <input type="hidden" name="id" value={editId ?? ""} />}
          <input type="hidden" name="lifeAreaId" value={lifeAreaId ? String(lifeAreaId) : "none"} />
          <input type="hidden" name="content" value={content} />

          <Field.Root name="title">
            <Field.Label className="block font-bold">{t("common.title")}</Field.Label>

            <Field.Control
              required
              minLength={1}
              name="title"
              value={title}
              disabled={pending}
              className="input"
              placeholder={t("skills.titlePlaceholder")}
              onChange={(event) => setTitle(event.target.value)}
            />

            <Field.Error className="sub-text mt-0.5 text-foreground text-xs" />
          </Field.Root>

          <LifeAreaSelect value={lifeAreaId} onChange={setLifeAreaId} />

          <Field.Root name="content">
            <Field.Label className="block font-bold">{t("skills.contentLabel") || t("common.content")}</Field.Label>

            <RichTextarea
              value={content}
              onChange={setContent}
              placeholder={t("skills.contentPlaceholder")}
              title={t("skills.contentLabel") || t("common.content")}
              required
              minLength={1}
            />

            <Field.Error className="sub-text mt-0.5 text-foreground text-xs" />
          </Field.Root>

          <PageActionBtn submit disabled={pending} form="skill-form" />
        </Form>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <div className="p-1 space-y-4">
          <div>
            <Dialog.Title className="font-bold">{t("common.delete")}</Dialog.Title>
            <Dialog.Description className="sub-text text-xs mt-1">
              {t("skills.deleteConfirm") || "Are you sure you want to delete this skill?"}
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
            <Button
              type="button"
              variant="primary"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isDeleting ? t("common.loading") : t("common.delete")}
            </Button>
          </div>
        </div>
      </Dialog>
    </PageWrapper>
  );
}

export default NewSkillPage;
