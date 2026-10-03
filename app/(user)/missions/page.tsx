"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { Drawer } from "@base-ui/react/drawer";
import {
  CalendarDaysIcon,
  CheckIcon,
  CircleIcon,
  GaugeIcon,
  Repeat2Icon,
  XIcon,
} from "lucide-react";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import { Button } from "@/features/general/components/ui/Button/Button";

type MissionAction = {
  id: number;
  title: string;
  deadline: string;
  isDone: boolean;
};

type MissionDiscipline = {
  id: number;
  title: string;
  repeatInterval: string;
};

type Mission = {
  id: number;
  title: string;
  deadline: string;
  difficulty: number;
  actions: MissionAction[];
  disciplines: MissionDiscipline[];
};

const missions: Mission[] = [
  {
    id: 1,
    title: "Build and launch my SaaS",
    deadline: "2026-12-20",
    difficulty: 5,
    actions: [
      {
        id: 1,
        title: "Finalize MVP feature set",
        deadline: "2026-10-15",
        isDone: true,
      },
      {
        id: 2,
        title: "Build landing page",
        deadline: "2026-10-25",
        isDone: true,
      },
      {
        id: 3,
        title: "Implement payment system",
        deadline: "2026-11-05",
        isDone: false,
      },
      {
        id: 4,
        title: "Deploy production version",
        deadline: "2026-11-20",
        isDone: false,
      },
      {
        id: 5,
        title: "Acquire first 10 customers",
        deadline: "2026-12-20",
        isDone: false,
      },
    ],
    disciplines: [
      {
        id: 1,
        title: "Work on the product every day",
        repeatInterval: "Daily",
      },
      {
        id: 2,
        title: "Talk to potential customers",
        repeatInterval: "3 times / week",
      },
      {
        id: 3,
        title: "Publish business-related content",
        repeatInterval: "2 times / week",
      },
    ],
  },
  {
    id: 2,
    title: "Reach B2 English level",
    deadline: "2027-01-15",
    difficulty: 4,
    actions: [
      {
        id: 1,
        title: "Finish Vocabulary in Use B2",
        deadline: "2026-11-15",
        isDone: true,
      },
      {
        id: 2,
        title: "Read the first English book",
        deadline: "2026-11-30",
        isDone: false,
      },
      {
        id: 3,
        title: "Read the second English book",
        deadline: "2026-12-20",
        isDone: false,
      },
      {
        id: 4,
        title: "Finish B2 grammar review",
        deadline: "2027-01-05",
        isDone: false,
      },
    ],
    disciplines: [
      {
        id: 1,
        title: "English study",
        repeatInterval: "Daily",
      },
      {
        id: 2,
        title: "Watch English content",
        repeatInterval: "Daily",
      },
    ],
  },
  {
    id: 3,
    title: "Reach 20 pull-ups",
    deadline: "2026-11-30",
    difficulty: 4,
    actions: [
      {
        id: 1,
        title: "Reach 12 strict pull-ups",
        deadline: "2026-10-20",
        isDone: true,
      },
      {
        id: 2,
        title: "Reach 15 strict pull-ups",
        deadline: "2026-11-05",
        isDone: false,
      },
      {
        id: 3,
        title: "Reach 18 strict pull-ups",
        deadline: "2026-11-20",
        isDone: false,
      },
      {
        id: 4,
        title: "Reach 20 strict pull-ups",
        deadline: "2026-11-30",
        isDone: false,
      },
    ],
    disciplines: [
      {
        id: 1,
        title: "Pull-up training",
        repeatInterval: "3 times / week",
      },
      {
        id: 2,
        title: "Track bodyweight",
        repeatInterval: "Weekly",
      },
    ],
  },
  {
    id: 4,
    title: "Build my personal brand",
    deadline: "2027-02-01",
    difficulty: 5,
    actions: [
      {
        id: 1,
        title: "Define personal positioning",
        deadline: "2026-10-20",
        isDone: false,
      },
      {
        id: 2,
        title: "Build portfolio website",
        deadline: "2026-11-10",
        isDone: false,
      },
      {
        id: 3,
        title: "Prepare first 10 content ideas",
        deadline: "2026-11-20",
        isDone: false,
      },
      {
        id: 4,
        title: "Publish first case study",
        deadline: "2026-12-01",
        isDone: false,
      },
      {
        id: 5,
        title: "Build professional network",
        deadline: "2027-01-15",
        isDone: false,
      },
    ],
    disciplines: [
      {
        id: 1,
        title: "Create or document something",
        repeatInterval: "3 times / week",
      },
      {
        id: 2,
        title: "Reach out to people",
        repeatInterval: "2 times / week",
      },
    ],
  },
  {
    id: 5,
    title: "Read 6 English books",
    deadline: "2027-01-01",
    difficulty: 3,
    actions: [
      {
        id: 1,
        title: "Choose six books",
        deadline: "2026-10-10",
        isDone: true,
      },
      {
        id: 2,
        title: "Finish book #1",
        deadline: "2026-10-31",
        isDone: false,
      },
      {
        id: 3,
        title: "Finish book #2",
        deadline: "2026-11-15",
        isDone: false,
      },
      {
        id: 4,
        title: "Finish book #3",
        deadline: "2026-11-30",
        isDone: false,
      },
      {
        id: 5,
        title: "Finish book #4",
        deadline: "2026-12-15",
        isDone: false,
      },
      {
        id: 6,
        title: "Finish book #5",
        deadline: "2026-12-25",
        isDone: false,
      },
      {
        id: 7,
        title: "Finish book #6",
        deadline: "2027-01-01",
        isDone: false,
      },
    ],
    disciplines: [
      {
        id: 1,
        title: "Read English",
        repeatInterval: "Daily",
      },
    ],
  },
];

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("fa-IR", {
    numberingSystem: "latn",
  });
}

