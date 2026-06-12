import { motion } from 'framer-motion';
import Gallery from './components/Gallery';
import Hero from './components/Hero';
import LoveLetter from './components/LoveLetter';
import MusicPlayer from './components/MusicPlayer';
import Timer from './components/Timer';
import siteData from './config/data';

const sectionMotion = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
};

export default function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf7] text-stone-800">
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
