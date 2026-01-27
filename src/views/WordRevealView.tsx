import { useState } from "react";
import { upperFirst } from "../utils/utils";
import type { GameSetup } from "../gameLogic/gameSetup";
import type { Player } from "../gameLogic/types";
import { useTranslation } from "react-i18next";

type wordRevealStage = "passPhone" | "enterName" | "revealWord" | "confirm";

const MAX_NAME_LENGTH = 20;

interface WordRevealViewProps {
  setup: GameSetup;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  onComplete: () => void;
}

export function WordRevealView({
  setup = { players: 0, masks: 0, authentics: 0, chameleon: false },
  players,
  setPlayers,
  onComplete,
}: WordRevealViewProps) {
  const { t } = useTranslation();

  const [stage, setStage] = useState<wordRevealStage>("passPhone");

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playerName, setPlayerName] = useState("");

  const currentPlayer = players[currentPlayerIndex];
  const shownCurrentPlayer = currentPlayer.name
    ? currentPlayer.name
    : `${t("playerSingular")} ${currentPlayerIndex + 1}`;

  const trimmedName = playerName.trim();
  const isValidChars = /^[a-zA-Z0-9\-']+$/.test(trimmedName);
  const isDuplicateName = players.some(
    (p, index) =>
      index !== currentPlayerIndex &&
      p.name?.toLowerCase() === trimmedName.toLowerCase(),
  );
  const isNameValid =
    trimmedName.length > 0 &&
    trimmedName.length <= MAX_NAME_LENGTH &&
    isValidChars &&
    !isDuplicateName;

  const handleNextStage = () => {
    if (stage === "passPhone") {
      if (currentPlayer.name) {
        setStage("revealWord");
      } else {
        setStage("enterName");
      }
    } else if (stage === "enterName") {
      if (!isNameValid) return;

      setPlayers((prevPlayers) => {
        const updatedPlayers = [...prevPlayers];
        updatedPlayers[currentPlayerIndex] = {
          ...updatedPlayers[currentPlayerIndex],
          name: trimmedName,
        };
        return updatedPlayers;
      });

      setStage("revealWord");
    } else if (stage === "revealWord") {
      setStage("confirm");
    } else if (stage === "confirm") {
      if (currentPlayerIndex < setup.players - 1) {
        setCurrentPlayerIndex((prev) => prev + 1);
        setPlayerName("");
        setStage("passPhone");
      } else {
        onComplete();
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-zinc-800 shadow-lg p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">
            {t("wordRevealView.wordReveal")}
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            {t("wordRevealView.playerProgress", {
              current: currentPlayerIndex + 1,
              total: setup.players,
            })}
          </p>
        </div>

        {/* Pass Phone Stage */}
        {stage === "passPhone" && (
          <div className="space-y-4">
            <div className="bg-zinc-700 rounded-lg p-6 text-center">
              <p className="text-lg">📱</p>
              <p className="text-sm mt-4 text-zinc-300">
                {t("wordRevealView.passPhoneTo", {
                  playerName: shownCurrentPlayer,
                })}
              </p>
            </div>
            <button
              onClick={handleNextStage}
              className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 font-semibold"
            >
              {t("wordRevealView.ready")}
            </button>
          </div>
        )}

        {/* Enter Name Stage */}
        {stage === "enterName" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm uppercase tracking-wide text-zinc-400 mb-2">
                {t("wordRevealView.enterYourName")}
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder={t("wordRevealView.yourNamePlaceholder")}
                autoFocus
                className="w-full rounded-lg bg-zinc-700 border border-zinc-600 px-4 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
              {trimmedName && isDuplicateName && (
                <p className="text-sm text-red-400 mt-2">
                  {t("wordRevealView.nameAlreadyTaken")}
                </p>
              )}
              {trimmedName && !isValidChars && (
                <p className="text-sm text-red-400 mt-2">
                  {t("wordRevealView.noSpecialChars")}
                </p>
              )}
              {trimmedName && trimmedName.length > MAX_NAME_LENGTH && (
                <p className="text-sm text-red-400 mt-2">
                  {t("wordRevealView.nameTooLong", { max: MAX_NAME_LENGTH })}
                </p>
              )}
            </div>
            <button
              onClick={handleNextStage}
              disabled={!isNameValid}
              className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed py-2 font-semibold"
            >
              {t("continue")}
            </button>
          </div>
        )}

        {/* Reveal Word Stage */}
        {stage === "revealWord" && (
          <div className="space-y-4">
            <div className="bg-zinc-700 rounded-lg p-6 text-center">
              <p className="text-sm text-zinc-400">
                {t("wordRevealView.yourWordIs")}
              </p>
              <button
                onClick={handleNextStage}
                className="mt-4 w-full rounded-lg bg-zinc-600 hover:bg-zinc-500 py-8 text-lg font-bold transition-all"
              >
                {t("wordRevealView.tapToReveal")}
              </button>
            </div>
          </div>
        )}

        {/* Confirm Stage */}
        {stage === "confirm" && (
          <div className="space-y-4">
            {currentPlayer.role === "chameleon" ? (
              <div className="bg-zinc-600 rounded-lg p-8 text-center">
                <p className="text-3xl font-bold">{t("chameleon")}</p>
                <p className="text-sm mt-4 opacity-80">
                  {t("wordRevealView.youDontKnowTheWord")}
                </p>
              </div>
            ) : (
              <div className="bg-zinc-600 rounded-lg p-8 text-center">
                <p className="text-sm opacity-80">
                  {t("wordRevealView.yourWord")}
                </p>
                <p className="text-4xl font-bold mt-4">
                  {upperFirst(currentPlayer.word)}
                </p>
              </div>
            )}
            <button
              onClick={handleNextStage}
              className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 font-semibold"
            >
              {t("wordRevealView.gotIt")}{" "}
              {currentPlayerIndex < setup.players - 1
                ? t("wordRevealView.nextPlayer")
                : t("wordRevealView.startGame")}
            </button>
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-zinc-700 rounded-full h-1 overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all"
            style={{
              width: `${((currentPlayerIndex + 1) / setup.players) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
