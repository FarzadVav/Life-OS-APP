"use client";

import { useMemo, useState } from "react";
import { PlusIcon, SparklesIcon, LoaderIcon, FilterIcon } from "lucide-react";

import { useSkills } from "../../hooks/useSkills";
import type { Skill } from "../../types";
import { SkillCard } from "../SkillCard/SkillCard";
import { SkillDialog } from "../SkillDialog/SkillDialog";
import { useLifeAreas } from "@/features/life-areas/hooks/useLifeAreas";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

export interface SkillsListProps {
  /** If provided, locks the list to this specific life area */
  lifeAreaId?: number | null;
  /** Whether to show the filter-by-life-area selector (defaults to true) */
  showFilter?: boolean;
  className?: string;
}

export function SkillsList({
  lifeAreaId: forcedLifeAreaId,
  showFilter = true,
  className = "",
}: SkillsListProps) {
  const { t } = useLocale();

  const [activeAreaFilter, setActiveAreaFilter] = useState<number | "ALL">("ALL");

  const effectiveLifeAreaId = forcedLifeAreaId !== undefined ? forcedLifeAreaId : null;
  const { skills, isLoading, createSkill, updateSkill, deleteSkill } = useSkills(effectiveLifeAreaId);
  const { lifeAreas } = useLifeAreas();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const targetSkill = skills.find((s) => s.id === deleteTargetId);

  // Filter skills client-side if activeAreaFilter is set and not forced from props
  const filteredSkills = useMemo(() => {
    if (forcedLifeAreaId !== undefined) return skills;
    if (activeAreaFilter === "ALL") return skills;
    if (activeAreaFilter === 0) {
      return skills.filter((s) => !s.lifeAreaId);
    }
    return skills.filter((s) => s.lifeAreaId === activeAreaFilter);
  }, [skills, forcedLifeAreaId, activeAreaFilter]);

  const handleOpenCreate = () => {
    setEditingSkill(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setDialogOpen(true);
  };

  const handleSave = async (data: {
    title: string;
    content: string;
    lifeAreaId?: number | null;
  }) => {
    if (editingSkill) {
      await updateSkill(editingSkill.id, data);
    } else {
      await createSkill(data);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteSkill(deleteTargetId);
      setDeleteTargetId(null);
    } catch (err) {
      console.error("Delete skill error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const showFilterBar = showFilter && forcedLifeAreaId === undefined && lifeAreas.length > 0;

  return (
    <div className={`w-full flex flex-col gap-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-4 text-foreground/80" />
          <h3 className="font-bold text-sm text-foreground">
            {t("skills.title")}
          </h3>
          <span className="text-xs sub-text">({filteredSkills.length})</span>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleOpenCreate}
          className="h-8 px-3 text-xs gap-1.5 rounded-component"
        >
          <PlusIcon className="size-3.5" />
          <span>{t("skills.new")}</span>
        </Button>
      </div>

      {/* Filter Chips Bar */}
      {showFilterBar && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setActiveAreaFilter("ALL")}
            className={`px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer shrink-0 ${
              activeAreaFilter === "ALL"
                ? "bg-foreground text-background font-medium"
                : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"
            }`}
          >
            {t("skills.allLifeAreas") || "All"}
          </button>
          {lifeAreas.map((area) => (
            <button
              key={area.id}
              type="button"
              onClick={() => setActiveAreaFilter(area.id)}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer shrink-0 ${
                activeAreaFilter === area.id
                  ? "bg-foreground text-background font-medium"
                  : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"
              }`}
            >
              {area.title}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setActiveAreaFilter(0)}
            className={`px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer shrink-0 ${
              activeAreaFilter === 0
                ? "bg-foreground text-background font-medium"
                : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"
            }`}
          >
            {t("skills.unassigned") || "General"}
          </button>
        </div>
      )}

      {/* Content */}
      {isLoading && skills.length === 0 ? (
        <div className="flex w-full items-center justify-center p-8 text-foreground/40 gap-2">
          <LoaderIcon className="size-5 animate-spin" />
          <span className="text-xs sub-text">{t("common.loading")}</span>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-container border-2 border-dashed border-foreground/15 p-6 text-center gap-2 bg-card/40">
          <div className="size-10 rounded-full bg-foreground/5 flex items-center justify-center mb-1">
            <SparklesIcon className="size-5 text-foreground/40" />
          </div>
          <p className="text-sm font-medium text-foreground/80">
            {t("skills.empty")}
          </p>
          <p className="text-xs sub-text max-w-xs leading-relaxed">
            {t("skills.addFirst")}
          </p>
          <Button
            type="button"
            variant="card"
            onClick={handleOpenCreate}
            className="h-8 px-3 text-xs mt-2 gap-1.5"
          >
            <PlusIcon className="size-3.5" />
            <span>{t("skills.new")}</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onEdit={handleOpenEdit}
              onDelete={(id) => setDeleteTargetId(id)}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <SkillDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingSkill}
        defaultLifeAreaId={
          typeof activeAreaFilter === "number" && activeAreaFilter > 0
            ? activeAreaFilter
            : forcedLifeAreaId ?? null
        }
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
              {t("skills.deleteConfirm")}
            </Dialog.Title>
            <Dialog.Description className="sub-text text-xs mt-1">
              {t("skills.deleteDesc")?.replace(
                "{title}",
                targetSkill?.title || "",
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

export default SkillsList;
