import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const TYPE_SPEED_MS = 26;

export default function YearLetter({ letter, ending, onReplay }) {
  const reduceMotion = useReducedMotion();
  const scrollRef = useRef(null);
  const endRef = useRef(null);
  const blocks = useMemo(() => [letter.greeting, ...letter.paragraphs], [letter]);
  const totalChars = useMemo(() => blocks.reduce((sum, block) => sum + block.length, 0), [blocks]);
  const [typed, setTyped] = useState(reduceMotion ? totalChars : 0);
  const done = typed >= totalChars;

  useEffect(() => {
    if (done) return undefined;
    const timeout = window.setTimeout(() => setTyped((current) => Math.min(current + 1, totalChars)), TYPE_SPEED_MS);
    return () => window.clearTimeout(timeout);
  }, [done, totalChars, typed]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || done) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) el.scrollTop = el.scrollHeight;
  }, [typed, done]);

  useEffect(() => {
    if (!done) return undefined;
    const timeout = window.setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 900);
    return () => window.clearTimeout(timeout);
  }, [done]);

  let remaining = typed;
  const visible = blocks.map((block) => {
    const text = block.slice(0, Math.max(0, remaining));
    remaining -= block.length;
    return text;
  });
  const activeIndex = visible.findIndex((text, i) => text.length < blocks[i].length);

  return (
    <motion.div
      className="relative mx-auto w-[min(660px,92vw)]"
      initial={{ opacity: 0, y: 80, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={scrollRef}
        className="max-h-[78svh] overflow-y-auto rounded-md shadow-[0_40px_90px_rgba(10,10,30,0.5)]"
        onClick={() => setTyped(totalChars)}
      >
        <div className="paper-texture px-6 pb-10 pt-[2.15rem] sm:px-12">
          <p className="font-storybook text-sm uppercase leading-[2.15rem] tracking-[0.3em] text-[#59867c]">{letter.date}</p>

          <div className="font-hand text-[1.5rem] leading-[2.15rem] text-[#4a3a33] sm:text-[1.7rem]">
            {visible.map((text, i) =>
              text.length > 0 || i === 0 ? (
                <p key={i} className={i === 0 ? 'text-[#7c3f3f]' : 'mt-[2.15rem]'}>
                  {text}
                  {activeIndex === i && <span className="type-caret" />}
                </p>
              ) : null,
            )}
          </div>

          <AnimatePresence>
            {done && (
              <motion.div ref={endRef} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <p className="font-hand mt-[2.15rem] text-right text-[1.9rem] leading-[2.15rem] text-[#7c3f3f]">{letter.signature}</p>

                <div className="mt-10 border-t border-[#e3cdb3] pt-8 text-center">
                  <p className="font-storybook text-xl italic text-[#7c3f3f] sm:text-2xl">{ending.title}</p>
                  <div className="mt-5 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onReplay();
                      }}
                      className="rounded-full bg-[#7c3f3f] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-lg transition hover:bg-[#693434]"
                    >
                      {ending.replayLabel} ↺
                    </button>
                    <a
                      href="/"
                      onClick={(event) => event.stopPropagation()}
                      className="rounded-full border border-[#7c3f3f]/40 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#7c3f3f] transition hover:bg-[#7c3f3f]/5"
                    >
                      {ending.homeLabel}
                    </a>
                  </div>
                </div>
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
