import { upperFirst } from "../utils/utils";
import { ROLES } from "../constants/roles";
import type { Player, Role, WinnerInfo, WordPair } from "../gameLogic/types";
import { Trans, useTranslation } from "react-i18next";

interface GameEndViewProps {
  winners: WinnerInfo[] | null;
  players: Player[];
  wordPair: WordPair;
  onConfirm: () => void;
}

export function GameEndView({
  winners,
  players,
  wordPair,
  onConfirm,
}: GameEndViewProps) {
  const { t } = useTranslation();

  if (winners === null) return;

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-800 shadow-lg p-6 text-center space-y-6">
        <h2 className="text-2xl font-bold text-emerald-400">
          {t("gameEndView.gameOver")}
        </h2>

        <div className="space-y-1">
          <div className="text-lg">
            <Trans i18nKey="gameEndView.winner" count={winners.length} />{" "}
            {winners.map((winner) => {
              return (
                <span key={winner.name} className="font-semibold">
                  <p className="flex items-center justify-center gap-1">
                    <span>{ROLES[winner.name as Role].icon}</span>
                    <span>{t(`roles.${winner.name}`)}</span>
                  </p>
                  <p className="text-sm text-zinc-300">
                    {t("gameEndView.pointsAwarded", {
                      points: winner.points,
                    })}
                  </p>
                </span>
              );
            })}
          </div>
        </div>

        {/* Word reveal */}
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-zinc-400">
            {t("gameEndView.words")}
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            {/* Authentic word */}
            <div
              className={`rounded-xl p-4 text-center border-2 ${ROLES.authentic.styles.bg} ${ROLES.authentic.styles.border} ${ROLES.authentic.styles.text}
              `}
            >
              <p className="text-base font-semibold">
                {upperFirst(wordPair.authentic)}
              </p>
              <p className="text-sm flex items-center justify-center gap-1">
                <span>{ROLES.authentic.icon}</span>
                <span>{t("authenticSingular")}</span>
              </p>
            </div>

            {/* Mask word */}
            <div
              className={`rounded-xl p-4 text-center border-2 ${ROLES.mask.styles.bg} ${ROLES.mask.styles.border} ${ROLES.mask.styles.text}
              `}
            >
              <p className="text-base font-semibold">
                {upperFirst(wordPair.mask)}
              </p>
              <p className="text-sm flex items-center justify-center gap-1">
                <span>{ROLES.mask.icon}</span>
                <span>{t("maskSingular")}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Player role reveal */}
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-zinc-400">
            {t("gameEndView.playerRoles")}
          </p>

          <div
            className="
              grid gap-3
              grid-cols-2
              sm:grid-cols-3
            "
          >
            {players.map((player) => {
              const roleInfo = ROLES[player.role!] ?? ROLES.authentic;
              const roleStyle = roleInfo.styles;

              return (
                <div
                  key={player.name}
                  className={`
                  rounded-xl p-4 text-center border-2
                  truncate overflow-hidden whitespace-nowrap
                  ${roleStyle.bg} ${roleStyle.border} ${roleStyle.text}
                `}
                >
                  <p className="text-base font-semibold">{player.name}</p>
                  <p className="text-sm text-zinc-300 flex items-center justify-center gap-1">
                    <span>{roleInfo.icon}</span>
                    <span>{t(`roles.${player.role}`)}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <button
          onClick={onConfirm}
          className="w-full mt-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 font-semibold"
        >
          {t("continue")}
        </button>
      </div>
    </div>
  );
}
