"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  CalendarDaysIcon,
  CheckIcon,
  CircleIcon,
  GaugeIcon,
  Repeat2Icon,
  XIcon,
} from "lucide-react";

import { Mission } from "../../types";
import Drawer from "@/features/general/components/ui/Drawer/Drawer";
import { Button } from "@/features/general/components/ui/Button/Button";

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("fa-IR", {
    numberingSystem: "latn",
  });
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

type MissionCardProps = {
  mission: Mission;
  progress: number;
  completedActions: number;
};

function MissionCard({
  mission,
  progress,
  completedActions,
}: MissionCardProps) {
  return (
    <Drawer
      trigger={
        <button
          type="button"
          key={mission.id}
          className="w-full rounded-component bg-card p-3 text-start transition-opacity hover:opacity-80 active:opacity-60"
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
      }
    >
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

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div className="rounded-component bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <CalendarDaysIcon className="size-4" />
            <span className="text-xs">Deadline</span>
          </div>

          <p className="mt-2 font-medium">{formatDate(mission.deadline)}</p>
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
                    action.isDone ? "text-muted-foreground line-through" : ""
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

        <Drawer.Close
          render={
            <Button
              type="button"
              variant="primary"
              className="w-full justify-center"
              render={
                <Link
                  className="flex flex-1"
                  href={`/missions/new?editId=${mission.id}`}
                >
                  Edit
                </Link>
              }
            />
          }
        />
      </div>
    </Drawer>
  );
}

export default MissionCard;
