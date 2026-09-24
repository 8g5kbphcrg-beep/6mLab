// A 7-metre throw seen from behind the shooter: striped handball goal, goalkeeper,
// 6 m zone and dashed 9 m line. One SMIL timeline of 3.6 s drives the arm, the ball and the keeper.
import { BALL } from "@/components/Logo";
import { MARK_VIEWBOX, markSvg } from "@/lib/mark.mjs";

const T = { dur: "3.6s", repeatCount: "indefinite" } as const;
const KT = "0;.1;.15;.24;.6;1";

type P = [number, number];
const S: P = [172, 219]; // throwing shoulder
// Elbow and hand per keyframe: cocked, cocked, release, follow-through, hold, back to cocked.
const E: P[] = [[193, 207], [193, 207], [185, 190], [183, 231], [183, 231], [193, 207]];
const H: P[] = [[195, 174], [195, 174], [205, 162], [165, 255], [165, 255], [195, 174]];
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const seq = (f: (i: number) => string) => E.map((_, i) => f(i)).join(";");
const upper = seq((i) => `M${S}L${E[i]}`);
const sleeve = seq((i) => `M${S}L${lerp(S, E[i], 0.5)}`);
const fore = seq((i) => `M${E[i]}L${H[i]}`);

const SKIN = "#C98E6B", SKIN2 = "#7A4A32", HAIR = "#2B1D17", JERSEY = "#FF7A59", SHORTS = "#1E1745";

