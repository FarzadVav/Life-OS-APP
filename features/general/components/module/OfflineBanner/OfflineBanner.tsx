"use client";

import { useSyncExternalStore, useState } from "react";
import { usePathname } from "next/navigation";
import { useOffline } from "next/offline";
import { WifiOff, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { useLocale } from "../LocaleProvider/LocaleProvider";

function subscribeOnlineStatus(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getOnlineSnapshot() {
  return navigator.onLine;
}

function getOnlineServerSnapshot() {
  return true;
}

export default function OfflineBanner() {
  const pathname = usePathname();
  const nextIsOffline = useOffline();
  const isOnline = useSyncExternalStore(
    subscribeOnlineStatus,
    getOnlineSnapshot,
    getOnlineServerSnapshot,
  );
  const [isRetrying, setIsRetrying] = useState(false);
  const { t } = useLocale();

  const isOffline = (nextIsOffline || !isOnline) && pathname !== "/offline";

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await fetch("/favicon.ico", { cache: "no-store", method: "HEAD" });
      window.location.reload();
    } catch {
      // Still offline
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.aside
          role="status"
          aria-live="polite"
          aria-label="Offline status banner"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed top-3 inset-x-3 z-important mx-auto max-w-lg rounded-component border border-foreground/20 bg-background/95 backdrop-blur-xl p-3 shadow-2xl text-xs text-foreground/90 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex items-center justify-center size-8 rounded-container bg-card-thick text-foreground shrink-0">
              <span className="absolute size-2 rounded-xs bg-foreground animate-ping opacity-75" />
              <WifiOff className="size-4 relative z-front" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-foreground text-xs leading-tight">
                {t("offline.mode")}
              </span>
              <span className="text-[11px] text-foreground/60 truncate leading-tight">
                {t("offlineBanner.pendingRetry")}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-component bg-card-thick hover:bg-card-thick/80 text-foreground font-medium text-[11px] transition-colors cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`size-3 ${isRetrying ? "animate-spin" : ""}`} />
            <span>{isRetrying ? t("offlineBanner.checking") : t("offlineBanner.retry")}</span>
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
