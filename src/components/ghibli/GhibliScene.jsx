import { motion } from 'framer-motion';
import { konpeitoColors, seeded } from './utils';

const clouds = [
  { top: '4%', w: 520, dur: 150, delay: -30, flip: false },
  { top: '17%', w: 330, dur: 110, delay: -80, flip: true },
  { top: '2%', w: 260, dur: 95, delay: -10, flip: true },
  { top: '26%', w: 440, dur: 170, delay: -120, flip: false },
];

// Ordem de trás pra frente: os gomos de baixo ficam na frente, como nas nuvens de Ponyo.
const cloudPuffs = [
  [262, 66, 58], [196, 84, 74], [318, 100, 64], [130, 116, 62],
  [372, 140, 52], [70, 152, 52], [236, 136, 78], [150, 164, 56], [304, 166, 54],
];

const stars = Array.from({ length: 70 }, (_, i) => ({
  left: `${seeded(i + 300) * 100}%`,
  top: `${seeded(i + 400) * 58}%`,
  size: 1 + seeded(i + 500) * 2.2,
  delay: `${-seeded(i + 600) * 4}s`,
}));

const fireflies = Array.from({ length: 18 }, (_, i) => ({
  left: `${6 + seeded(i + 1) * 88}%`,
  top: `${52 + seeded(i + 40) * 40}%`,
  dur: `${6 + seeded(i + 80) * 5}s`,
  delay: `${-seeded(i + 120) * 6}s`,
}));

const leaves = Array.from({ length: 14 }, (_, i) => ({
  left: `${seeded(i + 200) * 100}%`,
  dur: `${11 + seeded(i + 240) * 9}s`,
  delay: `${-seeded(i + 280) * 20}s`,
  color: ['#f6b3ac', '#f9d3c5', '#9fcf8a', '#f4a7a0', '#ffe3a3'][i % 5],
}));

const grassTufts = Array.from({ length: 26 }, (_, i) => ({
  x: (i / 26) * 1440 + seeded(i + 700) * 40,
  y: 318 + seeded(i + 720) * 70,
  h: 16 + seeded(i + 740) * 20,
  flower: seeded(i + 760) > 0.55,
}));

const sootSprites = [
  { left: '5%', bottom: '6%', s: 50, dur: '2.4s', delay: '0s', candy: 0 },
  { left: '13%', bottom: '3%', s: 38, dur: '2.1s', delay: '-0.7s' },
  { left: '19%', bottom: '7%', s: 44, dur: '2.8s', delay: '-1.3s', candy: 2 },
  { left: '80%', bottom: '3%', s: 36, dur: '2.2s', delay: '-0.4s' },
  { left: '88%', bottom: '6%', s: 48, dur: '2.6s', delay: '-1.9s', candy: 1 },
];

const sootSpikes = Array.from({ length: 44 }, (_, i) => {
  const angle = (i / 44) * Math.PI * 2;
  const length = 25 + seeded(i + 900) * 7;
  return {
    x1: Math.cos(angle) * 16,
    y1: Math.sin(angle) * 16,
    x2: Math.cos(angle) * length,
    y2: Math.sin(angle) * length,
  };
});

export function Konpeito({ color, x = 0, y = 0, r = 7 }) {
  const points = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const radius = i % 2 === 0 ? r : r * 0.72;
    return `${x + Math.cos(angle) * radius},${y + Math.sin(angle) * radius}`;
  }).join(' ');

  return <polygon points={points} fill={color} stroke="#fff" strokeWidth="0.8" strokeOpacity="0.6" />;
}

export function SootSprite({ candy }) {
  const carrying = candy !== undefined;

  return (
    <svg viewBox="-40 -52 80 100" className="h-full w-full overflow-visible">
      <ellipse cx="0" cy="44" rx="16" ry="3.5" fill="rgba(0,0,0,0.18)" />
      <path d="M -7 18 Q -9 32 -12 43" stroke="#1a1614" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M 7 18 Q 9 32 12 43" stroke="#1a1614" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {carrying && (
        <>
          <path d="M -15 -6 Q -22 -24 -8 -36" stroke="#1a1614" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M 15 -6 Q 22 -24 8 -36" stroke="#1a1614" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <Konpeito color={konpeitoColors[candy % konpeitoColors.length]} y={-42} r={11} />
        </>
      )}
      {sootSpikes.map((spike, i) => (
        <line key={i} {...spike} stroke="#1a1614" strokeWidth="1.3" strokeLinecap="round" />
      ))}
      <circle r="21" fill="#1a1614" />
      <circle cx="-8" cy="-3" r="7.5" fill="#f3e6c6" />
      <circle cx="8" cy="-3" r="7.5" fill="#f3e6c6" />
      <circle cx="-7" cy="-2" r="2.8" fill="#1a1614" />
      <circle cx="9" cy="-2" r="2.8" fill="#1a1614" />
    </svg>
  );
}

