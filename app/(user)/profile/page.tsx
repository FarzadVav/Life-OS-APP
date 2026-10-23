"use client";

import {
  BookOpenIcon,
  CheckSquareIcon,
  DotIcon,
  LogOutIcon,
  RocketIcon,
  UserIcon,
} from "lucide-react";

import { useTodos } from "@/features/todos/hooks";
import { useCurrentUser } from "@/features/auth/hooks";
import { useJournalsStats } from "@/features/journals/hooks";
import { LifeAreasList } from "@/features/life-areas/components";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import ThemeSwitcher from "@/features/general/components/module/ThemeSwitcher/ThemeSwitcher";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";
import LocaleSwitcher from "@/features/general/components/module/LocaleSwitcher/LocaleSwitcher";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import LogoutBtn from "@/features/auth/components/LogoutBtn/LogoutBtn";

function UserProfilePage() {
  const { t } = useLocale();
  const { user: currentUser } = useCurrentUser();
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
      label: t("profile.todos"),
      icon: <CheckSquareIcon className="size-5 text-foreground" />,
      details: [
        {
          label: t("todos.today") || "Daily",
          value: `${completedDaily}/${dailyTodos.length}`,
        },
        {
          label: t("todos.upcoming") || "Upcoming",
          value: upcomingTodos.length,
        },
      ],
    },
    {
      label: t("todos.missions") || "Missions",
      icon: <RocketIcon className="size-5 text-foreground" />,
      details: [
        { label: t("profile.total"), value: missionTodos.length },
        {
          label: t("missions.actionsLabel") || "Actions",
          value: `${doneMissionActions}/${totalMissionActions}`,
        },
      ],
    },
    {
      label: t("profile.journals"),
      icon: <BookOpenIcon className="size-5 text-foreground" />,
      details: [{ label: t("profile.total"), value: totalJournals }],
    },
  ];

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.InstallBtn position="left" />
        <TopBar.Title asTitle>{t("profile.title")}</TopBar.Title>
        <TopBar.HelpBtn position="right" />
      </TopBar>

      <PageItemsWrapper>
        <div className="w-full card items-center">
          <div className="size-14 rounded-full bg-card-thick flex items-center justify-center">
            <span className="title">
              {currentUser
                ? (currentUser.name || currentUser.username)[0]
                : "*"}
            </span>
          </div>

          <div>
            <p className="title">
              <span>{currentUser?.name || currentUser?.username || "..."}</span>
              {currentUser?.name ? (
                <>
                  {" "}
                  <span>({currentUser?.username})</span>
                </>
              ) : null}
            </p>
            <p className="sub-text flex items-center">
              Joined at {new Date().toLocaleDateString()}
            </p>
          </div>

          <LogoutBtn />
        </div>

        {/* Life Areas Section */}
        <LifeAreasList />

        {/* Stats Grid */}
        {stats.map((stat) => (
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
                  <span className="font-medium text-foreground">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <p className="sub-text w-full text-center">{t("profile.quote")}</p>

        <div className="flex w-full items-center justify-between gap-3 rounded-container bg-card p-3 border border-foreground/5 shadow-xs">
          <span className="font-bold">{t("profile.language")}</span>
          <LocaleSwitcher />
        </div>

        <div className="flex w-full items-center justify-between gap-3 rounded-container bg-card p-3 border border-foreground/5 shadow-xs">
          <span className="font-bold">{t("profile.colorScheme")}</span>
          <ThemeSwitcher />
        </div>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default UserProfilePage;
