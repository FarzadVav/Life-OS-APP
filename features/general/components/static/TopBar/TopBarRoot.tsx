import { ComponentProps } from "react";

import { cn } from "@/features/general/lib/utils";

type TopBarRootProps = ComponentProps<"header">;

function TopBarRoot({ className, ...p }: TopBarRootProps) {
  return <header className={cn("h-16 p-3", className)} {...p}></header>;
}

export default TopBarRoot;
