import { ComponentProps } from "react";

import { cn } from "@/features/general/lib/utils";

type TopBarRootProps = ComponentProps<"header">;

function TopBarRoot({ className, ...p }: TopBarRootProps) {
  return (
    <header
      className={cn(
        "h-19 flex items-center justify-center px-3 py-6",
        className,
      )}
      {...p}
    ></header>
  );
}

export default TopBarRoot;
