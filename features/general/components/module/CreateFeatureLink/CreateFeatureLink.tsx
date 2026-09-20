"use client";

import { cn } from "cn";
import { PlusIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button, ButtonProps } from "../../ui/Button";
import useLink from "@/features/general/hooks/useLink";
import { FeaturesAreas } from "@/features/general/lib/types";

type CreateFeatureLinkProps = Omit<ButtonProps, "children"> & {
  featureArea: FeaturesAreas;
};

function CreateFeatureLink({
  onClick,
  className,
  featureArea,
  ...p
}: CreateFeatureLinkProps) {
  const { navigate } = useLink();

  const [btnWidth, setBtnWidth] = useState(0);
  const [isReached, setIsReached] = useState(false);

  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!btnWidth && btnRef.current) {
      setBtnWidth(btnRef.current.scrollWidth);
    }

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      queueMicrotask(() =>
        setIsReached(scrollTop + clientHeight >= scrollHeight - 52),
      );
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Button
      ref={btnRef}
      variant={"default"}
      onClick={(ev) => navigate(`/${featureArea}/new`, onClick, ev)}
      className={cn(
        "rounded-full min-w-max max-w-full sticky z-10 bottom-26 mx-auto transition-all",
        className,
      )}
      style={{
        width: isReached ? "100%" : btnWidth,
      }}
      {...p}
    >
      <span className="capitalize">new {featureArea}</span>
      <PlusIcon />
    </Button>
  );
}

export default CreateFeatureLink;
