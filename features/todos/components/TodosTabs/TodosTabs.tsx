"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { LoaderIcon } from "lucide-react";

import { useTodos } from "../../hooks";
import TodoCard from "../TodoCard/TodoCard";
import TodoMissionCard from "../TodoMissionCard/TodoMissionCard";
import SlideTabs, { SlideTabItem } from "@/features/general/components/ui/SlideTabs";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

function TodosTabs() {
  const {
    todos: todosList,
    isLoading,
    mutate: revalidateTodos,
  } = useTodos();

  const sp = useSearchParams();
  const { t } = useLocale();

  const tab = sp.get("tab");
  const activeTab =
    tab === "upcoming" ? "upcoming" : tab === "missions" ? "missions" : "today";

  const currentTodos = todosList.filter((item) => {
    if (activeTab === "today") return item.type === "Daily";
    if (activeTab === "upcoming") return item.type === "Upcoming";
    return item.type === "Mission";
  });

  const completedCount =
    activeTab === "missions"
      ? currentTodos.reduce((acc, mission) => {
          const acts = mission.actions || [];
          return acc + acts.filter((a) => a.isDone).length;
        }, 0)
      : currentTodos.filter((item) => item.isDone).length;

  const totalCount =
    activeTab === "missions"
      ? currentTodos.reduce(
          (acc, mission) => acc + (mission.actions?.length || 0),
          0,
        )
      : currentTodos.length;

  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const tabs: SlideTabItem[] = [
    {
      id: "today",
      label: t("todos.today"),
      href: "?tab=today",
    },
    {
      id: "upcoming",
      label: t("todos.upcoming"),
      href: "?tab=upcoming",
    },
    {
      id: "missions",
      label: t("todos.missions") || "Missions",
      href: "?tab=missions",
    },
  ];

  return (
    <SlideTabs
      tabs={tabs}
      activeId={activeTab}
      between={
        totalCount > 0 ? (
          <div className="w-full rounded-container bg-card p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold">
                {activeTab === "today"
                  ? t("todos.dailyMomentum")
                  : activeTab === "upcoming"
                    ? t("todos.upcomingTargets")
                    : t("todos.activeMissions") || "Mission Progress"}
              </span>
              <span className="sub-text">
                {t("todos.completedOf", {
                  done: completedCount,
                  total: totalCount,
                })}
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-container bg-card-thick">
              <motion.div
                initial={{ width: 0 }}
                className="h-full rounded-container bg-foreground"
                transition={{ duration: 0.6, ease: "easeOut" }}
                animate={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        ) : null
      }
    >
      <div className="w-full space-y-3">
        {isLoading && todosList.length === 0 ? (
          <div className="flex w-full items-center justify-center p-8 text-foreground/40 gap-2">
            <LoaderIcon className="size-5 animate-spin" />
            <span className="text-xs sub-text">{t("common.loading")}</span>
          </div>
        ) : (
          <>
            {activeTab === "missions"
              ? currentTodos.map((mission) => (
                  <TodoMissionCard
                    key={mission.id}
                    todo={mission}
                    onMutated={revalidateTodos}
                  />
                ))
              : currentTodos.map((todo) => (
                  <TodoCard key={todo.id} todo={todo} onMutated={revalidateTodos} />
                ))}

            {currentTodos.length === 0 && (
              <div
                className="
                  flex w-full flex-1
                  items-center justify-center
                  rounded-container
                  border-2 border-dashed
                  p-6
                "
              >
                <p className="sub-text">
                  {activeTab === "missions"
                    ? t("todos.noMissions") || "You haven't any missions"
                    : t("todos.noTodos") || "You haven't any todos in this section"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </SlideTabs>
  );
}

export default TodosTabs;
