import { useState } from "react";
import type { RoleWinPoints } from "../gameLogic/types";
import { useTranslation } from "react-i18next";

interface RulesEditorViewProps {
  roleWinPoints: RoleWinPoints;
  chameleonGuessPossible: boolean;
  onConfirm: (
    roleWinPoints: RoleWinPoints,
    chameleonGuessPossible: boolean,
  ) => void;
  onCancel: () => void;
}

export function RulesEditorView({
  roleWinPoints,
  chameleonGuessPossible,
  onConfirm,
  onCancel,
}: RulesEditorViewProps) {
  const { t } = useTranslation();
  
  const [updatedRoleWinPoints, setUpdatedRoleWinPoints] = useState(() => ({
    authentic: roleWinPoints.authentic,
    mask: roleWinPoints.mask,
    chameleon: roleWinPoints.chameleon,
  }));

  const [updatedChameleonGuessPossible, setUpdatedChameleonGuessPossible] =
    useState(chameleonGuessPossible);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl bg-zinc-800 shadow-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold text-center">{t("rulesEditorView.gameRules")}</h2>

        {/* Authentic win points */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm uppercase tracking-wide text-zinc-400">
              {t("rulesEditorView.authenticWinPoints")}
            </span>
            <span className="text-lg font-bold">
              {updatedRoleWinPoints.authentic}
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={updatedRoleWinPoints.authentic}
            onChange={(e) =>
              setUpdatedRoleWinPoints((prev) => ({
                ...prev,
                authentic: Number(e.target.value),
              }))
            }
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Mask win points */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm uppercase tracking-wide text-zinc-400">
              {t("rulesEditorView.maskWinPoints")}
            </span>
            <span className="text-lg font-bold">
              {updatedRoleWinPoints.mask}
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={updatedRoleWinPoints.mask}
            onChange={(e) =>
              setUpdatedRoleWinPoints((prev) => ({
                ...prev,
                mask: Number(e.target.value),
              }))
            }
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Chameleon win points */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm uppercase tracking-wide text-zinc-400">
              {t("rulesEditorView.chameleonWinPoints")}
            </span>
            <span className="text-lg font-bold">
              {updatedRoleWinPoints.chameleon}
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={updatedRoleWinPoints.chameleon}
            onChange={(e) =>
              setUpdatedRoleWinPoints((prev) => ({
                ...prev,
                chameleon: Number(e.target.value),
              }))
            }
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Chameleon guess toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm uppercase tracking-wide text-zinc-400">
            {t("rulesEditorView.chameleonCanGuessTheWord")}
          </span>

          <button
            onClick={() => setUpdatedChameleonGuessPossible((prev) => !prev)}
            className={`
                relative w-12 h-6 rounded-full transition
                ${updatedChameleonGuessPossible ? "bg-emerald-500" : "bg-zinc-600"}
            `}
          >
            <span
              className={`
                absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform
                ${updatedChameleonGuessPossible ? "translate-x-6" : "translate-x-0"}
              `}
            />
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 py-2 font-semibold"
          >
            {t("cancel")}
          </button>

          <button
            onClick={() =>
              onConfirm(updatedRoleWinPoints, updatedChameleonGuessPossible)
            }
            className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 font-semibold"
          >
            {t("confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
