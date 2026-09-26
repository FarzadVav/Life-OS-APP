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
          href={"/journals/logs"}
          className="w-full flex items-center justify-between gap-3 p-3 rounded-component bg-card"
        >
          <div>
            <p className="font-bold">Logs</p>
            <p className="sub-text">Events, feelings, thoughts</p>
          </div>
          <ChevronRightIcon className="size-5" />
        </Link>
        <Link
          href={"/journals/skills"}
          className="w-full flex items-center justify-between gap-3 p-3 rounded-component bg-card"
        >
          <div>
            <p className="font-bold">Skills</p>
            <p className="sub-text">Personal dev, Success, Communations</p>
          </div>
          <ChevronRightIcon className="size-5" />
        </Link>
        <Link
          href={"/journals/vault"}
          className="w-full flex items-center justify-between gap-3 p-3 rounded-component bg-card"
        >
          <div>
            <p className="font-bold">Vault</p>
            <p className="sub-text">Informations, Resources, Recipes</p>
          </div>
          <ChevronRightIcon className="size-5" />
        </Link>
        <Link
          href={"/journals/sparks"}
          className="w-full flex items-center justify-between gap-3 p-3 rounded-component bg-card"
        >
          <div>
            <p className="font-bold">Sparks</p>
            <p className="sub-text">Future ideas, Goals, Wishes</p>
          </div>
          <ChevronRightIcon className="size-5" />
        </Link>

        <CreateBtn withPlusIcon href="/journals/vault">
          New Journal
        </CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default JournalsPage;
