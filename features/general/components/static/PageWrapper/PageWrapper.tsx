import { PropsWithChildren } from "react";

function PageWrapper(p: PropsWithChildren) {
  return <div className="h-full overflow-y-scroll" {...p} />;
}

export default PageWrapper;
