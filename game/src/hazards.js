// Hazards: fences and hay to jump, puddles to slow through, crates
// to jump or slide past, falling carving knives, the oven's flame
// jets, pots and rolling pins in the kitchen. Each kind draws itself
// and answers one question: does it touch the turkey now?
import { CONFIG } from './config.js';

export const HAZARD_SIZE = {
  fence: { w: 26, h: 64 },
  hay: { w: 64, h: 52 },
  puddle: { w: 90, h: 14 },
  crate: { w: 58, h: 58 },
  knifeDrop: { w: 30, h: 90 },
  oven: { w: 96, h: 110 },
  pot: { w: 62, h: 44 },
  rollingPin: { w: 84, h: 26 },
};

export function hazardBox(kind, x, time, seed) {
  const size = HAZARD_SIZE[kind];
  if (kind === 'knifeDrop') {
    // The knife hangs, warns with a shadow, then drops.
    const cycle = (time * 0.9 + seed * 3) % 2.4;
    const falling = cycle > 1.0;
    const drop = falling ? Math.min(1, (cycle - 1.0) * 3) : 0;
    const top = CONFIG.groundY - 260 + drop * 190;
    return { x: x - 15, y: top, w: 30, h: 90, falling };
  }
  if (kind === 'oven') {
    return { x: x - 48, y: CONFIG.groundY - 110, w: 96, h: 110, flame: ovenFlameOn(time, seed) };
  }
  if (kind === 'rollingPin') {
    const roll = Math.sin(time * 3 + seed * 6) * 10;
    return { x: x - 42, y: CONFIG.groundY - 26 + roll * 0.3, w: 84, h: 26 };
  }
  return { x: x - size.w / 2, y: CONFIG.groundY - size.h, w: size.w, h: size.h };
}

export function ovenFlameOn(time, seed) {
  return ((time * 0.8 + seed * 5) % 2.2) < 1.1;
}

export function hazardHits(kind, box, t) {
  if (kind === 'puddle') return false; // slows, never hurts
  if (kind === 'oven' && !box.flame) return false;
  const tx = t.x - 26;
  const ty = t.y - 10;
  const tw = 56;
  const th = t.h + 6;
  const overlapX = tx < box.x + box.w && tx + tw > box.x;
  const overlapY = ty < box.y + box.h && ty + th > box.y;
  return overlapX && overlapY;
}

