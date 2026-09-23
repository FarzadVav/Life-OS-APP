"use client";

import { PropsWithChildren, useEffect, useState } from "react";

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
        <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-background">
          <p className="title">Life OS</p>
        </div>
      )}
      {children}
    </>
  );
}

export default SplashScreen;
