export interface GameSetup {
  players: number;
  authentics: number;
  masks: number;
  chameleon: boolean;
}

export interface GameSetupControls {
  canAddPlayer: boolean;
  canRemovePlayer: boolean;
  canAddMask: boolean;
  canRemoveMask: boolean;
  canToggleChameleon: boolean;
}

const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;

export function getMaxMasks(
  players: number,
  includeChameleon: boolean,
): number {
  return Math.max(
    1,
    Math.floor((players - 1 - (includeChameleon ? 1 : 0)) / 2),
  );
}

function recalcAuthentics(setup: GameSetup): GameSetup {
  const authentics = setup.players - setup.masks - (setup.chameleon ? 1 : 0);

  return {
    ...setup,
    authentics,
  };
}

export function normalizeSetup(setup: GameSetup): GameSetup {
  const players = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, setup.players));

  const chameleon = setup.chameleon && players > 3;

  let masks = Math.min(
    getMaxMasks(players, setup.chameleon),
    Math.max(1, setup.masks),
  );

  let normalized = recalcAuthentics({
    players,
    masks,
    chameleon,
    authentics: 0, // recalculated
  });

  // Enforce authentics rules
  if (normalized.authentics < 2 || normalized.authentics <= normalized.masks) {
    masks = Math.max(1, masks - 1);
    normalized = recalcAuthentics({
      players,
      masks,
      chameleon,
      authentics: 0,
    });
  }

  return normalized;
}

/**
 * Compute what the UI is allowed to do
 */
export function getControls(setup: GameSetup): GameSetupControls {
  return {
    canAddPlayer: setup.players < MAX_PLAYERS,
    canRemovePlayer: setup.players > MIN_PLAYERS,

    canAddMask: setup.masks < getMaxMasks(setup.players, setup.chameleon),

    canRemoveMask: setup.masks > 1,

    canToggleChameleon: setup.players > 3,
  };
}

/**
 * Actions (safe to call from UI)
 */
export const GameSetupActions = {
  addPlayer(setup: GameSetup): GameSetup {
    const newSetup = normalizeSetup({
      ...setup,
      players: setup.players + 1,
    });

    return normalizeSetup({
      ...newSetup,
      masks: getMaxMasks(newSetup.players, newSetup.chameleon),
    });
  },

  removePlayer(setup: GameSetup): GameSetup {
    return normalizeSetup({
      ...setup,
      players: setup.players - 1,
    });
  },

  addMask(setup: GameSetup): GameSetup {
    return normalizeSetup({
      ...setup,
      masks: setup.masks + 1,
    });
  },

  removeMask(setup: GameSetup): GameSetup {
    return normalizeSetup({
      ...setup,
      masks: setup.masks - 1,
    });
  },

  toggleChameleon(setup: GameSetup): GameSetup {
    return normalizeSetup({
      ...setup,
      chameleon: !setup.chameleon,
    });
  },
};

export function createDefaultSetup(players = 5): GameSetup {
  return normalizeSetup({
    players,
    masks: 1,
    chameleon: true,
    authentics: 0,
  });
}
