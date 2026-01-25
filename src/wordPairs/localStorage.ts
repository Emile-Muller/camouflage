import type { WordPair } from "./words";

const STORAGE_KEYS = {
  USED_WORD_PAIRS: "USED_WORD_PAIRS",
};

function loadUsedWordPairIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USED_WORD_PAIRS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUsedWordPairId(id: string) {
  const existing = loadUsedWordPairIds();

  if (!existing.includes(id)) {
    localStorage.setItem(
      STORAGE_KEYS.USED_WORD_PAIRS,
      JSON.stringify([...existing, id]),
    );
  }
}

export function getAvailableWordPairs(allPairs: WordPair[]): WordPair[] {
  const usedIds = new Set(loadUsedWordPairIds());
  return allPairs.filter((pair) => !usedIds.has(pair.id));
}

export function resetWordPairHistory() {
  localStorage.removeItem(STORAGE_KEYS.USED_WORD_PAIRS);
}
