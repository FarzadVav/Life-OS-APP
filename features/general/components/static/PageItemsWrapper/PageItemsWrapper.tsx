import { PropsWithChildren } from "react";

function PageItemsWrapper(p: PropsWithChildren) {
  return <div className="flex flex-col gap-3" {...p} />;
}

export default PageItemsWrapper;
