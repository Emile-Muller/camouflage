import { lngs } from "../constants/languages";
import type { Player } from "../gameLogic/types";
import { useTranslation } from "react-i18next";

interface HomeScreenViewProps {
  doPlayersHaveScore: boolean;
  players: Player[];
  onStart: () => void;
  onRules: () => void;
  onEditRules: () => void;
}

export function HomeScreenView({
  doPlayersHaveScore,
  players,
  onStart,
  onRules,
  onEditRules,
}: HomeScreenViewProps) {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-zinc-800 shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-center">
          {t("gameTitle")}
          <span className="block text-xs text-zinc-400 tracking-wide uppercase mt-1">
            {t("partyDeductionGame")}
          </span>
        </h1>

        <button
          onClick={onStart}
          className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-3 text-lg font-semibold"
        >
          {t("homeScreenView.startGame")}
        </button>

        <div className="flex gap-3">
          <button
            onClick={onRules}
            className="w-full rounded-lg bg-zinc-600 hover:bg-zinc-500 py-2 text-md"
          >
          {t("howToPlay")}
          </button>

          <button
          onClick={onEditRules}
          className="w-full rounded-lg bg-zinc-600 hover:bg-zinc-500 py-2 text-md"
          >
          {t("homeScreenView.editRules")}
          </button>
        </div>

        {doPlayersHaveScore && (
          <div className="space-y-2">
            <h2 className="text-sm uppercase tracking-wide text-zinc-400">
              {t("homeScreenView.scoreboard")}
            </h2>
            <ul className="space-y-1 text-sm">
              {players
                .slice()
                .sort((a, b) => b.score - a.score)
                .map((player) => (
                  <li
                    key={player.name}
                    className="flex justify-between rounded-md bg-zinc-700/50 px-3 py-2"
                  >
                    <span>{player.name}</span>
                    <span className="font-medium">{player.score}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}

        <p className="text-sm uppercase tracking-wide text-zinc-400 text-center mb-2">
          🌐 {t("homeScreenView.selectLanguage")}
        </p>
        <div className="flex gap-2">
          {Object.entries(lngs).map(([lng, { nativeName }]) => (
            <button
              className="w-full rounded-lg py-2 text-md bg-zinc-600 hover:bg-zinc-500 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed transition-colors"
              type="button"
              key={lng}
              onClick={() => i18n.changeLanguage(lng)}
              disabled={i18n.resolvedLanguage === lng}
            >
              {nativeName}
            </button>
          ))}
        </div>

        <p className="text-xs text-zinc-500">
          {t("homeScreenView.disclaimer")}
        </p>

        <p className="text-xs text-zinc-500">&#169; Emile Muller, 2026</p>
      </div>
    </div>
  );
}
