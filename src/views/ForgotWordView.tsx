import { useState } from "react";
import { upperFirst } from "../utils/utils";
import type { Player } from "../gameLogic/types";
import { Trans, useTranslation } from "react-i18next";

interface ForgotWordViewProps {
  players: Player[];
  onBackToDiscussion: () => void;
}

export function ForgotWordView({
  players,
  onBackToDiscussion,
}: ForgotWordViewProps) {
  const { t } = useTranslation();

  const alivePlayers = players.filter((p) => p.alive);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [showingWord, setShowingWord] = useState(false);

  const selectedPlayer =
    selectedIndex !== null ? alivePlayers[selectedIndex] : null;

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-800 shadow-lg p-6 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-semibold">
            {t("forgotWordView.forgotWord")}
          </h2>

          <p className="text-sm text-zinc-300">
            {t("forgotWordView.whoForgotTheirWord")}
          </p>
        </div>

        {/* Player grid */}
        {!showingWord && (
          <div
            className="
            grid gap-3
            grid-cols-2
            sm:grid-cols-3
          "
          >
            {alivePlayers.map((player, index) => {
              const isSelected = selectedIndex === index;

              return (
                <button
                  key={player.name}
                  onClick={() => {
                    setSelectedIndex(index);
                    setConfirming(false);
                  }}
                  className={`
                  rounded-xl p-4 text-center font-semibold transition
                  border-2
                  truncate overflow-hidden whitespace-nowrap
                  ${
                    isSelected
                      ? "bg-emerald-600 border-emerald-400 text-white"
                      : "bg-zinc-700 border-zinc-600 hover:bg-zinc-600"
                  }
                `}
                >
                  {player.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Confirmation area */}
        {selectedPlayer && (
          <div className="border-zinc-700">
            {!showingWord && (
              <>
                {!confirming ? (
                  <button
                    onClick={() => setConfirming(true)}
                    className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 font-semibold"
                  >
                    {t("forgotWordView.lookAtWordFor", {
                      playerName: selectedPlayer.name,
                    })}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-center text-sm text-zinc-300">
                      <Trans
                        i18nKey="forgotWordView.areYouSureYouWantToLookAtTheWordFor"
                        values={{ playerName: selectedPlayer.name }}
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
                        onClick={() => setShowingWord(true)}
                        className="flex-1 rounded-lg bg-red-600 hover:bg-red-500 py-2 font-semibold"
                      >
                        {t("confirm")}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {showingWord && (
              <div className="space-y-4">
                {selectedPlayer.role === "chameleon" ? (
                  <div className="bg-yellow-600 rounded-lg p-8 text-center">
                    <p className="text-3xl font-bold">{t("chameleon")}</p>
                    <p className="text-sm mt-4 opacity-80">
                      {t("wordRevealView.youDontKnowTheWord")}
                    </p>
                  </div>
                ) : (
                  <div className="bg-zinc-600 rounded-lg p-8 text-center">
                    <p className="text-sm opacity-80">{t("wordRevealView.yourWord")}</p>
                    <p className="text-4xl font-bold mt-4">
                      {upperFirst(selectedPlayer.word)}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => onBackToDiscussion()}
          className="w-full flex-1 rounded-lg bg-gray-600 hover:bg-gray-500 py-2 font-semibold"
        >
          {t("forgotWordView.backToDiscussion")}
        </button>
      </div>
    </div>
  );
}
