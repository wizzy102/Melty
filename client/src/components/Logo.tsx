import { useId } from 'react';

interface Props {
  height?: number;
  /** Adds the neon glow (hero use). Off for small header sizes. */
  glow?: boolean;
  className?: string;
}

/**
 * SVG recreation of the Melty logo (navy blob, white M·T·Y, yellow E·L,
 * yellow sparks). Swap for the official vector file when available.
 */
export function Logo({ height = 40, glow = false, className }: Props) {
  const id = useId().replace(/:/g, '');
  const filter = glow ? `url(#glow-${id})` : undefined;

  return (
    <svg
      className={className}
      height={height}
      viewBox="0 0 360 160"
      role="img"
      aria-label="Melty"
      direction="ltr"
      style={{ width: 'auto', overflow: 'visible' }}
    >
      <defs>
        <filter id={`glow-${id}`} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d="M22 86C20 38 104 16 188 17c92 1 152 26 151 70-1 46-66 63-152 61C99 146 24 134 22 86Z"
        fill="#0e2550"
      />

      <g stroke="#ffd43b" strokeWidth="8" strokeLinecap="round" filter={filter}>
        <path d="M58 58l13 11" />
        <path d="M46 84h19" />
        <path d="M58 110l13-11" />
      </g>

      {/* textLength pins the word to a fixed, tight width regardless of font metrics */}
      <text
        x="86"
        y="114"
        fontFamily="'Baloo 2', 'Arial Rounded MT Bold', sans-serif"
        fontWeight="800"
        fontSize="84"
        textAnchor="start"
        textLength="240"
        lengthAdjust="spacing"
        filter={filter}
      >
        <tspan fill="#ffffff" rotate="-4">M</tspan>
        <tspan fill="#ffd43b" rotate="2 -2">EL</tspan>
        <tspan fill="#ffffff" rotate="3 -3">TY</tspan>
      </text>
    </svg>
  );
}
