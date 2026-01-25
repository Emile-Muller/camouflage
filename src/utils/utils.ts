export function upperFirst(name: string | null): string {
  return name!.charAt(0).toUpperCase() + name!.slice(1);
}