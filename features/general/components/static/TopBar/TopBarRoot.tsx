import { ComponentProps } from "react";

import { cn } from "cn";

type TopBarRootProps = ComponentProps<"header">;

function TopBarRoot({ className, ...p }: TopBarRootProps) {
  return (
    <header
      className={cn(
        "h-22 flex items-center justify-center p-3 pb-6",
        className,
      )}
      {...p}
    ></header>
  );
}

export default TopBarRoot;
