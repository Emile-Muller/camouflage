export {};

declare global {
  interface WakeLockSentinel {
    released: boolean;
    release(): Promise<void>;
    addEventListener(
      type: "release",
      listener: (this: WakeLockSentinel, ev: Event) => void,
    ): void;
  }

  interface WakeLock {
    request(type: "screen"): Promise<WakeLockSentinel>;
  }

  interface Navigator {
    wakeLock?: WakeLock;
  }
}
