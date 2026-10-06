"use client";

import { useState } from "react";
import {
  BookOpenIcon,
  CheckSquareIcon,
  LogOutIcon,
  RocketIcon,
  TrophyIcon,
} from "lucide-react";

import { todos } from "@/features/todos/constants";
import { journals } from "@/features/journals/constants";
import { skills } from "@/features/skills/constants";
import { missions } from "@/features/missions/constants";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import { logout } from "@/features/auth/actions/auth";

function UserProfilePage() {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const stats = [
    {
      label: "Todos",
      value: todos.length,
      icon: <CheckSquareIcon className="size-4" />,
    },
    {
      label: "Journals",
      value: journals.length,
      icon: <BookOpenIcon className="size-4" />,
    },
    {
      label: "Skills",
      value: skills.length,
      icon: <TrophyIcon className="size-4" />,
    },
    {
      label: "Missions",
      value: missions.length,
      icon: <RocketIcon className="size-4" />,
    },
  ];

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Profile</TopBar.Title>
        <TopBar.Btn backIcon href="/" position="left" />
      </TopBar>

      <PageItemsWrapper>
        <div className="grid w-full grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-2 rounded-component bg-card p-3"
            >
              <div className="flex items-center gap-2 sub-text">
                {stat.icon}
                <span>{stat.label}</span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        <p className="sub-text w-full text-center">
          Small steps every day lead to big results.
        </p>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setLogoutDialogOpen(true)}
        >
          <LogOutIcon />
          Logout
        </Button>
      </PageItemsWrapper>

      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <div className="flex w-full max-w-xs flex-col gap-5 p-1">
          <div className="flex flex-col gap-1">
            <Dialog.Title className="title text-foreground">
              Logout
            </Dialog.Title>
            <Dialog.Description className="sub-text">
              Are you sure you want to logout?
            </Dialog.Description>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Dialog.Close
              render={
                <Button type="button" variant="card" className="flex-1">
                  Cancel
                </Button>
              }
            />

            <form action={logout} className="flex-1">
              <Button type="submit" variant="primary" className="w-full">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </Dialog>
    </PageWrapper>
  );
}

export default UserProfilePage;
