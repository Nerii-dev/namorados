import { motion } from 'framer-motion';

export default function LoveLetter({ letter }) {
  return (
    <section className="relative px-5 py-20 sm:px-8 lg:py-28">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#fffaf7_0%,#fdeeed_100%)]" />
      <div className="relative mx-auto max-w-4xl">
        <motion.article
          className="rounded-lg border border-[#ead7cf] bg-white/72 px-6 py-10 shadow-[0_24px_70px_rgba(124,63,63,0.12)] backdrop-blur sm:px-10 lg:px-14"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#59867c]">
            {letter.eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-[#7c3f3f] sm:text-6xl">
            {letter.title}
          </h2>

          <div className="mt-8 space-y-6 text-lg leading-9 text-stone-700">
            {letter.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 border-t border-[#ead7cf] pt-7">
            <p className="font-serif text-3xl text-[#7c3f3f]">
              {letter.signature}
            </p>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-stone-500">
              {letter.recipient}
            </p>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
