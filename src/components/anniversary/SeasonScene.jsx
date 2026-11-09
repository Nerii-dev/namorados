import { motion } from 'framer-motion';
import { Cloud, CloudDefs, SootSprite } from '../ghibli/GhibliScene';
import { seeded } from '../ghibli/utils';

// season: night, spring, summer, autumn, winter ou bloom (a primavera de volta, com ipê amarelo).
const FADE = '2.6s ease-in-out';

const SKIES = {
  night: 'linear-gradient(180deg,#0b2240 0%,#143a66 38%,#245b86 70%,#4f7a98 100%)',
  spring: 'linear-gradient(180deg,#6fb6e6 0%,#a9d6f0 34%,#f6d6e4 72%,#ffeef0 100%)',
  summer: 'linear-gradient(180deg,#1f8fd0 0%,#3fa9e0 30%,#7fcaee 62%,#cdebf6 86%,#fff1dc 100%)',
  autumn: 'linear-gradient(180deg,#58719f 0%,#b8879a 30%,#eda677 62%,#ffd39a 100%)',
  winter: 'linear-gradient(180deg,#16284d 0%,#2f4777 34%,#7a7fa8 70%,#d8a99c 100%)',
  bloom: 'linear-gradient(180deg,#5aa8e0 0%,#9fd0f0 32%,#fbd3e1 70%,#fff3d6 100%)',
};

const LAND = {
  night: { hills: ['#4f7360', '#3b5c4b', '#2c473b'], grass: '#26402f', flower: '#cfe0ff' },
  spring: { hills: ['#b3dc8f', '#86c467', '#5ea54c'], grass: '#4b8a3e', flower: '#ffd1e0' },
  summer: { hills: ['#9fd07f', '#6db552', '#4b9340'], grass: '#3d7d34', flower: '#fff3a8' },
  autumn: { hills: ['#e2c36e', '#c2a052', '#94843f'], grass: '#7a6a2e', flower: '#ffb36b' },
  winter: { hills: ['#6c7f8e', '#526777', '#3c5060'], grass: '#33475a', flower: '#e6ecff' },
  bloom: { hills: ['#b9df90', '#8ac86a', '#62a94e'], grass: '#4b8a3e', flower: '#ffe27a' },
};

// Sombra, meio, topo e brilho da copa. Primavera = ipê rosa; bloom = ipê rosa e amarelo.
const CANOPY = {
  night: ['#22412f', '#2c5039', '#386045', '#4d7a58'],
  spring: ['#e57fa4', '#f29bb8', '#f7b6cc', '#ffd9e6'],
  summer: ['#2f6b34', '#3f8141', '#52984d', '#79b865'],
  autumn: ['#c2562a', '#e0773a', '#f29a45', '#ffc463'],
  winter: ['#27443a', '#31503f', '#3d5e4a', '#5a7c64'],
  bloom: ['#e67aa0', '#f4a6c0', '#f6c445', '#ffe08a'],
};

const SUN = {
  night: { left: '50%', top: '40%', size: 60, opacity: 0, color: '#fff4c8', glow: 'rgba(255,240,190,0)' },
  spring: { left: '16%', top: '12%', size: 90, opacity: 1, color: '#fff6d2', glow: 'rgba(255,244,200,0.75)' },
  summer: { left: '74%', top: '6%', size: 110, opacity: 1, color: '#fffbe6', glow: 'rgba(255,250,220,0.95)' },
  autumn: { left: '20%', top: '36%', size: 150, opacity: 1, color: '#ffb468', glow: 'rgba(255,170,90,0.8)' },
  winter: { left: '30%', top: '52%', size: 120, opacity: 0, color: '#ffa070', glow: 'rgba(255,150,90,0)' },
  bloom: { left: '78%', top: '10%', size: 96, opacity: 1, color: '#fff6d2', glow: 'rgba(255,244,200,0.8)' },
};

