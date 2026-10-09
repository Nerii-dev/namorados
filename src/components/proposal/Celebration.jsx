import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Konpeito } from '../ghibli/GhibliScene';
import { konpeitoColors, seeded } from '../ghibli/utils';
import Certificate from './Certificate';

const lanterns = Array.from({ length: 26 }, (_, i) => ({
  left: `${3 + seeded(i + 1000) * 94}%`,
  size: 16 + seeded(i + 1100) * 22,
  dur: `${12 + seeded(i + 1200) * 9}s`,
  delay: `${seeded(i + 1300) * 7}s`,
  sway: `${(seeded(i + 1400) - 0.5) * 120}px`,
}));

const particles = Array.from({ length: 42 }, (_, i) => {
  const angle = (i / 42) * Math.PI * 2 + seeded(i + 1500) * 0.4;
  const distance = 110 + seeded(i + 1600) * 190;
  return {
    dx: Math.cos(angle) * distance,
    dy: Math.sin(angle) * distance - 60,
    rotate: (seeded(i + 1700) - 0.5) * 720,
    size: 12 + seeded(i + 1800) * 14,
    color: konpeitoColors[i % konpeitoColors.length],
  };
});

function KonpeitoBurst({ x, y }) {
  return particles.map((p, i) => (
    <motion.div
      key={i}
      className="pointer-events-none absolute left-0 top-0"
      style={{ width: p.size, height: p.size, marginLeft: -p.size / 2, marginTop: -p.size / 2 }}
      initial={{ x, y, opacity: 1, scale: 0.3 }}
      animate={{
        x: [x, x + p.dx, x + p.dx * 1.12],
        y: [y, y + p.dy, y + p.dy + 280],
        opacity: [1, 1, 0],
        scale: [0.3, 1, 0.9],
        rotate: [0, p.rotate],
      }}
      transition={{ duration: 2.6, times: [0, 0.32, 1], ease: 'easeOut' }}
    >
      <svg viewBox="-12 -12 24 24" className="h-full w-full overflow-visible">
        <Konpeito color={p.color} r={10} />
      </svg>
    </motion.div>
  ));
}

export default function Celebration({ celebration, certificate, couple, acceptedAt, layout, starCount }) {
  const [bursts, setBursts] = useState([]);
  const [showCertificate, setShowCertificate] = useState(false);
  const dateText = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(new Date(acceptedAt));
  const { w } = layout.viewport;

  const burst = (x, y) => {
    const id = `${Date.now()}-${Math.random()}`;
    setBursts((current) => [...current, { id, x, y }]);
    window.setTimeout(() => {
      setBursts((current) => current.filter((item) => item.id !== id));
    }, 3000);
  };

  useEffect(() => {
    const timers = [
      window.setTimeout(() => burst(w / 2, layout.textTop + 30), 300),
      window.setTimeout(() => burst(w * 0.25, layout.textTop - 60), 1100),
      window.setTimeout(() => burst(w * 0.75, layout.textTop - 40), 1700),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
    // Só no momento do "sim".
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {lanterns.map((lantern, i) => (
          <span
            key={i}
            className="lantern"
            style={{
              left: lantern.left,
              '--s': `${lantern.size}px`,
              '--dur': lantern.dur,
              '--delay': lantern.delay,
              '--sway': lantern.sway,
            }}
          />
        ))}
      </div>

      <div
        className="absolute inset-x-0 flex flex-col items-center px-5 text-center"
        style={{ top: layout.textTop }}
      >
        <motion.h1
          className="font-hand cursor-pointer select-none text-[4rem] leading-none text-[#fff4dc] drop-shadow-[0_0_30px_rgba(255,200,140,0.7)] sm:text-[5.5rem]"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.2 }}
          onPointerDown={(event) => burst(event.clientX, event.clientY)}
        >
          {celebration.title}
        </motion.h1>
        <motion.p
          className="font-storybook mt-3 text-2xl italic text-white sm:text-3xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        >
          {celebration.subtitle}
        </motion.p>
        <motion.p
          className="mt-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#ffe9a8]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          {celebration.sinceLabel} {dateText}
        </motion.p>

        <motion.button
          type="button"
          onClick={() => setShowCertificate(true)}
          className="mt-7 rounded-full bg-[#fff4dc] px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#7c3f3f] shadow-[0_0_30px_rgba(255,230,170,0.45)] focus:outline-none focus:ring-4 focus:ring-white/50"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.7 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          {celebration.certificateLabel}
        </motion.button>
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {bursts.map((item) => (
          <KonpeitoBurst key={item.id} x={item.x} y={item.y} />
        ))}
      </div>

      <AnimatePresence>
        {showCertificate && (
          <Certificate
            certificate={certificate}
            couple={couple}
            dateText={`Sob o céu de ${dateText}`}
            starCount={starCount}
            onClose={() => setShowCertificate(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
