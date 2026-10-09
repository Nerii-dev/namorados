import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { getImageUrl } from '../config/data';
import { GhibliScene } from './ghibli/GhibliScene';

const TYPE_SPEED_MS = 32;

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
      <GhibliScene time={night ? 'night' : 'day'} />

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
