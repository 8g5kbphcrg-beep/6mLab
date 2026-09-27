// What a club can train with (quote form, app/[lang]/clubs): places, then equipment. For each one
// the coach ticks when it is available: pre-season, season, or both. The club program is built
// around it (collective, handball-like drills with the club's equipment).
export const CLUB_PLACES = [
  ["gymnase", "Gymnase ou salle de handball", "Sports hall"],
  ["exterieur", "Terrain extérieur ou stade", "Outdoor pitch or stadium"],
  ["piste", "Piste d'athlétisme", "Athletics track"],
  ["muscu", "Salle de musculation (en plus du gymnase)", "Weight room (on top of the hall)"],
] as const;

export const CLUB_GEAR = [
  ["plots", "Plots ou coupelles", "Cones or markers"],
  ["echelles", "Échelles de rythme", "Agility ladders"],
  ["haies", "Haies basses ou mini-haies", "Mini hurdles"],
  ["medecine", "Médecine-balls ou ballons lestés", "Medicine balls"],
  ["elastiques", "Élastiques ou bandes de résistance", "Resistance bands"],
  ["cerceaux", "Cerceaux", "Hoops"],
  ["cordes", "Cordes à sauter", "Jump ropes"],
  ["tapis", "Tapis de sol", "Floor mats"],
  ["charges", "Haltères, kettlebells ou barres", "Dumbbells, kettlebells or bars"],
  ["banc", "Bancs ou plinths", "Benches or boxes"],
] as const;

export const CLUB_WHEN = [["pre", "Pré-saison", "Pre-season"], ["saison", "Saison", "Season"]] as const;

// "Pré-saison et saison", "Pré-saison"… for the email to 6M Lab, from the ticked boxes.
export const whenLabel = (v: string[]) => (v.includes("pre") && v.includes("saison") ? "pré-saison et saison" : v.includes("pre") ? "pré-saison seulement" : v.includes("saison") ? "saison seulement" : "");
