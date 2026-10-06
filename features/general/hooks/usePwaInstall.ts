"use client";

import { useSyncExternalStore, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const promptListeners = new Set<() => void>();

function notifyPromptListeners() {
  promptListeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    notifyPromptListeners();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    notifyPromptListeners();
  });
}

function subscribePrompt(callback: () => void) {
  promptListeners.add(callback);
  return () => {
    promptListeners.delete(callback);
  };
}

function getPromptSnapshot() {
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
    (navigator as unknown as { standalone?: boolean }).standalone === true
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
    /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase()) &&
    !(window as unknown as { MSStream?: unknown }).MSStream;

  const installApp = useCallback(async () => {
    if (!prompt) return false;
    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === "accepted") {
        deferredPrompt = null;
        notifyPromptListeners();
        return true;
      }
    } catch (err) {
      console.error("Installation prompt error:", err);
    }
    return false;
  }, [prompt]);

  return {
    isStandalone,
    isInstallable: !!prompt,
    isIOS,
    installApp,
  };
}
