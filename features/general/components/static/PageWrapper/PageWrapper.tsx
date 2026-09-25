import { PropsWithChildren } from "react";

function PageWrapper(p: PropsWithChildren) {
  return <div className="p-3 py-6 flex flex-col gap-6" {...p} />;
}

export default PageWrapper;
