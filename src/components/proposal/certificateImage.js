import { konpeitoColors } from '../ghibli/utils';
import { heartPoints, heartSlot, smoothClosedPath } from './geometry';

// Desenha o certificado assinado numa imagem 1080x1350 (formato de post do Instagram).
const WIDTH = 1080;
const HEIGHT = 1350;

const SERIF = '"Cormorant Garamond", Georgia, serif';
const HAND = '"Caveat", "Segoe Script", cursive';

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let cursor = y;

  words.forEach((word) => {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cursor);
      line = word;
      cursor += lineHeight;
    } else {
      line = test;
    }
  });

  if (line) ctx.fillText(line, x, cursor);
  return cursor + lineHeight;
}

function drawHeart(ctx, cx, cy, size, color) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(size / 32, size / 32);
  ctx.beginPath();
  ctx.moveTo(0, 10);
  ctx.bezierCurveTo(-18, -2, -14, -18, 0, -9);
  ctx.bezierCurveTo(14, -18, 18, -2, 0, 10);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawSeal(ctx, cx, cy, r) {
  const wax = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.1, cx, cy, r);
  wax.addColorStop(0, '#de5a55');
  wax.addColorStop(1, '#962a2a');
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = wax;
  ctx.shadowColor = 'rgba(90, 20, 20, 0.4)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 6;
  ctx.fill();
  ctx.shadowColor = 'transparent';

  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.78, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 220, 210, 0.35)';
  ctx.lineWidth = 2;
  ctx.stroke();

  drawHeart(ctx, cx, cy + 4, r * 1.1, '#ffd9d4');
}

function drawKonpeito(ctx, cx, cy, r, color) {
  ctx.beginPath();
  for (let i = 0; i < 16; i += 1) {
    const angle = (i / 16) * Math.PI * 2;
    const radius = i % 2 === 0 ? r : r * 0.72;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.shadowBlur = 0;
}

// A mesma constelação de coração do céu do pedido, com os konpeito que ela coletou.
function drawConstellation(ctx, top, bottom, starCount) {
  const size = Math.min(260, (bottom - top) / 0.88);
  if (size < 90) return;

  const points = heartPoints(WIDTH / 2, top + (bottom - top - size * 0.88) / 2, size);
  const slots = new Map(
    Array.from({ length: starCount }, (_, i) => [heartSlot(i, starCount), konpeitoColors[i % konpeitoColors.length]]),
  );

  ctx.strokeStyle = 'rgba(185, 139, 94, 0.55)';
  ctx.lineWidth = 2;
  ctx.setLineDash([2, 7]);
  ctx.lineCap = 'round';
  ctx.stroke(new Path2D(smoothClosedPath(points)));
  ctx.setLineDash([]);

  points.forEach((point, i) => {
    if (slots.has(i)) {
      drawKonpeito(ctx, point.x, point.y, 14, slots.get(i));
    } else {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#c9a46e';
      ctx.fill();
    }
  });
}

const setSpacing = (ctx, value) => {
  if ('letterSpacing' in ctx) ctx.letterSpacing = value;
};

export async function renderCertificate({
  title,
  body,
  promise,
  dateText,
  nameOne,
  nameTwo,
  signatureOne,
  signatureCanvas,
  starCount = 5,
}) {
  await Promise.all([
    document.fonts.load(`600 50px ${SERIF}`),
    document.fonts.load(`italic 500 36px ${SERIF}`),
    document.fonts.load(`70px ${HAND}`),
  ]).catch(() => {});

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#fbf3e2';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  [
    [120, 140, 520],
    [960, 1220, 560],
  ].forEach(([x, y, r]) => {
    const stain = ctx.createRadialGradient(x, y, 0, x, y, r);
    stain.addColorStop(0, 'rgba(214, 183, 140, 0.28)');
    stain.addColorStop(1, 'rgba(214, 183, 140, 0)');
    ctx.fillStyle = stain;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  });

  ctx.strokeStyle = '#b98b5e';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, WIDTH - 80, HEIGHT - 80);
  ctx.lineWidth = 1.5;
  ctx.strokeRect(58, 58, WIDTH - 116, HEIGHT - 116);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = '#7c3f3f';
  ctx.font = `600 50px ${SERIF}`;
  setSpacing(ctx, '6px');
  let y = wrapText(ctx, title.toUpperCase(), WIDTH / 2, 190, 700, 64);
  setSpacing(ctx, '0px');

  drawHeart(ctx, WIDTH / 2, y + 4, 34, '#e0657a');
  y += 90;

  ctx.fillStyle = '#3f342f';
  ctx.font = `italic 500 38px ${SERIF}`;
  y = wrapText(ctx, body, WIDTH / 2, y, 860, 54);
  y += 24;
  ctx.font = `italic 500 34px ${SERIF}`;
  y = wrapText(ctx, promise, WIDTH / 2, y, 860, 50);
  y += 30;

  ctx.fillStyle = '#59867c';
  ctx.font = `48px ${HAND}`;
  ctx.fillText(dateText, WIDTH / 2, y);

  const lineY = 1150;
  drawConstellation(ctx, y + 50, lineY - 120, starCount);
  const left = 290;
  const right = 790;

  ctx.fillStyle = '#3a2f6b';
  ctx.font = `74px ${HAND}`;
  ctx.fillText(signatureOne, left, lineY - 22);

  if (signatureCanvas) {
    const box = { w: 360, h: 150 };
    const ratio = Math.min(box.w / signatureCanvas.width, box.h / signatureCanvas.height);
    const sw = signatureCanvas.width * ratio;
    const sh = signatureCanvas.height * ratio;
    ctx.drawImage(signatureCanvas, right - sw / 2, lineY - sh + 10, sw, sh);
  }

  ctx.strokeStyle = '#8a6a4e';
  ctx.lineWidth = 1.5;
  [left, right].forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(x - 170, lineY);
    ctx.lineTo(x + 170, lineY);
    ctx.stroke();
  });

  ctx.fillStyle = '#8a6a4e';
  ctx.font = `600 24px ${SERIF}`;
  setSpacing(ctx, '5px');
  ctx.fillText(nameOne.toUpperCase(), left, lineY + 42);
  ctx.fillText(nameTwo.toUpperCase(), right, lineY + 42);
  setSpacing(ctx, '0px');

  drawSeal(ctx, WIDTH / 2, lineY + 20, 58);

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}
