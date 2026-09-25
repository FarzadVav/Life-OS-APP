"use client";

import { Button } from "../../ui/Button/Button";
import useLink from "@/features/general/hooks/useLink";
import { NAVIGATION_LINKS } from "@/features/general/lib/constants";
import useMatchPathname from "@/features/general/hooks/useMatchPathname";

function Navigation() {
  const checkIsPathnameMatch = useMatchPathname();

  const { navigate } = useLink();

  return (
    <div className="h-22 px-6 bg-linear-to-t from-background from-10% to-transparent flex items-center justify-center z-important sticky bottom-0">
      <nav className="w-full p-1 rounded-full h-16 bg-card-thick flex items-center justify-center gap-2">
        {NAVIGATION_LINKS.map((item) => {
          const isPathnameMatch = checkIsPathnameMatch(item.matchPathname);

          return (
            <Button
              key={item.href}
              color={"foreground"}
              className="h-full flex-1 flex-col"
              onClick={() => navigate(item.href)}
              variant={isPathnameMatch ? "soft" : "ghost"}
            >
              <item.Icon className={isPathnameMatch ? "" : ""} />
            </Button>
          );
        })}
      </nav>
    </div>
  );
}

export default Navigation;
