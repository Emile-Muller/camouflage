import type { WordPair } from "./words";
import type { Language } from "../gameLogic/types";

const STORAGE_KEYS = {
  USED_WORD_PAIRS: "USED_WORD_PAIRS",
} as const;

function getStorageKey(lang: Language) {
  return `${STORAGE_KEYS.USED_WORD_PAIRS}_${lang}`;
}

function loadUsedWordPairIds(lang: Language): string[] {
  try {
    const raw = localStorage.getItem(getStorageKey(lang));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUsedWordPairId(id: string, lang: Language) {
  const existing = loadUsedWordPairIds(lang);

  if (!existing.includes(id)) {
    localStorage.setItem(
      getStorageKey(lang),
      JSON.stringify([...existing, id]),
    );
  }
}

export function getAvailableWordPairs(allPairs: WordPair[], lang: Language): WordPair[] {
  const usedIds = new Set(loadUsedWordPairIds(lang));
  return allPairs.filter((pair) => !usedIds.has(pair.id));
}

export function resetWordPairHistory(lang: Language) {
  localStorage.removeItem(getStorageKey(lang));
}
