import { useEffect, useRef } from "react";

export function useWakeLockWhilePlaying(isPlaying: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!isPlaying || !navigator.wakeLock) {
      wakeLockRef.current?.release();
      wakeLockRef.current = null;
      return;
    }

    let cancelled = false;

    const requestWakeLock = async () => {
      try {
        const lock = await navigator.wakeLock!.request("screen");
        if (!cancelled) {
          wakeLockRef.current = lock;
        } else {
          await lock.release();
        }
      } catch {
        // expected on unsupported browsers (iOS)
      }
    };

    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      wakeLockRef.current?.release();
      wakeLockRef.current = null;
    };
  }, [isPlaying]);
}
