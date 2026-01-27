import type { Player } from "../gameLogic/types";
import { ROLES } from "../constants/roles";
import { Trans, useTranslation } from "react-i18next";

interface AliveRolesComponentProps {
  players: Player[];
}

export function AliveRolesComponent({ players }: AliveRolesComponentProps) {
  const { t } = useTranslation();

  const alivePlayers = players.filter((p) => p.alive);

  const authenticsAlive = alivePlayers.filter(
    (p) => p.role === "authentic",
  ).length;

  const masksAlive = alivePlayers.filter((p) => p.role === "mask").length;

  const hasChameleon = players.some((p) => p.role === "chameleon");
  const chameleonAlive = alivePlayers.some((p) => p.role === "chameleon");

  return (
    <div className="bg-zinc-700 rounded-lg p-3 text-sm text-zinc-200 space-y-1">
      <p>
        {ROLES.authentic.icon}{" "}
        <Trans
          i18nKey="authenticsAlive"
          count={authenticsAlive}
          values={{ count: authenticsAlive }}
          components={{
            bold: <span className="font-semibold" />,
          }}
        />
      </p>

      <p>
        {ROLES.mask.icon}{" "}
        <Trans
          i18nKey="masksAlive"
          count={masksAlive}
          values={{ count: masksAlive }}
          components={{
            bold: <span className="font-semibold" />,
          }}
        />
      </p>

      {hasChameleon && (
        <p>
          {ROLES.chameleon.icon}{" "}{t("chameleonStatus")}{" "}
          <span className="font-semibold">
            {chameleonAlive ? t("aliveStatus") : t("eliminatedStatus")}
          </span>
        </p>
      )}
    </div>
  );
}
