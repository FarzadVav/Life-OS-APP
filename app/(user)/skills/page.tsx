import { skills } from "@/features/skills/constants";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import SkillCard from "@/features/skills/components/SkillCard/SkillCard";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";

function SkillsPage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Skills</TopBar.Title>
        <TopBar.Btn backIcon href="/" position="left" />
      </TopBar>

      <PageItemsWrapper>
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}

        {skills.length === 0 && (
          <div
            className="
              flex w-full flex-1
              items-center justify-center
              rounded-component
              border-2 border-dashed
              p-3
            "
          >
            <p>You haven{"'"}t any skills</p>
          </div>
        )}

        <p className="sub-text w-full text-center">
          Consistent practice transforms knowledge into mastery.
        </p>

        <CreateBtn href="/skills/new">New Skill</CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default SkillsPage;
