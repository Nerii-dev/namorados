import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { getImageUrl } from '../config/data';

const TYPE_SPEED_MS = 32;

const seeded = (seed) => {
  const x = Math.sin(seed * 999) * 10000;
  return x - Math.floor(x);
};

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

const konpeitoColors = ['#ff9fb8', '#ffe27a', '#9fe0b4', '#9cc9ff', '#ffc38a'];

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

function Konpeito({ color, x = 0, y = 0, r = 7 }) {
  const points = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2;
    const radius = i % 2 === 0 ? r : r * 0.72;
    return `${x + Math.cos(angle) * radius},${y + Math.sin(angle) * radius}`;
  }).join(' ');

  return <polygon points={points} fill={color} stroke="#fff" strokeWidth="0.8" strokeOpacity="0.6" />;
}

function SootSprite({ candy }) {
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

function Cloud({ w, flip }) {
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

function GhibliScene({ night }) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
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

      <div className="absolute inset-0 bg-[linear-gradient(180deg,#1f8fd0_0%,#3fa9e0_30%,#7fcaee_62%,#cdebf6_86%,#fff1dc_100%)]" />
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
        initial={false}
        animate={{ opacity: night ? 0.2 : 1 }}
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
    </div>
  );
}

function Envelope({ opening, onOpen }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      disabled={opening}
      className="relative mx-auto block aspect-[3/2] w-[min(360px,84vw)] focus:outline-none"
      style={{ perspective: 900 }}
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 1.05 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={opening ? undefined : { y: -6, rotate: -1 }}
      aria-label="Abrir o envelope"
    >
      <div className="absolute inset-0 rounded-md bg-[#e9cfae] shadow-[0_30px_60px_rgba(70,50,30,0.35)]" />

      <motion.div
        className="paper-texture absolute inset-x-[6%] top-[8%] h-[84%] rounded-sm shadow-md"
        style={{ zIndex: 2 }}
        animate={opening ? { y: '-55%' } : { y: 0 }}
        transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
      >
        <p className="font-hand pt-3 text-center text-2xl text-[#7c3f3f]">Para Gica ♡</p>
      </motion.div>

      <div
        className="absolute inset-0 rounded-md bg-[#f3dcbf]"
        style={{ zIndex: 3, clipPath: 'polygon(0 0, 50% 58%, 100% 0, 100% 100%, 0 100%)' }}
      />
      <div
        className="absolute inset-0 rounded-md bg-[#efd4b3]"
        style={{ zIndex: 3, clipPath: 'polygon(0 100%, 50% 50%, 100% 100%)' }}
      />

      <motion.div
        className="absolute inset-x-0 top-0 h-[62%] origin-top bg-[#e4c39c]"
        style={{
          zIndex: opening ? 1 : 4,
          clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          transformStyle: 'preserve-3d',
        }}
        animate={{ rotateX: opening ? 180 : 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      <AnimatePresence>
        {!opening && (
          <motion.div
            className="absolute left-1/2 top-[50%] grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#d9534f,#9e2b2b)] text-2xl text-[#ffd9d4] shadow-[0_6px_14px_rgba(90,20,20,0.45)]"
            style={{ zIndex: 5 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            ♥
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function TypedLetter({ birthday, onDone }) {
  const reduceMotion = useReducedMotion();
  const scrollRef = useRef(null);
  const blocks = useMemo(
    () => [birthday.letter.greeting, ...birthday.letter.paragraphs],
    [birthday.letter],
  );
  const totalChars = useMemo(
    () => blocks.reduce((sum, block) => sum + block.length, 0),
    [blocks],
  );
  const [typed, setTyped] = useState(reduceMotion ? totalChars : 0);
  const done = typed >= totalChars;

  useEffect(() => {
    if (done) {
      onDone?.();
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setTyped((current) => Math.min(current + 1, totalChars));
    }, TYPE_SPEED_MS);

    return () => window.clearTimeout(timeout);
  }, [done, onDone, totalChars, typed]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || done) return;

    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }, [typed, done]);

  let remaining = typed;
  const visibleBlocks = blocks.map((block) => {
    const visible = block.slice(0, Math.max(0, remaining));
    remaining -= block.length;
    return visible;
  });
  const activeIndex = visibleBlocks.findIndex(
    (visible, i) => visible.length < blocks[i].length,
  );

  const photos = birthday.polaroids.map((path) => getImageUrl(path)).filter(Boolean);

  return (
    <motion.div
      className="relative mx-auto w-[min(680px,92vw)]"
      initial={{ opacity: 0, y: 80, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={scrollRef}
        className="max-h-[64svh] overflow-y-auto rounded-md shadow-[0_40px_90px_rgba(50,40,30,0.45)]"
        onClick={() => setTyped(totalChars)}
      >
        <div className="paper-texture px-6 pb-10 pt-[2.15rem] sm:px-12">
          <p className="font-storybook text-sm uppercase leading-[2.15rem] tracking-[0.3em] text-[#59867c]">
            {birthday.date}
          </p>

          <div className="font-hand text-[1.55rem] leading-[2.15rem] text-[#4a3a33] sm:text-[1.7rem]">
            {visibleBlocks.map((visible, i) =>
              visible.length > 0 || i === 0 ? (
                <p
                  key={i}
                  className={i === 0 ? 'text-[#7c3f3f]' : 'mt-[2.15rem] min-h-[2.15rem]'}
                >
                  {visible}
                  {activeIndex === i && <span className="type-caret" />}
                </p>
              ) : null,
            )}
          </div>

          <AnimatePresence>
            {done && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <p className="font-hand mt-[2.15rem] text-right text-[1.9rem] leading-[2.15rem] text-[#7c3f3f]">
                  {birthday.letter.signature}
                </p>

                {photos.length > 0 && (
                  <div className="mt-10 flex flex-wrap justify-center gap-4 sm:gap-6">
                    {photos.map((src, i) => (
                      <motion.figure
                        key={src}
                        className="w-[30%] min-w-[120px] max-w-[170px] bg-white p-2 pb-7 shadow-[0_10px_24px_rgba(60,40,30,0.25)]"
                        style={{ rotate: [-6, 3, -2][i % 3] }}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.2, duration: 0.6 }}
                      >
                        <img src={src} alt="" className="aspect-square w-full object-cover" />
                      </motion.figure>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {!done && (
        <p className="mt-3 text-center text-xs font-semibold uppercase tracking-[0.25em] text-white/85 drop-shadow">
          Toque na carta para ler tudo
        </p>
      )}
    </motion.div>
  );
}

function LoveNotes({ notes }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((current) => (current + 1) % notes.length);
    }, 2600);

    return () => window.clearInterval(interval);
  }, [notes.length]);

  return (
    <div className="relative h-10">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          className="font-hand absolute inset-x-0 text-3xl text-[#7c3f3f]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          {notes[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

export default function BirthdayIntro({ birthday, onFinish }) {
  const [stage, setStage] = useState('scene');
  const night = stage === 'letter';
  const [opening, setOpening] = useState(false);
  const [letterDone, setLetterDone] = useState(false);
  const finishLetter = useCallback(() => setLetterDone(true), []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const startJourney = () => {
    window.dispatchEvent(new CustomEvent('neriegica:play-music', { detail: { reveal: false } }));
    setStage('envelope');
  };

  const openEnvelope = () => {
    setOpening(true);
    window.setTimeout(() => setStage('letter'), 1400);
  };

  return (
    <motion.div
      className="fixed inset-0 z-40 overflow-hidden"
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    >
      <GhibliScene night={night} />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 py-10">
        <AnimatePresence mode="wait">
          {stage === 'scene' && (
            <motion.div
              key="scene"
              className="max-w-2xl text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.8 }}
            >
              <motion.p
                className="font-storybook text-sm font-semibold uppercase tracking-[0.35em] text-[#1f4a5a] drop-shadow-[0_1px_6px_rgba(255,255,255,0.9)]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {birthday.date} · {birthday.greeting}
              </motion.p>
              <motion.h1
                className="font-hand mt-4 text-[clamp(3.4rem,13vw,6.5rem)] leading-[0.95] text-[#7c3f3f] drop-shadow-[0_2px_0_rgba(255,255,255,0.6)]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 1 }}
              >
                {birthday.title}
              </motion.h1>
              <motion.p
                className="font-storybook mx-auto mt-5 max-w-lg text-xl italic leading-8 text-[#3f342f] sm:text-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 1 }}
              >
                {birthday.subtitle}
              </motion.p>
              <motion.button
                type="button"
                onClick={startJourney}
                className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#7c3f3f] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_18px_45px_rgba(124,63,63,0.35)] transition hover:bg-[#693434] focus:outline-none focus:ring-4 focus:ring-white/60"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2, duration: 0.7 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                {birthday.openLabel}
                <span aria-hidden="true">✉</span>
              </motion.button>
            </motion.div>
          )}

          {stage === 'envelope' && (
            <motion.div
              key="envelope"
              className="text-center"
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
            >
              <Envelope opening={opening} onOpen={openEnvelope} />
              <motion.p
                className="font-hand mt-8 text-3xl text-[#7c3f3f]"
                animate={{ opacity: opening ? 0 : [0.55, 1, 0.55] }}
                transition={{ duration: 2.2, repeat: opening ? 0 : Infinity }}
              >
                toque no lacre ♡
              </motion.p>
            </motion.div>
          )}

          {stage === 'letter' && (
            <motion.div key="letter" className="flex w-full flex-col items-center">
              <TypedLetter birthday={birthday} onDone={finishLetter} />

              <AnimatePresence>
                {letterDone && (
                  <motion.div
                    className="mt-5 text-center"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.7 }}
                  >
                    <div className="rounded-full bg-white/70 px-6 py-1 backdrop-blur">
                      <LoveNotes notes={birthday.loveNotes} />
                    </div>
                    <motion.button
                      type="button"
                      onClick={onFinish}
                      className="mt-4 inline-flex items-center gap-3 rounded-full bg-[#7c3f3f] px-7 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_18px_45px_rgba(124,63,63,0.35)] transition hover:bg-[#693434] focus:outline-none focus:ring-4 focus:ring-white/60"
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {birthday.enterLabel}
                      <span aria-hidden="true">→</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
