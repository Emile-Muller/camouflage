import type { GameSetup } from "./gameSetup";
import type { Player, Role, WordPair } from "./types";

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

function getWordForRole(role: Role, wordPair: WordPair): string | null {
  if (role === "authentic") {
    return wordPair.authentic;
  } else if (role === "mask") {
    return wordPair.mask;
  } else if (role === "chameleon") {
    return null;
  } else {
    return null;
  }
}

export function attributeRolesToPlayers(
  setup: GameSetup,
  players: Player[],
  wordPair: WordPair,
): Player[] {
  const roles: Player["role"][] = [
    ...Array(setup.masks).fill("mask"),
    ...(setup.chameleon ? ["chameleon"] : []),
    ...Array(setup.authentics).fill("authentic"),
  ];

  const shuffledRoles = shuffle(roles);

  const playersWithRoles = players.map((player, index) => ({
    ...player,
    role: shuffledRoles[index]!,
    word: getWordForRole(shuffledRoles[index]!, wordPair),
    alive: true,
  }));

  return playersWithRoles;
}
