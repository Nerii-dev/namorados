import { useEffect } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion';

const CX = 120;
const CY = 34;
const RX = 96;
const RY = 20;

// A volta começa embaixo (a "frente" da órbita) e segue para a esquerda, para trás do Sol e de volta.
const ORBIT_PATH = `M ${CX} ${CY + RY} A ${RX} ${RY} 0 1 1 ${CX} ${CY - RY} A ${RX} ${RY} 0 1 1 ${CX} ${CY + RY}`;
const HEART = 'M 0 4 C -7 -1 -6 -7 0 -3.5 C 6 -7 7 -1 0 4 Z';

export default function YearOrbit({ progress, label, sublabel, complete }) {
  const p = useMotionValue(progress);
  const x = useTransform(p, (v) => CX - RX * Math.sin(v * Math.PI * 2));
  const y = useTransform(p, (v) => CY + RY * Math.cos(v * Math.PI * 2));
  const scale = useTransform(p, (v) => 1.05 + 0.3 * Math.cos(v * Math.PI * 2));

  useEffect(() => {
    const controls = animate(p, progress, { duration: 2.2, ease: [0.45, 0, 0.2, 1] });
    return () => controls.stop();
  }, [p, progress]);

  return (
    <motion.div
      className="flex flex-col items-center rounded-2xl border border-white/20 bg-[#0b2240]/25 px-4 pb-2 pt-1 backdrop-blur-md"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.8 }}
    >
      <svg viewBox="0 0 240 64" className="w-[200px] overflow-visible sm:w-[240px]" aria-hidden="true">
        <defs>
          <radialGradient id="orbit-sun">
            <stop offset="0" stopColor="#fffbe6" />
            <stop offset="0.6" stopColor="#ffd970" />
            <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path d={ORBIT_PATH} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeDasharray="2 4" />
        <motion.path
          d={ORBIT_PATH}
          fill="none"
          stroke="#ffe7a3"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ pathLength: p }}
          animate={{ opacity: complete ? [1, 0.6, 1] : 1, strokeWidth: complete ? 3 : 2 }}
          transition={{ duration: 1.8, repeat: complete ? Infinity : 0 }}
        />

        <circle cx={CX} cy={CY} r="17" fill="url(#orbit-sun)" />
        <circle cx={CX} cy={CY} r="7" fill="#fff4c4" />

        <motion.g style={{ x, y, scale }}>
          <path d={HEART} fill="#ff8fab" stroke="#fff" strokeWidth="0.9" transform="scale(1.3)" />
        </motion.g>
      </svg>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${label}-${complete}`}
          className="text-center"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-hand text-2xl leading-none text-white drop-shadow">{complete ? '1 volta completa ✦' : label}</p>
          {sublabel && !complete && (
            <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white/80">{sublabel}</p>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
