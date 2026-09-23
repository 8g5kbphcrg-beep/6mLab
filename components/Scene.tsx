// A 7-metre throw seen from behind the shooter: striped handball goal, goalkeeper,
// 6 m line and dashed 9 m line. One SMIL timeline of 3.6 s drives the arm, the ball and the keeper.
const T = { dur: "3.6s", repeatCount: "indefinite" } as const;

export default function Scene() {
  return (
    <svg className="scene" viewBox="0 0 480 340" aria-hidden="true" focusable="false">
      {/* Court */}
      <path d="M0 262H480" stroke="#fff" strokeOpacity=".25" strokeWidth="2" />
      <path d="M40 262C70 322 410 322 440 262" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="3" />
      <path d="M-10 286C40 352 440 352 490 286" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="2" strokeDasharray="10 9" />
      <path d="M226 318H254" stroke="#fff" strokeOpacity=".6" strokeWidth="3" strokeLinecap="round" />

      {/* Goal: 3 m x 2 m, red and white posts */}
      <g className="goalnet" stroke="#fff" strokeOpacity=".16" strokeWidth="1">
        <path d="M168 142V262M186 142V262M204 142V262M222 142V262M240 142V262M258 142V262M276 142V262M294 142V262M312 142V262" />
        <path d="M150 160H330M150 178H330M150 196H330M150 214H330M150 232H330M150 250H330" />
      </g>
      <path d="M150 262V142H330V262" fill="none" stroke="#fff" strokeWidth="7" strokeLinejoin="round" />
      <path d="M150 262V142H330V262" fill="none" stroke="#FF5A1F" strokeWidth="7" strokeDasharray="12 12" strokeLinejoin="round" />

      {/* Goalkeeper, arms up, leans towards the ball */}
      <g stroke="#00C2B2" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" {...T} values="0 240 262;0 240 262;9 240 262;9 240 262;0 240 262" keyTimes="0;.2;.38;.8;1" />
        <path d="M240 236L227 261M240 236L253 261" strokeWidth="7" />
        <path d="M240 210V236" strokeWidth="13" />
        <path d="M234 212L217 190M246 212L263 190" strokeWidth="6" />
        <circle cx="240" cy="198" r="8" fill="#00C2B2" stroke="none" />
      </g>

      {/* Ball in flight */}
      <g opacity="0">
        <animate attributeName="opacity" {...T} values="0;1;1;0" keyTimes="0;.15;.82;1" calcMode="discrete" />
        <animateMotion {...T} path="M170 152Q248 140 314 156" keyPoints="0;0;1;1" keyTimes="0;.15;.38;1" calcMode="linear" />
        <g>
          <animateTransform attributeName="transform" type="scale" {...T} values="1;1;.55;.55" keyTimes="0;.15;.38;1" />
          <circle r="11" fill="#FFE14A" stroke="#100A24" strokeWidth="1.5" />
          <path d="M-11 0Q0 -6 11 0M0 -11Q-6 0 0 11" fill="none" stroke="#100A24" strokeWidth="1.3" />
        </g>
      </g>

      {/* Shooter seen from behind, on the 7 m line */}
      <g transform="translate(-34 0)" strokeLinecap="round" strokeLinejoin="round">
        <path d="M143 292L133 338M159 292L171 316L181 338" stroke="#CFC8EE" strokeWidth="11" fill="none" />
        <path d="M134 270H168L172 294H130Z" fill="#4A3F7A" />
        <path d="M130 214H172L167 272H135Z" fill="#FF5A1F" />
        <text x="151" y="258" textAnchor="middle" fontSize="32" fill="#100A24" style={{ fontFamily: "var(--font-display), Impact, sans-serif" }}>7</text>
        <path d="M133 219L113 247" stroke="#CFC8EE" strokeWidth="9" />
        <circle cx="151" cy="198" r="15" fill="#CFC8EE" />
        <path d="M136 195A15 15 0 0 1 166 195Q151 188 136 195Z" fill="#4A3F7A" />
        <path d="M170 218L194 206L196 170" stroke="#CFC8EE" strokeWidth="9" fill="none">
          <animate attributeName="d" {...T} values="M170 218L194 206L196 170;M170 218L194 206L196 170;M170 218L186 188L204 160;M170 218L182 228L166 254;M170 218L182 228L166 254;M170 218L194 206L196 170" keyTimes="0;.1;.15;.24;.6;1" />
        </path>
        <circle cx="196" cy="162" r="11" fill="#FFE14A" stroke="#100A24" strokeWidth="1.5">
          <animate attributeName="cx" {...T} values="196;196;204;166;166;196" keyTimes="0;.1;.15;.24;.6;1" />
          <animate attributeName="cy" {...T} values="162;162;152;262;262;162" keyTimes="0;.1;.15;.24;.6;1" />
          <animate attributeName="opacity" {...T} values="1;0;1" keyTimes="0;.15;.95" calcMode="discrete" />
        </circle>
      </g>
    </svg>
  );
}
