"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Download,
  Share,
  PlusSquare,
  Sparkles,
  Wifi,
  Zap,
  CheckCircle2,
  MoreVertical,
  Layers,
} from "lucide-react";
import TopBar from "@/features/general/components/static/TopBar/TopBar";
import Dialog from "@/features/general/components/ui/Dialog/Dialog";
import { Button } from "@/features/general/components/ui/Button/Button";
import { usePwaInstall } from "@/features/general/hooks/usePwaInstall";
import { useLocale } from "@/features/general/components/module/LocaleProvider/LocaleProvider";

interface InstallAppDialogProps {
  position?: "left" | "right";
  className?: string;
}

export default function InstallAppDialog({
  position = "right",
  className,
}: InstallAppDialogProps) {
  const {
    isStandalone,
    isInstallable,
    isIOS,
    isAndroid,
    isMobile,
    installApp,
  } = usePwaInstall();
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  // Must NOT show in installed standalone PWA
  if (isStandalone) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const accepted = await installApp();
      if (accepted) {
        setInstalledSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
        }, 1200);
      }
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <>
      <TopBar.Btn
        position={position}
        onClick={() => setIsOpen(true)}
        className={className}
        aria-label={t("install.aria")}
        title={t("install.label")}
      >
        <span className="relative flex items-center justify-center">
          <Download className="size-5" />
          <span className="absolute -top-0.75 -right-0.75 size-1.5 rounded-full bg-emerald-400" />
        </span>
      </TopBar.Btn>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex flex-col gap-4 max-w-sm w-full p-1 sm:p-2">
          {/* Header */}
          <div className="flex items-center gap-3.5">
            <Image
              width={52}
              height={52}
              unoptimized
              alt={t("install.title")}
              src="/icons/icon-192x192.png"
              className="size-13 rounded-component object-cover shadow-md border border-foreground/10 shrink-0"
            />
            <div className="flex flex-col min-w-0">
              <Dialog.Title className="title text-foreground text-base sm:text-lg font-bold">
                {t("install.label")}
              </Dialog.Title>
              <Dialog.Description className="sub-text text-xs line-clamp-2">
                {t("install.subtitle")}
              </Dialog.Description>
            </div>
          </div>

          {/* Value Highlights */}
          <div className="space-y-3 py-2 text-xs sm:text-sm">
            <div className="flex items-start gap-2.5">
              <Zap className="size-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-foreground">{t("install.standaloneTitle")}</span>
                <span className="text-foreground/70 ml-1">
                  {t("install.standaloneDesc")}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Wifi className="size-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-foreground">{t("install.offlineTitle")}</span>
                <span className="text-foreground/70 ml-1">
                  {t("install.offlineDesc")}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Sparkles className="size-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-foreground">{t("install.quickTitle")}</span>
                <span className="text-foreground/70 ml-1">
                  {t("install.quickDesc")}
                </span>
              </div>
            </div>
          </div>

          {/* Device & Browser Specific Instructions / Status */}
          {installedSuccess ? (
            <div className="flex items-center justify-center gap-2 py-3 rounded-component bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-xs sm:text-sm">
              <CheckCircle2 className="size-5 shrink-0" />
              <span>{t("install.installedSuccess")}</span>
            </div>
          ) : isInstallable ? (
            <div className="rounded-component border border-emerald-500/20 bg-emerald-500/5 p-3 flex items-start gap-2.5 text-xs text-foreground/80">
              <Layers className="size-4 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                {isMobile
                  ? t("install.mobileInstallReady")
                  : t("install.desktopInstallReady")}
              </p>
            </div>
          ) : isIOS ? (
            <div className="rounded-component border border-foreground/10 bg-background/60 p-3 space-y-2 text-xs text-foreground/80">
              <p className="font-semibold text-foreground text-xs">{t("install.iosTitle")}</p>
              <div className="flex items-center gap-2.5 text-foreground/75">
                <span className="size-6 rounded-lg bg-foreground/10 flex items-center justify-center shrink-0">
                  <Share className="size-3.5" />
                </span>
                <span>{t("install.iosStep1")}</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground/75">
                <span className="size-6 rounded-lg bg-foreground/10 flex items-center justify-center shrink-0">
                  <PlusSquare className="size-3.5" />
                </span>
                <span>{t("install.iosStep2")}</span>
              </div>
            </div>
          ) : isAndroid || isMobile ? (
            <div className="rounded-component border border-foreground/10 bg-background/60 p-3 space-y-2 text-xs text-foreground/80">
              <p className="font-semibold text-foreground text-xs">{t("install.androidTitle")}</p>
              <div className="flex items-center gap-2.5 text-foreground/75">
                <span className="size-6 rounded-lg bg-foreground/10 flex items-center justify-center shrink-0">
                  <MoreVertical className="size-3.5" />
                </span>
                <span>{t("install.androidStep1")}</span>
              </div>
              <div className="flex items-center gap-2.5 text-foreground/75">
                <span className="size-6 rounded-lg bg-foreground/10 flex items-center justify-center shrink-0">
                  <PlusSquare className="size-3.5" />
                </span>
                <span>{t("install.androidStep2")}</span>
              </div>
            </div>
          ) : (
            <div className="rounded-component border border-foreground/10 bg-background/60 p-3 text-xs text-foreground/80">
              <p className="font-semibold text-foreground mb-1">{t("install.desktopTitle")}</p>
              <p className="leading-relaxed">
                {t("install.desktopDesc")}
              </p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <Dialog.Close
              render={
                <Button
                  type="button"
                  variant="card"
                  className={isInstallable && !installedSuccess ? "flex-1" : "w-full"}
                  onClick={() => setIsOpen(false)}
                >
                  {installedSuccess
                    ? t("common.close")
                    : isInstallable
                    ? t("install.later")
                    : t("help.gotIt")}
                </Button>
              }
            />

            {isInstallable && !installedSuccess && (
              <Button
                type="button"
                variant="primary"
                className="flex-1 flex items-center justify-center gap-2 font-medium"
                onClick={handleInstall}
                disabled={isInstalling}
              >
                <span>{isInstalling ? t("install.installing") : t("install.installNow")}</span>
                <Download className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </Dialog>
    </>
  );
}
