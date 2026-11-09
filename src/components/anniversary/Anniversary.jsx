import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import siteData, { getImageUrl } from '../../config/data';
import MusicPlayer from '../MusicPlayer';
import { useViewport } from '../proposal/geometry';
import BirthdayCake from './BirthdayCake';
import PhotoHeart from './PhotoHeart';
import SeasonCard from './SeasonCard';
import SeasonScene from './SeasonScene';
import YearCounter from './YearCounter';
import YearLetter from './YearLetter';
import YearOrbit from './YearOrbit';

export default function Anniversary() {
  const { anniversary, couple, gallery, music } = siteData;
  const { chapters } = anniversary;
  const [stage, setStage] = useState('intro');
  const [chapter, setChapter] = useState(0);
  const [direction, setDirection] = useState(1);
  const viewport = useViewport();
  const photos = gallery.images.map((path) => getImageUrl(path)).filter(Boolean);

  const season = stage === 'seasons' ? chapters[chapter].season : 'night';
  const showOrbit = stage === 'seasons' || stage === 'counter';
  const orbitProgress = stage === 'counter' ? 1 : chapters[chapter].progress;

  const start = () => {
    window.dispatchEvent(new CustomEvent('neriegica:play-music', { detail: { reveal: false } }));
    setChapter(0);
    setStage('seasons');
  };

  const goToChapter = (next) => {
    if (next < 0) return;
    if (next >= chapters.length) {
      setStage('counter');
      return;
    }
    setDirection(next > chapter ? 1 : -1);
    setChapter(next);
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#0b2240] text-stone-800">
      <SeasonScene season={season} celebrate={stage === 'heart'} hideSoot={stage === 'letter'} />

      <AnimatePresence>
        {showOrbit && (
          <div className="absolute inset-x-0 top-3 z-20 flex justify-center">
            <YearOrbit
              progress={orbitProgress}
              label={chapters[chapter].label}
              sublabel={stage === 'seasons' ? `${chapter + 1} de ${chapters.length}` : null}
              complete={stage === 'counter'}
            />
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.section
            key="intro"
            className="relative z-10 flex h-full flex-col items-center justify-center px-5 pb-[16svh] text-center"
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              className="font-storybook text-sm font-semibold uppercase tracking-[0.34em] text-[#ffe9a8]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9 }}
            >
              {anniversary.intro.eyebrow}
            </motion.p>
            <motion.h1
              className="font-hand mt-3 text-[clamp(3.6rem,15vw,7rem)] leading-[0.95] text-[#fff4dc] drop-shadow-[0_0_30px_rgba(255,220,160,0.45)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1.2 }}
            >
              {anniversary.intro.title}
            </motion.h1>
            <motion.p
              className="font-storybook mx-auto mt-5 max-w-xl text-xl italic leading-8 text-white/90 sm:text-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
            >
              {anniversary.intro.subtitle}
            </motion.p>
            <motion.button
              type="button"
              onClick={start}
              className="mt-9 rounded-full bg-[#fff4dc] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#7c3f3f] shadow-[0_0_40px_rgba(255,230,170,0.45)] focus:outline-none focus:ring-4 focus:ring-white/60"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8, duration: 0.7 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              {anniversary.intro.startLabel} ☀
            </motion.button>
          </motion.section>
        )}

        {stage === 'seasons' && (
          <motion.section
            key="seasons"
            className="relative z-10 flex h-full items-center justify-center px-3 pb-4 pt-28"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SeasonCard
              chapters={chapters}
              index={chapter}
              direction={direction}
              onNext={() => goToChapter(chapter + 1)}
              onPrev={() => goToChapter(chapter - 1)}
            />
          </motion.section>
        )}

        {stage === 'counter' && (
          <motion.section
            key="counter"
            className="relative z-10 flex h-full items-center justify-center px-4 pb-6 pt-28"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <YearCounter
              counter={anniversary.counter}
              start={couple.relationshipStart}
              photoCount={photos.length}
              onNext={() => setStage('cake')}
            />
          </motion.section>
        )}

        {stage === 'cake' && (
          <motion.section
            key="cake"
            className="relative z-10 flex h-full items-center justify-center px-4 pb-[6svh] pt-[12svh]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <BirthdayCake cake={anniversary.cake} onBlown={() => setStage('heart')} />
          </motion.section>
        )}

        {stage === 'heart' && (
          <PhotoHeart
            key="heart"
            celebration={anniversary.celebration}
            photos={photos}
            viewport={viewport}
            onNext={() => setStage('letter')}
          />
        )}

        {stage === 'letter' && (
          <motion.section
            key="letter"
            className="relative z-10 flex h-full items-center justify-center px-2 py-6"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <YearLetter letter={anniversary.letter} ending={anniversary.ending} onReplay={() => setStage('intro')} />
          </motion.section>
        )}
      </AnimatePresence>

      <MusicPlayer music={music} />
    </main>
  );
}
