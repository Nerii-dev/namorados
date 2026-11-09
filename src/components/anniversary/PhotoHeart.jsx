import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { seeded } from '../ghibli/utils';
import { KonpeitoBurst, Lanterns } from '../proposal/Celebration';
import { heartOutline } from '../proposal/geometry';

const FLY_STAGGER = 0.14;

// O coração de fotos + o botão da carta, centralizados na tela sem cortar as fotos das pontas.
function photoHeartLayout(w, h, count) {
  const size = Math.min(w * 0.86, (h - 110) / 1.12, 600);
  const photo = Math.max(54, size / 5.3);
  const height = size * 0.88;
  const above = photo * 0.65;
  const below = photo * 0.6 + 70;
  const top = above + Math.max(8, (h - above - height - below) / 2);
  return {
    size,
    top,
    photo,
    centerY: top + height * 0.38,
    bottom: top + height,
    points: heartOutline(count, w / 2, top, size),
  };
}

export default function PhotoHeart({ celebration, photos, viewport, onNext }) {
  const { w, h } = viewport;
  const layout = photoHeartLayout(w, h, photos.length);
  const [bursts, setBursts] = useState([]);
  const [zoomed, setZoomed] = useState(null);
  const lettersAt = 0.6 + photos.length * FLY_STAGGER;

  const burst = (x, y) => {
    const id = `${Date.now()}-${Math.random()}`;
    setBursts((current) => [...current, { id, x, y }]);
    window.setTimeout(() => setBursts((current) => current.filter((item) => item.id !== id)), 3000);
  };

  useEffect(() => {
    const timers = [
      window.setTimeout(() => burst(w / 2, layout.centerY), 200),
      window.setTimeout(() => burst(w * 0.2, layout.top + 40), 900),
      window.setTimeout(() => burst(w * 0.8, layout.top + 60), 1400),
    ];
    return () => timers.forEach((timer) => window.clearTimeout(timer));
    // Só quando a vela apaga.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
      <Lanterns />

      {photos.map((src, i) => {
        const point = layout.points[i];
        const tilt = (seeded(i + 5000) - 0.5) * 18;
        return (
          <motion.button
            key={src}
            type="button"
            onClick={() => setZoomed(src)}
            className="absolute left-0 top-0 bg-white shadow-[0_10px_24px_rgba(0,0,0,0.35)] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
            style={{
              width: layout.photo,
              padding: layout.photo * 0.06,
              paddingBottom: layout.photo * 0.2,
              marginLeft: -layout.photo / 2,
              marginTop: -layout.photo * 0.55,
            }}
            initial={{ x: w / 2, y: layout.centerY, scale: 0, rotate: tilt * 6, opacity: 0 }}
            animate={{ x: point.x, y: point.y, scale: 1, rotate: tilt, opacity: 1 }}
            transition={{ delay: 0.5 + i * FLY_STAGGER, type: 'spring', stiffness: 90, damping: 14 }}
            whileHover={{ scale: 1.12, zIndex: 5 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Ver foto ${i + 1}`}
          >
            <img src={src} alt="" draggable={false} className="aspect-square w-full object-cover" />
          </motion.button>
        );
      })}

      <div
        className="pointer-events-none absolute inset-x-0 flex flex-col items-center px-6 text-center"
        style={{ top: layout.centerY - layout.size * 0.09 }}
      >
        <motion.h1
          className="font-hand pointer-events-auto cursor-pointer select-none text-[3.4rem] leading-none text-[#fff4dc] drop-shadow-[0_0_28px_rgba(255,200,140,0.75)] sm:text-[5rem]"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 160, damping: 12, delay: lettersAt }}
          onPointerDown={(event) => burst(event.clientX, event.clientY)}
        >
          {celebration.title}
        </motion.h1>
        <motion.p
          className="font-storybook mt-2 text-lg italic leading-snug text-white sm:text-2xl"
          style={{ maxWidth: layout.size * 0.44 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: lettersAt + 0.8, duration: 1 }}
        >
          {celebration.subtitle}
        </motion.p>
      </div>

      <div className="absolute inset-x-0 flex justify-center" style={{ top: layout.bottom + layout.photo * 0.6 + 12 }}>
        <motion.button
          type="button"
          onClick={onNext}
          className="rounded-full bg-[#fff4dc] px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] text-[#7c3f3f] shadow-[0_0_30px_rgba(255,230,170,0.45)] focus:outline-none focus:ring-4 focus:ring-white/50"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: lettersAt + 1.8, duration: 0.7 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          {celebration.letterLabel} ✉
        </motion.button>
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {bursts.map((item) => (
          <KonpeitoBurst key={item.id} x={item.x} y={item.y} />
        ))}
      </div>

      <AnimatePresence>
        {zoomed && (
          <motion.button
            type="button"
            className="fixed inset-0 z-[60] grid place-items-center bg-[#0b2240]/70 p-6 backdrop-blur-sm"
            onClick={() => setZoomed(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Fechar foto"
          >
            <motion.img
              src={zoomed}
              alt=""
              className="max-h-[80svh] max-w-full border-[10px] border-b-[34px] border-white object-contain shadow-2xl"
              initial={{ scale: 0.8, rotate: -4 }}
              animate={{ scale: 1, rotate: -1.5 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
