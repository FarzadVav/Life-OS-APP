import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";

import { JOURNAL_TYPES } from "@/features/journals/constants";
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
        {Object.keys(JOURNAL_TYPES).map((item) => (
          <Link
            key={item}
            href={`/journals/items?type=${item}`}
            className="w-full flex items-center justify-between gap-3 p-3 rounded-component bg-card"
          >
            <div>
              <p className="font-bold">{item}</p>
              <span className="sub-text">7 Items</span>
            </div>
            <ChevronRightIcon className="size-5" />
          </Link>
        ))}

        <CreateBtn withPlusIcon href="/journals/new">
          New Journal
        </CreateBtn>
      </PageItemsWrapper>
    </PageWrapper>
  );
}

export default JournalsPage;
