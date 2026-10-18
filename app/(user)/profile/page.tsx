"use client";

import { useActionState, useState } from "react";
import {
  BookOpenIcon,
  CheckSquareIcon,
  LogOutIcon,
  RocketIcon,
  LayersIcon,
  UserIcon,
} from "lucide-react";

import { todos } from "@/features/todos/constants";
import { journals } from "@/features/journals/constants";
import { useFrameworkItems } from "@/features/framework/items";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import { logoutMutation } from "@/features/auth/mutations";
import { useCurrentUser } from "@/features/auth/hooks";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";
import LocaleSwitcher from "@/features/general/components/module/LocaleSwitcher/LocaleSwitcher";
import ThemeSwitcher from "@/features/general/components/module/ThemeSwitcher/ThemeSwitcher";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";

function UserProfilePage() {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [, logoutAction, isLoggingOut] = useActionState(logoutMutation, undefined);
  const { user: currentUser } = useCurrentUser();
  const { t } = useLocale();
  const { items: frameworkItems } = useFrameworkItems();

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

  const visionsCount = frameworkItems.filter(
    (i) => i.section === "Visions",
  ).length;
  const rulesCount = frameworkItems.filter((i) => i.section === "Rules").length;
  const conceptsCount = frameworkItems.filter(
    (i) => i.section === "Concepts",
  ).length;

  const stats = [
    {
      label: t("profile.todos"),
      icon: <CheckSquareIcon className="size-5 text-foreground" />,
      details: [
        { label: t("todos.today") || "Daily", value: `${completedDaily}/${dailyTodos.length}` },
        { label: t("todos.upcoming") || "Upcoming", value: upcomingTodos.length },
      ],
    },
    {
      label: t("todos.missions") || "Missions",
      icon: <RocketIcon className="size-5 text-foreground" />,
      details: [
        { label: t("profile.total"), value: missionTodos.length },
        { label: t("missions.actionsLabel") || "Actions", value: `${doneMissionActions}/${totalMissionActions}` },
      ],
    },
    {
      label: t("framework.title") || "Framework",
      icon: <LayersIcon className="size-5 text-foreground" />,
      details: [
        { label: t("framework.sections.visions") || "Visions", value: visionsCount },
        { label: t("framework.sections.rules") || "Rules", value: rulesCount },
        { label: t("framework.sections.concepts") || "Concepts", value: conceptsCount },
      ],
    },
    {
      label: t("profile.journals"),
      icon: <BookOpenIcon className="size-5 text-foreground" />,
      details: [{ label: t("profile.total"), value: journals.length }],
    },
  ];

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>{t("profile.title")}</TopBar.Title>
        <TopBar.Btn backIcon href="/" position="left" />
        <TopBar.HelpBtn position="right" />
      </TopBar>

      <PageItemsWrapper>
        {/* User Card fetched via SWR */}
        <div className="w-full flex items-center gap-3.5 p-4 rounded-container bg-card border border-foreground/5 shadow-xs">
          <div className="size-12 rounded-full bg-foreground/10 flex items-center justify-center shrink-0 text-foreground font-bold text-base">
            {currentUser?.name
              ? currentUser.name.slice(0, 2).toUpperCase()
              : currentUser?.username
                ? currentUser.username.slice(0, 2).toUpperCase()
                : <UserIcon className="size-5" />}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-foreground text-base tracking-tight truncate">
              {currentUser?.name || currentUser?.username || "..."}
            </span>
            <span className="sub-text text-xs truncate mt-0.5">
              {currentUser?.username ? `@${currentUser.username}` : "..."}
              {currentUser?.email ? ` • ${currentUser.email}` : ""}
            </span>
          </div>
        </div>

        {stats.map((stat) => (
          <div
            key={stat.label}
            className="w-full flex flex-col gap-3 rounded-container bg-card p-3"
          >
            <div className="flex items-center gap-2 font-semibold">
              {stat.icon}
              <span>{stat.label}</span>
            </div>
            <div className="flex flex-col gap-1 text-sm sub-text">
              {stat.details.map((detail) => (
                <div
                  key={detail.label}
                  className="flex w-full items-center justify-between"
                >
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

        <div className="flex w-full items-center justify-between gap-3 rounded-container bg-card p-3">
          <span className="font-bold">{t("profile.language")}</span>
          <LocaleSwitcher />
        </div>

        <div className="flex w-full items-center justify-between gap-3 rounded-container bg-card p-3">
          <span className="font-bold">{t("profile.colorScheme")}</span>
          <ThemeSwitcher />
        </div>

        <PageActionBtn
          icon={<LogOutIcon />}
          onClick={() => setLogoutDialogOpen(true)}
        >
          {t("profile.logout")}
        </PageActionBtn>
      </PageItemsWrapper>

      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <div className="flex w-full max-w-xs flex-col gap-5 p-1">
          <div className="flex flex-col gap-1">
            <Dialog.Title className="title text-foreground">
              {t("profile.logoutTitle")}
            </Dialog.Title>
            <Dialog.Description className="sub-text">
              {t("profile.logoutDescription")}
            </Dialog.Description>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Dialog.Close
              render={
                <Button type="button" variant="card" className="flex-1" disabled={isLoggingOut}>
                  {t("common.cancel")}
                </Button>
              }
            />

            <form action={logoutAction} className="flex-1">
              <Button type="submit" variant="primary" className="w-full" disabled={isLoggingOut}>
                {isLoggingOut ? t("common.loading") : t("profile.logout")}
              </Button>
            </form>
          </div>
        </div>
      </Dialog>
    </PageWrapper>
  );
}

export default UserProfilePage;
