"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
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
      <AnimatePresence>
        {isPaused ? (
          <motion.div
            key={"root"}
            className="root"
            transition={{ duration: 0.5 }}
            initial={{ opacity: 0, filter: "blur(5px)" }}
            animate={{ opacity: 1, filter: "none" }}
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key={"splash"}
            transition={{ duration: 0.15 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="fixed inset-0 z-50 flex h-dvh w-screen items-center justify-center flex-col gap-3 bg-background"
          >
            <motion.div
              initial={{ scale: 0, translateY: "50%", opacity: 0 }}
              animate={{ scale: 1, translateY: 0, opacity: 1 }}
            >
              <Image
                width={200}
                height={200}
                alt="Arrow Up"
                className="rounded-full"
                src={"/images/arrow-up_logo.jpg"}
              />
            </motion.div>
            <motion.p
              transition={{ delay: 0.15 }}
              className="text-3xl font-bold z-10"
              initial={{ scale: 0, translateY: "50%", opacity: 0 }}
              animate={{ scale: 1, translateY: 0, opacity: 1 }}
            >
              Arrow Up
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SplashScreen;
