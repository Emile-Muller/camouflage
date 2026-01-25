import { useState } from "react";
import { AliveRolesSummary } from "../components/AliveRolesSummary";
import type { Player } from "../gameLogic/types";
import { Trans, useTranslation } from "react-i18next";

interface VoteViewProps {
  players: Player[];
  startingPlayerName: string;
  onConfirmVote: (votedPlayer: Player) => void;
}

export function VoteView({
  players,
  startingPlayerName,
  onConfirmVote,
}: VoteViewProps) {
  const { t } = useTranslation();

  const alivePlayers = players.filter((p) => p.alive);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);

  const selectedPlayer =
    selectedIndex !== null ? alivePlayers[selectedIndex] : null;

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-800 shadow-lg p-6 space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-semibold">{t("voteView.vote")}</h2>
          <p className="text-sm text-zinc-400">
            <Trans
              i18nKey="voteView.startingPlayerThisRound"
              values={{ playerName: startingPlayerName }}
              components={{
                player: <span className="font-semibold text-emerald-400" />,
              }}
            />
          </p>

          <AliveRolesSummary players={players} />

          <p className="text-sm text-zinc-300">
            {t("voteView.whoIsBeingVotedOut")}
          </p>
        </div>

        {/* Player grid */}
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
                  border-2 truncate overflow-hidden whitespace-nowrap
                  ${
                    isSelected
                      ? "bg-emerald-600 border-emerald-400 text-white"
                      : "bg-zinc-700 border-zinc-600 hover:bg-zinc-600"
                  }
                `}
                title={player.name!}
              >
                {player.name}
              </button>
            );
          })}
        </div>

        {/* Confirmation area */}
        {selectedPlayer && (
          <div className="space-y-3 pt-4 border-t border-zinc-700">
            {!confirming ? (
              <button
                onClick={() => setConfirming(true)}
                className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 font-semibold"
              >
                {t("voteView.voteFor", {
                  playerName: selectedPlayer.name,
                })}
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-center text-sm text-zinc-300">
                  <Trans
                    i18nKey="voteView.confirmVoteFor"
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
                    onClick={() => onConfirmVote(selectedPlayer)}
                    className="flex-1 rounded-lg bg-red-600 hover:bg-red-500 py-2 font-semibold"
                  >
                    {t("confirm")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
