import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import siteData from '../../config/data';
import MusicPlayer from '../MusicPlayer';
import { GhibliScene } from '../ghibli/GhibliScene';
import Celebration from './Celebration';
import Constellation from './Constellation';
import StarWishes from './StarWishes';
import StoryBook from './StoryBook';
import TheQuestion from './TheQuestion';
import { getLayout, useViewport } from './geometry';

// Guarda a data do "sim" para ela ver sempre a mesma data se abrir de novo.
const ACCEPTED_KEY = 'neriegica:pedido-aceito-em';

const rememberAcceptedAt = () => {
  try {
    const saved = window.localStorage.getItem(ACCEPTED_KEY);
    if (saved) return saved;
    const now = new Date().toISOString();
    window.localStorage.setItem(ACCEPTED_KEY, now);
    return now;
  } catch {
    return new Date().toISOString();
  }
};

const NIGHT_STAGES = ['stars', 'question', 'yes'];

export default function Proposal() {
  const { proposal, couple, music } = siteData;
  const [stage, setStage] = useState('intro');
  const [collected, setCollected] = useState([]);
  const [acceptedAt, setAcceptedAt] = useState(null);
  const { w, h } = useViewport();
  const reasons = proposal.stars.reasons;
  const layout = getLayout(w, h, reasons.length);
  const night = NIGHT_STAGES.includes(stage);

  const start = () => {
    window.dispatchEvent(new CustomEvent('neriegica:play-music', { detail: { reveal: false } }));
    setStage('story');
  };

  const collect = (reason) => {
    setCollected((current) => (current.includes(reason) ? current : [...current, reason]));
  };

  const sayYes = () => {
    setAcceptedAt(rememberAcceptedAt());
    setStage('yes');
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#0b2240] text-stone-800">
      <GhibliScene
        time={night ? 'night' : 'sunset'}
        celebrate={stage === 'yes'}
        hideSoot={stage === 'stars'}
      />

      {night && (
        <Constellation
          layout={layout}
          collected={collected}
          total={reasons.length}
          complete={collected.length === reasons.length}
        />
      )}

      <AnimatePresence mode="wait">
        {stage === 'intro' && (
          <motion.section
            key="intro"
            className="relative z-10 flex h-full flex-col items-center justify-center px-5 pb-[18svh] text-center"
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.7 }}
          >
            <motion.p
              className="font-storybook text-sm font-semibold uppercase tracking-[0.32em] text-[#fff4dc] [text-shadow:0_1px_3px_rgba(70,25,55,0.7),0_2px_12px_rgba(70,25,55,0.5)]"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.9 }}
            >
              {proposal.intro.eyebrow}
            </motion.p>
            <motion.h1
              className="font-hand mt-4 max-w-3xl text-[clamp(3.2rem,12vw,6.2rem)] leading-[0.95] text-[#fff4dc] [text-shadow:0_2px_4px_rgba(70,25,55,0.55),0_4px_22px_rgba(70,25,55,0.6)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1.1 }}
            >
              {proposal.intro.title}
            </motion.h1>
            <motion.p
              className="font-storybook mt-5 text-xl italic text-white drop-shadow-[0_1px_8px_rgba(60,30,60,0.6)] sm:text-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.9, duration: 1 }}
            >
              {proposal.intro.subtitle}
            </motion.p>
            <motion.button
              type="button"
              onClick={start}
              className="mt-9 rounded-full bg-[#7c3f3f] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_18px_45px_rgba(60,20,30,0.45)] transition hover:bg-[#693434] focus:outline-none focus:ring-4 focus:ring-white/60"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6, duration: 0.7 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
            >
              {proposal.intro.startLabel} ♡
            </motion.button>
          </motion.section>
        )}

        {stage === 'story' && (
          <motion.section
            key="story"
            className="relative z-10 flex h-full items-center justify-center px-3 py-6"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <StoryBook chapters={proposal.chapters} onFinish={() => setStage('stars')} />
          </motion.section>
        )}

        {stage === 'stars' && (
          <StarWishes
            key="stars"
            stars={proposal.stars}
            layout={layout}
            collected={collected}
            onCollect={collect}
            onFinish={() => setStage('question')}
          />
        )}

        {stage === 'question' && (
          <TheQuestion key="question" question={proposal.question} layout={layout} onYes={sayYes} />
        )}

        {stage === 'yes' && (
          <Celebration
            key="yes"
            celebration={proposal.celebration}
            certificate={proposal.certificate}
            couple={couple}
            acceptedAt={acceptedAt}
            layout={layout}
            starCount={reasons.length}
          />
        )}
      </AnimatePresence>

      <MusicPlayer music={music} />
    </main>
  );
}
