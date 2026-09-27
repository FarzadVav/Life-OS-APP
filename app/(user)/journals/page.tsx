import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

import TopBar from "@/features/general/components/static/TopBar/TopBar";
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
        <Link
          href={"/journals/event-logs"}
          className="w-full flex items-center justify-between gap-3 p-3 rounded-component bg-card"
        >
          <div>
            <p className="font-bold">Event Logs</p>
            <span className="sub-text">12 Items</span>
          </div>
          <ChevronRightIcon className="size-5" />
        </Link>
        <Link
          href={"/journals/soft-skills"}
          className="w-full flex items-center justify-between gap-3 p-3 rounded-component bg-card"
        >
          <div>
            <p className="font-bold">Soft Skills</p>
            <span className="sub-text">7 Items</span>
          </div>
          <ChevronRightIcon className="size-5" />
        </Link>
        <Link
          href={"/journals/sources"}
          className="w-full flex items-center justify-between gap-3 p-3 rounded-component bg-card"
        >
          <div>
            <p className="font-bold">Sources</p>
            <span className="sub-text">20 Items</span>
          </div>
          <ChevronRightIcon className="size-5" />
        </Link>
        <Link
          href={"/journals/ideas"}
          className="w-full flex items-center justify-between gap-3 p-3 rounded-component bg-card"
        >
          <div>
            <p className="font-bold">Ideas</p>
            <span className="sub-text">3 Items</span>
          </div>
          <ChevronRightIcon className="size-5" />
        </Link>
        <Link
          href={"/journals/future"}
          className="w-full flex items-center justify-between gap-3 p-3 rounded-component bg-card"
        >
          <div>
            <p className="font-bold">Future</p>
            <span className="sub-text">18 Items</span>
          </div>
          <ChevronRightIcon className="size-5" />
        </Link>

        <CreateBtn withPlusIcon href="/journals/new">
          New Journal
        </CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default JournalsPage;
