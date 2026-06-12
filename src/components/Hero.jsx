import { motion } from 'framer-motion';
import { getImageUrl } from '../config/data';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.18 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export default function Hero({ data }) {
  const heroImage = getImageUrl(data.hero.featuredImage);

  const scrollToTimer = () => {
    window.dispatchEvent(new CustomEvent('neriegica:play-music'));

    document
      .getElementById('tempo')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative min-h-[100svh] bg-[#fff4ef]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,177,173,0.42),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(152,195,188,0.35),transparent_26%),linear-gradient(135deg,#fff8f3_0%,#fdebed_46%,#edf7f2_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#fffaf7] to-transparent" />

      <motion.div
        className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:py-10"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <motion.p
            className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-rose-700/75"
            variants={item}
          >
            {data.hero.namesLabel}
          </motion.p>

          <motion.h1
            className="font-serif text-[clamp(4rem,18vw,8.5rem)] leading-[0.86] text-[#7c3f3f]"
            variants={item}
          >
            {data.hero.title}
          </motion.h1>

          <motion.p
            className="mx-auto mt-7 max-w-xl text-lg leading-8 text-stone-700 sm:text-xl lg:mx-0"
            variants={item}
          >
            {data.hero.subtitle}
          </motion.p>

          <motion.button
            type="button"
            onClick={scrollToTimer}
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#7c3f3f] px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_18px_45px_rgba(124,63,63,0.22)] transition hover:bg-[#693434] focus:outline-none focus:ring-4 focus:ring-[#d99c9a]/45"
            variants={item}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            {data.hero.ctaLabel}
            <span aria-hidden="true" className="text-lg leading-none">
              v
            </span>
          </motion.button>
        </div>

        <motion.div
          className="order-1 mx-auto w-full max-w-[420px] lg:order-2 lg:max-w-[500px]"
          variants={item}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/80 bg-white/45 p-3 shadow-[0_30px_80px_rgba(124,63,63,0.18)] backdrop-blur">
            {heroImage ? (
              <img
                src={heroImage}
                alt={`${data.couple.nameOne} e ${data.couple.nameTwo}`}
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-md bg-gradient-to-br from-[#f7c6bd] via-[#f8e2d8] to-[#b8d8cf] px-8 text-center font-serif text-4xl leading-tight text-[#7c3f3f]">
                {data.couple.displayName}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
