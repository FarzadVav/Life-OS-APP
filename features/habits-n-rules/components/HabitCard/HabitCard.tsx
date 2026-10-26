"use client";

import { useMemo } from "react";
import {
  CalendarDaysIcon,
  CompassIcon,
  Repeat2Icon,
  Trash2Icon,
} from "lucide-react";
import type { Habit } from "../../types";
import CardDrawer from "@/features/general/components/ui/CardDrawer/CardDrawer";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

export interface HabitCardProps {
  habit: Habit;
  onEdit?: (habit: Habit) => void;
  onRequestDelete: (id: number) => void;
  onRecorded?: () => void;
}

export function HabitCard({
  habit,
  onRequestDelete,
}: HabitCardProps) {
  const { t } = useLocale();

  const completedCount = useMemo(() => {
    return (habit.history || []).filter((h) => h.isDone).length;
  }, [habit.history]);

  return (
    <CardDrawer
      title={habit.title}
      description={habit.description}
      icon={
        <div className="size-8 rounded-container bg-foreground/10 flex items-center justify-center shrink-0">
          <Repeat2Icon className="size-4 text-foreground" />
        </div>
      }
      editHref={`/habits-n-rules/new?editId=${habit.id}`}
      content={
        <div className="space-y-4">
          {habit.lifeArea && (
            <div className="flex items-center gap-1.5 sub-text text-xs">
              <CompassIcon className="size-3 text-foreground/60" />
              <span>{habit.lifeArea.title}</span>
            </div>
          )}

          {habit.description && (
            <div className="rounded-container bg-background/60 p-4 border border-foreground/10">
              <p className="text-sm leading-relaxed text-foreground select-text whitespace-pre-wrap">
                {habit.description}
              </p>
            </div>
          )}


          {/* Recent History summary */}
          {habit.history && habit.history.length > 0 && (
            <div className="rounded-container bg-card p-4 border border-foreground/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-foreground">
                  {t("habits.historyTitle")}
                </h4>
                <span className="text-xs sub-text">
                  {completedCount} / {habit.history.length} {t("common.done")}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto scrollbar-thin">
                {[...habit.history]
                  .reverse()
                  .slice(0, 14)
                  .map((entry) => (
                    <span
                      key={entry.id}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                        entry.isDone
                          ? "bg-foreground/10 text-foreground"
                          : "bg-destructive/10 text-destructive line-through"
                      }`}
                    >
                      <CalendarDaysIcon className="size-3" />
                      <span>{entry.date}</span>
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>
      }
      actions={
        <Button
          type="button"
          variant="card"
          square
          aria-label={t("common.delete")}
          onClick={() => onRequestDelete(habit.id)}
        >
          <Trash2Icon className="size-4 text-destructive" />
        </Button>
      }
    />
  );
}

export default HabitCard;
