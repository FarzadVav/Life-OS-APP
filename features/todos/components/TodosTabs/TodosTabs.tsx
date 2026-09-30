"use client";

import Link from "next/link";
import { useMounted } from "@mantine/hooks";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/features/general/components/ui/Button/Button";

function TodosTabs() {
  const isMounted = useMounted();

  const sp = useSearchParams();

  const tab = sp.get("tab");
  const activeTab = tab === "upcoming" ? "upcoming" : "today";

  return (
    <>
      <div className="w-full flex rounded-full">
        <Button
          nativeButton={false}
          className={"w-1/2 rounded-e-none"}
          render={<Link href={"?tab=today"} />}
          variant={activeTab === "today" ? "primary" : "card"}
        >
          Today
        </Button>
        <Button
          nativeButton={false}
          className={"w-1/2 rounded-s-none"}
          render={<Link href={"?tab=upcoming"} />}
          variant={activeTab === "upcoming" ? "primary" : "card"}
        >
          Upcoming
        </Button>
      </div>

      <div className="w-full overflow-hidden rounded-component">
        <AnimatePresence mode="wait">
          {activeTab === "today" ? (
            <motion.div
              key={"today"}
              className="w-full space-y-3"
              transition={{ ease: "linear", duration: 0.1 }}
              initial={{ translateX: "-10%", opacity: 0, filter: "blur(5px)" }}
              animate={{ translateX: 0, opacity: 1, filter: "none" }}
              exit={{ translateX: "-10%", opacity: 0, filter: "blur(5px)" }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full space-y-1 p-3 rounded-component bg-card"
                >
                  <p className="font-bold">
                    Make the SaaS and sell to 100 customers
                  </p>
                  <span className="sub-text">
                    {isMounted ? `To ${new Date().toLocaleTimeString()}` : null}
                  </span>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={"upcoming"}
              className="w-full space-y-3"
              transition={{ ease: "linear", duration: 0.1 }}
              initial={{ translateX: "10%", opacity: 0, filter: "blur(5px)" }}
              animate={{ translateX: 0, opacity: 1, filter: "none" }}
              exit={{ translateX: "10%", opacity: 0, filter: "blur(5px)" }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full space-y-1 p-3 rounded-component bg-card"
                >
                  <p className="font-bold">
                    Make the SaaS and sell to 100 customers
                  </p>
                  <span className="sub-text">
                    {isMounted ? `To ${new Date().toLocaleDateString()}` : null}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-3 border-2 w-full flex-1 border-dashed rounded-component flex justify-center items-center">
        <p>You haven{"'"}t any todos</p>
      </div>
    </>
  );
}

export default TodosTabs;
