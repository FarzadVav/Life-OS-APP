import { ComponentProps } from "react";

import { cn } from "cn";

type TopBarCapsuleProps = ComponentProps<"div">;

function TopBarCapsule({ className, ...p }: TopBarCapsuleProps) {
  return (
    <div
      className={cn(
        "h-13 p-3 bg-card border-2 flex items-center justify-between relative w-full rounded-full",
        className,
      )}
      {...p}
    />
  );
}

export default TopBarCapsule;
