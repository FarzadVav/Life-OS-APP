import { cn } from "cn";
import Link from "next/link";
import { ComponentProps } from "react";

type CardProps = ComponentProps<typeof Link> & {
  name: string;
  href: string;
  description?: string;
};

function Card({ className, name, description, ...p }: CardProps) {
  return (
    <Link
      className={cn(
        "flex flex-col justify-center items-center gap-1.5 p-3 bg-card rounded-xl",
        className,
      )}
      {...p}
    >
      <p className="font-bold text-lg text-center">{name}</p>
      {description?.trim() ? (
        <p className="text-center text-muted-foreground">{description}</p>
      ) : null}
    </Link>
  );
}

export default Card;
