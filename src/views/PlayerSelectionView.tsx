import { useTranslation } from "react-i18next";
import type { GameSetup } from "../gameLogic/gameSetup";
import { GameSetupActions, getControls } from "../gameLogic/gameSetup";

interface PlayerSelectionViewProps {
  setup: GameSetup;
  onSetupChange: (updater: (prev: GameSetup) => GameSetup) => void;
  onConfirm: () => void;
}

export function PlayerSelectionView({
  setup,
  onSetupChange,
  onConfirm,
}: PlayerSelectionViewProps) {
  const { t } = useTranslation();
  
  const controls = getControls(setup);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl bg-zinc-800 shadow-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold text-center">{t("playerSelectionView.gameSetup")}</h2>

        {/* Players */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm uppercase tracking-wide text-zinc-400">
              {t("playerPlural")}
            </span>
            <span className="text-lg font-bold">{setup.players}</span>
          </div>

          <div className="flex gap-2">
            <button
              disabled={!controls.canRemovePlayer}
              onPointerDown={() =>
                onSetupChange((prev) => GameSetupActions.removePlayer(prev))
              }
              className="flex-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 py-2 text-lg"
            >
              -
            </button>

            <button
              disabled={!controls.canAddPlayer}
              onPointerDown={() =>
                onSetupChange((prev) => GameSetupActions.addPlayer(prev))
              }
              className="flex-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 py-2 text-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* Masks */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm uppercase tracking-wide text-zinc-400">
              {t("maskPlural")}
            </span>
            <span className="text-lg font-bold">{setup.masks}</span>
          </div>

          <div className="flex gap-2">
            <button
              disabled={!controls.canRemoveMask}
              onPointerDown={() =>
                onSetupChange((prev) => GameSetupActions.removeMask(prev))
              }
              className="flex-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 py-2 text-lg"
            >
              -
            </button>

            <button
              disabled={!controls.canAddMask}
              onPointerDown={() =>
                onSetupChange((prev) => GameSetupActions.addMask(prev))
              }
              className="flex-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 py-2 text-lg"
            >
              +
            </button>
          </div>
        </div>

        {/* Chameleon */}
        <div className="flex items-center justify-between">
          <span className="text-sm uppercase tracking-wide text-zinc-400">
            {t("chameleon")}
          </span>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={setup.chameleon}
              disabled={!controls.canToggleChameleon}
              onChange={() =>
                onSetupChange((prev) => GameSetupActions.toggleChameleon(prev))
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-700 rounded-full peer peer-checked:bg-emerald-600 peer-disabled:opacity-40 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
          </label>
        </div>

        {/* Summary */}
        <div className="border-t border-zinc-700 pt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>{t("authenticPlural")}</span>
            <span>{setup.authentics}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("maskPlural")}</span>
            <span>{setup.masks}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("chameleon")}</span>
            <span>{setup.chameleon ? 1 : 0}</span>
          </div>
        </div>

        <button
          onClick={onConfirm}
          className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 font-semibold"
        >
          {t("confirm")}
        </button>
      </div>
    </div>
  );
}
