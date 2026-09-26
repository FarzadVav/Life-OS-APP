"use client";

import { LoaderIcon } from "lucide-react";
import { PropsWithChildren, useEffect, useState } from "react";

function SplashScreen({ children }: PropsWithChildren) {
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      document.body.classList.remove("overflow-hidden");

      queueMicrotask(() => setIsPaused(true));
    }, 2_000);
  }, []);

  return (
    <>
      {isPaused ? null : (
        <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-background">
          <div className="flex items-center justify-center gap-1.5">
            <p className="title">Arrow up</p>
            <LoaderIcon className="size-5 opacity-50 animate-spin -translate-y-px" />
          </div>
        </div>
      )}
      {children}
    </>
  );
}

export default SplashScreen;
