"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PlusIcon, Repeat2Icon, LoaderIcon } from "lucide-react";

import { useHabits } from "../../hooks/useHabits";
import type { Habit } from "../../types";
import { HabitCard } from "../HabitCard/HabitCard";
import { useLifeAreas } from "@/features/life-areas/hooks/useLifeAreas";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

export interface HabitsListProps {
  /** If provided, locks the list to this specific life area */
  lifeAreaId?: number | null;
  /** Whether to show the filter-by-life-area selector (defaults to true) */
  showFilter?: boolean;
  className?: string;
}

export function HabitsList({
  lifeAreaId: forcedLifeAreaId,
  showFilter = true,
  className = "",
}: HabitsListProps) {
  const { t } = useLocale();

  const [activeAreaFilter, setActiveAreaFilter] = useState<number | "ALL">("ALL");

  const effectiveLifeAreaId = forcedLifeAreaId !== undefined ? forcedLifeAreaId : null;
  const { habits, isLoading, createHabit, updateHabit, deleteHabit, recordHabit } =
    useHabits(effectiveLifeAreaId);
  const { lifeAreas } = useLifeAreas();

  const router = useRouter();

  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const targetHabit = habits.find((h) => h.id === deleteTargetId);

  // Filter habits client-side if activeAreaFilter is set and not forced from props
  const filteredHabits = useMemo(() => {
    if (forcedLifeAreaId !== undefined) return habits;
    if (activeAreaFilter === "ALL") return habits;
    if (activeAreaFilter === 0) {
      return habits.filter((h) => !h.lifeAreaId);
    }
    return habits.filter((h) => h.lifeAreaId === activeAreaFilter);
  }, [habits, forcedLifeAreaId, activeAreaFilter]);

  const handleOpenCreate = () => {
    const area =
      typeof activeAreaFilter === "number" && activeAreaFilter > 0
        ? activeAreaFilter
        : forcedLifeAreaId && forcedLifeAreaId > 0
          ? forcedLifeAreaId
          : null;
    if (area) {
      router.push(`/habits/new?lifeAreaId=${area}`);
    } else {
      router.push("/habits/new");
    }
  };

  const handleOpenEdit = (habit: Habit) => {
    router.push(`/habits/new?editId=${habit.id}`);
  };

  const handleRecord = async (habitId: number, isDone: boolean) => {
    try {
      await recordHabit(habitId, isDone);
    } catch (err) {
      console.error("Failed to record habit check-in:", err);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteHabit(deleteTargetId);
      setDeleteTargetId(null);
    } catch (err) {
      console.error("Delete habit error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const showFilterBar =
    showFilter && forcedLifeAreaId === undefined && lifeAreas.length > 0;

  return (
    <div className={`w-full flex flex-col gap-3 ${className}`}>

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
            {t("habits.allLifeAreas") || t("skills.allLifeAreas") || "All"}
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
            {t("habits.unassigned") || t("skills.unassigned") || "General"}
          </button>
        </div>
      )}

      {/* Content */}
      {isLoading && habits.length === 0 ? (
        <div className="flex w-full items-center justify-center p-8 text-foreground/40 gap-2">
          <LoaderIcon className="size-5 animate-spin" />
          <span className="text-xs sub-text">{t("common.loading")}</span>
        </div>
      ) : filteredHabits.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-container border-2 border-dashed border-foreground/15 p-6 text-center gap-2 bg-card/40">
          <div className="size-10 rounded-full bg-foreground/5 flex items-center justify-center mb-1">
            <Repeat2Icon className="size-5 text-foreground/40" />
          </div>
          <p className="text-sm font-medium text-foreground/80">
            {t("habits.empty") || "No habits defined yet."}
          </p>
          <p className="text-xs sub-text max-w-xs leading-relaxed">
            {t("habits.addFirst") ||
              "Add your first habit with recurrence intervals and track your momentum."}
          </p>
          <Button
            type="button"
            variant="card"
            onClick={handleOpenCreate}
            className="h-8 px-3 text-xs mt-2 gap-1.5"
          >
            <PlusIcon className="size-3.5" />
            <span>{t("habits.new") || "New Habit"}</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={handleOpenEdit}
              onDelete={(id) => setDeleteTargetId(id)}
              onRecord={handleRecord}
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
              {t("habits.deleteConfirm") || "Are you sure you want to delete this habit?"}
            </Dialog.Title>
            <Dialog.Description className="sub-text text-xs mt-1">
              {t("habits.deleteDesc")?.replace(
                "{title}",
                targetHabit?.title || "",
              ) || `"${targetHabit?.title || ""}" will be permanently deleted.`}
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

export default HabitsList;
