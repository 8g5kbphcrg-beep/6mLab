export default function Scene() {
  return (
    <svg className="scene" viewBox="0 0 480 340" aria-hidden="true" focusable="false">
      <path d="M0 320H480" stroke="#fff" strokeOpacity=".3" strokeWidth="3" />
      <path d="M250 320V262A150 150 0 0 1 480 262V320" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="2" strokeDasharray="8 8" />
      <g className="net" stroke="#fff" strokeOpacity=".45" strokeWidth="1.2"><path d="M432 130l36 0M432 160l36 0M432 190l36 0M432 220l36 0M444 120v110M456 120v110M468 120v110" /></g>
      <path d="M432 120V240M432 120H472" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <path id="p" className="traj" pathLength="1" d="M40 296C130 20 320 20 428 180" fill="none" stroke="#FFE14A" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="60" cy="322" rx="30" ry="5" fill="#FF5A1F" opacity=".7" />
      <g id="ball">
        <animateMotion dur="3.6s" repeatCount="indefinite" keyPoints="0;1;1" keyTimes="0;.66;1" calcMode="linear"><mpath href="#p" /></animateMotion>
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur=".8s" repeatCount="indefinite" />
          <circle r="16" fill="#FFE14A" stroke="#100A24" strokeWidth="2" />
          <path d="M-16 0Q0 -9 16 0M-16 0Q0 9 16 0M0 -16Q-9 0 0 16" fill="none" stroke="#100A24" strokeWidth="1.6" />
        </g>
      </g>
    </svg>
  );
}
