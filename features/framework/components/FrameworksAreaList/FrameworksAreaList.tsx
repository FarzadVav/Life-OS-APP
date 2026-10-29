"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CompassIcon, FolderOpenIcon, type LucideIcon } from "lucide-react";

import { useLifeAreas } from "@/features/life-areas/hooks/useLifeAreas";
import { useFrameworks } from "../../hooks/useFrameworks";
import { UNSET_LIFE_AREA_SLUG } from "@/features/general/lib/lifeAreaSlug";
import CardView from "@/features/general/components/ui/CardView/CardView";
import EmptyAlert from "@/features/general/components/static/EmptyAlert";
import Skeleton from "@/features/general/components/ui/Skeleton";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";
import { stripHtml } from "@/features/general/lib/richText";

export function FrameworksAreaList() {
  const { t } = useLocale();
  const { lifeAreas, isLoading: isLoadingAreas } = useLifeAreas();
  const { frameworks, isLoading: isLoadingFrameworks } = useFrameworks();

  const countByArea = useMemo(() => {
    const counts = new Map<number, number>();
    let general = 0;

    frameworks.forEach((framework) => {
      if (framework.lifeAreaId) {
        counts.set(framework.lifeAreaId, (counts.get(framework.lifeAreaId) ?? 0) + 1);
      } else {
        general += 1;
      }
    });

    return { counts, general };
  }, [frameworks]);

  const isLoading =
    (isLoadingAreas || isLoadingFrameworks) && lifeAreas.length === 0;

  const renderCard = (
    key: string,
    href: string,
    Icon: LucideIcon,
    title: string,
    description: string,
    count: number,
  ) => (
    <Link key={key} href={href} className="block">
      <CardView
        icon={
          <div className="size-10 rounded-full bg-foreground/5 flex items-center justify-center shrink-0 text-foreground">
            <Icon className="size-5" />
          </div>
        }
        title={title}
        description={description}
        date={
          <span>
            {count} {t("framework.countSuffix")}
          </span>
        }
      />
    </Link>
  );

  if (isLoading) {
    return (
      <div className="w-full space-y-2.5">
        <Skeleton count={3} />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2.5">
      {lifeAreas.length === 0 && (
        <EmptyAlert
          icon={<CompassIcon className="size-5 text-foreground/40" />}
          alert={t("lifeAreas.empty")}
          description={t("lifeAreas.subtitle")}
          className="p-8"
        />
      )}

      {lifeAreas.map((area) =>
        renderCard(
          String(area.id),
          `/framework/${area.id}`,
          CompassIcon,
          area.title,
          stripHtml(area.vision) || t("framework.areaDesc"),
          countByArea.counts.get(area.id) ?? 0,
        ),
      )}

      {renderCard(
        UNSET_LIFE_AREA_SLUG,
        `/framework/${UNSET_LIFE_AREA_SLUG}`,
        FolderOpenIcon,
        t("common.general"),
        t("framework.generalDesc"),
        countByArea.general,
      )}
    </div>
  );
}

export default FrameworksAreaList;