// Filtros e gradientes usados pelas nuvens. Renderize uma vez por página.
export function CloudDefs() {
  return (
    <svg width="0" height="0" className="absolute">
      <defs>
        <filter id="cloud-fluff" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="9" result="fluffed" />
          <feGaussianBlur in="fluffed" stdDeviation="0.7" />
        </filter>
        <radialGradient id="cloud-lobe" cx="0.42" cy="0.3" r="0.72">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#fbfdff" />
          <stop offset="0.8" stopColor="#e2edf7" />
          <stop offset="1" stopColor="#b7cde3" />
        </radialGradient>
        <linearGradient id="cloud-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dbe8f3" />
          <stop offset="1" stopColor="#b3cae1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Cloud({ w, flip }) {
  return (
    <svg
      viewBox="0 0 440 240"
      className="overflow-visible"
      style={{
        width: `min(${w}px, ${Math.round(w / 9)}vw)`,
        transform: flip ? 'scaleX(-1)' : undefined,
      }}
    >
      <g filter="url(#cloud-fluff)">
        <ellipse cx="220" cy="190" rx="186" ry="30" fill="url(#cloud-base)" />
        {cloudPuffs.map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="url(#cloud-lobe)" />
        ))}
      </g>
    </svg>
  );
}

// time: 'day' (Ponyo), 'sunset' (fim de tarde) ou 'night' (Chihiro).
// celebrate: as fuligens pulam mais rápido. hideSoot: esconde as fuligens do fundo.
export function GhibliScene({ time = 'day', celebrate = false, hideSoot = false }) {
  const night = time === 'night';
  const sunset = time === 'sunset';

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${celebrate ? 'scene-celebrate' : ''}`}
      aria-hidden="true"
    >
      <CloudDefs />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,#1f8fd0_0%,#3fa9e0_30%,#7fcaee_62%,#cdebf6_86%,#fff1dc_100%)]" />
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(180deg,#46578f_0%,#9a6f9e_32%,#e98e86_60%,#fbb98a_80%,#ffe1a8_100%)]"
        initial={false}
        animate={{ opacity: sunset ? 1 : 0 }}
        transition={{ duration: 3, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(180deg,#0b2240_0%,#143a66_38%,#245b86_70%,#4f7a98_100%)]"
        initial={false}
        animate={{ opacity: night ? 1 : 0 }}
        transition={{ duration: 3, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: night ? 1 : 0 }}
        transition={{ duration: 3, delay: night ? 1.2 : 0 }}
      >
        {stars.map((star, i) => (
          <span
            key={i}
            className="twinkle-star"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              '--delay': star.delay,
            }}
          />
        ))}
        <span className="shooting-star" style={{ top: '12%', left: '62%', '--delay': '2s' }} />
        <span className="shooting-star" style={{ top: '22%', left: '30%', '--delay': '6.5s' }} />
      </motion.div>

      <motion.div
        className="absolute inset-0"
        style={{
          // No pôr do sol as nuvens ficam rosadas, como nas cenas de fim de tarde do Ghibli.
          filter: sunset ? 'sepia(0.6) saturate(2.4) hue-rotate(-38deg) brightness(0.9)' : 'none',
          transition: 'filter 3s ease-in-out',
        }}
        initial={false}
        animate={{ opacity: night ? 0.1 : 1 }}
        transition={{ duration: 3 }}
      >
        {clouds.map((cloud, i) => (
          <div
            key={i}
            className="ghibli-cloud"
            style={{
              top: cloud.top,
              '--dur': `${cloud.dur}s`,
              '--delay': `${cloud.delay}s`,
            }}
          >
            <Cloud w={cloud.w} flip={cloud.flip} />
          </div>
        ))}
      </motion.div>

      {leaves.map((leaf, i) => (
        <span
          key={i}
          className="falling-leaf"
          style={{
            left: leaf.left,
            '--dur': leaf.dur,
            '--delay': leaf.delay,
            '--c': leaf.color,
          }}
        />
      ))}

      <svg
        className="absolute inset-x-0 bottom-0 h-[42svh] w-full"
        viewBox="0 0 1440 420"
        preserveAspectRatio="none"
      >
        <path
          d="M0 170 C 220 90 420 120 620 150 C 860 185 1040 70 1250 95 C 1340 105 1400 130 1440 140 L1440 420 L0 420 Z"
          fill="#9fd07f"
        />
        <path
          d="M0 250 C 180 190 360 210 560 240 C 780 272 980 200 1180 215 C 1300 224 1380 245 1440 255 L1440 420 L0 420 Z"
          fill="#6db552"
        />
        <path
          d="M0 330 C 240 280 480 300 720 320 C 960 340 1200 290 1440 310 L1440 420 L0 420 Z"
          fill="#4b9340"
        />
        {grassTufts.map((tuft, i) => (
          <g key={i} transform={`translate(${tuft.x} ${tuft.y})`}>
            <path
              d={`M0 0 Q -4 ${-tuft.h * 0.6} -9 ${-tuft.h} M0 0 Q 1 ${-tuft.h * 0.7} 3 ${-tuft.h * 1.15} M0 0 Q 5 ${-tuft.h * 0.5} 11 ${-tuft.h * 0.85}`}
              stroke="#3d7d34"
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
            />
            {tuft.flower && <circle cx="3" cy={-tuft.h * 1.15} r="3.2" fill="#fffdf3" />}
          </g>
        ))}
      </svg>

      <svg
        className="absolute bottom-[23svh] right-[4%] w-[clamp(150px,26vw,330px)]"
        viewBox="0 0 300 300"
      >
        <path d="M140 300 C 142 240 138 200 128 170 L 162 170 C 156 210 158 250 162 300 Z" fill="#5b3f2c" />
        <path d="M134 200 C 110 185 96 170 88 150" stroke="#5b3f2c" strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M158 196 C 184 182 200 166 210 146" stroke="#5b3f2c" strokeWidth="8" fill="none" strokeLinecap="round" />
        <circle cx="150" cy="105" r="78" fill="#2f6b34" />
        <circle cx="86" cy="138" r="54" fill="#2f6b34" />
        <circle cx="216" cy="136" r="56" fill="#2f6b34" />
        <circle cx="112" cy="70" r="50" fill="#3f8141" />
        <circle cx="192" cy="72" r="48" fill="#3f8141" />
        <circle cx="150" cy="44" r="42" fill="#52984d" />
        <circle cx="126" cy="36" r="16" fill="#79b865" opacity="0.7" />
        <circle cx="200" cy="56" r="14" fill="#79b865" opacity="0.6" />
        <circle cx="74" cy="120" r="12" fill="#79b865" opacity="0.5" />
      </svg>

      <motion.div
        className="absolute inset-0 bg-[#ff8a5c] mix-blend-soft-light"
        initial={false}
        animate={{ opacity: sunset ? 0.7 : 0 }}
        transition={{ duration: 3, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 bg-[#0b2240]"
        initial={false}
        animate={{ opacity: night ? 0.45 : 0 }}
        transition={{ duration: 3, ease: 'easeInOut' }}
      />

      {fireflies.map((fly, i) => (
        <span
          key={i}
          className="firefly"
          style={{ left: fly.left, top: fly.top, '--dur': fly.dur, '--delay': fly.delay }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: hideSoot ? 0 : 1 }}
        transition={{ duration: 0.8 }}
      >
        {sootSprites.map((soot, i) => (
          <span
            key={i}
            className="soot"
            style={{
              left: soot.left,
              bottom: soot.bottom,
              '--s': `${soot.s}px`,
              '--dur': soot.dur,
              '--delay': soot.delay,
            }}
          >
            <SootSprite candy={soot.candy} />
          </span>
        ))}

        <div className="soot-walker" style={{ '--dur': '34s' }}>
          <span className="soot" style={{ '--s': '40px', '--dur': '0.55s' }}>
            <SootSprite candy={3} />
          </span>
          <span className="soot" style={{ left: '46px', '--s': '34px', '--dur': '0.5s', '--delay': '-0.2s' }}>
            <SootSprite candy={4} />
          </span>
        </div>
      </motion.div>
    </div>
  );
}
