import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const unitLabels = [
  ['years', 'Anos'],
  ['months', 'Meses'],
  ['days', 'Dias'],
  ['hours', 'Horas'],
  ['minutes', 'Minutos'],
  ['seconds', 'Segundos'],
];

const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

const getElapsedTime = (startDate) => {
  const start = new Date(startDate);
  const now = new Date();

  if (Number.isNaN(start.getTime()) || start > now) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  let hours = now.getHours() - start.getHours();
  let minutes = now.getMinutes() - start.getMinutes();
  let seconds = now.getSeconds() - start.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }

  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }

  if (hours < 0) {
    hours += 24;
    days -= 1;
  }

  if (days < 0) {
    months -= 1;
    const previousMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    const previousMonthYear =
      now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    days += daysInMonth(previousMonthYear, previousMonth);
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days, hours, minutes, seconds };
};

function TimeTile({ value, label }) {
  return (
    <motion.div
      className="grid min-h-28 place-items-center rounded-lg border border-[#ead7cf] bg-white/70 px-3 py-5 text-center shadow-[0_14px_35px_rgba(124,63,63,0.08)] backdrop-blur"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
    >
      <motion.span
        key={value}
        className="font-serif text-4xl leading-none text-[#7c3f3f] sm:text-5xl"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {String(value).padStart(2, '0')}
      </motion.span>
      <span className="mt-3 text-xs font-bold uppercase tracking-[0.22em] text-stone-500">
        {label}
      </span>
    </motion.div>
  );
}

export default function Timer({ startDate, content }) {
  const [elapsed, setElapsed] = useState(() => getElapsedTime(startDate));

  const formattedDate = useMemo(() => {
    const date = new Date(startDate);
    if (Number.isNaN(date.getTime())) return 'Data nao configurada';

    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(date);
  }, [startDate]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setElapsed(getElapsedTime(startDate));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [startDate]);

  return (
    <section id="tempo" className="px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#59867c]">
            {content.eyebrow}
          </p>
          <h2 className="mt-4 font-serif text-4xl leading-tight text-[#7c3f3f] sm:text-6xl">
            {content.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-stone-700 sm:text-lg">
            {content.description}
          </p>
          <p className="mt-4 text-sm font-medium text-stone-500">
            Inicio: {formattedDate}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
          {unitLabels.map(([key, label]) => (
            <TimeTile key={key} value={elapsed[key]} label={label} />
          ))}
        </div>
      </div>
    </section>
  );
}
