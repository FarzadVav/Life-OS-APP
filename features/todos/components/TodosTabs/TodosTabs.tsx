"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

import { Todo } from "../../types";
import { todos as initialTodos } from "../../constants";
import TodoCard from "../TodoCard/TodoCard";
import TodoMissionCard from "../TodoMissionCard/TodoMissionCard";
import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

function TodosTabs() {
  const [todosList, setTodosList] = useState<Todo[]>(initialTodos);
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

  const handleToggle = (id: number) => {
    setTodosList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isDone: !item.isDone } : item,
      ),
    );
  };

  const handleToggleMissionAction = (todoId: number, actionId: number) => {
    setTodosList((prev) =>
      prev.map((todo) => {
        if (todo.id !== todoId || !todo.actions) return todo;
        const updatedActions = todo.actions.map((act) =>
          act.id === actionId ? { ...act, isDone: !act.isDone } : act,
        );
        const allDone =
          updatedActions.length > 0 &&
          updatedActions.every((act) => act.isDone);
        return {
          ...todo,
          actions: updatedActions,
          isDone: allDone,
        };
      }),
    );
  };

  return (
    <>
      <div className="w-full flex gap-2">
        <Button
          nativeButton={false}
          className="flex-1 justify-center rounded-container"
          render={<Link href="?tab=today" />}
          variant={activeTab === "today" ? "primary" : "card"}
        >
          {t("todos.today")}
        </Button>
        <Button
          nativeButton={false}
          className="flex-1 justify-center rounded-container"
          render={<Link href="?tab=upcoming" />}
          variant={activeTab === "upcoming" ? "primary" : "card"}
        >
          {t("todos.upcoming")}
        </Button>
        <Button
          nativeButton={false}
          className="flex-1 justify-center rounded-container"
          render={<Link href="?tab=missions" />}
          variant={activeTab === "missions" ? "primary" : "card"}
        >
          {t("todos.missions") || "Missions"}
        </Button>
      </div>

      {totalCount > 0 && (
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
      )}

      <div className="w-full overflow-hidden rounded-container">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            className="w-full space-y-3"
            transition={{ ease: "linear", duration: 0.15 }}
            initial={{
              translateX:
                activeTab === "today"
                  ? "-10%"
                  : activeTab === "missions"
                    ? "10%"
                    : "0%",
              opacity: 0,
              filter: "blur(4px)",
            }}
            animate={{ translateX: 0, opacity: 1, filter: "none" }}
            exit={{
              translateX:
                activeTab === "today"
                  ? "-10%"
                  : activeTab === "missions"
                    ? "10%"
                    : "0%",
              opacity: 0,
              filter: "blur(4px)",
            }}
          >
            {activeTab === "missions"
              ? currentTodos.map((mission) => (
                  <TodoMissionCard
                    key={mission.id}
                    todo={mission}
                    onToggleAction={handleToggleMissionAction}
                  />
                ))
              : currentTodos.map((todo) => (
                  <TodoCard key={todo.id} todo={todo} onToggle={handleToggle} />
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
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

export default TodosTabs;
