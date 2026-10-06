"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { useLocale } from "../LocaleProvider/LocaleProvider";

export default function PwaManager() {
  const { t } = useLocale();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  // Register service worker and handle lifecycle updates
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      })
      .then((registration) => {
        // Detect waiting worker on initial load
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setUpdateAvailable(true);
        }

        // Check for incoming updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker);
                setUpdateAvailable(true);
              }
            });
          }
        });
      })
      .catch((err) => {
        console.error("ServiceWorker registration failed: ", err);
      });

    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    }
    setUpdateAvailable(false);
  };

  return (
    <AnimatePresence>
      {updateAvailable && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="fixed bottom-20 inset-x-4 max-w-sm mx-auto z-50 p-4 rounded-2xl bg-card border border-foreground/20 shadow-2xl flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="size-5 text-amber-400 shrink-0" />
            <div className="text-xs">
              <p className="font-semibold text-foreground">{t("pwa.updateAvailable")}</p>
              <p className="text-foreground/70">{t("pwa.freshVersion")}</p>
            </div>
          </div>
          <button
            onClick={handleUpdate}
            type="button"
            className="px-3 py-1.5 rounded-full bg-foreground text-background text-xs font-semibold hover:bg-foreground/90 transition-colors shrink-0"
          >
            {t("pwa.refresh")}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
