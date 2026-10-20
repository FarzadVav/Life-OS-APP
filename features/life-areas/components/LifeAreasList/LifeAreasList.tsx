"use client";

import { useState } from "react";
import { PlusIcon, CompassIcon, LoaderIcon } from "lucide-react";

import { useLifeAreas } from "../../hooks/useLifeAreas";
import type { LifeArea } from "../../types";
import { LifeAreaCard } from "../LifeAreaCard/LifeAreaCard";
import { LifeAreaDialog } from "../LifeAreaDialog/LifeAreaDialog";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

export function LifeAreasList() {
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
    <div className="w-full flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CompassIcon className="size-4 text-foreground/80" />
          <h3 className="font-bold text-sm text-foreground">
            {t("lifeAreas.title")}
          </h3>
          <span className="text-xs sub-text">({lifeAreas.length})</span>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleOpenCreate}
          className="h-8 px-3 text-xs gap-1.5 rounded-component"
        >
          <PlusIcon className="size-3.5" />
          <span>{t("lifeAreas.new")}</span>
        </Button>
      </div>

      {/* Content */}
      {isLoading && lifeAreas.length === 0 ? (
        <div className="flex w-full items-center justify-center p-8 text-foreground/40 gap-2">
          <LoaderIcon className="size-5 animate-spin" />
          <span className="text-xs sub-text">{t("common.loading")}</span>
        </div>
      ) : lifeAreas.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-container border-2 border-dashed border-foreground/15 p-6 text-center gap-2 bg-card/40">
          <div className="size-10 rounded-full bg-foreground/5 flex items-center justify-center mb-1">
            <CompassIcon className="size-5 text-foreground/40" />
          </div>
          <p className="text-sm font-medium text-foreground/80">
            {t("lifeAreas.empty")}
          </p>
          <p className="text-xs sub-text max-w-xs leading-relaxed">
            {t("lifeAreas.addFirst")}
          </p>
          <Button
            type="button"
            variant="card"
            onClick={handleOpenCreate}
            className="h-8 px-3 text-xs mt-2 gap-1.5"
          >
            <PlusIcon className="size-3.5" />
            <span>{t("lifeAreas.new")}</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {lifeAreas.map((area) => (
            <LifeAreaCard
              key={area.id}
              lifeArea={area}
              onEdit={handleOpenEdit}
              onDelete={(id) => setDeleteTargetId(id)}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <LifeAreaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingArea}
        onSave={handleSave}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
      >
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
              disabled={isDeleting}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              variant="primary"
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
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

export default LifeAreasList;
