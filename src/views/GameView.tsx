import { useState } from "react";
import { WordRevealView } from "./WordRevealView";
import { DiscussionView } from "./DiscussionView";
import { VoteView } from "./VoteView";
import { VoteRevealView } from "./VoteRevealView";
import { GameEndView } from "./GameEndView";
import type { GameSetup } from "../gameLogic/gameSetup";
import type {
  Player,
  RoleWinPoints,
  WinnerInfo,
  WordPair,
} from "../gameLogic/types";

type GamePhase =
  | "wordReveal"
  | "discussion"
  | "vote"
  | "voteReveal"
  | "gameEnd";

interface GameViewProps {
  setup: GameSetup;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  wordPair: WordPair;
  roleWinPoints: RoleWinPoints;
  chameleonGuessPossible: boolean;
  timerDuration: number;
  setTimerDuration: React.Dispatch<React.SetStateAction<number>>;
  onGameEnd: (winners: WinnerInfo[] | null) => void;
}

export function GameView({
  setup = { players: 0, masks: 0, authentics: 0, chameleon: false },
  players = [],
  setPlayers,
  wordPair,
  roleWinPoints,
  chameleonGuessPossible,
  timerDuration,
  setTimerDuration,
  onGameEnd,
}: GameViewProps) {
  const [phase, setPhase] = useState<GamePhase>("wordReveal");

  const [startingPlayerIndex, setStartingPlayerIndex] = useState(0);
  const [eliminatedPlayer, setEliminatedPlayer] = useState<Player | null>(null);
  const [winners, setWinners] = useState<WinnerInfo[] | null>(null);

  const startingPlayerName = players[startingPlayerIndex]?.name || "Unknown";

  // -------------------------
  // Utilities
  // -------------------------
  function getAlivePlayers(): Player[] {
    return players.filter((p) => p.alive);
  }

  function getPlayerStartingOrder(playersList: Player[]): Player[] {
    const eligibleStartingIndices = playersList
      .map((player, index) => ({ player, index }))
      .filter(({ player, index }) => {
        if (index === 0) return false;

        if (player.role === "chameleon") return false;
        const secondIndex = (index + 1) % playersList.length;
        if (playersList[secondIndex].role === "chameleon") return false;

        return true;
      })
      .map(({ index }) => index);

    let startIndex: number;

    if (eligibleStartingIndices.length > 0) {
      // Normal case: pick randomly from eligible indices
      startIndex =
        eligibleStartingIndices[
          Math.floor(Math.random() * eligibleStartingIndices.length)
        ];
    } else {
      // Fallback: pick first non-Chameleon player alive (prefer not index 0 if possible)
      const nonChameleonIndex = playersList.findIndex(
        (p) => p.role !== "chameleon",
      );
      startIndex = nonChameleonIndex >= 0 ? nonChameleonIndex : 0;
    }

    const rotatedPlayerList = [
      ...playersList.slice(startIndex),
      ...playersList.slice(0, startIndex),
    ];

    return rotatedPlayerList;
  }

  // Determine next starting player (skip eliminated)
  const getNextStartingPlayerIndex = () => {
    const alivePlayers = players.filter((player) => player.alive);
    if (!alivePlayers.length) return 0;

    for (let i = 0; i < players.length; i++) {
      const index = (startingPlayerIndex + i) % players.length;
      if (players[index].alive) return index;
    }
    return 0;
  };

  function checkGameEnd(): WinnerInfo[] | null {
    const alive = getAlivePlayers();

    const authenticsAlive = alive.filter((p) => p.role === "authentic").length;
    const masksAlive = alive.filter((p) => p.role === "mask").length;
    const chameleonAlive = alive.some((p) => p.role === "chameleon");

    // All alive players are authentics
    if (authenticsAlive === alive.length) {
      return [{ name: "authentic", points: roleWinPoints.authentic }];
    }

    // Chameleon + exactly one authentic (no masks)
    if (authenticsAlive === 1 && chameleonAlive && masksAlive === 0) {
      return [{ name: "chameleon", points: roleWinPoints.chameleon }];
    }

    // Masks + exactly one authentic (no Chameleon)
    if (authenticsAlive === 1 && !chameleonAlive && masksAlive > 0) {
      return [{ name: "mask", points: roleWinPoints.mask }];
    }

    // No authentics alive (e.g. mask + Chameleon)
    if (authenticsAlive === 0 && chameleonAlive && masksAlive > 0) {
      return [
        { name: "mask", points: roleWinPoints.mask },
        { name: "chameleon", points: roleWinPoints.chameleon },
      ];
    }

    return null;
  }

  // -------------------------
  // Vote handler
  // -------------------------
  const handleVote = (votedPlayer: Player) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((p) =>
        p.name === votedPlayer.name ? { ...p, alive: false } : p,
      ),
    );
    setEliminatedPlayer(votedPlayer);
    setPhase("voteReveal");
  };

  // -------------------------
  // Continue after Reveal
  // -------------------------
  const handleContinueAfterReveal = (
    chameleonGuess?: string | null | undefined,
  ) => {
    if (!eliminatedPlayer) return;

    if (eliminatedPlayer.role === "chameleon") {
      if (chameleonGuess) {
        // Chameleon guessed correctly -> instant win, otherwise eliminated
        setWinners([{ name: "chameleon", points: roleWinPoints.chameleon }]);
        setPhase("gameEnd");
        return;
      }
    } else {
      // Normal player elimination
      setPlayers((prevPlayers) =>
        prevPlayers.map((p) =>
          p.name === eliminatedPlayer.name ? { ...p, alive: false } : p,
        ),
      );
    }

    const winner = checkGameEnd();
    if (winner) {
      setWinners(winner);
      setPhase("gameEnd");
      setEliminatedPlayer(null);
      return;
    }

    const nextIndex = getNextStartingPlayerIndex();
    setStartingPlayerIndex(nextIndex);
    setEliminatedPlayer(null);
    setPhase("discussion");
  };

  // -------------------------
  // Rendering
  // -------------------------
  switch (phase) {
    case "wordReveal":
      return (
        <WordRevealView
          setup={setup}
          players={players}
          setPlayers={setPlayers}
          onComplete={() => {
            setPlayers((prev) => getPlayerStartingOrder(prev));
            setStartingPlayerIndex(0);
            setPhase("discussion");
          }}
        />
      );

    case "discussion":
      return (
        <DiscussionView
          players={players}
          startingPlayerIndex={startingPlayerIndex}
          startingPlayerName={startingPlayerName}
          timerDuration={timerDuration}
          setTimerDuration={setTimerDuration}
          onStartVote={() => setPhase("vote")}
        />
      );

    case "vote":
      return (
        <VoteView
          players={players}
          startingPlayerName={startingPlayerName}
          onConfirmVote={handleVote}
          backToDiscussion={() => setPhase("discussion")}
        />
      );

    case "voteReveal":
      return (
        <VoteRevealView
          eliminatedPlayer={eliminatedPlayer}
          correctWord={wordPair.authentic}
          chameleonGuessPossible={chameleonGuessPossible}
          onContinue={(chameleonGuess) => {
            handleContinueAfterReveal(chameleonGuess);
          }}
        />
      );

    case "gameEnd":
      return (
        <GameEndView
          winners={winners}
          players={players}
          wordPair={wordPair}
          onConfirm={() => {
            onGameEnd(winners);
            setPhase("wordReveal");
          }}
        />
      );

    default:
      return null;
  }
}
