import { AnimatePresence, motion } from 'framer-motion';
import { SootSprite } from '../ghibli/GhibliScene';

export default function StarWishes({ stars, layout, collected, onCollect, onFinish }) {
  const complete = collected.length === stars.reasons.length;
  const lastReason = collected.at(-1);

  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div
        className="absolute inset-x-0 flex flex-col items-center px-5 text-center"
        style={{ top: layout.textTop }}
      >
        <AnimatePresence mode="wait">
          {lastReason === undefined ? (
            <motion.div
              key="hint"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ delay: 1.6, duration: 0.8 }}
            >
              <h2 className="font-hand text-[2.3rem] leading-tight text-[#fff4dc] drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)] sm:text-5xl">
                {stars.title}
              </h2>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/75">
                {stars.hint} ↓
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={lastReason}
              className="w-[min(560px,92vw)] rounded-2xl border border-white/25 bg-white/10 px-6 py-5 backdrop-blur-md"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#ffe9a8]">
                {collected.length} de {stars.reasons.length}
              </p>
              <p className="font-storybook mt-2 text-[1.35rem] italic leading-8 text-white sm:text-2xl">
                {stars.reasons[lastReason]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {complete && (
            <motion.button
              type="button"
              onClick={onFinish}
              className="mt-6 rounded-full bg-[#fff4dc] px-7 py-3 text-sm font-bold uppercase tracking-[0.2em] text-[#7c3f3f] shadow-[0_0_30px_rgba(255,230,170,0.45)] focus:outline-none focus:ring-4 focus:ring-white/50"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 4.2, duration: 0.7 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              {stars.doneLabel}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {layout.sprites.map((sprite, i) => {
        const taken = collected.includes(i);

        return (
          <motion.button
            key={i}
            type="button"
            onClick={() => onCollect(i)}
            disabled={taken}
            className="absolute rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
            style={{
              left: sprite.x - layout.spriteSize / 2,
              top: sprite.top,
              width: layout.spriteSize,
              height: layout.spriteSize * 1.25,
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.15, duration: 0.6 }}
            whileHover={taken ? undefined : { scale: 1.08 }}
            whileTap={taken ? undefined : { scale: 0.92 }}
            aria-label={taken ? `Estrela ${i + 1} entregue` : `Pegar a estrela ${i + 1}`}
          >
            <span
              className="soot"
              style={{
                position: 'relative',
                '--s': `${layout.spriteSize}px`,
                '--dur': taken ? '3.2s' : `${1.8 + i * 0.15}s`,
                '--delay': `${-i * 0.4}s`,
              }}
            >
              <SootSprite candy={taken ? undefined : i} />
            </span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