export function drawHazard(ctx, kind, x, time, seed) {
  const box = hazardBox(kind, x, time, seed);
  ctx.save();
  if (kind === 'fence') {
    ctx.fillStyle = '#8a5a2a';
    ctx.fillRect(box.x, box.y, 8, 64);
    ctx.fillRect(box.x + 18, box.y, 8, 64);
    ctx.fillRect(box.x - 8, box.y + 12, 42, 8);
    ctx.fillRect(box.x - 8, box.y + 34, 42, 8);
  } else if (kind === 'hay') {
    ctx.fillStyle = '#d9a83c';
    ctx.beginPath();
    ctx.ellipse(x, CONFIG.groundY - 26, 34, 26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#a87c1e';
    ctx.lineWidth = 2;
    for (let i = -2; i <= 2; i += 1) {
      ctx.beginPath();
      ctx.moveTo(x - 24, CONFIG.groundY - 26 + i * 9);
      ctx.quadraticCurveTo(x, CONFIG.groundY - 34 + i * 9, x + 24, CONFIG.groundY - 26 + i * 9);
      ctx.stroke();
    }
  } else if (kind === 'puddle') {
    ctx.fillStyle = 'rgba(90, 120, 160, 0.75)';
    ctx.beginPath();
    ctx.ellipse(x, CONFIG.groundY - 4, 46, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.ellipse(x - 14, CONFIG.groundY - 6, 14, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === 'crate') {
    ctx.fillStyle = '#a8642f';
    ctx.fillRect(box.x, box.y, 58, 58);
    ctx.strokeStyle = '#7d4a22';
    ctx.lineWidth = 3;
    ctx.strokeRect(box.x + 2, box.y + 2, 54, 54);
    ctx.beginPath();
    ctx.moveTo(box.x, box.y);
    ctx.lineTo(box.x + 58, box.y + 58);
    ctx.moveTo(box.x + 58, box.y);
    ctx.lineTo(box.x, box.y + 58);
    ctx.stroke();
  } else if (kind === 'knifeDrop') {
    // Warning shadow on the ground while it hangs.
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(x, CONFIG.groundY - 4, 20, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#c8ccd4';
    ctx.beginPath();
    ctx.moveTo(x - 6, box.y);
    ctx.lineTo(x + 6, box.y);
    ctx.lineTo(x + 4, box.y + 62);
    ctx.lineTo(x, box.y + 88);
    ctx.lineTo(x - 4, box.y + 62);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#5d3413';
    ctx.fillRect(x - 7, box.y - 16, 14, 18);
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(x - 4, box.y + 8);
    ctx.lineTo(x + 2, box.y + 40);
    ctx.lineTo(x - 1, box.y + 8);
    ctx.closePath();
    ctx.fill();
  } else if (kind === 'oven') {
    ctx.fillStyle = '#4a4a52';
    ctx.fillRect(box.x, box.y, 96, 110);
    ctx.fillStyle = '#2e2e36';
    ctx.fillRect(box.x + 8, box.y + 18, 80, 62);
    ctx.fillStyle = '#e8a020';
    ctx.fillRect(box.x + 8, box.y + 86, 80, 6);
    // Window glow when the flame jet is on.
    if (box.flame) {
      ctx.fillStyle = '#ff7b24';
      ctx.fillRect(box.x + 14, box.y + 24, 68, 50);
      ctx.fillStyle = '#ffd23e';
      ctx.beginPath();
      ctx.moveTo(x - 30, box.y + 74);
      ctx.quadraticCurveTo(x - 18, box.y + 20, x, box.y + 74);
      ctx.quadraticCurveTo(x + 18, box.y + 20, x + 30, box.y + 74);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ff5a1e';
      ctx.font = 'bold 13px "Trebuchet MS", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('HOT!', x, box.y - 10);
    } else {
      ctx.fillStyle = '#7a8899';
      ctx.fillRect(box.x + 14, box.y + 24, 68, 50);
    }
  } else if (kind === 'pot') {
    ctx.fillStyle = '#3a3a44';
    ctx.beginPath();
    ctx.ellipse(x, CONFIG.groundY - 22, 32, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#565664';
    ctx.fillRect(x - 32, CONFIG.groundY - 40, 64, 10);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.ellipse(x - 10, CONFIG.groundY - 34, 12, 4, -0.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === 'rollingPin') {
    ctx.fillStyle = '#c9a06a';
    ctx.fillRect(box.x, box.y, 84, 22);
    ctx.fillStyle = '#8a5a2a';
    ctx.fillRect(box.x - 8, box.y + 6, 10, 10);
    ctx.fillRect(box.x + 82, box.y + 6, 10, 10);
  }
  ctx.restore();
}

export function drawCorn(ctx, x, y, golden, time) {
  const bob = Math.sin(time * 4 + x * 0.05) * 3;
  ctx.save();
  ctx.translate(x, y + bob);
  ctx.rotate(Math.sin(time * 2 + x) * 0.2);
  ctx.fillStyle = golden ? '#ffd23e' : '#f7c948';
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = golden ? '#e8a020' : '#d9a83c';
  for (let r = -1; r <= 1; r += 1) {
    for (let c = -1; c <= 1; c += 1) {
      ctx.beginPath();
      ctx.arc(c * 5, r * 7, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.fillStyle = '#4a7a2e';
  ctx.beginPath();
  ctx.ellipse(0, -16, 8, 5, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
