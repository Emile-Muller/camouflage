export type Role = "authentic" | "mask" | "chameleon";

export interface Player {
  id: string;
  name: string | null;
  role: Role | null;
  word: string | null;
  alive: boolean | null;
  score: number;
}

export type RoleWinPoints = {
  authentic: number;
  mask: number;
  chameleon: number;
};

export type WinnerInfo = {
  name: Role;
  points: number;
};
