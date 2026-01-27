import { Trans, useTranslation } from "react-i18next";
import { ROLES } from "../constants/roles";

interface RulesViewProps {
  onClose: () => void;
}

export function RulesView({ onClose }: RulesViewProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-zinc-800 text-zinc-300 shadow-lg p-6 space-y-6">
        {/* Title */}
        <header className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight  text-zinc-100">
            {t("howToPlay")}
          </h1>
          <p className="text-sm text-zinc-400">
            {t("rulesView.camouflageDescription")}
          </p>
        </header>

        {/* Roles */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-200">
            {t("rulesView.roles")}
          </h2>

          <div className="space-y-3">
            <div className="rounded-lg bg-zinc-700 p-4">
              <h3 className="font-semibold text-zinc-200">
                {ROLES.authentic.icon} {t("authenticPlural")}
              </h3>
              <p className="text-sm text-zinc-300">
                {t("rulesView.authenticObjective")}
              </p>
            </div>

            <div className="rounded-lg bg-zinc-700 p-4">
              <h3 className="font-semibold text-zinc-200">
                {ROLES.mask.icon} {t("maskPlural")}
              </h3>
              <p className="text-sm text-zinc-300">
                {t("rulesView.maskObjective")}
              </p>
            </div>

            <div className="rounded-lg bg-zinc-700 p-4">
              <h3 className="font-semibold text-zinc-200">
                {ROLES.chameleon.icon} {t("chameleon")}
              </h3>
              <p className="text-sm text-zinc-300">
                {t("rulesView.chameleonObjective")}
              </p>
            </div>
          </div>
        </section>

        {/* Gameplay */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-200">
            {t("rulesView.gameplay.title")}
          </h2>

          <div className="space-y-3 text-sm">
            <p>
              <Trans
                i18nKey="rulesView.gameplay.paragraph1"
                components={{ bold: <span className="font-semibold" /> }}
              />
            </p>

            <p>{t("rulesView.gameplay.paragraph2")}</p>

            <p>{t("rulesView.gameplay.paragraph3")}</p>

            <p>
              <Trans
                i18nKey="rulesView.gameplay.paragraph4"
                components={{ bold: <span className="font-semibold" /> }}
              />
            </p>
          </div>
        </section>

        {/* Voting */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-200">
            {t("rulesView.voting.title")}
          </h2>

          <div className="space-y-3 text-sm">
            <p>{t("rulesView.voting.paragraph1")}</p>

            <p>
              <Trans
                i18nKey="rulesView.voting.paragraph2"
                components={{ bold: <span className="font-semibold" /> }}
              />
            </p>

            <p>{t("rulesView.voting.paragraph3")}</p>

            <p>{t("rulesView.voting.paragraph4")}</p>

            <p>{t("rulesView.voting.paragraph5")}</p>
          </div>
        </section>

        {/* Chameleon Last Chance */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-200">
            {t("rulesView.chameleonGuess.title")}
          </h2>

          <div className="space-y-3 text-sm">
            <p>{t("rulesView.chameleonGuess.paragraph1")}</p>

            <p>
              <Trans
                i18nKey="rulesView.chameleonGuess.paragraph2"
                components={{ bold: <span className="font-semibold" /> }}
              />
            </p>

            <p>{t("rulesView.chameleonGuess.paragraph3")}</p>
          </div>
        </section>

        {/* Rounds */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-200">
            {t("rulesView.rounds.title")}
          </h2>

          <div className="space-y-3 text-sm">
            <p>{t("rulesView.rounds.paragraph1")}</p>
          </div>
        </section>

        {/* Win Conditions */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-200">
            {t("rulesView.winConditions.title")}
          </h2>

          <ul className="space-y-2 text-sm">
            <li>
              <Trans
                i18nKey="rulesView.winConditions.condition1"
                components={{ bold: <span className="font-semibold" /> }}
              />
            </li>
            <li>
              <Trans
                i18nKey="rulesView.winConditions.condition2"
                components={{ bold: <span className="font-semibold" /> }}
              />
            </li>
            <li>
              <Trans
                i18nKey="rulesView.winConditions.condition3"
                components={{ bold: <span className="font-semibold" /> }}
              />
            </li>
            <li>
              <Trans
                i18nKey="rulesView.winConditions.condition4"
                components={{ bold: <span className="font-semibold" /> }}
              />
            </li>
          </ul>
        </section>

        <button
          onClick={onClose}
          className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-3 text-lg font-semibold"
        >
          {t("continue")}
        </button>
      </div>
    </div>
  );
}
