"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren, useEffect, useRef } from "react";

function PageWrapper(p: PropsWithChildren) {
  const pathname = usePathname();

  const pageWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const navigationElem = document.getElementById("navigation");
    const createBtnElem = document.getElementById("create-btn");

    let minH = 0;
    let pb = 0.75;

    if (navigationElem) {
      minH += 5.5;
    }

    if (createBtnElem) {
      pb += 4;
    }

    if (pageWrapperRef.current) {
      pageWrapperRef.current.style.minHeight = minH
        ? `calc(100dvh - ${minH}rem)`
        : "100dvh";
      pageWrapperRef.current.style.paddingBottom = `${pb}rem`;
    }
  }, [pathname]);

  return (
    <div ref={pageWrapperRef} className="bg-red-500/20f p-3 pt-6 flex flex-col gap-6" {...p} />
  );
}

export default PageWrapper;
