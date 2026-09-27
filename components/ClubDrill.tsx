import type { Lang } from "@/lib/dict";

// Example of a club session drill, drawn on half a handball court: agility ladder, cone slalom,
// then a shot on goal, in relay by groups. Shows the collective, handball-like side of the club
// program (colors from the theme tokens).
export default function ClubDrill({ lang }: { lang: Lang }) {
  const fr = lang === "fr";
  const cones = [[150, 180], [190, 150], [230, 180], [270, 150]];
  return (
    <figure className="drill">
      <svg viewBox="0 0 420 300" role="img" aria-label={fr ? "Exemple de situation : échelle de rythme, slalom entre les plots, puis tir, en relais par groupes" : "Sample drill: agility ladder, cone slalom, then a shot, as a relay in groups"}>
        <rect x="6" y="6" width="408" height="288" rx="10" className="d-court" />
        {/* Goal and 6 m / 9 m lines at the top. */}
        <rect x="180" y="6" width="60" height="10" className="d-goal" />
        <path d="M90 6 A120 90 0 0 0 330 6" className="d-line" />
        <path d="M50 6 A160 125 0 0 0 370 6" className="d-line dash" />
        {/* 1. Ladder. */}
        <rect x="40" y="200" width="30" height="80" rx="3" className="d-ladder" />
        {[215, 230, 245, 260].map((y) => <line key={y} x1="40" x2="70" y1={y} y2={y} className="d-rung" />)}
        {/* 2. Cones. */}
        {cones.map(([x, y]) => <path key={x} d={`M${x} ${y - 11} L${x + 9} ${y + 6} L${x - 9} ${y + 6} Z`} className="d-cone" />)}
        {/* Path of the player: out of the ladder, slalom, then shot. */}
        <path d="M55 196 C60 170 110 175 130 170 S170 125 190 138 S220 200 240 190 S265 125 290 130 S320 110 300 60" className="d-run" markerEnd="url(#arr)" />
        <path d="M300 60 L218 22" className="d-shot" markerEnd="url(#arr2)" />
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" className="d-arrow" /></marker>
          <marker id="arr2" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" className="d-arrow2" /></marker>
        </defs>
        {/* Players waiting in line and the ball. */}
        {[[100, 270], [120, 270], [140, 270]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="8" className="d-player" />)}
        <circle cx="300" cy="60" r="8" className="d-player on" />
        <circle cx="312" cy="52" r="5" className="d-ball" />
        <g className="d-num">
          <circle cx="86" cy="210" r="11" /><text x="86" y="214">1</text>
          <circle cx="210" cy="206" r="11" /><text x="210" y="210">2</text>
          <circle cx="336" cy="84" r="11" /><text x="336" y="88">3</text>
        </g>
      </svg>
      <figcaption>
        <strong>{fr ? "Exemple de situation, en relais par groupes" : "Sample drill, as a relay in groups"}</strong>
        <ol>
          <li>{fr ? "Échelle de rythme : appuis rapides" : "Agility ladder: quick feet"}</li>
          <li>{fr ? "Slalom entre les plots : changements de direction" : "Cone slalom: changes of direction"}</li>
          <li>{fr ? "Réception de passe et tir en fin d'effort" : "Catch a pass and shoot at the end of the effort"}</li>
        </ol>
      </figcaption>
    </figure>
  );
}
