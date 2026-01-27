import { useState } from "react";
import { createDefaultSetup, type GameSetup } from "../gameLogic/gameSetup";
import { PlayerSelectionView } from "./PlayerSelectionView";
import { GameView } from "./GameView";
import { attributeRolesToPlayers } from "../gameLogic/roleAttribution";
import { HomeScreenView } from "./HomeScreenView";
import { getRandomPairs, type WordPair } from "../wordPairs/words";
import { saveUsedWordPairId } from "../wordPairs/localStorage";
import type {
  Language,
  Player,
  RoleWinPoints,
  WinnerInfo,
} from "../gameLogic/types";
import { RulesEditorView } from "./RulesEditorView";
import i18n from "i18next";
import { RulesView } from "./RulesView";

type SessionState = "home" | "rules" | "rulesEditor" | "setup" | "playing";

const TOTAL_PAIRS_PER_SESSION = 30;

export function GameSessionView() {
  const [state, setState] = useState<SessionState>("home");
  const [isSetupSelected, setIsSetupSelected] = useState(false);
  const [doPlayersHaveScore, setDoPlayersHaveScore] = useState(false);

  const [roleWinPoints, setRoleWinPoints] = useState({
    authentic: 1,
    mask: 3,
    chameleon: 5,
  });
  const [chameleonGuessPossible, setChameleonGuessPossible] = useState(true);

  const [setup, setSetup] = useState(createDefaultSetup(5));
  const [players, setPlayers] = useState<Player[]>([]);

  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [sessionPairs, setSessionPairs] = useState<WordPair[]>([]);
  const [language, setLanguage] = useState("");

  const startPlaying = () => {
    let wordPairs = sessionPairs;
    const newLanguage: Language = i18n.language;

    if (sessionPairs.length == 0 || newLanguage != language) {
      wordPairs = getRandomPairs(TOTAL_PAIRS_PER_SESSION, newLanguage);
    }

    setLanguage(newLanguage);
    setSessionPairs(wordPairs);
    setPlayers((prev) =>
      attributeRolesToPlayers(setup, prev, wordPairs[currentGameIndex]),
    );

    setState("playing");
  };

  const startGame = () => {
    if (!isSetupSelected) {
      setState("setup");
    } else {
      startPlaying();
    }
  };

  const updateRules = (
    newRoleWinPoints: RoleWinPoints,
    newChameleonGuessPossible: boolean,
  ) => {
    setRoleWinPoints(newRoleWinPoints);
    setChameleonGuessPossible(newChameleonGuessPossible);
  };

  const confirmSetup = (setup: GameSetup) => {
    setSetup(setup);

    setPlayers(
      Array.from({ length: setup.players }).map(() => ({
        id: crypto.randomUUID(),
        name: null,
        role: null,
        word: null,
        alive: true,
        score: 0,
      })),
    );
    setIsSetupSelected(true);

    startPlaying();
  };

  const endGame = (winner: WinnerInfo | null) => {
    if (winner === null) return;

    setPlayers((prev) =>
      prev.map((player) => {
        const shouldAwardPoints =
          (winner.name === "chameleon" && player.role === "chameleon") ||
          (winner.name === "mask" && player.role === "mask") ||
          (winner.name === "authentic" && player.role === "authentic");

        return shouldAwardPoints
          ? { ...player, score: player.score + winner.points }
          : player;
      }),
    );
    setDoPlayersHaveScore(true);

    saveUsedWordPairId(sessionPairs[currentGameIndex].id, language);
    setCurrentGameIndex((i) => Math.min(i + 1, sessionPairs.length - 1));
    setState("home");
  };

  // -------------------------
  // Rendering
  // -------------------------
  switch (state) {
    case "home":
      return (
        <HomeScreenView
          doPlayersHaveScore={doPlayersHaveScore}
          players={players}
          onStart={startGame}
          onRules={() => setState("rules")}
          onEditRules={() => setState("rulesEditor")}
        />
      );

    case "rules":
      return <RulesView onClose={() => setState("home")} />;

    case "rulesEditor":
      return (
        <RulesEditorView
          roleWinPoints={roleWinPoints}
          chameleonGuessPossible={chameleonGuessPossible}
          onConfirm={(newRoleWinPoints, newChameleonGuessPossible) => {
            updateRules(newRoleWinPoints, newChameleonGuessPossible);
            setState("home");
          }}
          onCancel={() => setState("home")}
        />
      );

    case "setup":
      return (
        <PlayerSelectionView
          setup={setup}
          onSetupChange={setSetup}
          onConfirm={() => confirmSetup(setup)}
        />
      );

    case "playing":
      return (
        <GameView
          setup={setup}
          players={players}
          setPlayers={setPlayers}
          wordPair={sessionPairs[currentGameIndex]}
          roleWinPoints={roleWinPoints}
          chameleonGuessPossible={chameleonGuessPossible}
          onGameEnd={endGame}
        />
      );

    default:
      return null;
  }
}
