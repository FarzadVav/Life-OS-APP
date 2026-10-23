"use client";

import Link from "next/link";
import { useState } from "react";
import { LoaderIcon, EditIcon } from "lucide-react";

import type { LifeArea } from "../../../../life-areas/types";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLifeAreas } from "../../../../life-areas/hooks/useLifeAreas";
import EmptyAlert from "@/features/general/components/static/EmptyAlert/EmptyAlert";
import { LifeAreaCard } from "../../../../life-areas/components/LifeAreaCard/LifeAreaCard";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";
import { LifeAreaDialog } from "../../../../life-areas/components/LifeAreaDialog/LifeAreaDialog";

export function ProfileLifeAreas() {
  const { t } = useLocale();
  const {
    lifeAreas,
    isLoading,
    createLifeArea,
    updateLifeArea,
    deleteLifeArea,
  } = useLifeAreas();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<LifeArea | null>(null);

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const targetArea = lifeAreas.find((a) => a.id === deleteTargetId);

  const handleOpenCreate = () => {
    setEditingArea(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (area: LifeArea) => {
    setEditingArea(area);
    setDialogOpen(true);
  };

  const handleSave = async (data: { title: string; vision: string }) => {
    if (editingArea) {
      await updateLifeArea(editingArea.id, data);
    } else {
      await createLifeArea(data);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteLifeArea(deleteTargetId);
      setDeleteTargetId(null);
    } catch (err) {
      console.error("Delete life area error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <p className="title">{t("lifeAreas.title")}</p>

        <Button
          type="button"
          variant="card"
          nativeButton={false}
          render={
            <Link href={"/profile/life-ares"}>
              <EditIcon />
              <span>{t("common.edit")}</span>
            </Link>
          }
        />
      </div>

      {isLoading ? (
        <div className="skeleton h-[64px]" />
      ) : lifeAreas.length === 0 ? (
        <EmptyAlert
          alert={t("lifeAreas.empty")}
          href="/profile/life-areas/new"
        />
      ) : (
        lifeAreas.map((area) => <LifeAreaCard key={area.id} lifeArea={area} />)
      )}

      <LifeAreaDialog
        open={dialogOpen}
        onSave={handleSave}
        initialData={editingArea}
        onOpenChange={setDialogOpen}
      />

      <Dialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <div className="flex flex-col gap-4 p-1">
          <div>
            <Dialog.Title className="title">
              {t("lifeAreas.deleteConfirm")}
            </Dialog.Title>
            <Dialog.Description className="sub-text text-xs mt-1">
              {t("lifeAreas.deleteDesc")?.replace(
                "{title}",
                targetArea?.title || "",
              )}
            </Dialog.Description>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteTargetId(null)}
              disabled={isDeleting}>
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              variant="primary"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
              disabled={isDeleting}>
              {isDeleting ? (
                <span className="flex items-center gap-1.5">
                  <LoaderIcon className="size-4 animate-spin" />
                  <span>{t("common.loading")}</span>
                </span>
              ) : (
                <span>{t("common.delete")}</span>
              )}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default ProfileLifeAreas;
