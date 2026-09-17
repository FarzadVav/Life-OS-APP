"use client";

import Link from "next/link";
import { ViewTransition } from "react";

import { Button } from "../../ui/button";
import { NAVIGATION_LINKS } from "@/features/general/lib/constant";
import useCheckIsPathnameMatch from "@/features/general/hooks/useCheckIsPathnameMatch";

function Navigation() {
  const checkIsPathnameMatch = useCheckIsPathnameMatch();

  return (
    <nav className="h-20 bg-card border-t-2 flex items-center justify-center gap-3">
      {NAVIGATION_LINKS.map((item) => {
        const isPathnameMatch = checkIsPathnameMatch(item.matchPathname);

        return (
          <Link key={item.href} href={item.href} className="size-full">
            <Button
              variant={"ghost"}
              className={"size-full rounded-none flex-col relative"}
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
          </Link>
        );
      })}
    </nav>
  );
}

export default Navigation;
