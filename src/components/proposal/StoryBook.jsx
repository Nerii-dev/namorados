import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getImageUrl } from '../../config/data';

const SWIPE_DISTANCE = 60;

export default function StoryBook({ chapters, onFinish }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const chapter = chapters[index];
  const isLast = index === chapters.length - 1;
  const image = getImageUrl(chapter.image);

  const goTo = (next) => {
    if (next < 0) return;
    if (next >= chapters.length) {
      onFinish();
      return;
    }
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  };

  return (
    <motion.div
      className="flex w-full flex-col items-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.7 }}
    >
      <div className="w-[min(520px,92vw)]" style={{ perspective: 1400 }}>
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.article
            key={index}
            custom={direction}
            className="parchment relative cursor-grab touch-pan-y select-none rounded-md px-6 pb-6 pt-7 shadow-[0_30px_70px_rgba(40,20,30,0.45)] active:cursor-grabbing sm:px-9"
            style={{ transformOrigin: direction > 0 ? 'left center' : 'right center' }}
            variants={{
              enter: (dir) => ({ rotateY: dir > 0 ? 70 : -70, opacity: 0 }),
              center: { rotateY: 0, opacity: 1 },
              exit: (dir) => ({ rotateY: dir > 0 ? -70 : 70, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => {
              if (info.offset.x < -SWIPE_DISTANCE) goTo(index + 1);
              if (info.offset.x > SWIPE_DISTANCE) goTo(index - 1);
            }}
          >
            <p className="font-storybook text-center text-xs font-semibold uppercase tracking-[0.4em] text-[#59867c]">
              {chapter.label}
            </p>
            <h2 className="font-hand mt-1 text-center text-[2.6rem] leading-tight text-[#7c3f3f]">
              {chapter.title}
            </h2>

            {image && (
              <figure
                className="mx-auto mt-4 w-[88%] bg-white p-2 pb-6 shadow-[0_12px_28px_rgba(60,40,30,0.28)]"
                style={{ rotate: index % 2 === 0 ? '-2deg' : '2deg' }}
              >
                <img
                  src={image}
                  alt=""
                  draggable={false}
                  className="aspect-[4/3] w-full object-cover"
                />
              </figure>
            )}

            <p className="font-storybook mt-5 text-center text-[1.2rem] italic leading-7 text-[#3f342f] sm:text-[1.3rem] sm:leading-8">
              {chapter.text}
            </p>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="grid h-11 w-11 place-items-center rounded-full bg-white/80 text-lg text-[#7c3f3f] shadow-lg backdrop-blur transition hover:bg-white disabled:opacity-0"
          aria-label="Capítulo anterior"
        >
          ←
        </button>

        <div className="flex gap-2" aria-hidden="true">
          {chapters.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${i === index ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
            />
          ))}
        </div>

        <motion.button
          type="button"
          onClick={() => goTo(index + 1)}
          className="rounded-full bg-[#7c3f3f] px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_14px_35px_rgba(60,20,30,0.4)] transition hover:bg-[#693434] focus:outline-none focus:ring-4 focus:ring-white/60"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          {isLast ? 'Continuar ♡' : 'Próximo →'}
        </motion.button>
      </div>
    </motion.div>
  );
}
