"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  CalendarDaysIcon,
  CalendarIcon,
  CheckIcon,
  ChevronRightIcon,
  CircleIcon,
  GaugeIcon,
  Repeat2Icon,
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
          className={`h-1.5 w-1/5 rounded-full ${
            index < value ? "bg-foreground" : "bg-card-thick"
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
      nativeButton={false}
      trigger={
        <div
          key={mission.id}
          className="w-full rounded-component bg-card p-3 transition-opacity hover:opacity-90"
        >
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-bold">{mission.title}</p>

              <div className="mt-1 flex items-center gap-2">
                <span className="sub-text text-sm">
                  To {formatDate(mission.deadline)}
                </span>

                <span className="sub-text">•</span>

                <span className="sub-text">{progress}%</span>
              </div>
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-card-thick">
            <motion.div
              initial={{ width: 6 }}
              className="h-full rounded-full bg-foreground"
              transition={{ duration: 1, ease: "easeOut" }}
              animate={{ width: progress ? `${progress}%` : 6 }}
            />
          </div>
        </div>
      }
    >
      <Drawer.Title className="title">{mission.title}</Drawer.Title>

      <div className="rounded-component bg-background p-3">
        <div className="flex items-center justify-between">
          <span className="font-bold">Progress</span>

          <span className="sub-text text-sm">
            {completedActions} / {mission.actions.length}
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-card mt-1.5">
          <motion.div
            initial={{ width: 0 }}
            className="h-full rounded-full bg-foreground"
            transition={{ duration: 1, ease: "easeOut" }}
            animate={{ width: progress ? `${progress}%` : 6 }}
          />
        </div>

        <p className="sub-text mt-1.5">{progress}% completed</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div className="rounded-component bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <CalendarDaysIcon className="size-4" />
            <span>Deadline</span>
          </div>

          <p className="mt-2">{formatDate(mission.deadline)}</p>
        </div>

        <div className="rounded-component bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <GaugeIcon className="size-4" />
            <span>Difficulty</span>
          </div>

          <div className="mt-3">
            <Difficulty value={mission.difficulty} />
          </div>
        </div>

        <div className="rounded-component bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <CheckIcon className="size-4" />
            <span>Actions</span>
          </div>

          <p className="mt-2">{mission.actions.length}</p>
        </div>
      </div>

      <section className="space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Actions</h3>

            <span className="sub-text">
              {completedActions}/{mission.actions.length}
            </span>
          </div>

          <p className="sub-text mt-0.5">
            Concrete results that move this mission forward
          </p>
        </div>

        {mission.actions.map((action) => (
          <div
            key={action.id}
            className="flex items-start gap-3 rounded-component bg-background p-3 transition-opacity hover:bg-background/90"
          >
            <div className="translate-y-0.5 shrink-0">
              {action.isDone ? (
                <div className="flex size-5 items-center justify-center rounded-full bg-foreground">
                  <CheckIcon className="size-3.5 text-background" />
                </div>
              ) : (
                <CircleIcon className="size-5 muted-text" />
              )}
            </div>

            <div className="flex-1">
              <p className={action.isDone ? "muted-text line-through" : ""}>
                {action.title}
              </p>

              <div className="mt-1 flex items-center gap-1.5 sub-text text-sm">
                <CalendarIcon className="size-3" />
                <span>{formatDate(action.deadline)}</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Disciplines</h3>

            <span className="sub-text">{mission.disciplines.length}</span>
          </div>

          <p className="sub-text mt-0.5">
            Repeated behaviors that support the mission
          </p>
        </div>

        {mission.disciplines.map((discipline) => (
          <div
            key={discipline.id}
            className="flex items-center gap-3 rounded-component bg-background p-3"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-card">
              <Repeat2Icon className="size-4" />
            </div>

            <div className="flex-1 h-10 flex justify-between items-start flex-col">
              <p>{discipline.title}</p>

              <p className="sub-text">{discipline.repeatInterval}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="flex gap-3">
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
          nativeButton={false}
          render={
            <Button
              type="button"
              variant="primary"
              nativeButton={false}
              className="w-full justify-center"
              render={
                <Link
                  className="flex flex-1"
                  href={`/missions/new?editId=${mission.id}`}
                >
                  <span>Edit</span>
                  <ChevronRightIcon />
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
