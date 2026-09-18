import { ComponentProps } from "react";

import { cn } from "cn";

type TopBarRootProps = ComponentProps<"header">;

function TopBarRoot({ className, ...p }: TopBarRootProps) {
  return (
    <header
      className={cn(
        "h-12 p-3 bg-card border-2 flex items-center justify-between relative w-full rounded-full",
        className,
      )}
      {...p}
    />
  );
}

export default TopBarRoot;
