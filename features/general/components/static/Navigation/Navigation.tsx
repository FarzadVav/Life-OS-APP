"use client";

import Link from "next/link";
import { ViewTransition } from "react";

import useLink from "@/features/general/hooks/useLink";
import { NAVIGATION_LINKS } from "@/features/general/lib/constants";
import useCheckIsPathnameMatch from "@/features/general/hooks/useCheckIsPathnameMatch";
import { Button } from "../../ui/Button";

function Navigation() {
  const checkIsPathnameMatch = useCheckIsPathnameMatch();

  const { navigate } = useLink();

  return (
    <nav className="h-20 bg-card border-t-2 flex items-center justify-center gap-3 z-20 sticky bottom-0">
      {NAVIGATION_LINKS.map((item) => {
        const isPathnameMatch = checkIsPathnameMatch(item.matchPathname);

        return (
          <Button
            key={item.href}
            variant={"ghost"}
            onClick={() => navigate(item.href)}
            className="h-full flex-1 flex-col rounded-none"
          >
            {
              <item.Icon
                className={`transition-opacity -translate-y-2 ${isPathnameMatch ? "" : "opacity-50"}`}
              />
            }
            {isPathnameMatch ? (
              <ViewTransition>
                <span className="absolute bottom-2">{item.name}</span>
              </ViewTransition>
            ) : null}
          </Button>
        );
      })}
    </nav>
  );
}

export default Navigation;
