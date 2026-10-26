"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useActionState, useEffect } from "react";
import { PlusIcon, SparklesIcon, LoaderIcon } from "lucide-react";

import { useSkills } from "../../hooks/useSkills";
import { deleteSkillMutation } from "../../mutations";
import type { Skill } from "../../types";
import Field from "@/features/general/components/ui/Field";
import { SkillCard } from "../SkillCard/SkillCard";
import { useLifeAreas } from "@/features/life-areas/hooks/useLifeAreas";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import EmptyAlert from "@/features/general/components/static/EmptyAlert";
import Skeleton from "@/features/general/components/ui/Skeleton";
import SlideTabs, { SlideTabItem } from "@/features/general/components/ui/SlideTabs";
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteSkillMutation,
    undefined,
  );

  useEffect(() => {
    if (!deleteState?.success) return;

    revalidateSkills();
  }, [deleteState, revalidateSkills]);

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

  const filterTabs: SlideTabItem[] = useMemo(
    () => [
      {
        id: "ALL",
        label: t("lifeAreas.allAreas"),
      },
      ...lifeAreas.map((area) => ({
        id: String(area.id),
        label: area.title,
      })),
      {
        id: "0",
        label: t("common.general"),
      },
    ],
    [lifeAreas, t],
  );

  const content =
    isLoading && skills.length === 0 ? (
      <div className="space-y-2.5">
        <Skeleton count={3} />
      </div>
    ) : filteredSkills.length === 0 ? (
      <EmptyAlert
        className="bg-card/40"
        icon={<SparklesIcon className="size-5 text-foreground/40" />}
        alert={t("skills.empty")}
        description={t("skills.addFirst")}
        action={
          <Button
            type="button"
            variant="card"
            onClick={handleOpenCreate}
            className="h-8 px-3 text-xs mt-2 gap-1.5"
          >
            <PlusIcon className="size-3.5" />
            <span>{t("skills.new")}</span>
          </Button>
        }
      />
    ) : (
      <div className="space-y-2.5">
        {filteredSkills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            onEdit={handleOpenEdit}
            onRequestDelete={(id) => {
              setDeleteTargetId(id);
              setDeleteDialogOpen(true);
            }}
          />
        ))}
      </div>
    );

  return (
    <div className={`w-full flex flex-col gap-3 ${className}`}>
      {showFilterBar ? (
        <SlideTabs
          tabs={filterTabs}
          activeId={String(activeAreaFilter)}
          onTabChange={(id) => {
            setActiveAreaFilter(id === "ALL" ? "ALL" : Number(id));
          }}
          headerClassName="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-0.5 gap-1.5"
          tabClassName="shrink-0 flex-none"
        >
          {content}
        </SlideTabs>
      ) : (
        content
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <div className="flex flex-col gap-4 p-1">
          <div>
            <Dialog.Title className="title">
              {t("skills.deleteConfirm")}
            </Dialog.Title>
            <Dialog.Description className="sub-text text-xs mt-1">
              {t("skills.deleteDesc", {
                title: targetSkill?.title || "",
              })}
            </Dialog.Description>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              {t("common.cancel")}
            </Button>
            <form action={deleteAction} onSubmit={() => setDeleteDialogOpen(false)}>
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
