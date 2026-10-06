import { useId, type ReactNode } from 'react';

/**
 * Branded placeholder illustrations, used until real product photos exist.
 * When a product/category has an `image` URL, render that instead (see <Media>).
 */

type ArtKey = 'pancake' | 'waffle' | 'crepe' | 'fries' | 'chicken' | 'icecream' | 'cake' | 'drink';

/** Glow colors per art; a product's slug picks one, so neighbors differ. */
const GLOWS: Record<ArtKey, string[]> = {
  pancake: ['#f5a524', '#ffb347', '#e98a2c'],
  waffle: ['#ffd43b', '#f5a524', '#ffc85c'],
  crepe: ['#f7b267', '#ff9f6b', '#f5a524'],
  fries: ['#ffd43b', '#ffc60a', '#ffe17a'],
  chicken: ['#f08a3c', '#f5a524', '#ff7a45'],
  icecream: ['#7dd8ff', '#f7a8c4', '#b9a6ff'],
  cake: ['#e0607e', '#c65a3b', '#f5a524'],
  drink: ['#7dd8ff', '#ffd43b', '#f7a8c4'],
};

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

const Plate = () => (
  <>
    <ellipse cx="100" cy="124" rx="70" ry="11" fill="#000" opacity="0.35" />
    <ellipse cx="100" cy="119" rx="66" ry="13" fill="#eef2fb" />
    <ellipse cx="100" cy="118" rx="53" ry="9" fill="#dbe3f3" />
  </>
);

const Strawberry = ({ x, y, r = 1 }: { x: number; y: number; r?: number }) => (
  <g transform={`translate(${x} ${y}) scale(${r})`}>
    <path d="M0 -7c6 0 9 4 8 8-1 5-5 8-8 9-3-1-7-4-8-9-1-4 2-8 8-8Z" fill="#e8384f" />
    <path d="M-4 -7l4 3 4-3-4-2Z" fill="#4caf50" />
    <circle cx="-3" cy="0" r="0.8" fill="#ffd9a0" />
    <circle cx="2" cy="2" r="0.8" fill="#ffd9a0" />
    <circle cx="0" cy="-3" r="0.8" fill="#ffd9a0" />
  </g>
);

