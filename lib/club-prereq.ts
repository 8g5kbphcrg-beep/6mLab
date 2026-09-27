// Prerequisites expected for each side, age group and level of play (club quote form, the "i"
// next to the level). A coach whose team lacks them picks the level below, or does not ask for a
// quote. Lists to come from 6M Lab: while one is empty, the general explanation is shown instead.
// Key: <side f|m>-<category u15|u17|u18|seniors>-<level departemental|regional|national|pro>.
// Seniors start at regional: there is no county-level seniors program.
export const CLUB_PREREQ: Record<string, { fr: string[]; en: string[] }> = {
  // Féminines
  "f-u15-departemental": { fr: [], en: [] },
  "f-u15-regional": { fr: [], en: [] },
  "f-u17-departemental": { fr: [], en: [] },
  "f-u17-regional": { fr: [], en: [] },
  "f-u17-national": { fr: [], en: [] },
  "f-seniors-regional": { fr: [], en: [] },
  "f-seniors-national": { fr: [], en: [] },
  "f-seniors-pro": { fr: [], en: [] },
  // Masculins
  "m-u15-departemental": { fr: [], en: [] },
  "m-u15-regional": { fr: [], en: [] },
  "m-u18-departemental": { fr: [], en: [] },
  "m-u18-regional": { fr: [], en: [] },
  "m-u18-national": { fr: [], en: [] },
  "m-seniors-regional": { fr: [], en: [] },
  "m-seniors-national": { fr: [], en: [] },
  "m-seniors-pro": { fr: [], en: [] },
};

export const CAT_KEYS = { f: ["u15", "u17", "seniors"], m: ["u15", "u18", "seniors"] } as const;
export const LEVEL_KEYS = ["departemental", "regional", "national", "pro"] as const;
