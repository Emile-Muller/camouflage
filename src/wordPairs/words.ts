import { getAvailableWordPairs, resetWordPairHistory } from "./localStorage";
import enWordPairs from "./wordPairsEnglish.json";
import frWordPairs from "./wordPairsFrench.json";
import i18n from "i18next";

export interface WordPair {
  id: string;
  authentic: string;
  mask: string;
}

interface WordPairEntry {
  authentic: string;
  mask: string;
}

type WordPairsJSON = Record<string, WordPairEntry>;

const allWordPairs: Record<string, WordPairsJSON> = {
  en: enWordPairs,
  fr: frWordPairs,
};

export function getAllWordPairs(): WordPair[] {
  const lang = i18n.language;

  const data: WordPairsJSON = allWordPairs[lang] || {};

  const wordPairs: WordPair[] = Object.entries(data).map(([id, pair]) => ({
    id,
    authentic: pair.authentic,
    mask: pair.mask,
  }));

  return wordPairs;
}

function getUniqueRandomPairs(pairs: WordPair[], count: number): WordPair[] {
  if (count > pairs.length) {
    throw new Error("Requested more unique pairs than available");
  }

  const shuffled = [...pairs];

  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

export function getRandomPairs(pairsPerSession: number): WordPair[] {
  const allPairs: WordPair[] = getAllWordPairs();

  if (allPairs.length === 0) {
    return [];
  }

  const available: WordPair[] = getAvailableWordPairs(allPairs);

  let selected: WordPair[] = [];

  if (available.length >= pairsPerSession) {
    selected = getUniqueRandomPairs(available, pairsPerSession);
  } else {
    selected = [...available];
    resetWordPairHistory();
    const remainingPool = allPairs.filter(
      (pair) => !selected.some((p) => p.id === pair.id),
    );
    const remainingNeeded = pairsPerSession - selected.length;
    const refill = getUniqueRandomPairs(remainingPool, remainingNeeded);
    selected = [...selected, ...refill];
  }

  return selected;
}
