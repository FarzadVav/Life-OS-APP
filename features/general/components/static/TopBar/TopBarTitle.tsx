import { HTMLAttributes, ViewTransition } from "react";

import { cn } from "cn";

type TopBarTitleProps = HTMLAttributes<HTMLElement> & {
  asTitle?: boolean;
};

function TopBarTitle({ className, asTitle, ...p }: TopBarTitleProps) {
  const Tag = asTitle ? "h1" : "div";

  return (
    <ViewTransition name="top-bar-title">
      <Tag
        className={cn(
          "absolute left-1/2 -translate-x-1/2",
          asTitle ? "text-lg font-bold text-center" : "",
          className,
        )}
        {...p}
      />
    </ViewTransition>
  );
}

export default TopBarTitle;
