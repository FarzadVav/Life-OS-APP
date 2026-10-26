"use client";

import { BookOpenIcon, CheckSquareIcon, RocketIcon } from "lucide-react";

import { useTodos } from "@/features/todos/hooks";
import { useJournalsStats } from "@/features/journals/hooks";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

function ProfileStats() {
  const { t } = useLocale();

  const { todos = [] } = useTodos();
  const { stats: journalStats } = useJournalsStats();

  const dailyTodos = todos.filter((item) => item.type === "Daily");
  const upcomingTodos = todos.filter((item) => item.type === "Upcoming");
  const missionTodos = todos.filter((item) => item.type === "Mission");
  const completedDaily = dailyTodos.filter((item) => item.isDone).length;
  const totalMissionActions = missionTodos.reduce(
    (acc, m) => acc + (m.actions?.length || 0),
    0,
  );
  const doneMissionActions = missionTodos.reduce(
    (acc, m) => acc + (m.actions?.filter((a) => a.isDone).length || 0),
    0,
  );
  const totalJournals = journalStats?.total ?? 0;

  const stats = [
    {
      label: t("todos.title"),
      icon: <CheckSquareIcon className="size-5 text-foreground" />,
      details: [
        {
          label: t("todos.today"),
          value: `${completedDaily}/${dailyTodos.length}`,
        },
        {
          label: t("todos.upcoming"),
          value: upcomingTodos.length,
        },
      ],
    },
    {
      label: t("missions.title"),
      icon: <RocketIcon className="size-5 text-foreground" />,
      details: [
        { label: t("profile.total"), value: missionTodos.length },
        {
          label: t("missions.actionsLabel"),
          value: `${doneMissionActions}/${totalMissionActions}`,
        },
      ],
    },
    {
      label: t("journals.title"),
      icon: <BookOpenIcon className="size-5 text-foreground" />,
      details: [{ label: t("profile.total"), value: totalJournals }],
    },
  ];

  return stats.map((stat) => (
    <div
      key={stat.label}
      className="w-full flex flex-col gap-3 rounded-container bg-card p-3 border border-foreground/5 shadow-xs">
      <div className="flex items-center gap-2 font-semibold">
        {stat.icon}
        <span>{stat.label}</span>
      </div>
      <div className="flex flex-col gap-1 text-sm sub-text">
        {stat.details.map((detail) => (
          <div
            key={detail.label}
            className="flex w-full items-center justify-between">
            <span>{detail.label}</span>
            <span className="font-medium text-foreground">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  ));
}

export default ProfileStats;
