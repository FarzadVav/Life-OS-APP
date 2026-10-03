import { Mission } from "@/features/missions/types";
import { missions } from "@/features/missions/constants";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import MissionCard from "@/features/missions/components/MissionCard/MissionCard";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";

function MissionsPage() {
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
        <TopBar.Title asTitle>Missions</TopBar.Title>
        <TopBar.Btn backIcon href="/" position="left" />
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
    </PageWrapper>
  );
}

export default MissionsPage;
