import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import type { WordPairEntry, WordPairsJSON } from "../src/gameLogic/types";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const files = [
  path.join(__dirname, "../src/wordPairs/wordPairsFrench.json"),
  path.join(__dirname, "../src/wordPairs/wordPairsEnglish.json"),
];

function writeJSONSingleLine(
  filePath: string,
  obj: Record<string, WordPairEntry>,
) {
  const entries = Object.entries(obj)
    .map(([key, pair]) => `  "${key}": ["${pair[0]}", "${pair[1]}"]`)
    .join(",\n");

  const content = `{\n${entries}\n}\n`;
  fs.writeFileSync(filePath, content, "utf-8");
}

function normalizePair(pair: WordPairEntry): WordPairEntry {
  const [a, b] = pair;
  return a < b ? [a, b] : [b, a];
}

function validateFile(filePath: string) {
  const rawData = fs.readFileSync(filePath, "utf-8");
  const wordPairsObj: WordPairsJSON = JSON.parse(rawData);

  const wordPairs: [string, string][] = Object.values(wordPairsObj);

  const normalizedPairs = wordPairs.map(normalizePair);

  const uniquePairsMap = new Map<string, WordPairEntry>();
  normalizedPairs.forEach((pair) => {
    const key = pair.join("|");
    if (!uniquePairsMap.has(key)) {
      uniquePairsMap.set(key, pair);
    }
  });

  // Alphabetical sort by key
  const sortedEntries = Array.from(uniquePairsMap.entries()).sort(
    ([keyA], [keyB]) => keyA.localeCompare(keyB),
  );

  const outputObj: WordPairsJSON = {};
  for (const [key, pair] of sortedEntries) {
    outputObj[key] = pair;
  }

  writeJSONSingleLine(filePath, outputObj);

  if (files.length > 0) {
    const filesToAdd = files.map((f) => `"${f}"`).join(" ");
    execSync(`git add ${filesToAdd}`, { stdio: "inherit" });
    console.log("Staged updated wordPairs JSON files");
  }

  console.log(`✅ ${filePath} validated`);
}

files.forEach(validateFile);
