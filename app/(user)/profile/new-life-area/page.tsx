"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

import { Field } from "@base-ui/react";
import { LoaderIcon, Trash2Icon } from "lucide-react";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";

import { useLifeAreas } from "@/features/life-areas/hooks";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import { RichTextarea } from "@/features/general/components/ui/RichTextEditor";

function ProfileNewLifeAreaPage() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const isEditMode = Boolean(editId);

  const {
    lifeAreas,
    isLoading,
    createLifeArea,
    updateLifeArea,
    deleteLifeArea,
  } = useLifeAreas();

  const area = lifeAreas.find((a) => a.id === Number(editId));
  const isLoadingDetail = isEditMode && isLoading && !area;

  const [title, setTitle] = useState("");
  const [vision, setVision] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (!editId) {
      queueMicrotask(() => {
        setTitle("");
        setVision("");
      });
      return;
    }

    if (area) {
      queueMicrotask(() => {
        setTitle(area.title);
        setVision(area.vision);
      });
    }
  }, [editId, area]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      if (isEditMode && editId) {
        await updateLifeArea(Number(editId), { title: title.trim(), vision });
      } else {
        await createLifeArea({ title: title.trim(), vision });
      }
      router.push("/profile");
      router.refresh();
    } catch (err) {
      console.error("Save life area error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!editId) return;
    setIsDeleting(true);
    try {
      await deleteLifeArea(Number(editId));
      setDeleteDialogOpen(false);
      router.push("/profile");
      router.refresh();
    } catch (err) {
      console.error("Delete life area error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>
          {isEditMode ? t("lifeAreas.edit") : t("lifeAreas.new")}
        </TopBar.Title>
        <TopBar.Btn backIcon href="/profile" position="left" />

        {isEditMode ? (
          <TopBar.Btn
            position="right"
            onClick={() => setDeleteDialogOpen(true)}
            aria-label={t("common.delete")}
            className="text-foreground/70 hover:text-foreground">
            <Trash2Icon className="size-5" />
          </TopBar.Btn>
        ) : (
          <TopBar.HelpBtn position="right" />
        )}
      </TopBar>

      {isLoadingDetail ? (
        <div className="flex w-full items-center justify-center p-12 text-foreground/40 gap-2">
          <LoaderIcon className="size-5 animate-spin" />
          <span className="text-xs sub-text">{t("common.loading")}</span>
        </div>
      ) : (
        <form
          id="life-area-form"
          onSubmit={handleSubmit}
          className="w-full space-y-6">
          <p className="sub-text text-xs">{t("lifeAreas.subtitle")}</p>

          <Field.Root name="title">
            <Field.Label className="block font-bold">
              {t("common.title")}
            </Field.Label>

            <input
              required
              className="input w-full"
              placeholder={t("lifeAreas.titlePlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />

            <Field.Error className="sub-text mt-0.5 text-foreground text-xs" />
          </Field.Root>

          <Field.Root name="vision">
            <Field.Label className="block font-bold">
              {t("lifeAreas.visionLabel")}
            </Field.Label>

            <RichTextarea
              name="vision"
              value={vision}
              onChange={setVision}
              placeholder={t("lifeAreas.visionPlaceholder")}
              title={t("lifeAreas.visionLabel")}
              required
              minLength={1}
            />

            <Field.Error className="sub-text mt-0.5 text-foreground text-xs" />
          </Field.Root>

          <PageActionBtn submit disabled={isSubmitting} form="life-area-form">
            {t("common.save")}
          </PageActionBtn>
        </form>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <div className="p-1 space-y-4">
          <div>
            <Dialog.Title className="font-bold">
              {t("lifeAreas.deleteConfirm")}
            </Dialog.Title>
            <Dialog.Description className="sub-text text-xs mt-1">
              {t("lifeAreas.deleteDesc")?.replace("{title}", area?.title || "")}
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
              className="bg-red-600 text-white hover:bg-red-700">
              {isDeleting ? t("common.loading") : t("common.delete")}
            </Button>
          </div>
        </div>
      </Dialog>
    </PageWrapper>
  );
}

export default ProfileNewLifeAreaPage;
