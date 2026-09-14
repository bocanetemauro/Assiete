"use client";

import { GroundShadow, INK, LinearGradient, RadialGradient, Sparkle, outline, useUid } from "./kit";

/** Zilveren cloche — visuele placeholder voor eigen recepten zonder foto. */
export function ClocheIllustration({ className, label }: { className?: string; label?: string }) {
  const id = useUid();
  const letter = (label?.trim().charAt(0) ?? "A").toUpperCase();
  return (
    <svg viewBox="0 0 400 400" className={`ill ${className ?? ""}`} role="img" aria-label={label ? `Eigen recept: ${label}` : "Eigen recept"} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <LinearGradient id={`${id}d`} x2={1} y2={0} stops={[[0, "#838C91"], [0.2, "#DDE2E4"], [0.34, "#FFFFFF"], [0.52, "#B5BDC1"], [0.8, "#858E93"], [1, "#5C656A"]]} />
        <RadialGradient id={`${id}p`} cx={0.45} cy={0.4} r={0.7} stops={[[0, "#FFFFFF"], [1, "#E4DCCF"]]} />
        <LinearGradient id={`${id}k`} x2={1} y2={0} stops={[[0, "#8A6A36"], [0.45, "#E6CB93"], [1, "#7A5B2C"]]} />
      </defs>
      <GroundShadow cx={214} cy={304} rx={176} ry={48} opacity={0.3} />
      <ellipse cx={200} cy={290} rx={172} ry={54} fill={`url(#${id}p)`} {...outline} />
      <ellipse cx={200} cy={286} rx={122} ry={34} fill="#F3EEE6" stroke={INK} strokeOpacity={0.18} strokeWidth={1.4} />
      <path d="M74 282 C 74 172 132 110 200 110 C 268 110 326 172 326 282 Z" fill={`url(#${id}d)`} {...outline} />
      <ellipse cx={200} cy={282} rx={130} ry={17} fill="#A7AFB3" {...outline} />
      <path d="M186 112 C 186 98 214 98 214 112 Z" fill={`url(#${id}k)`} {...outline} strokeWidth={1.8} />
      <circle cx={200} cy={92} r={13} fill={`url(#${id}k)`} {...outline} />
      <path d="M104 256 C 102 200 124 156 162 132" stroke="#FFFFFF" strokeOpacity={0.75} strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d="M132 262 C 132 222 146 190 170 170" stroke="#FFFFFF" strokeOpacity={0.45} strokeWidth={4} fill="none" strokeLinecap="round" />
      <text x={228} y={232} textAnchor="middle" fontFamily="var(--font-cormorant), Georgia, serif" fontStyle="italic" fontSize={64} fill={INK} opacity={0.22}>
        {letter}
      </text>
      <Sparkle x={296} y={150} size={10} />
      <Sparkle x={110} y={122} size={6} delay={0.8} />
    </svg>
  );
}
