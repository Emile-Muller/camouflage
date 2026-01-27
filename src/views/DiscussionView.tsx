import { useTranslation, Trans } from "react-i18next";
import { AliveRolesComponent } from "../components/AliveRolesComponent";
import type { Player } from "../gameLogic/types";
import { useState } from "react";
import { RulesView } from "./RulesView";

type DiscussionState = "discussion" | "rules";

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

  const [state, setState] = useState<DiscussionState>("discussion");

  const startingPlayer = players[startingPlayerIndex];

  if (!startingPlayer) {
    return null;
  }

  switch (state) {
    case "discussion":
      return (
        <div className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-800 shadow-lg p-6 space-y-4 text-center">
            <p className="text-sm uppercase tracking-wide text-zinc-400">
              {t("discussionView.discussionPhase")}
            </p>

            <p className="text-2xl font-bold text-emerald-400 flex items-center gap-2 max-w-full justify-center">
              <span
                className="truncate"
                style={{ maxWidth: "calc(100% - 4ch)" }}
              >
                {startingPlayerName}
              </span>
              <span className="flex-shrink-0">
                {t("discussionView.starts")}
              </span>
            </p>

            <AliveRolesComponent players={players} />

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
            </div>

            <button
              onClick={onStartVote}
              className="w-full mt-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 font-semibold"
            >
              {t("discussionView.goToVote")}
            </button>

            <button
              onClick={() => setState("rules")}
              className="w-full mt-4 rounded-lg bg-zinc-600 hover:bg-zinc-500 py-2"
            >
              {t("howToPlay")}
            </button>

            <button
              onClick={onForgotWord}
              className="w-full mt-4 rounded-lg bg-teal-700 hover:bg-teal-600 py-2"
            >
              {t("discussionView.IForgotMyWord")}
            </button>
          </div>
        </div>
      );

    case "rules":
      return <RulesView onClose={() => setState("discussion")} />;
  }
}
