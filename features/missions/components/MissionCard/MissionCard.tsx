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
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

function Difficulty({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className={`h-1.5 w-1/5 rounded-xs ${
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
  const { formatDate, t } = useLocale();

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
                  {t("dates.to")} {formatDate(mission.deadline)}
                </span>

                <span className="sub-text">•</span>

                <span className="sub-text">{progress}%</span>
              </div>
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-container bg-card-thick">
            <motion.div
              initial={{ width: 6 }}
              className="h-full rounded-container bg-foreground"
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
          <span className="font-bold">{t("common.progress")}</span>

          <span className="sub-text text-sm">
            {completedActions} / {mission.actions.length}
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-container bg-card mt-1.5">
          <motion.div
            initial={{ width: 0 }}
            className="h-full rounded-container bg-foreground"
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
            <span>{t("common.deadline")}</span>
          </div>

          <p className="mt-2">{formatDate(mission.deadline)}</p>
        </div>

        <div className="rounded-component bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <GaugeIcon className="size-4" />
            <span>{t("missions.difficulty")}</span>
          </div>

          <div className="mt-3">
            <Difficulty value={mission.difficulty} />
          </div>
        </div>

        <div className="rounded-component bg-background p-3">
          <div className="flex items-center gap-2 sub-text">
            <CheckIcon className="size-4" />
            <span>{t("missions.actionsLabel")}</span>
          </div>

          <p className="mt-2">{mission.actions.length}</p>
        </div>
      </div>

      <section className="space-y-3">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="font-bold">{t("missions.actionsLabel")}</h3>

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
                <div className="flex size-5 items-center justify-center rounded-component bg-foreground">
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
            <h3 className="font-bold">{t("missions.disciplines")}</h3>

            <span className="sub-text">{mission.disciplines.length}</span>
          </div>

          <p className="sub-text mt-0.5">
            Repeated behaviors that support the mission
          </p>
        </div>

        {mission.disciplines.map((discipline) => (
          <div
            key={discipline.id}
            className="flex flex-col gap-3 rounded-component bg-background p-3"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-card">
                <Repeat2Icon className="size-4" />
              </div>

              <div className="flex-1 h-10 flex justify-between items-start flex-col">
                <p>{discipline.title}</p>

                <p className="sub-text">{discipline.repeatInterval}</p>
              </div>
            </div>

            <div className="flex gap-2 w-full mt-1">
              <Button
                type="button"
                variant="outline"
                className="flex-1 justify-center py-1.5 h-auto text-xs bg-card-thick text-foreground hover:bg-card-thick/80 border-foreground/20"
                onClick={() => console.log('I Do:', discipline.title)}
              >
                I Do
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1 justify-center py-1.5 h-auto text-xs bg-card-thick text-foreground/70 hover:bg-card-thick/80 border-foreground/20"
                onClick={() => console.log("I Don't Do:", discipline.title)}
              >
                I Don't Do
              </Button>
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
                  <span>{t("common.edit")}</span>
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
