import { Suspense } from "react";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";
import ConnectivityFallback from "@/features/general/components/module/ConnectivityFallback/ConnectivityFallback";
import SkillsTabs from "@/features/skills/components/SkillsTabs/SkillsTabs";

function SkillsPage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Skills</TopBar.Title>
        <TopBar.Btn backIcon href="/" position="left" />
      </TopBar>

      <PageItemsWrapper>
        <Suspense
          fallback={
            <ConnectivityFallback message="Waiting for connection to load skills..." />
          }
        >
          <SkillsTabs />
        </Suspense>

        <p className="sub-text w-full text-center">
          Consistent practice transforms knowledge into mastery.
        </p>

        <CreateBtn href="/skills/new">New Skill</CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default SkillsPage;