function getProgress(mission: Mission) {
  const total = mission.actions.length;

  if (!total) {
    return 0;
  }

  const completed = mission.actions.filter((action) => action.isDone).length;

  return Math.round((completed / total) * 100);
}

function Difficulty({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className={`h-1.5 w-4 rounded-full ${
            index < value ? "bg-foreground" : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
}

function MissionDrawer({
  mission,
  open,
  onOpenChange,
}: {
  mission: Mission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!mission) {
    return null;
  }

  const progress = getProgress(mission);
  const completedActions = mission.actions.filter(
    (action) => action.isDone,
  ).length;

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      <Drawer.Portal>
        <Drawer.Backdrop
          className="
            [--backdrop-opacity:0.7]
            [--bleed:3rem]
            fixed inset-0 min-h-dvh
            bg-background
            opacity-[calc(var(--backdrop-opacity)*(1-var(--drawer-swipe-progress)))]
            transition-opacity
            duration-500
            ease-[cubic-bezier(0.32,0.72,0,1)]
            data-swiping:duration-0
            data-ending-style:opacity-0
            data-starting-style:opacity-0
            data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)]
            supports-[-webkit-touch-callout:none]:absolute
          "
        />

        <Drawer.Viewport className="fixed inset-0 flex items-end justify-center">
          <Drawer.Popup
            className="
              -mb-12
              w-full
              max-h-[calc(88dvh+3rem)]
              bg-card
              px-4
              pb-[calc(1rem+env(safe-area-inset-bottom,0px)+3rem)]
              pt-3
              outline-none
              shadow-2xl
              overflow-y-auto
              overscroll-contain
              touch-auto
              [transform:translateY(var(--drawer-swipe-movement-y))]
              transition-transform
              duration-[450ms]
              ease-[cubic-bezier(0.32,0.72,0,1)]
              data-swiping:select-none
              data-ending-style:[transform:translateY(calc(100%-3rem+2px))]
              data-starting-style:[transform:translateY(calc(100%-3rem+2px))]
              data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)]
            "
          >
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-muted" />

            <Drawer.Content className="mx-auto w-full max-w-2xl">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <Drawer.Title className="text-lg font-bold leading-tight">
                      {mission.title}
                    </Drawer.Title>

                    <Drawer.Description className="sub-text mt-1">
                      Mission #{mission.id}
                    </Drawer.Description>
                  </div>

                  <Drawer.Close
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-9 w-9 shrink-0 p-0"
                        aria-label="Close"
                      >
                        <XIcon className="size-4" />
                      </Button>
                    }
                  />
                </div>

                {/* Progress */}
                <div className="rounded-component bg-background p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-bold">Progress</span>

                    <span className="sub-text text-sm">
                      {completedActions} / {mission.actions.length}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-foreground transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <p className="sub-text mt-2 text-sm">{progress}% completed</p>
                </div>

                {/* Mission metadata */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <div className="rounded-component bg-background p-3">
                    <div className="flex items-center gap-2 sub-text">
                      <CalendarDaysIcon className="size-4" />
                      <span className="text-xs">Deadline</span>
                    </div>

                    <p className="mt-2 font-medium">
                      {formatDate(mission.deadline)}
                    </p>
                  </div>

                  <div className="rounded-component bg-background p-3">
                    <div className="flex items-center gap-2 sub-text">
                      <GaugeIcon className="size-4" />
                      <span className="text-xs">Difficulty</span>
                    </div>

                    <div className="mt-3">
                      <Difficulty value={mission.difficulty} />
                    </div>
                  </div>

                  <div className="rounded-component bg-background p-3">
                    <div className="flex items-center gap-2 sub-text">
                      <CheckIcon className="size-4" />
                      <span className="text-xs">Actions</span>
                    </div>

                    <p className="mt-2 font-medium">{mission.actions.length}</p>
                  </div>
                </div>

                {/* Actions */}
                <section className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">Actions</h3>

                      <span className="sub-text text-sm">
                        {completedActions}/{mission.actions.length}
                      </span>
                    </div>

                    <p className="sub-text mt-1 text-sm">
                      Concrete results that move this mission forward
                    </p>
                  </div>

                  <div className="space-y-2">
                    {mission.actions.map((action) => (
                      <div
                        key={action.id}
                        className="
                          flex items-start gap-3
                          rounded-component
                          bg-background
                          p-3
                        "
                      >
                        <div className="mt-0.5 shrink-0">
                          {action.isDone ? (
                            <div className="flex size-5 items-center justify-center rounded-full bg-foreground">
                              <CheckIcon className="size-3 text-background" />
                            </div>
                          ) : (
                            <CircleIcon className="size-5 sub-text" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className={`font-medium ${
                              action.isDone
                                ? "text-muted-foreground line-through"
                                : ""
                            }`}
                          >
                            {action.title}
                          </p>

                          <div className="mt-1 flex items-center gap-1.5 sub-text text-sm">
                            <CalendarDaysIcon className="size-3.5" />
                            <span>{formatDate(action.deadline)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Disciplines */}
                <section className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">Disciplines</h3>

                      <span className="sub-text text-sm">
                        {mission.disciplines.length}
                      </span>
                    </div>

                    <p className="sub-text mt-1 text-sm">
                      Repeated behaviors that support the mission
                    </p>
                  </div>

                  <div className="space-y-2">
                    {mission.disciplines.map((discipline) => (
                      <div
                        key={discipline.id}
                        className="
                          flex items-center gap-3
                          rounded-component
                          bg-background
                          p-3
                        "
                      >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-card">
                          <Repeat2Icon className="size-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{discipline.title}</p>

                          <p className="sub-text mt-0.5 text-sm">
                            {discipline.repeatInterval}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Footer actions */}
                <div className="flex gap-2 pt-1">
                  <Drawer.Close
                    render={
                      <Button
                        type="button"
                        variant="card"
                        className="flex-1 justify-center"
                      >
                        Close
                      </Button>
                    }
                  />

                  <Link
                    href={`/missions/new?editId=${mission.id}`}
                    className="flex flex-1"
                    onClick={() => onOpenChange(false)}
                  >
                    <Button
                      type="button"
                      variant="primary"
                      className="w-full justify-center"
                    >
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function MissionsPage() {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Missions</TopBar.Title>

        <TopBar.Btn backIcon href="/" position="left" />
      </TopBar>

      <PageItemsWrapper>
        {missions.map((mission) => {
          const progress = getProgress(mission);

          return (
            <button
              key={mission.id}
              type="button"
              className="
                w-full
                rounded-component
                bg-card
                p-3
                text-start
                transition-opacity
                hover:opacity-80
                active:opacity-60
              "
              onClick={() => setSelectedMission(mission)}
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{mission.title}</p>

                  <div className="mt-1 flex items-center gap-2">
                    <span className="sub-text text-sm">
                      To {formatDate(mission.deadline)}
                    </span>

                    <span className="sub-text">•</span>

                    <span className="sub-text text-sm">{progress}%</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-card-thick">
                <motion.div
                  initial={{ width: 0 }}
                  className="h-full rounded-full bg-foreground"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </button>
          );
        })}

        {missions.length === 0 && (
          <div
            className="
              flex w-full flex-1
              items-center justify-center
              rounded-component
              border-2 border-dashed
              p-3
            "
          >
            <p>You haven{"'"}t any missions</p>
          </div>
        )}

        <p className="sub-text w-full text-center">
          It{"'"}s better to have not more than 3 or 4 missions!
        </p>

        <CreateBtn href="/missions/new">New Mission</CreateBtn>
      </PageItemsWrapper>

      <MissionDrawer
        mission={selectedMission}
        open={selectedMission !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedMission(null);
          }
        }}
      />
    </PageWrapper>
  );
}

export default MissionsPage;
