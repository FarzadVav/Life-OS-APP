import { Mission } from "@/features/missions/types";
import { missions } from "@/features/missions/constants";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import MissionCard from "@/features/missions/components/MissionCard/MissionCard";
import PageActionBtn from "@/features/general/components/module/PageActionBtn/PageActionBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import { getTranslations } from "@/features/general/lib/i18n/server";

async function MissionsPage() {
  const { t } = await getTranslations();
  const getProgress = (mission: Mission) => {
    const total = mission.actions.length;

    if (!total) {
      return 0;
    }

    const completed = mission.actions.filter((action) => action.isDone).length;

    return Math.round((completed / total) * 100);
  };

  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>{t("missions.title")}</TopBar.Title>
        <TopBar.Btn backIcon href="/" position="left" />
        <TopBar.HelpBtn position="right" />
      </TopBar>

      <PageItemsWrapper>
        {missions.map((mission) => {
          const progress = getProgress(mission);
          const completedActions = mission.actions.filter(
            (action) => action.isDone,
          ).length;

          return (
            <MissionCard
              key={mission.id}
              mission={mission}
              progress={progress}
              completedActions={completedActions}
            />
          );
        })}

        {missions.length === 0 && (
          <div
            className="
              flex w-full flex-1
              items-center justify-center
              rounded-container
              border-2 border-dashed
              p-3
            "
          >
            <p>{t("missions.empty")}</p>
          </div>
        )}

        <p className="sub-text w-full text-center">
          {t("missions.subtitle")}
        </p>

        <PageActionBtn href="/missions/new">{t("missions.new")}</PageActionBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default MissionsPage;
