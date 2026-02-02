import { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatTime } from "../utils/utils";

interface TimerEditorViewProps {
  timerDuration: number;
  onConfirm: (timerDuration: number) => void;
  onCancel: () => void;
}

export function TimerEditorView({
  timerDuration,
  onConfirm,
  onCancel,
}: TimerEditorViewProps) {
  const { t } = useTranslation();

  const [updatedTimerDuration, setUpdatedTimerDuration] =
    useState(timerDuration);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl bg-zinc-800 shadow-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold text-center">
          {t("timerEditorView.timerEdit")}
        </h2>

        {/* Timer duration */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm uppercase tracking-wide text-zinc-400">
              {t("timerEditorView.timerDuration")}
            </span>
            <span className="text-lg font-bold">
              {formatTime(updatedTimerDuration)}
            </span>
          </div>

          <input
            type="range"
            min={30}
            max={600}
            step={10}
            value={updatedTimerDuration}
            onChange={(e) => setUpdatedTimerDuration(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Cancel button */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 py-2 font-semibold"
          >
            {t("cancel")}
          </button>

          {/* Confirm button */}
          <button
            onClick={() => onConfirm(updatedTimerDuration)}
            className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 font-semibold"
          >
            {t("confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
