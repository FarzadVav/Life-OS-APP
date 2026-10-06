"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  WifiOff,
  RefreshCw,
  Home,
  CheckSquare,
  BookOpen,
  Target,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/features/general/components/ui/Button/Button";

export default function OfflinePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);
  const [onlineNow, setOnlineNow] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setOnlineNow(true);
      setTimeout(() => {
        router.refresh();
      }, 1000);
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [router]);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      await fetch("/favicon.ico", { cache: "no-store", method: "HEAD" });
      setOnlineNow(true);
      setTimeout(() => {
        router.refresh();
      }, 800);
    } catch {
      setOnlineNow(false);
    } finally {
      setIsChecking(false);
    }
  };

  const offlineShortcuts = [
    { title: "Todos", href: "/", icon: CheckSquare, desc: "Review daily actions" },
    { title: "Journals", href: "/journals", icon: BookOpen, desc: "Reflect and review logs" },
    { title: "Missions", href: "/missions", icon: Target, desc: "Track active milestones" },
  ];

  return (
    <main className="min-h-screen w-full flex flex-col justify-between p-4 sm:p-6 pb-20">
      {/* Top Header */}
      <header className="w-full flex items-center justify-between py-2">
        <button
          onClick={() => router.back()}
          type="button"
          className="flex items-center gap-1.5 text-xs text-foreground/70 hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
          <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Offline Mode</span>
        </div>
      </header>

      {/* Main Hero Card */}
      <div className="flex-1 flex flex-col items-center justify-center my-8 text-center max-w-md mx-auto w-full">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="relative mb-6"
        >
          {/* Subtle pulsating glow */}
          <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-2xl animate-pulse" />
          <div className="relative size-24 rounded-3xl bg-card border border-foreground/15 flex items-center justify-center shadow-2xl">
            <WifiOff className="size-10 text-amber-400" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground"
        >
          {onlineNow ? "Connection Restored!" : "No Internet Connection"}
        </motion.h1>

        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-3 text-sm text-foreground/60 leading-relaxed max-w-sm"
        >
          {onlineNow
            ? "Your device is back online. Syncing pending requests and reloading..."
            : "Arrow Up is running in offline mode. Your cached data and app shell remain fully accessible."}
        </motion.p>

        {/* Action Controls */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full"
        >
          <Button
            variant="primary"
            onClick={checkConnection}
            disabled={isChecking || onlineNow}
            className="h-11 px-6 rounded-full text-sm font-semibold flex items-center gap-2 shadow-lg"
          >
            <RefreshCw className={`size-4 ${isChecking ? "animate-spin" : ""}`} />
            <span>{isChecking ? "Checking Connection..." : onlineNow ? "Reconnected" : "Retry Connection"}</span>
          </Button>

          <Button
            variant="card"
            render={<Link href="/" />}
            nativeButton={false}
            className="h-11 px-5 rounded-full text-sm font-medium flex items-center gap-2 border border-foreground/10"
          >
            <Home className="size-4" />
            <span>Home</span>
          </Button>
        </motion.div>

        {/* Cached Sections */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-10 w-full"
        >
          <h2 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3 text-left">
            Quick Navigation (Cached)
          </h2>
          <div className="grid grid-cols-1 gap-2.5">
            {offlineShortcuts.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-card hover:bg-card-thick border border-foreground/10 transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-9 rounded-xl bg-foreground/5 group-hover:bg-foreground/10 flex items-center justify-center shrink-0 transition-colors">
                    <item.icon className="size-4 text-foreground/80" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight">{item.title}</p>
                    <p className="text-xs text-foreground/60 leading-tight mt-0.5 truncate">{item.desc}</p>
                  </div>
                </div>
                <span className="text-xs text-foreground/40 group-hover:text-foreground/70 transition-colors">
                  Open →
                </span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Offline Features Pill */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-6 w-full p-4 rounded-2xl bg-card-thick/60 border border-foreground/10 text-left"
        >
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-foreground/80">
            <Sparkles className="size-3.5 text-amber-400" />
            <span>What happens while offline?</span>
          </div>
          <ul className="space-y-1.5 text-xs text-foreground/60">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
              <span>Cached pages load without interruption</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
              <span>Pending server requests queue and retry automatically</span>
            </li>
          </ul>
        </motion.div>
      </div>

      <footer className="text-center text-[11px] text-foreground/40">
        Arrow Up · Progressive Web App
      </footer>
    </main>
  );
}
