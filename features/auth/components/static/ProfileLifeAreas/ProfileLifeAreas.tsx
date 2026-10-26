"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { Button } from "@/features/general/components/ui/Button/Button";
import { useLifeAreas } from "../../../../life-areas/hooks/useLifeAreas";
import EmptyAlert from "@/features/general/components/static/EmptyAlert";
import Skeleton from "@/features/general/components/ui/Skeleton";
import { LifeAreaCard } from "../../../../life-areas/components/LifeAreaCard/LifeAreaCard";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

export function ProfileLifeAreas() {
  const { t } = useLocale();
  const { lifeAreas, isLoading } = useLifeAreas();

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <p className="title">{t("lifeAreas.title")}</p>

        <Button
          type="button"
          variant="card"
          nativeButton={false}
          render={
            <Link href={"/profile/new-life-area"}>
              <PlusIcon />
              <span>{t("common.add")}</span>
            </Link>
          }
        />
      </div>

      {isLoading ? (
        <Skeleton />
      ) : lifeAreas.length === 0 ? (
        <EmptyAlert
          alert={t("lifeAreas.empty")}
          href="/profile/life-areas/new"
        />
      ) : (
        lifeAreas.map((area) => <LifeAreaCard key={area.id} lifeArea={area} />)
      )}
    </div>
  );
}

export default ProfileLifeAreas;