const CLOUD_LOOK = {
  night: { opacity: 0.1, filter: 'brightness(0.6) saturate(0.5)' },
  spring: { opacity: 1, filter: 'sepia(0.15) saturate(1.5) hue-rotate(-25deg)' },
  summer: { opacity: 1, filter: 'none' },
  autumn: { opacity: 0.95, filter: 'sepia(0.6) saturate(2.4) hue-rotate(-38deg) brightness(0.92)' },
  winter: { opacity: 0.18, filter: 'brightness(0.55) saturate(0.6)' },
  bloom: { opacity: 1, filter: 'sepia(0.12) saturate(1.4) hue-rotate(-20deg)' },
};

const clouds = [
  { top: '5%', w: 480, dur: 150, delay: -40, flip: false },
  { top: '18%', w: 320, dur: 115, delay: -85, flip: true },
  { top: '1%', w: 250, dur: 95, delay: -15, flip: true },
  { top: '27%', w: 420, dur: 170, delay: -125, flip: false },
];

// Copa da árvore: [cx, cy, r, tom] — tom indexa a paleta CANOPY.
const canopy = [
  [150, 105, 78, 0], [86, 138, 54, 0], [216, 136, 56, 0],
  [112, 70, 50, 1], [192, 72, 48, 1], [150, 44, 42, 2],
  [126, 36, 16, 3], [200, 56, 14, 3], [74, 120, 12, 3],
];

const blossoms = Array.from({ length: 36 }, (_, i) => {
  const [cx, cy, r] = canopy[i % 6];
  const angle = seeded(i + 3000) * Math.PI * 2;
  const dist = Math.sqrt(seeded(i + 3100)) * r * 0.85;
  return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist, r: 2.5 + seeded(i + 3200) * 2.5 };
});

const stars = Array.from({ length: 70 }, (_, i) => ({
  left: `${seeded(i + 300) * 100}%`,
  top: `${seeded(i + 400) * 55}%`,
  size: 1 + seeded(i + 500) * 2.2,
  delay: `${-seeded(i + 600) * 4}s`,
}));

const grassTufts = Array.from({ length: 26 }, (_, i) => ({
  x: (i / 26) * 1440 + seeded(i + 700) * 40,
  y: 318 + seeded(i + 720) * 70,
  h: 16 + seeded(i + 740) * 20,
  flower: seeded(i + 760) > 0.45,
}));

const fallers = (count, seed, colors, size) =>
  Array.from({ length: count }, (_, i) => ({
    left: `${seeded(i + seed) * 100}%`,
    dur: `${10 + seeded(i + seed + 40) * 9}s`,
    delay: `${-seeded(i + seed + 80) * 20}s`,
    color: colors[i % colors.length],
    size: size * (0.75 + seeded(i + seed + 120) * 0.5),
  }));

const petals = fallers(18, 3300, ['#f7a9c4', '#ffc8da', '#f48fb1', '#ffe0ea'], 13);
const bloomPetals = fallers(18, 3500, ['#f7a9c4', '#ffd75e', '#ffc8da', '#f6c445'], 13);
const autumnLeaves = fallers(16, 3700, ['#d9692f', '#ee8f3a', '#f6b44a', '#b8442a'], 19);

const risers = (count, seed, leftMin, leftSpan, bottomMin, bottomSpan) =>
  Array.from({ length: count }, (_, i) => ({
    left: `${leftMin + seeded(i + seed) * leftSpan}%`,
    bottom: `${bottomMin + seeded(i + seed + 30) * bottomSpan}%`,
    dur: `${3 + seeded(i + seed + 60) * 4}s`,
    delay: `${-seeded(i + seed + 90) * 7}s`,
    drift: `${(seeded(i + seed + 120) - 0.5) * 60}px`,
  }));

const motes = risers(18, 3900, 4, 92, 18, 40);
const embers = risers(14, 4100, 32, 5, 9, 2);

