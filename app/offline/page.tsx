"use client";

import { useEffect, useState } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

import { Button } from "@/features/general/components/ui/Button/Button";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

export default function OfflinePage() {
  const { t } = useLocale();
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      window.location.reload();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    window.location.reload();
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-container bg-card border border-foreground/15 p-6 sm:p-8 flex flex-col items-center text-center shadow-lg">
        <div className="size-16 rounded-container bg-card-thick border border-foreground/10 flex items-center justify-center mb-5 text-foreground">
          <WifiOff className="size-8" />
        </div>

        <h1 className="text-xl font-bold text-foreground">
          {t("offline.title")}
        </h1>

        <p className="mt-2 text-xs sm:text-sm text-foreground/60 leading-relaxed">
          {t("offline.description")}
        </p>

        <Button
          variant="primary"
          onClick={handleRetry}
          disabled={isRetrying}
          className="mt-6 w-full h-10 rounded-container text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
        >
          <RefreshCw className={`size-4 ${isRetrying ? "animate-spin" : ""}`} />
          <span>{t("offline.retry")}</span>
        </Button>
      </div>
    </main>
  );
}