const art: Record<ArtKey, (v: number) => ReactNode> = {
  pancake: (v) => {
    const sauce = ['#8b4a1c', '#4a2414', '#a8701f'][v % 3];
    return (
      <>
        <Plate />
        {[0, 1, 2, 3].map((i) => {
          const y = 108 - i * 12;
          return (
            <g key={i}>
              <rect x="48" y={y - 7} width="104" height="14" rx="7" fill="#c97f2e" />
              <ellipse cx="100" cy={y - 7} rx="52" ry="10" fill="#f2b254" />
            </g>
          );
        })}
        <path
          d="M56 66c4-11 84-11 88 0 1 4-5 5-7 4v9c0 4-6 4-6 0v-8c-15 3-38 3-54 0v13c0 4-6 4-6 0V70c-6 0-12 0-15-4Z"
          fill={sauce}
        />
        <rect x="90" y="52" width="20" height="10" rx="3" fill="#fff3c4" />
        <Strawberry x={72} y={58} />
        <Strawberry x={128} y={60} r={0.9} />
      </>
    );
  },

  waffle: (v) => (
    <>
      <Plate />
      <rect x="52" y="56" width="96" height="60" rx="16" fill="#e7a743" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3, 4].map((c) => (
          <rect key={`${r}${c}`} x={60 + c * 17} y={63 + r * 16} width="12" height="11" rx="3" fill="#c8832b" />
        )),
      )}
      <path
        d="M58 70l20 24 16-28 17 30 16-30 16 24"
        fill="none"
        stroke={v % 2 ? '#f6f1ff' : '#4a2414'}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Strawberry x={70} y={54} />
      <Strawberry x={132} y={56} r={0.85} />
    </>
  ),

  crepe: () => (
    <>
      <Plate />
      <path d="M46 112 100 50l54 62c-18 7-90 7-108 0Z" fill="#f3c67e" />
      <path d="M100 50l-4 64" stroke="#d9a057" strokeWidth="3" />
      <path d="M46 112 100 50l54 62" fill="none" stroke="#d9a057" strokeWidth="3" strokeLinejoin="round" />
      <path
        d="M64 96c10-6 20 4 30-2s20 4 30-2 14 2 16 4"
        fill="none"
        stroke="#4a2414"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {[
        [78, 84],
        [104, 76],
        [120, 92],
        [90, 104],
      ].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <circle cx={x} cy={y} r="6" fill="#fff0b8" stroke="#e8cf7a" strokeWidth="1.5" />
          <circle cx={x} cy={y} r="1.3" fill="#e8cf7a" />
        </g>
      ))}
      {[70, 86, 98, 112, 126, 108, 92].map((x, i) => (
        <circle key={i} cx={x} cy={70 + ((i * 13) % 34)} r="1.4" fill="#fff" opacity="0.85" />
      ))}
    </>
  ),

  fries: (v) => {
    const sticks = [
      [66, 34, -10],
      [76, 22, -6],
      [86, 28, -3],
      [95, 16, 0],
      [104, 26, 2],
      [113, 18, 5],
      [122, 30, 8],
      [131, 36, 11],
    ];
    return (
      <>
        <ellipse cx="100" cy="132" rx="46" ry="7" fill="#000" opacity="0.35" />
        {sticks.map(([x, top, rot], i) => (
          <rect
            key={i}
            x={x}
            y={top}
            width="10"
            height={84 - top}
            rx="3"
            fill={i % 2 ? '#ffd43b' : '#ffc60a'}
            stroke="#e6a800"
            strokeWidth="1.2"
            transform={`rotate(${rot} ${x + 5} 100)`}
          />
        ))}
        <path d="M62 74h76l-9 56H71Z" fill={v % 2 ? '#7dd8ff' : '#4cc6ff'} />
        <path d="M58 70h84l-2 9H60Z" fill="#0e2550" />
        <text
          x="100"
          y="115"
          textAnchor="middle"
          fontFamily="'Baloo 2', sans-serif"
          fontWeight="800"
          fontSize="28"
          fill="#0e2550"
        >
          M
        </text>
      </>
    );
  },

  chicken: (v) => (
    <>
      <Plate />
      {[
        [-14, 0],
        [6, 14],
        [-4, 26],
      ].map(([rot, dy], i) => (
        <g key={i} transform={`rotate(${rot} 96 ${80 + dy})`}>
          <rect x="52" y={70 + dy} width="84" height="22" rx="11" fill="#d98a3a" />
          {[60, 72, 86, 99, 112, 124].map((x, j) => (
            <ellipse
              key={j}
              cx={x}
              cy={77 + dy + ((j * 5) % 9)}
              rx="3.2"
              ry="2.2"
              fill={j % 2 ? '#b8661f' : '#f0b062'}
            />
          ))}
        </g>
      ))}
      <rect x="130" y="94" width="30" height="22" rx="7" fill="#f6f6f6" />
      <ellipse cx="145" cy="96" rx="13" ry="4.5" fill={['#e8a23a', '#d9432f', '#fff3d6'][v % 3]} />
    </>
  ),

  icecream: (v) => {
    const scoops = [
      ['#fff1d6', '#f7a8c4', '#7a4a2a'],
      ['#7a4a2a', '#fff1d6', '#b5e48c'],
      ['#f7a8c4', '#7a4a2a', '#fff1d6'],
    ][v % 3];
    return (
      <>
        <ellipse cx="100" cy="134" rx="34" ry="6" fill="#000" opacity="0.35" />
        <ellipse cx="100" cy="130" rx="24" ry="5" fill="rgba(255,255,255,0.45)" />
        <rect x="96" y="116" width="8" height="14" fill="rgba(255,255,255,0.45)" />
        <circle cx="82" cy="74" r="19" fill={scoops[0]} />
        <circle cx="118" cy="74" r="19" fill={scoops[1]} />
        <circle cx="100" cy="58" r="20" fill={scoops[2]} />
        <path d="M62 80h76l-16 40H78Z" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
        <path
          d="M82 52c6-6 30-6 36 0 1 4-3 4-4 3v6c0 3-4 3-4 0v-5c-6 1-12 1-18 0v8c0 3-4 3-4 0v-9c-3 0-6-1-6-3Z"
          fill="#4a2414"
        />
        <circle cx="100" cy="36" r="6.5" fill="#e23d4f" />
        <path d="M100 30c2-6 6-9 10-10" stroke="#4caf50" strokeWidth="2" fill="none" strokeLinecap="round" />
        {[
          [76, 66, '#ffd43b'],
          [124, 68, '#7dd8ff'],
          [112, 60, '#f7a8c4'],
          [88, 62, '#7dd8ff'],
        ].map(([x, y, c], i) => (
          <rect key={i} x={x as number} y={y as number} width="6" height="2.4" rx="1.2" fill={c as string} transform={`rotate(${i * 40} ${x} ${y})`} />
        ))}
      </>
    );
  },

  cake: (v) => {
    const sponge = ['#6b3e26', '#b8323f', '#e9c27a'][v % 3];
    return (
      <>
        <Plate />
        <path d="M50 72v40c0 7 22 12 50 12s50-5 50-12V72Z" fill={sponge} />
        <path d="M50 88c0 7 22 12 50 12s50-5 50-12v6c0 7-22 12-50 12s-50-5-50-12Z" fill="#fff1dc" />
        <ellipse cx="100" cy="72" rx="50" ry="12" fill="#4a2414" />
        <path
          d="M50 72c0 4 2 7 6 9v8c0 3 5 3 5 0v-6c9 3 22 5 39 5v10c0 3 5 3 5 0V88c14 0 26-2 34-5v12c0 3 5 3 5 0V80c4-2 6-5 6-8Z"
          fill="#4a2414"
        />
        <Strawberry x={86} y={64} r={1.2} />
        <Strawberry x={112} y={66} r={1.1} />
      </>
    );
  },

  drink: (v) => {
    const top = ['#f6d9a8', '#ffe9b0', '#ffd3e2'][v % 3];
    const bottom = ['#c9843f', '#7a4a2a', '#e86a92'][v % 3];
    return (
      <>
        <ellipse cx="100" cy="132" rx="30" ry="6" fill="#000" opacity="0.35" />
        <defs>
          <linearGradient id={`liq-${v}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={top} />
            <stop offset="1" stopColor={bottom} />
          </linearGradient>
        </defs>
        <path d="M108 52 122 14" stroke="#7dd8ff" strokeWidth="7" strokeLinecap="round" />
        <path d="M76 66h48l-5 60H81Z" fill={`url(#liq-${v})`} />
        <path d="M72 52h56l-7 76H79Z" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.55)" strokeWidth="2" />
        <circle cx="86" cy="52" r="10" fill="#fff6e6" />
        <circle cx="100" cy="46" r="13" fill="#fff6e6" />
        <circle cx="114" cy="52" r="10" fill="#fff6e6" />
        {[88, 96, 104, 112].map((x, i) => (
          <circle key={i} cx={x} cy={44 + (i % 2) * 6} r="1.8" fill="#c77a35" />
        ))}
      </>
    );
  },
};

