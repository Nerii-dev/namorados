// Gera as artes do story do Instagram de 1 ano (1080x1920) a partir de /1ano/?story=1 e ?story=2.
// Uso: npm run story  →  gera os arquivos na pasta instagram/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { createServer } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.join(root, 'instagram');
const PORT = 5198;

const variants = [
  { query: '1', file: 'story-1ano-dia.png' },
  { query: '2', file: 'story-1ano-noite.png' },
];

const server = await createServer({ root, logLevel: 'error', server: { port: PORT, strictPort: true } });
await server.listen();
const browser = await chromium.launch({ channel: 'msedge' });

try {
  fs.mkdirSync(outDir, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
  // Os botões do player não fazem parte da arte.
  await page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      const style = document.createElement('style');
      style.textContent = 'div.fixed.z-50 { display: none !important; }';
      document.head.append(style);
    });
  });

  for (const variant of variants) {
    await page.goto(`http://localhost:${PORT}/1ano/?story=${variant.query}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => Promise.all([...document.images].map((img) => img.decode().catch(() => {}))));
    await page.waitForTimeout(2500);
    const file = path.join(outDir, variant.file);
    await page.screenshot({ path: file });
    console.log(`  ${file}`);
  }
} finally {
  await browser.close();
  await server.close();
}
