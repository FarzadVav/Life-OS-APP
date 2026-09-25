import { PropsWithChildren } from "react";

function PageItemsWrapper(p: PropsWithChildren) {
  return (
    <div className="flex flex-col justify-start items-start gap-3" {...p} />
  );
}

export default PageItemsWrapper;
