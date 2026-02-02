import { useState } from "react";
import { ROLES } from "../constants/roles";
import type { Player } from "../gameLogic/types";
import { Trans, useTranslation } from "react-i18next";

interface VoteRevealViewProps {
  eliminatedPlayer: Player | null;
  correctWord: string;
  chameleonGuessPossible: boolean;
  onContinue: (chameleonGuess?: string | null) => void;
}

export function VoteRevealView({
  eliminatedPlayer,
  correctWord,
  chameleonGuessPossible,
  onContinue,
}: VoteRevealViewProps) {
  const { t } = useTranslation();

  const [guess, setGuess] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [guessResult, setGuessResult] = useState<"correct" | "wrong" | null>(
    null,
  );

  if (eliminatedPlayer === null) return;

  const isChameleon = eliminatedPlayer!.role === "chameleon";

  const normalize = (str: string) =>
    str
      .normalize("NFD") // Decompose characters (é → e + ´)
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/[^\w\s]|_/g, "") // Remove punctuation
      .replace(/\s+/g, " ") // Ignore multiple spaces
      .toLowerCase()
      .trim()
      .replace(/s$/i, ""); // Remove trailing "s" for simple plural handling

  const handleConfirmGuess = () => {
    if (!guess.trim()) return;

    const isCorrect = normalize(guess) === normalize(correctWord);

    setGuessResult(isCorrect ? "correct" : "wrong");
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-zinc-800 shadow-lg p-6 space-y-6 text-center">
        <h2 className="text-xl font-semibold">
          {t("voteRevealView.playerEliminated")}
        </h2>

        <div
          className={`rounded-xl p-4 space-y-2 text-center border-2 ${ROLES[eliminatedPlayer.role!].styles.bg} ${ROLES[eliminatedPlayer.role!].styles.border} ${ROLES[eliminatedPlayer.role!].styles.text}
        `}
        >
          <p className="text-2xl font-bold truncate overflow-hidden whitespace-nowrap">
            {eliminatedPlayer.name}
          </p>
          <p className="text-sm flex items-center justify-center gap-1">
            <span>{ROLES[eliminatedPlayer.role!].icon}</span>
            <span className="text-sm uppercase tracking-wide">
              {t(`roles.${eliminatedPlayer.role}`)}
            </span>
          </p>
        </div>

        {chameleonGuessPossible && isChameleon && (
          <>
            {guessResult === null && (
              <div className="space-y-3">
                <p className="text-sm text-zinc-300">
                  {t("voteRevealView.chameleonGuessTheAuthenticWord")}
                </p>

                <input
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  className="w-full rounded-lg bg-zinc-700 border border-zinc-600 px-4 py-2 text-zinc-100"
                  disabled={confirming}
                  placeholder={t("voteRevealView.yourGuessPlaceholder")}
                />

                {!confirming ? (
                  <button
                    onClick={() => setConfirming(true)}
                    disabled={!guess.trim()}
                    className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 font-semibold disabled:opacity-40"
                  >
                    {t("voteRevealView.submitGuess")}
                  </button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-zinc-300">
                      <Trans
                        i18nKey="voteRevealView.confirmGuess"
                        values={{ guess }}
                        components={{
                          bold: <span className="font-semibold" />,
                        }}
                      />
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setConfirming(false)}
                        className="flex-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 py-2 font-semibold"
                      >
                        {t("cancel")}
                      </button>
                      <button
                        onClick={handleConfirmGuess}
                        className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 font-semibold"
                      >
                        {t("confirm")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {guessResult !== null && (
              <div className="space-y-3">
                <p
                  className={`text-lg font-semibold ${
                    guessResult === "correct"
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {guessResult === "correct"
                    ? t("voteRevealView.correctGuessChameleonWins")
                    : t("voteRevealView.wrongGuessChameleonIsEliminated")}
                </p>

                <button
                  onClick={() =>
                    onContinue(guessResult === "correct" ? guess : null)
                  }
                  className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 font-semibold"
                >
                  {t("continue")}
                </button>
              </div>
            )}
          </>
        )}

        {(!chameleonGuessPossible || !isChameleon) && (
          <button
            onClick={() => onContinue(null)}
            className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 font-semibold"
          >
            {t("continue")}
          </button>
        )}
      </div>
    </div>
  );
}
