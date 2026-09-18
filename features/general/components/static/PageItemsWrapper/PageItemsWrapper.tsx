import { PropsWithChildren } from "react";

function PageItemsWrapper(p: PropsWithChildren) {
  return <div className="px-3 pb-6 flex flex-col gap-3" {...p} />;
}

export default PageItemsWrapper;
