import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BirthdayIntro from './components/BirthdayIntro';
import Gallery from './components/Gallery';
import Hero from './components/Hero';
import LoveLetter from './components/LoveLetter';
import MusicPlayer from './components/MusicPlayer';
import Timer from './components/Timer';
import siteData from './config/data';

const sectionMotion = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '0px 0px -12% 0px' },
  transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
};

export default function App() {
  const [showIntro, setShowIntro] = useState(Boolean(siteData.birthday?.enabled));

  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf7] text-stone-800">
      <AnimatePresence>
        {showIntro && (
          <BirthdayIntro
            birthday={siteData.birthday}
            onFinish={() => setShowIntro(false)}
          />
        )}
      </AnimatePresence>

      {siteData.birthday?.enabled && !showIntro && (
        <button
          type="button"
          onClick={() => setShowIntro(true)}
          className="fixed bottom-4 left-4 z-30 grid h-12 w-12 place-items-center rounded-full border border-[#ead7cf] bg-white/88 text-xl text-[#7c3f3f] shadow-lg backdrop-blur transition hover:bg-[#fff4ef] focus:outline-none focus:ring-4 focus:ring-[#d99c9a]/45 sm:bottom-6 sm:left-6"
          aria-label="Reler a carta de aniversário"
          title="Reler a carta"
        >
          ✉
        </button>
      )}

      <Hero data={siteData} />
      <MusicPlayer music={siteData.music} />

      <motion.div {...sectionMotion}>
        <Timer
          startDate={siteData.couple.relationshipStart}
          content={siteData.timer}
        />
      </motion.div>

      <motion.div {...sectionMotion}>
        <Gallery gallery={siteData.gallery} />
      </motion.div>

      <motion.div {...sectionMotion}>
        <LoveLetter letter={siteData.letter} couple={siteData.couple} />
      </motion.div>
    </main>
  );
}
