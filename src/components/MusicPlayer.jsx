import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getAudioUrl } from '../config/data';

const getDeezerEmbedUrl = (deezerUrl, autoplay = false) => {
  if (!deezerUrl) return '';

  const match = deezerUrl.match(/deezer\.com\/(?:[a-z]{2}\/)?(track|album|playlist)\/(\d+)/i);
  if (!match) return '';

  const [, type, id] = match;
  const params = new URLSearchParams({
    tracklist: 'false',
  });

  if (autoplay) {
    params.set('autoplay', 'true');
  }

  return `https://widget.deezer.com/widget/auto/${type}/${id}?${params.toString()}`;
};

export default function MusicPlayer({ music }) {
  const audioRef = useRef(null);
  const [isOpen, setIsOpen] = useState(Boolean(music.autoplay && music.deezerUrl));
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.55);
  const audioUrl = getAudioUrl(music.file);
  const deezerEmbedUrl = useMemo(
    () => getDeezerEmbedUrl(music.deezerUrl, music.autoplay),
    [music.autoplay, music.deezerUrl],
  );
  const usesDeezer = Boolean(music.deezerUrl);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playLocalAudio = useCallback(async () => {
    const audio = audioRef.current;

    if (usesDeezer) {
      setIsOpen(true);
      return;
    }

    if (!audio || !audioUrl) return;

    try {
      await audio.play();
      setIsPlaying(true);
      setIsOpen(true);
    } catch {
      setIsOpen(true);
    }
  }, [audioUrl, usesDeezer]);

  useEffect(() => {
    const handleHeroPlay = () => {
      playLocalAudio();
    };

    window.addEventListener('neriegica:play-music', handleHeroPlay);

    return () => {
      window.removeEventListener('neriegica:play-music', handleHeroPlay);
    };
  }, [playLocalAudio]);

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (usesDeezer) {
      setIsOpen(true);
      return;
    }

    if (!audio || !audioUrl) return;

    if (audio.paused) {
      await playLocalAudio();
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="mb-3 w-[min(18rem,calc(100vw-2rem))] rounded-lg border border-[#ead7cf] bg-white/88 p-4 shadow-[0_22px_55px_rgba(70,42,42,0.18)] backdrop-blur"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-stone-800">{music.title}</p>
                <p className="mt-1 text-xs font-medium text-stone-500">
                  {music.artist}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-800"
                aria-label="Fechar player"
              >
                x
              </button>
            </div>

            {usesDeezer && deezerEmbedUrl && (
              <iframe
                title={music.title}
                src={deezerEmbedUrl}
                className="mt-4 h-[90px] w-full rounded-md border-0"
                allow="autoplay; encrypted-media; clipboard-write"
              />
            )}

            {!usesDeezer && (
              <label className="mt-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                Volume
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  className="h-1 flex-1 accent-[#7c3f3f]"
                />
              </label>
            )}

            {usesDeezer && !deezerEmbedUrl && (
              <p className="mt-4 rounded-md bg-[#fff4ef] px-3 py-2 text-xs leading-5 text-[#7c3f3f]">
                Use um link direto do Deezer com /track/, /album/ ou /playlist/.
              </p>
            )}

            {!usesDeezer && !audioUrl && (
              <p className="mt-4 rounded-md bg-[#fff4ef] px-3 py-2 text-xs leading-5 text-[#7c3f3f]">
                Coloque o arquivo em src/assets/audio e confira o nome no data.js.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="grid h-12 w-12 place-items-center rounded-full border border-[#ead7cf] bg-white/88 font-bold text-[#7c3f3f] shadow-lg backdrop-blur transition hover:bg-[#fff4ef] focus:outline-none focus:ring-4 focus:ring-[#d99c9a]/45"
          aria-label="Abrir player de musica"
        >
          M
        </button>
        <button
          type="button"
          onClick={togglePlay}
          disabled={!usesDeezer && !audioUrl}
          className="grid h-12 w-12 place-items-center rounded-full bg-[#7c3f3f] font-bold text-white shadow-lg transition hover:bg-[#693434] focus:outline-none focus:ring-4 focus:ring-[#d99c9a]/45 disabled:cursor-not-allowed disabled:bg-stone-300"
          aria-label={usesDeezer ? 'Abrir musica do Deezer' : isPlaying ? 'Pausar musica' : 'Tocar musica'}
        >
          {usesDeezer ? 'D' : isPlaying ? 'II' : '>'}
        </button>
      </div>
    </div>
  );
}
