// Grava a abertura do site em vídeo vertical (1080x1920) para Reels/Stories.
// Uso: npm run video  →  gera os arquivos na pasta video/
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ffmpegPath from 'ffmpeg-static';
import { chromium } from 'playwright-core';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'video');
const framesDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gica-frames-'));
const musicFile = path.join(root, 'src/assets/audio/nossa-musica.mp3');

const VIEWPORT = { width: 540, height: 960 };
const SCALE = 2;
const FPS = 30;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const smoothScroll = (page, selector, duration) =>
  page.evaluate(
    ({ selector, duration }) =>
      new Promise((resolve) => {
        const el = selector ? document.querySelector(selector) : document.scrollingElement;
        const start = el.scrollTop;
        const distance = el.scrollHeight - el.clientHeight - start;
        const t0 = performance.now();
        const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

        const step = (now) => {
          const t = Math.min((now - t0) / duration, 1);
          el.scrollTop = start + distance * ease(t);
          if (t < 1) requestAnimationFrame(step);
          else resolve();
        };

        requestAnimationFrame(step);
      }),
    { selector, duration },
  );

async function record() {
  const server = await createServer({
    root,
    logLevel: 'error',
    server: { port: 5199, strictPort: true },
  });
  await server.listen();

  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: VIEWPORT, deviceScaleFactor: SCALE });
  const timestamps = [];

  try {
    await page.goto('http://localhost:5199/');
    await page.addStyleTag({
      content:
        'div.fixed.z-50, button[aria-label^="Reler"] { display: none !important; }' +
        ' html, * { scroll-behavior: auto !important; }',
    });
    await page.evaluate(() => document.fonts.ready);

    const cdp = await page.context().newCDPSession(page);
    cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
      timestamps.push(metadata.timestamp);
      const name = `f${String(timestamps.length).padStart(5, '0')}.jpg`;
      fs.writeFileSync(path.join(framesDir, name), Buffer.from(data, 'base64'));
      cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
    });
    await cdp.send('Page.startScreencast', {
      format: 'jpeg',
      quality: 92,
      maxWidth: VIEWPORT.width * SCALE,
      maxHeight: VIEWPORT.height * SCALE,
    });

    console.log('Cena inicial...');
    await sleep(5500);
    await page.getByRole('button', { name: /Abrir sua carta/ }).click();
    await sleep(2500);

    console.log('Abrindo o envelope...');
    await page.getByRole('button', { name: 'Abrir o envelope' }).click();

    console.log('Escrevendo a carta (isso leva um tempinho)...');
    const enterButton = page.getByRole('button', { name: /Entrar no nosso cantinho/ });
    await enterButton.waitFor({ timeout: 180000 });
    await sleep(800);
    await smoothScroll(page, '.overflow-y-auto', 2500);
    await sleep(4500);

    console.log('Entrando no site...');
    await enterButton.click();
    await sleep(2500);
    await smoothScroll(page, null, 28000);
    await sleep(2000);

    await cdp.send('Page.stopScreencast');
  } finally {
    await browser.close();
    await server.close();
  }

  return timestamps;
}

function encode(timestamps) {
  const frames = fs.readdirSync(framesDir).filter((f) => f.endsWith('.jpg')).sort();
  const lines = ['ffconcat version 1.0'];

  frames.forEach((file, i) => {
    const next = timestamps[i + 1] ?? timestamps[i] + 0.5;
    lines.push(`file '${file}'`, `duration ${(next - timestamps[i]).toFixed(4)}`);
  });
  lines.push(`file '${frames.at(-1)}'`);

  const listFile = path.join(framesDir, 'frames.txt');
  fs.writeFileSync(listFile, lines.join('\n'));

  const duration = timestamps.at(-1) - timestamps[0] + 0.5;
  const video = [
    '-f', 'concat', '-safe', '0', '-i', listFile,
  ];
  const videoCodec = [
    '-vf', `fps=${FPS},scale=1080:1920:flags=lanczos,format=yuv420p`,
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18',
    '-movflags', '+faststart',
  ];

  fs.mkdirSync(outDir, { recursive: true });

  const silent = path.join(outDir, 'aniversario-gica-sem-musica.mp4');
  execFileSync(ffmpegPath, ['-y', ...video, ...videoCodec, '-an', silent], { stdio: 'inherit' });

  const withMusic = path.join(outDir, 'aniversario-gica.mp4');
  execFileSync(
    ffmpegPath,
    [
      '-y', ...video, '-i', musicFile,
      ...videoCodec,
      '-af', `afade=t=in:d=1.5,afade=t=out:st=${(duration - 4).toFixed(2)}:d=4`,
      '-c:a', 'aac', '-b:a', '192k', '-shortest',
      withMusic,
    ],
    { stdio: 'inherit' },
  );

  console.log(`\nPronto! (${duration.toFixed(0)}s)\n  ${withMusic}\n  ${silent}`);
}

const timestamps = await record();
console.log(`${timestamps.length} quadros capturados. Gerando o vídeo...`);
encode(timestamps);
fs.rmSync(framesDir, { recursive: true, force: true });
