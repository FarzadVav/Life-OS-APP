"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useActionState, useEffect } from "react";
import Field from "@/features/general/components/ui/Field";
import { PlusIcon, Repeat2Icon, LoaderIcon } from "lucide-react";

import { useFrameworks } from "../../hooks/useFrameworks";
import { deleteFrameworkMutation } from "../../mutations";
import type { Framework } from "../../types";
import { FrameworkCard } from "../FrameworkCard/FrameworkCard";
import { useLifeAreas } from "@/features/life-areas/hooks/useLifeAreas";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import EmptyAlert from "@/features/general/components/static/EmptyAlert";
import Skeleton from "@/features/general/components/ui/Skeleton";
import SlideTabs, { SlideTabItem } from "@/features/general/components/ui/SlideTabs";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

export interface FrameworksListProps {
  /** If provided, locks the list to this specific life area */
  lifeAreaId?: number | null;
  /** Whether to show the filter-by-life-area selector (defaults to true) */
  showFilter?: boolean;
  className?: string;
}

export function FrameworksList({
  lifeAreaId: forcedLifeAreaId,
  showFilter = true,
  className = "",
}: FrameworksListProps) {
  const { t } = useLocale();

  const [activeAreaFilter, setActiveAreaFilter] = useState<number | "ALL">("ALL");

  const effectiveLifeAreaId = forcedLifeAreaId !== undefined ? forcedLifeAreaId : null;
  const { frameworks, isLoading, mutate: revalidateHabits } = useFrameworks(
    effectiveLifeAreaId,
  );
  const { lifeAreas } = useLifeAreas();

  const router = useRouter();

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteFrameworkMutation,
    undefined,
  );

  useEffect(() => {
    if (!deleteState?.success) return;

    revalidateHabits();
  }, [deleteState, revalidateHabits]);

  const targetHabit = frameworks.find((h) => h.id === deleteTargetId);

  // Filter frameworks client-side if activeAreaFilter is set and not forced from props
  const filteredHabits = useMemo(() => {
    if (forcedLifeAreaId !== undefined) return frameworks;
    if (activeAreaFilter === "ALL") return frameworks;
    if (activeAreaFilter === 0) {
      return frameworks.filter((h) => !h.lifeAreaId);
    }
    return frameworks.filter((h) => h.lifeAreaId === activeAreaFilter);
  }, [frameworks, forcedLifeAreaId, activeAreaFilter]);

  const handleOpenCreate = () => {
    const area =
      typeof activeAreaFilter === "number" && activeAreaFilter > 0
        ? activeAreaFilter
        : forcedLifeAreaId && forcedLifeAreaId > 0
          ? forcedLifeAreaId
          : null;
    if (area) {
      router.push(`/framework/new?lifeAreaId=${area}`);
    } else {
      router.push("/framework/new");
    }
  };

  const handleOpenEdit = (framework: Framework) => {
    router.push(`/framework/new?editId=${framework.id}`);
  };

  const showFilterBar =
    showFilter && forcedLifeAreaId === undefined && lifeAreas.length > 0;

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
    isLoading && frameworks.length === 0 ? (
      <div className="space-y-2.5">
        <Skeleton count={3} />
      </div>
    ) : filteredHabits.length === 0 ? (
      <EmptyAlert
        className="bg-card/40"
        icon={<Repeat2Icon className="size-5 text-foreground/40" />}
        alert={t("framework.empty")}
        description={t("framework.addFirst")}
        action={
          <Button
            type="button"
            variant="card"
            onClick={handleOpenCreate}
            className="h-8 px-3 text-xs mt-2 gap-1.5"
          >
            <PlusIcon className="size-3.5" />
            <span>{t("framework.new")}</span>
          </Button>
        }
      />
    ) : (
      <div className="space-y-2.5">
        {filteredHabits.map((framework) => (
          <FrameworkCard
            key={framework.id}
            framework={framework}
            onEdit={handleOpenEdit}
            onRequestDelete={(id) => {
              setDeleteTargetId(id);
              setDeleteDialogOpen(true);
            }}
            onRecorded={revalidateHabits}
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
              {t("framework.deleteConfirm")}
            </Dialog.Title>
            <Dialog.Description className="sub-text text-xs mt-1">
              {t("framework.deleteDesc", {
                title: targetHabit?.title || "",
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

export default FrameworksList;
