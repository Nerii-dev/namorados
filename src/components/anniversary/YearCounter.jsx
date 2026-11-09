import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const COUNT_UP_MS = 2600;
const format = new Intl.NumberFormat('pt-BR');

const elapsedSince = (start) => {
  const ms = Math.max(0, Date.now() - new Date(start).getTime());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor(ms / 3600000),
    minutes: Math.floor(ms / 60000),
    seconds: Math.floor(ms / 1000),
  };
};

const easeOut = (t) => 1 - (1 - t) ** 4;

// Sobe do zero até o tempo real juntos e depois segue contando ao vivo.
function useCountUp(start) {
  const [state, setState] = useState(() => ({ factor: 0, elapsed: elapsedSince(start) }));

  useEffect(() => {
    let frame;
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min((now - t0) / COUNT_UP_MS, 1);
      setState({ factor: easeOut(t), elapsed: elapsedSince(start) });
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);

    const interval = window.setInterval(() => {
      setState((current) => ({ ...current, elapsed: elapsedSince(start) }));
    }, 1000);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(interval);
    };
  }, [start]);

  const value = (key) => Math.floor(state.elapsed[key] * state.factor);
  return { value, done: state.factor >= 1 };
}

export default function YearCounter({ counter, start, photoCount, onNext }) {
  const { value, done } = useCountUp(start);
  const units = [
    ['hours', 'horas'],
    ['minutes', 'minutos'],
    ['seconds', 'segundos'],
  ];

  return (
    <motion.div
      className="flex w-[min(560px,92vw)] flex-col items-center text-center"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.9 }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#ffe9a8]">{counter.eyebrow}</p>
      <h2 className="font-hand mt-1 text-[2.6rem] leading-tight text-[#fff4dc] sm:text-5xl">{counter.title}</h2>

      <div className="relative mt-2">
        <div className="absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle,rgba(255,220,150,0.35),transparent_70%)] blur-xl" />
        <p className="font-storybook text-[6.5rem] font-semibold leading-none text-white tabular-nums drop-shadow-[0_0_28px_rgba(255,220,160,0.55)] sm:text-[8rem]">
          {format.format(value('days'))}
        </p>
        <p className="font-hand -mt-1 text-3xl text-[#ffe9a8]">dias juntinhos</p>
      </div>

      <div className="mt-6 grid w-full grid-cols-3 gap-2 sm:gap-3">
        {units.map(([key, label]) => (
          <div key={key} className="rounded-xl border border-white/20 bg-white/10 px-1 py-3 backdrop-blur-md">
            <p className="font-storybook text-[1.35rem] font-semibold leading-none text-white tabular-nums sm:text-2xl">
              {format.format(value(key))}
            </p>
            <p className="mt-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/75">{label}</p>
          </div>
        ))}
      </div>

      <motion.div
        className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: done ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {counter.facts.map((fact) => (
          <p key={fact.label} className="text-white/90">
            <span className="font-hand text-3xl text-[#ffe9a8]">{fact.value.replace('{photos}', photoCount)}</span>{' '}
            <span className="font-storybook text-lg italic">{fact.label}</span>
          </p>
        ))}
      </motion.div>

      <motion.button
        type="button"
        onClick={onNext}
        className="mt-7 rounded-full bg-[#fff4dc] px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#7c3f3f] shadow-[0_0_30px_rgba(255,230,170,0.45)] focus:outline-none focus:ring-4 focus:ring-white/50"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: done ? 1 : 0, y: done ? 0 : 12 }}
        transition={{ duration: 0.7, delay: done ? 0.8 : 0 }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        disabled={!done}
      >
        {counter.nextLabel}
      </motion.button>
    </motion.div>
  );
}
