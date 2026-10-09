import { useSyncExternalStore } from 'react';

const subscribe = (callback) => {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
};

const getSnapshot = () => `${window.innerWidth}x${window.innerHeight}`;

export function useViewport() {
  const [w, h] = useSyncExternalStore(subscribe, getSnapshot).split('x').map(Number);
  return { w, h };
}

export const HEART_POINTS = 14;

// Os pontos 0, 1 e 13 ficam todos no vinco do topo do coração, então os konpeito
// se espalham só pelos pontos 2 a 12 (para 5 motivos: 3, 5, 7, 9 e 11).
const SLOT_FIRST = 2;
const SLOT_COUNT = HEART_POINTS - 3;
export const heartSlot = (i, total) =>
  SLOT_FIRST + Math.min(SLOT_COUNT - 1, Math.max(0, Math.round(((i + 0.5) * SLOT_COUNT) / total - 0.5)));

// Curva clássica do coração: x = 16 sen³t, y = 13 cos t − 5 cos 2t − 2 cos 3t − cos 4t.
// Em y ela vai de −11,1 (topo dos lóbulos) até 17 (ponta), e em x de −16 a 16.
const heartPoint = (t) => ({
  x: 16 * Math.sin(t) ** 3,
  y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
});

// Pontos de um coração com largura `size`, centrado em cx e começando em top (altura = 0,88 × size).
export function heartPoints(cx, top, size) {
  const scale = size / 32;
  return Array.from({ length: HEART_POINTS }, (_, i) => {
    const p = heartPoint((i / HEART_POINTS) * Math.PI * 2);
    return { x: cx + p.x * scale, y: top + (p.y + 11.12) * scale };
  });
}

export function getLayout(w, h, spriteCount) {
  const size = Math.min(w * 0.72, h * 0.4);
  const top = h * 0.07;
  const scale = size / 32;
  const heart = heartPoints(w / 2, top, size);

  const spriteSize = w < 480 ? 54 : 64;
  const spriteHeight = spriteSize * 1.25;
  const spriteBase = h * 0.84;
  const sprites = Array.from({ length: spriteCount }, (_, i) => {
    const x = w * (0.14 + (i * 0.72) / Math.max(spriteCount - 1, 1));
    const topY = spriteBase - spriteHeight;
    // O konpeito fica ~10% abaixo do topo do desenho da fuligem.
    return { x, top: topY, candyY: topY + spriteHeight * 0.1 };
  });

  return {
    viewport: { w, h },
    heart,
    sprites,
    spriteSize,
    textTop: top + 28.1 * scale + 28,
    textBottom: spriteBase - spriteHeight - 16,
  };
}

// Caminho suave (Catmull-Rom → Bézier) fechado passando por todos os pontos.
export function smoothClosedPath(points) {
  const n = points.length;
  const at = (i) => points[(i + n) % n];
  let d = `M ${at(0).x.toFixed(1)} ${at(0).y.toFixed(1)}`;

  for (let i = 0; i < n; i += 1) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)} ${c2.x.toFixed(1)} ${c2.y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  return `${d} Z`;
}
