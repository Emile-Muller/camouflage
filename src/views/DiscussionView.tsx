import { useTranslation, Trans } from "react-i18next";
import { AliveRolesSummary } from "../components/AliveRolesSummary";
import type { Player } from "../gameLogic/types";

interface DiscussionViewProps {
  players: Player[];
  startingPlayerIndex: number;
  startingPlayerName: string;
  onStartVote: () => void;
  onForgotWord: () => void;
}

export function DiscussionView({
  players,
  startingPlayerIndex,
  startingPlayerName,
  onStartVote,
  onForgotWord,
}: DiscussionViewProps) {
  const { t } = useTranslation();

  const startingPlayer = players[startingPlayerIndex];

  if (!startingPlayer) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-zinc-800 shadow-lg p-6 space-y-6 text-center">
        <p className="text-sm uppercase tracking-wide text-zinc-400">
          {t("discussionView.discussionPhase")}
        </p>

        <p className="text-2xl font-bold text-emerald-400 flex items-center gap-2 max-w-full justify-center">
          <span className="truncate" style={{ maxWidth: "calc(100% - 4ch)" }}>
            {startingPlayerName}
          </span>
          <span className="flex-shrink-0">{t("discussionView.starts")}</span>
        </p>

        <AliveRolesSummary players={players} />

        <div className="text-sm text-zinc-300 space-y-3 leading-relaxed">
          <p>
            <Trans
              i18nKey="discussionView.discussionInstructions1"
              values={{ startingPlayerName }}
              components={{ bold: <span className="font-semibold" /> }}
            />
          </p>
          <p>
            <Trans
              i18nKey="discussionView.discussionInstructions2"
              components={{ bold: <span className="font-semibold" /> }}
            />
          </p>
          <p>
            <Trans
              i18nKey="discussionView.discussionInstructions3"
              components={{ bold: <span className="font-semibold" /> }}
            />
          </p>
        </div>

        <button
          onClick={onStartVote}
          className="w-full mt-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 font-semibold"
        >
          {t("discussionView.goToVote")}
        </button>

        <button
          onClick={onForgotWord}
          className="w-full mt-4 rounded-lg bg-gray-600 hover:bg-gray-500 py-2 text-sm"
        >
          {t("discussionView.IForgotMyWord")}
        </button>
      </div>
    </div>
  );
}
