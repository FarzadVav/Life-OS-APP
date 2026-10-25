"use client";

import { cn } from "cn";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PlusIcon, SparklesIcon, LoaderIcon } from "lucide-react";

import { useSkills } from "../../hooks/useSkills";
import { useDeleteSkillAction } from "../../actions";
import type { Skill } from "../../types";
import Field from "@/features/general/components/ui/Field";
import { SkillCard } from "../SkillCard/SkillCard";
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
  const { skills, isLoading, mutate: revalidateSkills } = useSkills(
    effectiveLifeAreaId,
  );
  const { lifeAreas } = useLifeAreas();

  const router = useRouter();

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const { action: deleteAction, isPending: isDeleting } = useDeleteSkillAction(
    () => {
      setDeleteTargetId(null);
      revalidateSkills();
    },
  );

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
    const area =
      typeof activeAreaFilter === "number" && activeAreaFilter > 0
        ? activeAreaFilter
        : forcedLifeAreaId && forcedLifeAreaId > 0
          ? forcedLifeAreaId
          : null;
    if (area) {
      router.push(`/skills/new?lifeAreaId=${area}`);
    } else {
      router.push("/skills/new");
    }
  };

  const handleOpenEdit = (skill: Skill) => {
    router.push(`/skills/new?editId=${skill.id}`);
  };

  const showFilterBar = showFilter && forcedLifeAreaId === undefined && lifeAreas.length > 0;

  const chipClasses = (active: boolean) =>
    cn(
      "h-auto px-2.5 py-1 text-xs transition-colors cursor-pointer",
      active
        ? "bg-foreground text-background font-medium"
        : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10",
    );

  return (
    <div className={`w-full flex flex-col gap-3 ${className}`}>

      {/* Filter Chips Bar */}
      {showFilterBar && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setActiveAreaFilter("ALL")}
            className={chipClasses(activeAreaFilter === "ALL")}>
            {t("skills.allLifeAreas") || "All"}
          </Button>
          {lifeAreas.map((area) => (
            <Button
              key={area.id}
              type="button"
              variant="ghost"
              onClick={() => setActiveAreaFilter(area.id)}
              className={chipClasses(activeAreaFilter === area.id)}>
              {area.title}
            </Button>
          ))}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setActiveAreaFilter(0)}
            className={chipClasses(activeAreaFilter === 0)}>
            {t("skills.unassigned") || "General"}
          </Button>
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
              onRequestDelete={(id) => setDeleteTargetId(id)}
            />
          ))}
        </div>
      )}

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
            <form action={deleteAction}>
              <Field type="hidden" name="id" value={deleteTargetId ?? ""} />
              <Button
                type="submit"
                variant="primary"
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting || deleteTargetId === null}
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
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default SkillsList;
