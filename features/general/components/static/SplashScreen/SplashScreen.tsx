"use client";

import { PropsWithChildren, useEffect, useState, ViewTransition } from "react";

function SplashScreen({ children }: PropsWithChildren) {
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      queueMicrotask(() => setIsPaused(true));
    }, 1_500);
  }, []);

  return (
    <>
      {isPaused ? null : (
        <ViewTransition default="none" enter="splash-enter" exit="splash-exit">
          <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-background">
            <p className="splash-title">Chaste Brain</p>
          </div>
        </ViewTransition>
      )}
      {children}
    </>
  );
}

export default SplashScreen;
