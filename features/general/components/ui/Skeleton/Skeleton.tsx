import { ComponentProps } from "react";
import { cn } from "cn";

export type SkeletonProps = ComponentProps<"div"> & {
  count?: number;
};

export function Skeleton({
  count = 1,
  className,
  ...props
}: SkeletonProps) {
  if (count > 1) {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={cn("skeleton h-[64px]", className)}
            aria-hidden="true"
            {...props}
          />
        ))}
      </>
    );
  }

  return (
    <div
      className={cn("skeleton h-[64px]", className)}
      aria-hidden="true"
      {...props}
    />
  );
}

export default Skeleton;
