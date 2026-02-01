import { useTranslation, Trans } from "react-i18next";
import { AliveRolesComponent } from "../components/AliveRolesComponent";
import type { Player } from "../gameLogic/types";
import { useEffect, useRef, useState } from "react";
import { RulesView } from "./RulesView";
import { TimerEditorView } from "./TimerEditorView";
import { ForgotWordView } from "./ForgotWordView";
import { formatTime } from "../utils/utils";

type DiscussionState = "discussion" | "rules" | "timerEdit" | "forgotWord";

interface DiscussionViewProps {
  players: Player[];
  startingPlayerIndex: number;
  startingPlayerName: string;
  timerDuration: number;
  setTimerDuration: React.Dispatch<React.SetStateAction<number>>;
  onStartVote: () => void;
}

export function DiscussionView({
  players,
  startingPlayerIndex,
  startingPlayerName,
  timerDuration,
  setTimerDuration,
  onStartVote,
}: DiscussionViewProps) {
  const { t } = useTranslation();

  const [state, setState] = useState<DiscussionState>("discussion");

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startAudioRef = useRef<HTMLAudioElement | null>(null);
  const intervalsAudioRef = useRef<HTMLAudioElement | null>(null);
  const tickAudioRef = useRef<HTMLAudioElement | null>(null);
  const endAudioRef = useRef<HTMLAudioElement | null>(null);

  const startingPlayer = players[startingPlayerIndex];

  const startInterval = () => {
    if (timerRef.current) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return 0;

        const next = prev - 1;

        if ([30, 20, 10].includes(next)) {
          intervalsAudioRef.current?.play();
        } else if ([4, 3, 2, 1].includes(next)) {
          tickAudioRef.current?.play();
        }

        if (next <= 0) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return 0;
        }

        return next;
      });
    }, 1000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Pause when leaving discussion
  useEffect(() => {
    if (state !== "discussion" && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [state]);

  // Resume timer if returning to discussion
  useEffect(() => {
    if (
      state === "discussion" &&
      timeLeft !== null &&
      timeLeft > 0 &&
      !timerRef.current
    ) {
      startInterval();
    }
  }, [state, timeLeft]);

  // Handle timer reaching zero
  useEffect(() => {
    if (timeLeft === 0) {
      if (endAudioRef.current) {
        const audio = endAudioRef.current;
        audio.currentTime = 0;

        audio.play().then(() => {
          audio.onended = onStartVote;
        });
      } else {
        onStartVote();
      }
    }
  }, [timeLeft, onStartVote]);

  const onTimerStart = () => {
    // prevent duplicates
    if (timerRef.current) return;

    startAudioRef.current?.play();

    setTimeLeft((prev) => prev ?? timerDuration);

    startInterval();
  };

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

            {timeLeft === null && (
              <div className="flex gap-3">
                <button
                  onClick={onTimerStart}
                  className="flex-[3] w-full mt-4 rounded-lg py-2 transition bg-zinc-600 hover:bg-zinc-500"
                >
                  {"▶️ "}
                  {t("discussionView.startTimer", {
                    formattedTime: formatTime(timerDuration),
                  })}
                </button>

                <button
                  onClick={() => setState("timerEdit")}
                  className="flex-[1] w-full mt-4 rounded-lg py-2 transition bg-zinc-600 hover:bg-zinc-500"
                >
                  {"⚙️ "}
                  {t("discussionView.timerEdit")}
                </button>
              </div>
            )}

            {timeLeft !== null && (
              <div className="mt-4 text-center">
                <p className="text-sm text-zinc-400">
                  {t("discussionView.timeRemaining")}
                </p>
                <p
                  className={`text-2xl font-mono font-bold ${
                    timeLeft <= 30 ? "text-red-400" : "text-zinc-100"
                  }`}
                >
                  {formatTime(timeLeft)}
                </p>
              </div>
            )}

            <audio ref={startAudioRef} src="/sounds/start.wav" preload="auto" />
            <audio
              ref={intervalsAudioRef}
              src="/sounds/intervals.wav"
              preload="auto"
            />
            <audio ref={tickAudioRef} src="/sounds/tick.wav" preload="auto" />
            <audio ref={endAudioRef} src="/sounds/end.wav" preload="auto" />

            <div className="flex gap-3">
              <button
                onClick={() => setState("rules")}
                className="w-full rounded-lg bg-zinc-600 hover:bg-zinc-500 py-2"
              >
                {t("howToPlay")}
              </button>

              <button
                onClick={() => setState("forgotWord")}
                className="w-full rounded-lg bg-teal-700 hover:bg-teal-600 py-2"
              >
                {t("discussionView.IForgotMyWord")}
              </button>
            </div>
          </div>
        </div>
      );

    case "rules":
      return <RulesView onClose={() => setState("discussion")} />;

    case "timerEdit":
      return (
        <TimerEditorView
          timerDuration={timerDuration}
          onConfirm={(newTimerDuration) => {
            setTimerDuration(newTimerDuration);
            setState("discussion");
          }}
          onCancel={() => setState("discussion")}
        />
      );

    case "forgotWord":
      return (
        <ForgotWordView
          players={players}
          onBackToDiscussion={() => setState("discussion")}
        />
      );
  }
}
