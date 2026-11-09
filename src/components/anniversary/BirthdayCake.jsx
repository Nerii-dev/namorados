import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const BLOWN_DELAY_MS = 1900;

// Escuta o microfone e chama onBlow quando ouve um sopro forte e contínuo.
function useBlowDetector(onBlow) {
  const [status, setStatus] = useState('idle');
  const stopRef = useRef(null);
  const onBlowRef = useRef(onBlow);

  useEffect(() => {
    onBlowRef.current = onBlow;
  }, [onBlow]);

  useEffect(() => () => stopRef.current?.(), []);

  const start = async () => {
    if (status === 'listening') return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false },
      });
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const samples = new Float32Array(analyser.fftSize);

      let frame;
      let calibrating = 50;
      let ambient = 0;
      let loudFrames = 0;

      const stop = () => {
        cancelAnimationFrame(frame);
        stream.getTracks().forEach((track) => track.stop());
        ctx.close().catch(() => {});
        stopRef.current = null;
      };

      const tick = () => {
        analyser.getFloatTimeDomainData(samples);
        let sum = 0;
        for (let i = 0; i < samples.length; i += 1) sum += samples[i] * samples[i];
        const rms = Math.sqrt(sum / samples.length);

        if (calibrating > 0) {
          // O primeiro ~1s mede o barulho do ambiente (inclusive a música tocando).
          ambient = Math.max(ambient, rms);
          calibrating -= 1;
        } else if (rms > Math.max(0.14, ambient * 2.5)) {
          loudFrames += 1;
          if (loudFrames >= 9) {
            stop();
            onBlowRef.current();
            return;
          }
        } else {
          loudFrames = Math.max(0, loudFrames - 1);
        }

        frame = requestAnimationFrame(tick);
      };

      stopRef.current = stop;
      setStatus('listening');
      tick();
    } catch {
      setStatus('unavailable');
    }
  };

  return { status, start };
}

