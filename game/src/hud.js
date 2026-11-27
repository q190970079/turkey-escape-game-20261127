// HUD and screens: the score, distance, lives and stage bar during
// a run, the title screen, and the caught / escaped end screens
// with a restart button. Buttons are hit-tested by main.js.
import { CONFIG } from './config.js';
import { stageFor } from './world.js';

export const BUTTONS = {
  start: { x: 490, y: 520, w: 300, h: 72 },
  restart: { x: 490, y: 540, w: 300, h: 72 },
};

function panel(ctx, x, y, w, h) {
  ctx.fillStyle = 'rgba(43, 26, 16, 0.82)';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 14);
  ctx.fill();
  ctx.strokeStyle = '#e8a34c';
  ctx.lineWidth = 3;
  ctx.stroke();
}

function bigButton(ctx, box, label, pulse) {
  const grow = pulse ? Math.sin(Date.now() / 280) * 3 : 0;
  ctx.fillStyle = '#c93a2e';
  ctx.beginPath();
  ctx.roundRect(box.x - grow, box.y - grow, box.w + grow * 2, box.h + grow * 2, 16);
  ctx.fill();
  ctx.strokeStyle = '#ffd23e';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 34px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, box.x + box.w / 2, box.y + box.h / 2 + 2);
  ctx.textBaseline = 'alphabetic';
}

export function drawHud(ctx, state) {
  const stage = stageFor(state.distance);
  // Top bar.
  ctx.fillStyle = 'rgba(43, 26, 16, 0.78)';
  ctx.fillRect(0, 0, CONFIG.width, 64);
  ctx.fillStyle = '#ffd23e';
  ctx.font = 'bold 26px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`SCORE  ${Math.floor(state.score)}`, 24, 42);
  ctx.fillStyle = '#fff';
  ctx.fillText(`DISTANCE  ${Math.floor(state.distance)} m / ${CONFIG.escapeDistance} m`, 300, 42);
  ctx.fillStyle = '#f7c873';
  ctx.fillText(stage.name, 700, 42);
  // Lives as hearts.
  for (let i = 0; i < CONFIG.startLives; i += 1) {
    const hx = 980 + i * 44;
    const hy = 34;
    ctx.fillStyle = i < state.lives ? '#e8352c' : 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.moveTo(hx, hy + 10);
    ctx.bezierCurveTo(hx - 16, hy - 6, hx - 8, hy - 18, hx, hy - 8);
    ctx.bezierCurveTo(hx + 8, hy - 18, hx + 16, hy - 6, hx, hy + 10);
    ctx.fill();
  }
  // Distance progress bar.
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(24, 70, 300, 10);
  ctx.fillStyle = '#4a7a2e';
  ctx.fillRect(24, 70, 300 * Math.min(1, state.distance / CONFIG.escapeDistance), 10);
  // Farmer warning.
  if (state.farmerGap < CONFIG.farmer.closeWarning && state.phase === 'play') {
    const flash = Math.sin(Date.now() / 130) > 0;
    ctx.font = 'bold 26px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(43, 26, 16, 0.8)';
    ctx.strokeText("HE'S RIGHT BEHIND YOU!", CONFIG.width / 2, 118);
    ctx.fillStyle = flash ? '#ff5a3c' : '#fff';
    ctx.fillText("HE'S RIGHT BEHIND YOU!", CONFIG.width / 2, 118);
  }
  if (state.muted) {
    ctx.fillStyle = '#fff';
    ctx.font = '16px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('MUTED (M)', CONFIG.width - 20, 100);
  }
  ctx.textAlign = 'left';
}

export function drawTitle(ctx, best) {
  panel(ctx, 190, 64, 900, 336);
  ctx.fillStyle = '#ffd23e';
  ctx.font = 'bold 64px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("TURKEY'S GREAT", 640, 158);
  ctx.fillText('ESCAPE', 640, 226);
  ctx.fillStyle = '#fff';
  ctx.font = '26px "Trebuchet MS", sans-serif';
  ctx.fillText('Thanksgiving dinner is coming. The farmer is coming faster.', 640, 282);
  ctx.fillText('Run the farmyard, the barn and the kitchen — and get out!', 640, 316);
  ctx.fillStyle = '#f7c873';
  ctx.font = '22px "Trebuchet MS", sans-serif';
  ctx.fillText('SPACE / ↑ jump (twice = double jump)    ↓ slide    SHIFT dash', 640, 356);
  ctx.fillText('Grab corn for points. Dodge fences, knives and the oven.', 640, 384);
  if (best > 0) {
    ctx.fillStyle = '#ffd23e';
    ctx.font = 'bold 22px "Trebuchet MS", sans-serif';
    ctx.fillText(`Best score so far: ${Math.floor(best)}`, 640, 470);
  }
  bigButton(ctx, BUTTONS.start, '▶  START', true);
  ctx.textAlign = 'left';
}

export function drawEnd(ctx, state) {
  const escaped = state.phase === 'escaped';
  ctx.fillStyle = escaped ? 'rgba(46, 93, 35, 0.35)' : 'rgba(90, 20, 10, 0.45)';
  ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);
  panel(ctx, 240, 120, 800, 400);
  ctx.textAlign = 'center';
  ctx.fillStyle = escaped ? '#a8e063' : '#ff8a70';
  ctx.font = 'bold 72px "Trebuchet MS", sans-serif';
  ctx.fillText(escaped ? 'ESCAPED!' : 'CAUGHT!', 640, 230);
  ctx.fillStyle = '#fff';
  ctx.font = '26px "Trebuchet MS", sans-serif';
  ctx.fillText(
    escaped
      ? 'You made it to the forest. Happy Thanksgiving, free bird!'
      : 'The farmer got you... Thanksgiving dinner awaits.',
    640, 292,
  );
  ctx.fillStyle = '#ffd23e';
  ctx.font = 'bold 30px "Trebuchet MS", sans-serif';
  ctx.fillText(`SCORE  ${Math.floor(state.score)}      DISTANCE  ${Math.floor(state.distance)} m`, 640, 352);
  ctx.fillStyle = '#f7c873';
  ctx.font = '22px "Trebuchet MS", sans-serif';
  ctx.fillText(`Corn collected: ${state.corn}      Best: ${Math.floor(state.best)}`, 640, 392);
  ctx.fillText(escaped ? 'You outran the whole farm!' : 'Tip: dash (SHIFT) when the farmer gets close.', 640, 428);
  bigButton(ctx, BUTTONS.restart, '↻  RUN AGAIN', true);
  ctx.textAlign = 'left';
}

export function hitButton(box, x, y) {
  return x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h;
}
