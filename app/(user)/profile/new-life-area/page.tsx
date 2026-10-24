"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useActionState, useState } from "react";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

import { Field, Form } from "@base-ui/react";
import { LoaderIcon, Trash2Icon } from "lucide-react";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";

import { useLifeAreas } from "@/features/life-areas/hooks";
import {
  createLifeAreaMutation,
  updateLifeAreaMutation,
} from "@/features/life-areas/mutations";
import { useDeleteLifeAreaAction } from "@/features/life-areas/actions";
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

  const { lifeAreas, isLoading } = useLifeAreas();

  const area = lifeAreas.find((a) => a.id === Number(editId));
  const isLoadingDetail = isEditMode && isLoading && !area;

  const [title, setTitle] = useState("");
  const [vision, setVision] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [state, formAction, pending] = useActionState(
    isEditMode ? updateLifeAreaMutation : createLifeAreaMutation,
    null,
  );

  const { state: deleteState, action: deleteAction, isPending: isDeleting } =
    useDeleteLifeAreaAction(() => setDeleteDialogOpen(false));

  useEffect(() => {
    if (state?.success) {
      router.push("/profile");
      router.refresh();
    }
  }, [state?.success, router]);

  useEffect(() => {
    if (!deleteState?.success) return;

    router.push("/profile");
    router.refresh();
  }, [deleteState?.success, router]);

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
        <Form
          id="life-area-form"
          className="w-full space-y-6"
          aria-label={isEditMode ? t("lifeAreas.edit") : t("lifeAreas.new")}
          action={formAction}
          errors={state?.errors}>
          {state?.errors?.general && (
            <div
              role="alert"
              className="p-3 text-xs rounded-component bg-foreground/5 border border-foreground/15 text-foreground leading-relaxed">
              {state.errors.general.join(", ")}
            </div>
          )}

          {isEditMode && (
            <Field.Root className="hidden" name="id">
              <Field.Control type="hidden" name="id" value={editId ?? ""} />
            </Field.Root>
          )}
          <Field.Root className="hidden" name="vision">
            <Field.Control type="hidden" name="vision" value={vision} />
          </Field.Root>

          <Field.Root name="title">
            <Field.Label className="block font-bold">
              {t("common.title")}
            </Field.Label>

            <Field.Control
              required
              name="title"
              value={title}
              disabled={pending}
              className="input w-full"
              placeholder={t("lifeAreas.titlePlaceholder")}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Field.Error className="sub-text mt-0.5 text-foreground text-xs" />
          </Field.Root>

          <Field.Root name="vision">
            <Field.Label className="block font-bold">
              {t("lifeAreas.visionLabel")}
            </Field.Label>

            <RichTextarea
              value={vision}
              onChange={setVision}
              placeholder={t("lifeAreas.visionPlaceholder")}
              title={t("lifeAreas.visionLabel")}
            />

            <Field.Error className="sub-text mt-0.5 text-foreground text-xs" />
          </Field.Root>

          <PageActionBtn submit disabled={pending} form="life-area-form">
            {t("common.save")}
          </PageActionBtn>
        </Form>
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
            <form action={deleteAction}>
              <Field.Root className="hidden" name="id">
                <Field.Control type="hidden" name="id" value={editId ?? ""} />
              </Field.Root>
              <Button
                type="submit"
                variant="primary"
                disabled={isDeleting || !editId}
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

export default ProfileNewLifeAreaPage;
