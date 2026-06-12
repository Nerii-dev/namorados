import { motion } from 'framer-motion';
import { getImageUrl, getVideoUrl } from '../config/data';

const heights = ['h-72', 'h-96', 'h-80', 'h-[26rem]', 'h-72', 'h-96'];

export default function Gallery({ gallery }) {
  const resolvedImages = gallery.images.map((path) => ({
    type: 'image',
    path,
    src: getImageUrl(path),
  }));
  const resolvedVideos = (gallery.videos ?? []).map((path) => ({
    type: 'video',
    path,
    src: getVideoUrl(path),
  }));
  const mediaItems = [...resolvedImages, ...resolvedVideos];

  return (
    <section className="bg-[#f6eee8] px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#59867c]">
            Galeria
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-[#7c3f3f] sm:text-6xl">
            {gallery.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-stone-700 sm:text-lg">
            {gallery.description}
          </p>
        </div>

        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {mediaItems.map((item, index) => (
            <motion.figure
              key={`${item.path}-${index}`}
              className="mb-5 break-inside-avoid overflow-hidden rounded-lg border border-white/80 bg-white/65 p-2 shadow-[0_18px_45px_rgba(124,63,63,0.10)]"
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: (index % 3) * 0.08 }}
              whileHover={{ y: -5 }}
            >
              {item.type === 'image' && item.src ? (
                <img
                  src={item.src}
                  alt={`Momento ${index + 1}`}
                  className={`${heights[index % heights.length]} w-full rounded-md object-cover`}
                  loading="lazy"
                />
              ) : item.type === 'video' && item.src ? (
                <video
                  src={item.src}
                  className={`${heights[index % heights.length]} w-full rounded-md object-cover`}
                  muted
                  loop
                  playsInline
                  controls
                  preload="metadata"
                />
              ) : (
                <div
                  className={`${heights[index % heights.length]} flex w-full items-center justify-center rounded-md bg-gradient-to-br from-[#f5bbb2] via-[#f8dfd3] to-[#b9d9cf] px-6 text-center font-serif text-3xl leading-tight text-[#7c3f3f]`}
                >
                  Adicione {item.path}
                </div>
              )}
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
