import Link from "next/link";
import { PlusIcon } from "lucide-react";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import { Button } from "@/features/general/components/ui/Button/Button";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";

function HabitsPage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Disciplines</TopBar.Title>
        <TopBar.Btn backIcon href="/" position="left" />
      </TopBar>

      <PageItemsWrapper>
        <Button
          variant={"soft"}
          color={"foreground"}
          render={<Link href={"/disciplines/new"} />}
        >
          <PlusIcon />
          <span>New Discipline</span>
        </Button>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default HabitsPage;
