"use client";

import { useOffline } from "next/offline";
import { WifiOff, Loader2 } from "lucide-react";

import { useLocale } from "../LocaleProvider/LocaleProvider";

interface ConnectivityFallbackProps {
  message?: string;
}

export default function ConnectivityFallback({
  message,
}: ConnectivityFallbackProps) {
  const isOffline = useOffline();
  const { t } = useLocale();
  const resolvedMessage = message ?? t("common.waitingConnection");

  if (isOffline) {
    return (
      <div
        role="status"
        className="w-full py-8 px-4 rounded-container bg-card border border-foreground/20 flex flex-col items-center justify-center text-center gap-2 text-foreground/80"
      >
        <div className="size-9 rounded-container bg-card-thick flex items-center justify-center text-foreground">
          <WifiOff className="size-4" />
        </div>
        <p className="text-xs font-semibold text-foreground">{resolvedMessage}</p>
        <p className="text-[11px] text-foreground/50">
          {t("offlineBanner.streamIn")}
        </p>
      </div>
    );
  }

  return (
    <div
      role="status"
      className="w-full py-8 flex items-center justify-center gap-2 text-xs text-foreground/60"
    >
      <Loader2 className="size-4 animate-spin" />
      <span>{t("common.loading")}</span>
    </div>
  );
}
