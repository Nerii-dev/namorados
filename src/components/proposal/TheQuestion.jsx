import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

const EDGE = 16;
// Canto inferior direito fica livre por causa do player de música.
const PLAYER_ZONE = { w: 140, h: 90 };

const overlaps = (a, b) =>
  a.x < b.right && a.x + a.w > b.left && a.y < b.bottom && a.y + a.h > b.top;

export default function TheQuestion({ question, layout, onYes }) {
  const yesRef = useRef(null);
  const noRef = useRef(null);
  const headingRef = useRef(null);
  const [dodges, setDodges] = useState(0);
  const [noPosition, setNoPosition] = useState(null);
  const [noOrigin, setNoOrigin] = useState(null);
  const gaveUp = dodges >= question.noLabels.length;
  const noLabel = question.noLabels[Math.min(dodges, question.noLabels.length - 1)];
  const yesScale = 1 + Math.min(dodges, question.noLabels.length) * 0.12;

  const dodge = (pointer) => {
    if (gaveUp) return;

    const button = noRef.current.getBoundingClientRect();
    const { w, h } = layout.viewport;
    const size = { w: button.width + 24, h: button.height };
    // Nunca cair em cima do "Sim" nem do texto da pergunta.
    const forbidden = [yesRef.current, headingRef.current].map((el) => {
      const rect = el.getBoundingClientRect();
      return { left: rect.left - 24, right: rect.right + 24, top: rect.top - 24, bottom: rect.bottom + 24 };
    });

    let next = null;
    for (let attempt = 0; attempt < 40 && !next; attempt += 1) {
      const candidate = {
        x: EDGE + Math.random() * (w - size.w - EDGE * 2),
        y: EDGE + Math.random() * (h - size.h - EDGE * 2),
        ...size,
      };
      const nearPointer =
        pointer && Math.hypot(candidate.x + size.w / 2 - pointer.x, candidate.y + size.h / 2 - pointer.y) < 160;
      const onPlayer = candidate.x + size.w > w - PLAYER_ZONE.w && candidate.y + size.h > h - PLAYER_ZONE.h;
      const blocked = forbidden.some((zone) => overlaps(candidate, zone));

      if (!blocked && !nearPointer && !onPlayer) next = candidate;
    }

    if (!noPosition) setNoOrigin({ x: button.left, y: button.top });
    setNoPosition(next ?? { x: EDGE, y: EDGE });
    setDodges((current) => current + 1);
  };

  const noButtonClass =
    'whitespace-nowrap rounded-full bg-white/85 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[#7c3f3f] shadow-lg backdrop-blur focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60';

  const runawayNo = noPosition && !gaveUp && (
    <motion.button
      ref={noRef}
      type="button"
      className={`${noButtonClass} fixed z-40`}
      style={{ left: 0, top: 0 }}
      initial={noOrigin ? { x: noOrigin.x, y: noOrigin.y } : false}
      animate={{ x: noPosition.x, y: noPosition.y }}
      transition={{ type: 'spring', stiffness: 520, damping: 26 }}
      onPointerEnter={(event) => event.pointerType === 'mouse' && dodge({ x: event.clientX, y: event.clientY })}
      onPointerDown={(event) => {
        event.preventDefault();
        dodge({ x: event.clientX, y: event.clientY });
      }}
      onClick={(event) => event.detail === 0 && dodge(null)}
    >
      {noLabel}
    </motion.button>
  );

  return (
    <motion.div
      className="absolute inset-x-0 flex flex-col items-center px-5 text-center"
      style={{ top: layout.textTop }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        ref={headingRef}
        className="font-hand max-w-3xl text-[2.6rem] leading-[1.05] text-[#fff4dc] drop-shadow-[0_0_24px_rgba(255,220,160,0.45)] sm:text-6xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1.2 }}
      >
        {question.text}
      </motion.h2>

      <motion.div
        className="mt-8 flex flex-wrap items-center justify-center gap-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <motion.button
          ref={yesRef}
          type="button"
          onClick={onYes}
          className="rounded-full bg-[#e0657a] px-9 py-4 text-base font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_40px_rgba(255,140,160,0.55)] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
          animate={{ scale: yesScale }}
          whileHover={{ scale: yesScale * 1.05 }}
          whileTap={{ scale: yesScale * 0.95 }}
        >
          {question.yesLabel} ♡
        </motion.button>

        {gaveUp ? (
          <motion.button
            type="button"
            onClick={onYes}
            className={noButtonClass}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {question.noGivesUpLabel} ♡
          </motion.button>
        ) : (
          !noPosition && (
            <button
              ref={noRef}
              type="button"
              className={noButtonClass}
              onPointerEnter={(event) => event.pointerType === 'mouse' && dodge({ x: event.clientX, y: event.clientY })}
              onPointerDown={(event) => {
                event.preventDefault();
                dodge({ x: event.clientX, y: event.clientY });
              }}
              onClick={(event) => event.detail === 0 && dodge(null)}
            >
              {noLabel}
            </button>
          )
        )}
      </motion.div>

      {runawayNo && createPortal(runawayNo, document.body)}
    </motion.div>
  );
}
