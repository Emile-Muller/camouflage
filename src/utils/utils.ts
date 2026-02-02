export function upperFirst(name: string | null): string {
  return name!.charAt(0).toUpperCase() + name!.slice(1);
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
