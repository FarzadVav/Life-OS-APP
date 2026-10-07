"use client";

import { useSyncExternalStore, useCallback } from "react";

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window {
    __pwaPrompt?: BeforeInstallPromptEvent | null;
  }
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const promptListeners = new Set<() => void>();

function notifyPromptListeners() {
  promptListeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error(e);
    }
  });
}

function updatePrompt(nextPrompt: BeforeInstallPromptEvent | null) {
  deferredPrompt = nextPrompt;
  if (typeof window !== "undefined") {
    window.__pwaPrompt = nextPrompt;
  }
  notifyPromptListeners();
}

if (typeof window !== "undefined") {
  // Sync if captured before this module executed
  if (window.__pwaPrompt && !deferredPrompt) {
    deferredPrompt = window.__pwaPrompt;
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    updatePrompt(e as BeforeInstallPromptEvent);
  });

  window.addEventListener("pwa-prompt-captured", () => {
    if (window.__pwaPrompt) {
      updatePrompt(window.__pwaPrompt);
    }
  });

  window.addEventListener("appinstalled", () => {
    updatePrompt(null);
  });

  window.addEventListener("pwa-installed", () => {
    updatePrompt(null);
  });
}

function subscribePrompt(callback: () => void) {
  promptListeners.add(callback);
  return () => {
    promptListeners.delete(callback);
  };
}

function getPromptSnapshot() {
  if (typeof window !== "undefined" && window.__pwaPrompt && !deferredPrompt) {
    deferredPrompt = window.__pwaPrompt;
  }
  return deferredPrompt;
}

function getPromptServerSnapshot() {
  return null;
}

function subscribeStandalone(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia("(display-mode: standalone)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getStandaloneSnapshot() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true ||
    (typeof document !== "undefined" && document.referrer.includes("android-app://"))
  );
}

function getStandaloneServerSnapshot() {
  return false;
}

export function usePwaInstall() {
  const isStandalone = useSyncExternalStore(
    subscribeStandalone,
    getStandaloneSnapshot,
    getStandaloneServerSnapshot,
  );

  const prompt = useSyncExternalStore(
    subscribePrompt,
    getPromptSnapshot,
    getPromptServerSnapshot,
  );

  const isIOS =
    typeof window !== "undefined" &&
    ((/iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) &&
      !(window as unknown as { MSStream?: unknown }).MSStream) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));

  const isAndroid =
    typeof window !== "undefined" && /android/i.test(navigator.userAgent);

  const isMobile =
    typeof window !== "undefined" &&
    (isIOS || isAndroid || /mobi|tablet|iphone|ipad|android/i.test(navigator.userAgent));

  const installApp = useCallback(async () => {
    const activePrompt =
      deferredPrompt || (typeof window !== "undefined" ? window.__pwaPrompt : null);
    if (!activePrompt) return false;

    try {
      await activePrompt.prompt();
      const { outcome } = await activePrompt.userChoice;
      // In all browsers, prompt() can only be called once per event.
      // Clear it so it cannot be called again on the spent event.
      updatePrompt(null);
      return outcome === "accepted";
    } catch (err) {
      console.error("Installation prompt error:", err);
      updatePrompt(null);
      return false;
    }
  }, []);

  return {
    isStandalone,
    isInstallable: !!prompt,
    isIOS,
    isAndroid,
    isMobile,
    installApp,
  };
}
