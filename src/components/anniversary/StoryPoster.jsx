import siteData, { getImageUrl } from '../../config/data';
import { Cloud, Konpeito } from '../ghibli/GhibliScene';
import { konpeitoColors } from '../ghibli/utils';
import { heartOutline, smoothClosedPath, useViewport } from '../proposal/geometry';
import SeasonScene from './SeasonScene';

// Arte de story do Instagram (9:16). Feita para ser capturada em 540x960 com zoom 2x
// pelo `npm run story`. Topo e rodapé ficam livres para a interface do Instagram.

function Polaroid({ src, width, style, caption, tape }) {
  return (
    <figure
      className="absolute bg-white shadow-[0_14px_30px_rgba(60,30,40,0.35)]"
      style={{ width, padding: width * 0.05, paddingBottom: width * 0.17, ...style }}
    >
      {tape && (
        <span className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-3 bg-[#f7c6d4]/80 shadow-sm" />
      )}
      <img src={src} alt="" className="aspect-square w-full object-cover" />
      {caption && (
        <figcaption
          className="font-hand absolute inset-x-0 text-center leading-none text-[#7c3f3f]"
          style={{ bottom: width * 0.035, fontSize: width * 0.11 }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function DayStory({ story }) {
  const [main, left, right, small] = story.photos.map((path) => getImageUrl(path));

  return (
    <>
      <SeasonScene season="spring" hideClouds hideTree />
      <div className="absolute inset-0" style={{ filter: 'sepia(0.15) saturate(1.5) hue-rotate(-25deg)' }}>
        <div className="absolute -left-16 top-[1.5%]">
          <Cloud w={480} />
        </div>
        <div className="absolute -right-24 top-[27%]">
          <Cloud w={380} flip />
        </div>
      </div>
      <div className="absolute inset-0">
        <p className="font-storybook absolute inset-x-0 top-[11.5%] text-center text-[15px] font-semibold uppercase tracking-[0.38em] text-[#1f4a5a]">
          {story.eyebrow}
        </p>
        <h1 className="font-hand absolute inset-x-0 top-[13.5%] text-center text-[150px] leading-none text-[#7c3f3f] [text-shadow:0_3px_0_rgba(255,255,255,0.55)]">
          {story.title}
        </h1>
        <p className="font-storybook absolute inset-x-0 top-[28.5%] text-center text-[30px] italic text-[#7c3f3f]">
          {story.subtitle}
        </p>

        {left && <Polaroid src={left} width={175} style={{ left: '3%', top: '37%', rotate: '-10deg' }} />}
        {right && <Polaroid src={right} width={175} style={{ right: '3%', top: '39%', rotate: '9deg' }} />}
        {main && (
          <Polaroid src={main} width={250} caption="08.11 ♡" tape style={{ left: 'calc(50% - 125px)', top: '41%', rotate: '-3deg' }} />
        )}
        {small && <Polaroid src={small} width={130} style={{ right: '9%', top: '61%', rotate: '11deg' }} />}

        <p className="absolute left-1/2 top-[76.5%] -translate-x-1/2 whitespace-nowrap rounded-full bg-white/65 px-5 py-2 text-[11.5px] font-bold uppercase tracking-[0.2em] text-[#7c3f3f] shadow-sm backdrop-blur">
          {story.line}
        </p>
        <p className="font-hand absolute inset-x-0 top-[80.5%] text-center text-[36px] text-[#7c3f3f]">
          {story.footer} ♡
        </p>
      </div>
    </>
  );
}

function NightStory({ story, viewport }) {
  const photo = getImageUrl(story.nightPhoto);
  const size = viewport.w * 0.86;
  const top = viewport.h * 0.33;
  const points = heartOutline(22, viewport.w / 2, top, size);

  return (
    <>
      <SeasonScene season="night" />
      <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${viewport.w} ${viewport.h}`}>
        <defs>
          <filter id="story-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d={smoothClosedPath(points)} fill="none" stroke="rgba(255,240,205,0.7)" strokeWidth="1.6" filter="url(#story-glow)" />
        {points.map((point, i) =>
          i % 4 === 1 ? (
            <g key={i} transform={`translate(${point.x} ${point.y})`} filter="url(#story-glow)">
              <Konpeito color={konpeitoColors[i % konpeitoColors.length]} r={9} />
            </g>
          ) : (
            <circle key={i} cx={point.x} cy={point.y} r="2.6" fill="#fffbe8" filter="url(#story-glow)" />
          ),
        )}
      </svg>

      <div className="absolute inset-0">
        <h1 className="font-hand absolute inset-x-0 top-[12.5%] text-center text-[112px] leading-none text-[#fff4dc] drop-shadow-[0_0_26px_rgba(255,220,160,0.55)]">
          {story.nightTitle}
        </h1>
        <p className="font-storybook absolute inset-x-0 top-[26%] px-10 text-center text-[25px] italic leading-snug text-white/90">
          {story.nightSubtitle}
        </p>

        {photo && (
          <Polaroid src={photo} width={205} caption="1 ano ♡" style={{ left: 'calc(50% - 102px)', top: '43%', rotate: '-3deg' }} />
        )}

        <p className="font-storybook absolute inset-x-0 top-[77.5%] text-center text-[14px] font-semibold uppercase tracking-[0.38em] text-[#ffe9a8]">
          {story.eyebrow}
        </p>
        <p className="font-hand absolute inset-x-0 top-[80%] text-center text-[36px] text-[#fff4dc]">{story.footer} ♡</p>
      </div>
    </>
  );
}

export default function StoryPoster({ variant }) {
  const viewport = useViewport();
  const { story } = siteData.anniversary;

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#0b2240]">
      {variant === '2' ? <NightStory story={story} viewport={viewport} /> : <DayStory story={story} />}
    </main>
  );
}
