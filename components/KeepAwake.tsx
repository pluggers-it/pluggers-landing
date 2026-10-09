"use client";

import { useEffect } from "react";

/** Keeps the phone screen on while the page is shown to someone; silently does nothing where unsupported. */
export function KeepAwake() {
  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    const ask = () => {
      if (document.visibilityState !== "visible") return;
      navigator.wakeLock?.request("screen").then((l) => (lock = l)).catch(() => {});
    };
    ask();
    document.addEventListener("visibilitychange", ask);
    return () => {
      document.removeEventListener("visibilitychange", ask);
      lock?.release().catch(() => {});
    };
  }, []);
  return null;
}
