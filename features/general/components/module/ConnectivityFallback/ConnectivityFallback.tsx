"use client";

import { useOffline } from "next/offline";
import { WifiOff, Loader2 } from "lucide-react";

interface ConnectivityFallbackProps {
  message?: string;
}

export default function ConnectivityFallback({
  message = "Waiting for connection to load this section...",
}: ConnectivityFallbackProps) {
  const isOffline = useOffline();

  if (isOffline) {
    return (
      <div
        role="status"
        className="w-full py-8 px-4 rounded-2xl bg-card border border-amber-500/20 flex flex-col items-center justify-center text-center gap-2 text-foreground/80"
      >
        <div className="size-9 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
          <WifiOff className="size-4" />
        </div>
        <p className="text-xs font-semibold text-foreground">{message}</p>
        <p className="text-[11px] text-foreground/50">
          Content will stream in automatically once back online.
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
      <span>Loading...</span>
    </div>
  );
}
