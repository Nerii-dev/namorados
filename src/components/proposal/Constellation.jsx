import { motion } from 'framer-motion';
import { Konpeito } from '../ghibli/GhibliScene';
import { konpeitoColors } from '../ghibli/utils';
import { heartSlot, smoothClosedPath } from './geometry';

const STAR_SIZE = 30;

export default function Constellation({ layout, collected, total, complete }) {
  const filledSlots = new Set(collected.map((reason) => heartSlot(reason, total)));
  const { w, h } = layout.viewport;

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <filter id="heart-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {complete && (
          <motion.path
            d={smoothClosedPath(layout.heart)}
            fill="none"
            stroke="rgba(255, 240, 205, 0.75)"
            strokeWidth="1.6"
            strokeLinecap="round"
            filter="url(#heart-glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.6, delay: 1.4, ease: 'easeInOut' }}
          />
        )}

        {complete &&
          layout.heart.map((point, i) =>
            filledSlots.has(i) ? null : (
              <motion.circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="2.4"
                fill="#fffbe8"
                filter="url(#heart-glow)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.06, duration: 0.5 }}
              />
            ),
          )}
      </svg>

      {collected.map((reason) => {
        const from = layout.sprites[reason];
        const to = layout.heart[heartSlot(reason, total)];

        return (
          <motion.div
            key={reason}
            className="absolute left-0 top-0"
            style={{ width: STAR_SIZE, height: STAR_SIZE, marginLeft: -STAR_SIZE / 2, marginTop: -STAR_SIZE / 2 }}
            initial={{ x: from.x, y: from.candyY, scale: 1 }}
            animate={{ x: to.x, y: to.y, scale: [1, 1.8, 1] }}
            transition={{ duration: 1.6, ease: [0.45, 0, 0.2, 1] }}
          >
            <svg viewBox="-15 -15 30 30" className="konpeito-star h-full w-full overflow-visible">
              <Konpeito color={konpeitoColors[reason % konpeitoColors.length]} r={10} />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
}