export default function Scene() {
  return (
    <svg className="scene" viewBox="0 0 480 340" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="ballclip"><circle r="10" /></clipPath>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#241B4A" />
          <stop offset="1" stopColor="#15102E" />
        </linearGradient>
        <linearGradient id="jersey" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E0460F" />
          <stop offset=".45" stopColor={JERSEY} />
          <stop offset="1" stopColor="#C73A0A" />
        </linearGradient>
      </defs>

      {/* Court */}
      <path d="M0 262H480V340H0Z" fill="url(#floor)" />
      <path d="M40 262C70 322 410 322 440 262Z" fill="#2E2360" />
      <path d="M40 262C70 322 410 322 440 262" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="2.5" />
      <path d="M-10 286C40 352 440 352 490 286" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="2" strokeDasharray="10 9" />
      <path d="M0 262H480" stroke="#fff" strokeOpacity=".35" strokeWidth="2" />
      <path d="M226 318H254" stroke="#fff" strokeOpacity=".7" strokeWidth="3" strokeLinecap="round" />

      {/* Goal: 3 m x 2 m with depth, red and white posts */}
      <g className="goalnet" stroke="#fff" strokeOpacity=".15" strokeWidth="1" fill="none">
        <path d="M150 142L164 152H316L330 142M164 152V258M316 152V258M150 262L164 258H316L330 262" strokeOpacity=".35" />
        <path d="M181 152V258M198 152V258M215 152V258M232 152V258M249 152V258M266 152V258M283 152V258M300 152V258" />
        <path d="M164 167H316M164 182H316M164 197H316M164 212H316M164 227H316M164 242H316" />
      </g>
      <path d="M150 262V142H330V262" fill="none" stroke="#fff" strokeWidth="7" strokeLinejoin="round" />
      <path d="M150 262V142H330V262" fill="none" stroke="#E32B2B" strokeWidth="7" strokeDasharray="12 12" strokeLinejoin="round" />

      {/* Goalkeeper, facing us, arms and legs spread; leans towards the ball */}
      <ellipse cx="240" cy="263" rx="22" ry="3" fill="#000" opacity=".35" />
      <g strokeLinecap="round" strokeLinejoin="round">
        <animateTransform attributeName="transform" type="rotate" {...T} values="0 240 262;0 240 262;9 240 262;9 240 262;0 240 262" keyTimes="0;.2;.38;.8;1" />
        <path d="M235 236L228 258M245 236L252 258" stroke={SKIN2} strokeWidth="5" />
        <path d="M235 236L230 250M245 236L250 250" stroke="#111" strokeWidth="6.5" />
        <path d="M224 259h7M249 259h7" stroke="#fff" strokeWidth="4" />
        <path d="M233 234L231 244H249L247 234Z" fill="#111" />
        <path d="M232 208Q240 205 248 208L249 236H231Z" fill="#2EC4B6" />
        <svg x="236" y="212" width="8" height="9" viewBox={MARK_VIEWBOX} dangerouslySetInnerHTML={{ __html: markSvg("#100A24", "#fff") }} />
        <path d="M233 210L221 192M247 210L259 192" stroke="#2EC4B6" strokeWidth="5.5" />
        <circle cx="220" cy="189" r="3.2" fill={SKIN2} /><circle cx="260" cy="189" r="3.2" fill={SKIN2} />
        <path d="M237 203h6v6h-6z" fill={SKIN2} />
        <circle cx="240" cy="197" r="7" fill={SKIN2} />
        <path d="M233 196a7 7 0 0 1 14 0q-7-4-14 0z" fill="#140C08" />
      </g>

      {/* Ball in flight */}
      <g opacity="0">
        <animate attributeName="opacity" {...T} values="0;1;1;0" keyTimes="0;.15;.82;1" calcMode="discrete" />
        <animateMotion {...T} path="M171 150Q248 138 314 156" keyPoints="0;0;1;1" keyTimes="0;.15;.38;1" calcMode="linear" />
        <g>
          <animateTransform attributeName="transform" type="scale" {...T} values="1;1;.55;.55" keyTimes="0;.15;.38;1" />
          <g dangerouslySetInnerHTML={{ __html: BALL }} />
        </g>
      </g>

      {/* Shooter seen from behind, on the 7 m line */}
      <g transform="translate(-34 0)" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="156" cy="338" rx="38" ry="5" fill="#000" opacity=".35" />
        {/* Legs: left foot planted forward, right leg pushing back */}
        <path d="M137 290Q134 312 132 330L140 331Q145 312 150 291Z" fill={SKIN} />
        <path d="M156 290Q166 304 170 316Q174 326 178 334L186 331Q182 318 178 308Q172 296 166 288Z" fill={SKIN} />
        <path d="M131 326L141 327L140 333L131 332Z" fill="#F3F1FB" />
        <path d="M176 328L186 325L188 331L178 334Z" fill="#F3F1FB" />
        <path d="M126 331Q125 338 132 339H146Q148 334 141 332Z" fill="#fff" />
        <path d="M126 336H147" stroke="#100A24" strokeWidth="2" />
        <path d="M176 333Q175 339 182 339H194Q195 333 188 330Z" fill="#fff" />
        <path d="M176 337H195" stroke="#100A24" strokeWidth="2" />
        {/* Shorts */}
        <path d="M133 268H169L173 296L153 298L151 288L149 298L129 296Z" fill={SHORTS} />
        <path d="M131 292L149 293M153 293L171 292" stroke="#FFC75F" strokeWidth="1.5" />
        {/* Left arm, relaxed */}
        <path d="M128 222L114 244L108 262" stroke={SKIN} strokeWidth="10" fill="none" />
        <circle cx="107" cy="265" r="5.5" fill={SKIN} />
        <path d="M130 219L120 236" stroke="url(#jersey)" strokeWidth="15" />
        {/* Jersey with sponsor and number */}
        <path d="M125 222Q126 213 138 211H164Q176 213 177 222L171 274H131Z" fill="url(#jersey)" />
        <path d="M168 218L171 274H163Z" fill="#000" opacity=".12" />
        <path d="M138 211Q151 216 164 211" stroke="#C73A0A" strokeWidth="3" fill="none" />
        <svg x="145" y="218" width="12" height="14" viewBox={MARK_VIEWBOX} dangerouslySetInnerHTML={{ __html: markSvg("#FFC75F", "#fff") }} />
        <text x="151" y="265" textAnchor="middle" fontSize="28" fill="#fff" style={{ fontFamily: "var(--font-display), Impact, sans-serif" }}>7</text>
        {/* Neck and head, from behind: hair, ears */}
        <path d="M145 200h12v12h-12z" fill={SKIN} />
        <ellipse cx="136.5" cy="193" rx="3" ry="4.5" fill={SKIN} />
        <ellipse cx="165.5" cy="193" rx="3" ry="4.5" fill={SKIN} />
        <ellipse cx="151" cy="189" rx="14" ry="16" fill={HAIR} />
        <path d="M140 200Q151 206 162 200" stroke={HAIR} strokeWidth="3" fill="none" />
        {/* Throwing arm */}
        <path d={`M${S}L${E[0]}`} stroke={SKIN} strokeWidth="11" fill="none"><animate attributeName="d" {...T} values={upper} keyTimes={KT} /></path>
        <path d={`M${E[0]}L${H[0]}`} stroke={SKIN} strokeWidth="9" fill="none"><animate attributeName="d" {...T} values={fore} keyTimes={KT} /></path>
        <path d={`M${S}L${lerp(S, E[0], 0.5)}`} stroke="url(#jersey)" strokeWidth="15" fill="none"><animate attributeName="d" {...T} values={sleeve} keyTimes={KT} /></path>
        <g opacity="1">
          <animateTransform attributeName="transform" type="translate" {...T} values={H.map((h) => `${h[0]} ${h[1] - 9}`).join(";")} keyTimes={KT} />
          <animate attributeName="opacity" {...T} values="1;0;1" keyTimes="0;.15;.95" calcMode="discrete" />
          <g dangerouslySetInnerHTML={{ __html: BALL }} />
        </g>
        <circle cx={H[0][0]} cy={H[0][1]} r="5.5" fill={SKIN}>
          <animate attributeName="cx" {...T} values={H.map((h) => h[0]).join(";")} keyTimes={KT} />
          <animate attributeName="cy" {...T} values={H.map((h) => h[1]).join(";")} keyTimes={KT} />
        </circle>
      </g>
    </svg>
  );
}
