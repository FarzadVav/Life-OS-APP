import { ComponentProps } from "react";

import { cn } from "@/features/general/lib/utils";

type TopBarTitleProps = ComponentProps<"h1">;

function TopBarTitle({ className, ...p }: TopBarTitleProps) {
  return (
    <h1
      className={cn(
        "text-xl font-bold text-center absolute left-1/2 -translate-x-1/2",
        className,
      )}
      {...p}
    />
  );
}

export default TopBarTitle;
