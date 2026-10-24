"use client";

import Link from "next/link";
import { useState } from "react";
import { Field } from "@base-ui/react";
import { EditIcon, Trash2Icon, LoaderIcon } from "lucide-react";

import type { LifeArea } from "../../types";
import { useLifeAreas } from "../../hooks/useLifeAreas";
import { useDeleteLifeAreaAction } from "../../actions";
import Drawer from "@/features/general/components/ui/Drawer/Drawer";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

export interface LifeAreaCardProps {
  lifeArea: LifeArea;
}

export function LifeAreaCard({ lifeArea }: LifeAreaCardProps) {
  const { t } = useLocale();
  const { mutate } = useLifeAreas();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { action: deleteLifeAreaAction, isPending: isDeleting } =
    useDeleteLifeAreaAction(() => {
      setDeleteDialogOpen(false);
      mutate();
    });

  return (
    <>
      <Drawer
        nativeButton={false}
        trigger={
          <div className="group card card-action items-center justify-between">
            <p className="title">{lifeArea.title}</p>

            <Button
              square
              type="button"
              variant="ghost"
              nativeButton={false}
              aria-label={t("common.edit")}
              render={
                <Link
                  onClick={(ev) => ev.stopPropagation()}
                  href={`/profile/new-life-area?editId=${lifeArea.id}`}>
                  <EditIcon />
                </Link>
              }
            />
          </div>
        }>
        <Drawer.Title className="title">{lifeArea.title}</Drawer.Title>

        <div className="rounded-container bg-background p-3">
          {lifeArea.vision ? (
            <div
              className="tiptap-content"
              dangerouslySetInnerHTML={{ __html: lifeArea.vision }}
            />
          ) : (
            <p>{t("lifeAreas.visionPlaceholder")}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 [&_>_*]:w-1/2">
          <Button
            type="button"
            variant="card"
            disabled={isDeleting}
            aria-label={t("common.delete")}
            onClick={() => setDeleteDialogOpen(true)}>
            <Trash2Icon />
          </Button>
          <Button
            type="button"
            nativeButton={false}
            aria-label={t("common.edit")}
            render={
              <Link href={`/profile/new-life-area?editId=${lifeArea.id}`}>
                <EditIcon />
                <span>{t("common.edit")}</span>
              </Link>
            }
          />
        </div>
      </Drawer>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <div className="p-1 space-y-4">
          <div>
            <Dialog.Title className="font-bold">
              {t("lifeAreas.deleteConfirm")}
            </Dialog.Title>
            <Dialog.Description className="sub-text text-xs mt-1">
              {t("lifeAreas.deleteDesc")?.replace("{title}", lifeArea.title)}
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
            <form action={deleteLifeAreaAction}>
              <Field.Root className="hidden" name="id">
                <Field.Control type="hidden" name="id" value={lifeArea.id} />
              </Field.Root>
              <Button
                type="submit"
                variant="primary"
                disabled={isDeleting}
                className="bg-red-600 text-white hover:bg-red-700">
                {isDeleting ? (
                  <span className="flex items-center gap-1.5">
                    <LoaderIcon className="size-4 animate-spin" />
                    <span>{t("common.loading")}</span>
                  </span>
                ) : (
                  <span>{t("common.delete")}</span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default LifeAreaCard;
