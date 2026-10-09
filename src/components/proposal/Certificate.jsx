import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SignaturePad from './SignaturePad';
import { renderCertificate } from './certificateImage';

const fillNames = (text, couple) =>
  text.replaceAll('{nameOne}', couple.nameOne).replaceAll('{nameTwo}', couple.nameTwo);

export default function Certificate({ certificate, couple, dateText, starCount, onClose }) {
  const padRef = useRef(null);
  const actionsRef = useRef(null);
  const [hasInk, setHasInk] = useState(false);
  const [signed, setSigned] = useState(false);
  const [saving, setSaving] = useState(false);
  const body = fillNames(certificate.body, couple);
  const promise = fillNames(certificate.promise, couple);
  const whatsappUrl = `https://wa.me/${certificate.whatsappNumber}?text=${encodeURIComponent(certificate.whatsappMessage)}`;

  const clear = () => {
    padRef.current.clear();
    setHasInk(false);
  };

  const download = async () => {
    setSaving(true);
    try {
      const blob = await renderCertificate({
        title: certificate.title,
        body,
        promise,
        dateText,
        nameOne: couple.nameOne,
        nameTwo: couple.nameTwo,
        signatureOne: certificate.signatureOne,
        signatureCanvas: padRef.current.canvas,
        starCount,
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'certificado-de-namoro.png';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0b2240]/55 px-3 py-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.article
        className="parchment relative max-h-full w-[min(620px,100%)] overflow-y-auto rounded-md p-2 shadow-[0_40px_90px_rgba(0,0,0,0.5)]"
        initial={{ opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full text-xl text-[#8a6a4e] transition hover:bg-black/5"
          aria-label="Fechar certificado"
        >
          ×
        </button>

        <div className="rounded-sm border-[3px] border-double border-[#b98b5e] px-5 pb-8 pt-9 text-center sm:px-10">
          <h2 className="font-storybook text-xl font-semibold uppercase tracking-[0.28em] text-[#7c3f3f] sm:text-2xl">
            {certificate.title}
          </h2>
          <p className="mt-2 text-2xl text-[#e0657a]" aria-hidden="true">
            ♥
          </p>

          <p className="font-storybook mt-3 text-[1.15rem] italic leading-7 text-[#3f342f] sm:text-xl sm:leading-8">
            {body}
          </p>
          <p className="font-storybook mt-4 text-[1.1rem] italic leading-7 text-[#3f342f] sm:text-lg">
            {promise}
          </p>
          <p className="font-hand mt-5 text-3xl text-[#59867c]">{dateText}</p>

          <div className="mt-8 grid grid-cols-2 items-end gap-5">
            <div>
              <p className="font-hand text-[2.6rem] leading-none text-[#3a2f6b]">
                {certificate.signatureOne}
              </p>
              <div className="mt-3 border-t border-[#8a6a4e]" />
              <p className="font-storybook mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#8a6a4e]">
                {couple.nameOne}
              </p>
            </div>

            <div>
              <div
                className={`relative rounded-md border border-dashed ${signed ? 'border-transparent' : 'border-[#b98b5e] bg-white/45'}`}
              >
                <SignaturePad ref={padRef} disabled={signed} onInk={() => setHasInk(true)} />
                {!hasInk && (
                  <p className="pointer-events-none absolute inset-0 grid place-items-center px-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#b98b5e]">
                    {certificate.signHint}
                  </p>
                )}
              </div>
              <div className="border-t border-[#8a6a4e]" />
              <p className="font-storybook mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#8a6a4e]">
                {couple.nameTwo}
              </p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!signed ? (
              <motion.div
                key="sign"
                className="mt-6 flex justify-center gap-3"
                exit={{ opacity: 0 }}
              >
                <button
                  type="button"
                  onClick={clear}
                  disabled={!hasInk}
                  className="rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[#8a6a4e] transition hover:bg-black/5 disabled:opacity-40"
                >
                  {certificate.clearLabel}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSigned(true);
                    window.setTimeout(() => {
                      actionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    }, 900);
                  }}
                  disabled={!hasInk}
                  className="rounded-full bg-[#7c3f3f] px-7 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-lg transition hover:bg-[#693434] disabled:bg-stone-300 disabled:shadow-none"
                >
                  {certificate.confirmLabel}
                </button>
              </motion.div>
            ) : (
              <motion.div key="signed" ref={actionsRef} className="mt-4 flex flex-col items-center">
                <motion.div
                  className="grid h-16 w-16 place-items-center rounded-full sm:h-20 sm:w-20 bg-[radial-gradient(circle_at_35%_30%,#de5a55,#962a2a)] text-3xl text-[#ffd9d4] shadow-[0_8px_18px_rgba(90,20,20,0.45)]"
                  initial={{ scale: 2.6, opacity: 0, rotate: -25 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 14 }}
                  aria-hidden="true"
                >
                  ♥
                </motion.div>

                <motion.div
                  className="mt-6 flex flex-wrap justify-center gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <button
                    type="button"
                    onClick={download}
                    disabled={saving}
                    className="rounded-full bg-[#7c3f3f] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-lg transition hover:bg-[#693434] disabled:opacity-60"
                  >
                    {saving ? 'Gerando...' : certificate.downloadLabel}
                  </button>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[#25a35a] px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-lg transition hover:bg-[#1f8b4c]"
                  >
                    {certificate.whatsappLabel}
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.article>
    </motion.div>
  );
}