const fireflies = Array.from({ length: 16 }, (_, i) => ({
  left: `${6 + seeded(i + 1) * 88}%`,
  top: `${55 + seeded(i + 40) * 35}%`,
  dur: `${6 + seeded(i + 80) * 5}s`,
  delay: `${-seeded(i + 120) * 6}s`,
}));

const flagColors = ['#e8463c', '#ffd23f', '#3fb26b', '#3b82d6', '#f472b6', '#ff8c2e'];

// Bandeirinhas de festa junina: um cordão em curva com triângulos pendurados.
function Bunting({ x1, y1, x2, y2, sag, count, seed }) {
  const flags = Array.from({ length: count }, (_, i) => {
    const t = (i + 0.5) / count;
    const x = x1 + (x2 - x1) * t;
    const y = y1 + (y2 - y1) * t + sag * 4 * t * (1 - t);
    return { x, y, color: flagColors[(i + seed) % flagColors.length], delay: `${-seeded(i + seed) * 3}s` };
  });

  return (
    <g>
      <path
        d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2 + sag * 2} ${x2} ${y2}`}
        stroke="#3b2b22"
        strokeWidth="1.5"
        fill="none"
      />
      {flags.map((flag, i) => (
        <path
          key={i}
          className="bunting-flag"
          d={`M ${flag.x - 7} ${flag.y} L ${flag.x + 7} ${flag.y} L ${flag.x} ${flag.y + 20} Z`}
          fill={flag.color}
          style={{ transformOrigin: `${flag.x}px ${flag.y}px`, animationDelay: flag.delay }}
        />
      ))}
    </g>
  );
}

const fade = (visible, max = 1) => ({ opacity: visible ? max : 0, transition: `opacity ${FADE}` });

// hideClouds/hideTree: usados pela arte do story, que posiciona as próprias nuvens.
export default function SeasonScene({ season = 'night', celebrate = false, hideSoot = false, hideClouds = false, hideTree = false }) {
  const land = LAND[season];
  const leaves = CANOPY[season];
  const sun = SUN[season];
  const cloudLook = CLOUD_LOOK[season];
  const dark = season === 'night' || season === 'winter';
  const flowering = season === 'spring' || season === 'bloom';

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${celebrate ? 'scene-celebrate' : ''}`}
      aria-hidden="true"
    >
      <CloudDefs />

      {Object.entries(SKIES).map(([key, sky]) => (
        <div key={key} className="absolute inset-0" style={{ background: sky, ...fade(key === season) }} />
      ))}

      <div className="absolute inset-0" style={fade(dark, season === 'night' ? 1 : 0.75)}>
        {stars.map((star, i) => (
          <span
            key={i}
            className="twinkle-star"
            style={{ left: star.left, top: star.top, width: star.size, height: star.size, '--delay': star.delay }}
          />
        ))}
        <span className="shooting-star" style={{ top: '12%', left: '64%', '--delay': '3s' }} />
        <span className="shooting-star" style={{ top: '24%', left: '28%', '--delay': '7.5s' }} />
      </div>

      <div
        className="absolute left-[12%] top-[9%] h-[clamp(70px,13vw,120px)] w-[clamp(70px,13vw,120px)] rounded-full bg-[radial-gradient(circle_at_40%_38%,#fffdf0_0%,#fdf3d2_60%,#efdcae_100%)] shadow-[0_0_60px_18px_rgba(255,245,200,0.35)]"
        style={fade(dark, season === 'night' ? 1 : 0.85)}
      />

      <motion.div
        className="absolute rounded-full"
        style={{ x: '-50%', y: '-50%' }}
        initial={false}
        animate={{
          left: sun.left,
          top: sun.top,
          width: sun.size,
          height: sun.size,
          opacity: sun.opacity,
          backgroundColor: sun.color,
          boxShadow: `0 0 70px 30px ${sun.glow}`,
        }}
        transition={{ duration: 2.6, ease: 'easeInOut' }}
      />

      <div
        className="absolute inset-0"
        style={{
          opacity: hideClouds ? 0 : cloudLook.opacity,
          filter: cloudLook.filter,
          transition: `opacity ${FADE}, filter ${FADE}`,
        }}
      >
        {clouds.map((cloud, i) => (
          <div key={i} className="ghibli-cloud" style={{ top: cloud.top, '--dur': `${cloud.dur}s`, '--delay': `${cloud.delay}s` }}>
            <Cloud w={cloud.w} flip={cloud.flip} />
          </div>
        ))}
      </div>

      <div className="absolute inset-0" style={fade(season === 'spring')}>
        {petals.map((p, i) => (
          <span key={i} className="falling-leaf" style={{ left: p.left, width: p.size, height: p.size * 0.65, '--dur': p.dur, '--delay': p.delay, '--c': p.color }} />
        ))}
      </div>
      <div className="absolute inset-0" style={fade(season === 'bloom')}>
        {bloomPetals.map((p, i) => (
          <span key={i} className="falling-leaf" style={{ left: p.left, width: p.size, height: p.size * 0.65, '--dur': p.dur, '--delay': p.delay, '--c': p.color }} />
        ))}
      </div>
      <div className="absolute inset-0" style={fade(season === 'autumn')}>
        {autumnLeaves.map((p, i) => (
          <span key={i} className="falling-leaf" style={{ left: p.left, width: p.size, height: p.size * 0.65, '--dur': p.dur, '--delay': p.delay, '--c': p.color }} />
        ))}
      </div>
      <div className="absolute inset-0" style={fade(season === 'summer')}>
        {motes.map((m, i) => (
          <span key={i} className="sun-mote" style={{ left: m.left, bottom: m.bottom, '--dur': m.dur, '--delay': m.delay, '--drift': m.drift }} />
        ))}
      </div>

      <svg
        className="absolute bottom-[27svh] left-0 w-[min(78%,700px)] overflow-visible"
        viewBox="0 0 400 110"
        style={fade(season === 'winter')}
      >
        <path d="M 386 4 L 386 112" stroke="#4a3326" strokeWidth="5" strokeLinecap="round" />
        <Bunting x1={-10} y1={18} x2={384} y2={10} sag={22} count={16} seed={0} />
        <Bunting x1={-10} y1={50} x2={384} y2={42} sag={16} count={13} seed={3} />
      </svg>

      <svg className="absolute inset-x-0 bottom-0 h-[42svh] w-full" viewBox="0 0 1440 420" preserveAspectRatio="none">
        <path
          d="M0 170 C 220 90 420 120 620 150 C 860 185 1040 70 1250 95 C 1340 105 1400 130 1440 140 L1440 420 L0 420 Z"
          style={{ fill: land.hills[0], transition: `fill ${FADE}` }}
        />
        <path
          d="M0 250 C 180 190 360 210 560 240 C 780 272 980 200 1180 215 C 1300 224 1380 245 1440 255 L1440 420 L0 420 Z"
          style={{ fill: land.hills[1], transition: `fill ${FADE}` }}
        />
        <path
          d="M0 330 C 240 280 480 300 720 320 C 960 340 1200 290 1440 310 L1440 420 L0 420 Z"
          style={{ fill: land.hills[2], transition: `fill ${FADE}` }}
        />
        {grassTufts.map((tuft, i) => (
          <g key={i} transform={`translate(${tuft.x} ${tuft.y})`}>
            <path
              d={`M0 0 Q -4 ${-tuft.h * 0.6} -9 ${-tuft.h} M0 0 Q 1 ${-tuft.h * 0.7} 3 ${-tuft.h * 1.15} M0 0 Q 5 ${-tuft.h * 0.5} 11 ${-tuft.h * 0.85}`}
              style={{ stroke: land.grass, transition: `stroke ${FADE}` }}
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
            />
            {tuft.flower && (
              <circle cx="3" cy={-tuft.h * 1.15} r="3.4" style={{ fill: land.flower, transition: `fill ${FADE}` }} />
            )}
          </g>
        ))}
      </svg>

      <div
        className="absolute bottom-[18svh] left-0 right-0 h-[16svh] bg-[linear-gradient(180deg,transparent,rgba(220,230,245,0.35),transparent)] blur-md"
        style={fade(dark, 0.9)}
      />

      <svg
        className="absolute bottom-[23svh] right-[3%] w-[clamp(160px,28vw,360px)]"
        viewBox="0 0 300 300"
        style={{ display: hideTree ? 'none' : undefined }}
      >
        <g style={{ fill: dark ? '#3d2c22' : '#5b3f2c', stroke: dark ? '#3d2c22' : '#5b3f2c', transition: `fill ${FADE}, stroke ${FADE}` }}>
          <path d="M140 300 C 142 240 138 200 128 170 L 162 170 C 156 210 158 250 162 300 Z" strokeWidth="0" />
          <path d="M134 200 C 110 185 96 170 88 150" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M158 196 C 184 182 200 166 210 146" strokeWidth="8" fill="none" strokeLinecap="round" />
        </g>
        {canopy.map(([cx, cy, r, tone], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            opacity={tone === 3 ? 0.7 : 1}
            style={{ fill: leaves[tone], transition: `fill ${FADE}` }}
          />
        ))}
        <g style={fade(flowering)}>
          {blossoms.map((b, i) => (
            <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={i % 3 === 0 && season === 'bloom' ? '#fff3b0' : '#fff0f5'} opacity="0.9" />
          ))}
        </g>
      </svg>

      <div className="absolute bottom-[5svh] left-[30%] w-[clamp(56px,9vw,90px)]" style={fade(season === 'winter')}>
        <div className="absolute -inset-10 rounded-full bg-[radial-gradient(circle,rgba(255,170,80,0.55),transparent_65%)]" />
        <svg viewBox="0 0 100 90" className="relative w-full overflow-visible">
          <path className="campfire-flame" d="M50 8 C 64 30 76 40 70 62 C 66 76 34 76 30 62 C 26 44 44 34 50 8 Z" fill="#ff8a2e" />
          <path className="campfire-flame" style={{ animationDelay: '-0.4s' }} d="M50 30 C 58 44 64 52 60 64 C 57 72 43 72 40 64 C 37 54 46 46 50 30 Z" fill="#ffd25e" />
          <rect x="18" y="66" width="64" height="11" rx="5.5" fill="#5b3f2c" transform="rotate(12 50 72)" />
          <rect x="18" y="66" width="64" height="11" rx="5.5" fill="#6d4a33" transform="rotate(-12 50 72)" />
        </svg>
      </div>
      <div className="absolute inset-0" style={fade(season === 'winter')}>
        {embers.map((e, i) => (
          <span key={i} className="ember" style={{ left: e.left, bottom: e.bottom, '--dur': e.dur, '--delay': e.delay, '--drift': e.drift }} />
        ))}
      </div>

      <div className="absolute inset-0" style={fade(dark)}>
        {fireflies.map((fly, i) => (
          <span key={i} className="firefly" style={{ left: fly.left, top: fly.top, '--dur': fly.dur, '--delay': fly.delay }} />
        ))}
      </div>

      <div className="absolute inset-0" style={fade(!hideSoot)}>
        {[
          { left: '4%', bottom: '5%', s: 46, dur: '2.4s', delay: '0s', candy: 0 },
          { left: '24%', bottom: '3%', s: 36, dur: '2.1s', delay: '-0.7s' },
          { left: '70%', bottom: '4%', s: 38, dur: '2.6s', delay: '-1.3s', candy: 2 },
          { left: '86%', bottom: '6%', s: 44, dur: '2.2s', delay: '-0.4s', candy: 1 },
        ].map((soot, i) => (
          <span
            key={i}
            className="soot"
            style={{ left: soot.left, bottom: soot.bottom, '--s': `${soot.s}px`, '--dur': soot.dur, '--delay': soot.delay }}
          >
            <SootSprite candy={soot.candy} />
          </span>
        ))}
      </div>
    </div>
  );
}