function Cake({ lit, onTapFlame }) {
  return (
    <svg viewBox="0 0 300 270" className="w-[min(300px,74vw)] overflow-visible">
      <defs>
        <linearGradient id="cake-body" x1="0" x2="1">
          <stop offset="0" stopColor="#f1dcc6" />
          <stop offset="0.35" stopColor="#fff6ea" />
          <stop offset="1" stopColor="#ead2bb" />
        </linearGradient>
        <linearGradient id="flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#ff7a1a" />
          <stop offset="0.55" stopColor="#ffc93d" />
          <stop offset="1" stopColor="#fff3b0" />
        </linearGradient>
        <radialGradient id="flame-glow">
          <stop offset="0" stopColor="rgba(255,214,120,0.75)" />
          <stop offset="1" stopColor="rgba(255,190,90,0)" />
        </radialGradient>
        <pattern id="candle-stripes" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <rect width="10" height="10" fill="#ff9fb8" />
          <rect width="4" height="10" fill="#fff4f7" />
        </pattern>
      </defs>

      <ellipse cx="150" cy="248" rx="138" ry="17" fill="rgba(0,0,0,0.22)" />
      <ellipse cx="150" cy="242" rx="134" ry="17" fill="#f6f1ea" />
      <ellipse cx="150" cy="239" rx="118" ry="12" fill="#ebe3d8" />

      <path d="M40 158 L40 228 Q150 252 260 228 L260 158 Z" fill="url(#cake-body)" />
      <ellipse cx="150" cy="158" rx="110" ry="19" fill="#fff8ef" />
      <path
        d="M40 158 Q40 176 52 178 Q60 160 70 182 Q80 166 92 186 Q104 168 116 188 Q128 170 140 189 Q152 171 164 189 Q176 170 188 188 Q200 168 212 185 Q224 166 234 181 Q244 162 252 177 Q260 172 260 158 Q150 186 40 158 Z"
        fill="#f6a3bc"
      />
      <ellipse cx="150" cy="157" rx="108" ry="17" fill="#f8b2c8" />

      <path d="M78 102 L78 156 Q150 172 222 156 L222 102 Z" fill="url(#cake-body)" />
      <ellipse cx="150" cy="102" rx="72" ry="13" fill="#fff8ef" />
      {[86, 108, 132, 156, 180, 204].map((x, i) => (
        <circle key={x} cx={x} cy={150 + (i % 2) * 3} r="7" fill="#fffaf3" stroke="#f0e2d2" strokeWidth="1" />
      ))}

      {[
        [96, 100],
        [124, 92],
        [178, 92],
        [204, 100],
      ].map(([x, y]) => (
        <g key={x}>
          <path d={`M${x} ${y - 9} C ${x + 9} ${y - 9} ${x + 8} ${y + 6} ${x} ${y + 9} C ${x - 8} ${y + 6} ${x - 9} ${y - 9} ${x} ${y - 9} Z`} fill="#e23d4f" />
          <path d={`M${x - 5} ${y - 9} L${x} ${y - 14} L${x + 5} ${y - 9} Z`} fill="#4c9a45" />
          <circle cx={x - 2} cy={y - 2} r="1" fill="#ffd9a0" />
          <circle cx={x + 3} cy={y + 2} r="1" fill="#ffd9a0" />
        </g>
      ))}

      <path d="M143 104 L143 52 L134 59 L129 51 L148 36 L158 36 L158 104 Z" fill="url(#candle-stripes)" stroke="#f08aa5" strokeWidth="1.2" />
      <path d="M151 36 Q150 31 152 27" stroke="#3b2b22" strokeWidth="2" fill="none" strokeLinecap="round" />

      <AnimatePresence>
        {lit && (
          <motion.g
            key="flame"
            onClick={onTapFlame}
            style={{ cursor: 'pointer', transformOrigin: '152px 27px' }}
            exit={{ scaleY: 0.1, scaleX: 0.4, opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <circle cx="152" cy="10" r="34" fill="url(#flame-glow)" className="candle-glow" />
            <g className="candle-flame">
              <path d="M152 -14 C 164 2 166 14 152 27 C 138 14 140 2 152 -14 Z" fill="url(#flame)" />
              <path d="M152 6 C 157 13 157 19 152 25 C 147 19 147 13 152 6 Z" fill="#fff7d6" />
            </g>
            <circle cx="152" cy="6" r="30" fill="transparent" />
          </motion.g>
        )}
      </AnimatePresence>

      {!lit &&
        [0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d="M152 26 C 146 16 158 8 152 -2 C 146 -12 158 -20 152 -30"
            stroke="rgba(235,235,245,0.7)"
            strokeWidth={3 - i * 0.6}
            strokeLinecap="round"
            fill="none"
            initial={{ opacity: 0.9, y: 0, x: 0 }}
            animate={{ opacity: 0, y: -50 - i * 12, x: (i - 1) * 10 }}
            transition={{ duration: 2.2, delay: i * 0.18, ease: 'easeOut' }}
          />
        ))}
    </svg>
  );
}

export default function BirthdayCake({ cake, onBlown }) {
  const [lit, setLit] = useState(true);

  const blow = () => {
    if (!lit) return;
    setLit(false);
    window.dispatchEvent(new CustomEvent('neriegica:music-volume', { detail: { volume: null } }));
    window.setTimeout(onBlown, BLOWN_DELAY_MS);
  };

  const { status, start } = useBlowDetector(blow);

  const listen = () => {
    // Abaixa a música para o microfone não confundir a batida com um sopro.
    window.dispatchEvent(new CustomEvent('neriegica:music-volume', { detail: { volume: 0.12 } }));
    start();
  };

  return (
    <motion.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="font-hand text-[3rem] leading-none text-[#fff4dc] drop-shadow-[0_0_24px_rgba(255,220,160,0.5)] sm:text-6xl">
        {cake.title}
      </h2>
      <p className="font-storybook mt-1 text-xl italic text-white/90">{cake.hint}</p>

      <div className="mt-10">
        <Cake lit={lit} onTapFlame={blow} />
      </div>

      <AnimatePresence>
        {lit && (
          <motion.div className="mt-6 flex flex-col items-center gap-2" exit={{ opacity: 0 }}>
            {status !== 'unavailable' && (
              <button
                type="button"
                onClick={listen}
                disabled={status === 'listening'}
                className="rounded-full bg-[#fff4dc] px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#7c3f3f] shadow-[0_0_30px_rgba(255,230,170,0.4)] transition focus:outline-none focus:ring-4 focus:ring-white/50 disabled:animate-pulse"
              >
                {status === 'listening' ? cake.listeningLabel : `🎤 ${cake.micLabel}`}
              </button>
            )}
            <button type="button" onClick={blow} className="text-xs font-semibold uppercase tracking-[0.25em] text-white/75 underline-offset-4 hover:underline">
              {cake.tapHint}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