interface Props {
  art: string;
  /** Stable string (e.g. product slug) used to vary colors between items. */
  seed?: string;
  className?: string;
}

export function ProductArt({ art: artKey, seed = '', className }: Props) {
  const key: ArtKey = artKey in art ? (artKey as ArtKey) : 'cake';
  const h = hash(seed || key);
  const glow = GLOWS[key][h % GLOWS[key].length];
  const cx = 35 + (h % 30);
  const id = useId().replace(/:/g, '');

  return (
    <svg className={className} viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={`bg-${id}`} cx={`${cx}%`} cy="40%" r="75%">
          <stop offset="0" stopColor={glow} stopOpacity="0.55" />
          <stop offset="0.55" stopColor={glow} stopOpacity="0.12" />
          <stop offset="1" stopColor="#0c1b3a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="200" height="150" fill="#10224a" />
      <rect width="200" height="150" fill={`url(#bg-${id})`} />
      {[0, 1, 2, 3, 4].map((i) => {
        const n = hash(seed + i);
        return (
          <circle
            key={i}
            cx={10 + (n % 180)}
            cy={8 + ((n >> 8) % 40)}
            r={1 + (n % 3) * 0.6}
            fill={i % 2 ? '#7dd8ff' : '#ffd43b'}
            opacity="0.7"
          />
        );
      })}
      {art[key](h)}
    </svg>
  );
}

interface MediaProps {
  image: string | null;
  art: string;
  seed: string;
  alt: string;
  className?: string;
}

/** Real photo when available, otherwise the branded placeholder art. */
export function Media({ image, art: artKey, seed, alt, className }: MediaProps) {
  if (image) return <img className={className} src={image} alt={alt} loading="lazy" />;
  return <ProductArt className={className} art={artKey} seed={seed} />;
}
