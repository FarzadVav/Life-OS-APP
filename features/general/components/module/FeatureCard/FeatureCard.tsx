"use client";

import { Button, ButtonProps } from "../../ui/Button";
import useLink from "@/features/general/hooks/useLink";

type FeatureCardProps = ButtonProps & {
  name: string;
  href: string;
  description?: string;
};

function FeatureCard({
  name,
  href,
  onClick,
  description,
  ...p
}: FeatureCardProps) {
  const { navigate } = useLink();

  return (
    <Button
      size={"card"}
      variant={"card"}
      onClick={(ev) => navigate(href, onClick, ev)}
      {...p}
    >
      <p className="font-bold text-lg text-center">{name}</p>
      {description?.trim() ? (
        <p className="text-center text-muted-foreground">{description}</p>
      ) : null}
    </Button>
  );
}

export default FeatureCard;
