import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
import { Button } from "@/features/general/components/ui/Button/Button";
import CreateBtn from "@/features/general/components/module/CreateBtn/CreateBtn";
import PageWrapper from "@/features/general/components/static/PageWrapper/PageWrapper";
import PageItemsWrapper from "@/features/general/components/static/PageItemsWrapper/PageItemsWrapper";

function JournalsPage() {
  return (
    <PageWrapper>
      <TopBar>
        <TopBar.Title asTitle>Journals</TopBar.Title>
        <TopBar.Btn backIcon href="/" position="left" />
      </TopBar>

      <PageItemsWrapper>
        <Button
          variant={"soft"}
          color={"foreground"}
          className={"w-full justify-between"}
          render={<Link href={"/journals/event-logs"} />}
        >
          <p className="font-bold">Event Logs</p>
          <ChevronRightIcon className="size-5" />
        </Button>
        <Button
          variant={"soft"}
          color={"foreground"}
          className={"w-full justify-between"}
          render={<Link href={"/journals/soft-skills"} />}
        >
          <p className="font-bold">Soft Skills</p>
          <ChevronRightIcon className="size-5" />
        </Button>
        <Button
          variant={"soft"}
          color={"foreground"}
          className={"w-full justify-between"}
          render={<Link href={"/journals/sources"} />}
        >
          <p className="font-bold">Sources</p>
          <ChevronRightIcon className="size-5" />
        </Button>
        <Button
          variant={"soft"}
          color={"foreground"}
          className={"w-full justify-between"}
          render={<Link href={"/journals/ideas"} />}
        >
          <p className="font-bold">Ideas</p>
          <ChevronRightIcon className="size-5" />
        </Button>
        <Button
          variant={"soft"}
          color={"foreground"}
          className={"w-full justify-between"}
          render={<Link href={"/journals/future"} />}
        >
          <p className="font-bold">Future</p>
          <ChevronRightIcon className="size-5" />
        </Button>

        <CreateBtn withPlusIcon href="/journals/new">
          New Journal
        </CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default JournalsPage;
