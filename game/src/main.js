// Turkey's Great Escape: game loop, states, scoring and collisions.
// Title -> play -> caught / escaped, with restart. The turkey runs
// on its own; the player jumps, slides and dashes through three
// stages: farmyard, barn, kitchen. The farmer closes in on every
// stumble and falls back on corn and dashes.
import { CONFIG } from './config.js';
import { createWorld, stageFor, worldToScreen } from './world.js';
import { createTurkey, updateTurkey, turkeyJump, turkeySlide, turkeyDash, drawTurkey, turkeyGroundY } from './turkey.js';
import { createFarmer, updateFarmer, farmerScreenX, drawFarmer } from './farmer.js';
import { drawHazard, hazardBox, hazardHits, drawCorn } from './hazards.js';
import { drawBackground, drawScenery } from './render.js';
import { drawHud, drawTitle, drawEnd, hitButton, BUTTONS } from './hud.js';
import { createInput } from './input.js';
import { createAudio } from './audio.js';
import { parseShot, shotState } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const audio = createAudio();

function freshState(seed) {
  return {
    phase: 'title',
    seed,
    world: createWorld(seed),
    turkey: createTurkey(),
    farmer: createFarmer(),
    distance: 0,
    score: 0,
    lives: CONFIG.startLives,
    corn: 0,
    best: 0,
    time: 0,
    speed: CONFIG.baseSpeed,
    invulnerable: 0,
    muted: false,
    farmerGap: 200,
    caughtFlash: 0,
  };
}

let state = freshState(7);
let shot = parseShot();
if (shot) {
  const posed = shotState(shot.shot, shot.seed, freshState);
  if (posed) state = posed;
}

function startRun() {
  const best = state.best;
  state = freshState(Math.floor(Math.random() * 100000) + 1);
  state.best = best;
  state.phase = 'play';
  audio.unlock();
  audio.gobble();
}

function endRun(escaped) {
  state.phase = escaped ? 'escaped' : 'caught';
  state.best = Math.max(state.best, state.score);
  if (escaped) audio.escaped();
  else audio.caught();
}

function stumble() {
  if (state.invulnerable > 0) return;
  state.lives -= 1;
  state.invulnerable = 1.5;
  state.turkey.stumble = 0.5;
  state.farmer.gap = Math.max(CONFIG.farmer.catchGap, state.farmer.gap - CONFIG.farmer.stumbleClose);
  state.farmer.grabbing = 0.6;
  state.farmer.shout = 1.4;
  audio.stumble();
  audio.alarm();
  if (state.lives <= 0) endRun(false);
}

function update(dt) {
  state.time += dt;
  if (state.phase !== 'play') return;

  if (state.invulnerable > 0) state.invulnerable -= dt;

  // Speed grows with distance, and each stage runs a little faster.
  const stageBoost = (state.distance / CONFIG.escapeDistance) * 180;
  state.speed = Math.min(CONFIG.maxSpeed, CONFIG.baseSpeed + stageBoost);
  let speed = state.speed;
  if (state.turkey.dashing > 0) speed = CONFIG.dashSpeed;
  if (state.turkey.sliding > 0) speed *= 0.92;

  const prevDistance = state.distance;
  state.distance += (speed * dt) / 46;
  state.score += dt * 6;

  updateTurkey(state.turkey, dt, speed);
  updateFarmer(state.farmer, dt, speed, state.turkey.dashing > 0);
  state.farmerGap = state.farmer.gap;

  // The farmer catches the turkey when the gap closes completely.
  if (state.farmer.gap <= CONFIG.farmer.catchGap + 1) {
    state.lives = 0;
    endRun(false);
    return;
  }

  // Puddles slow the turkey while it wades through them.
  for (const ob of state.world.obstacles) {
    if (ob.kind !== 'puddle') continue;
    const x = worldToScreen(state.distance, ob.at, state.turkey.x);
    if (Math.abs(x - state.turkey.x) < 50 && state.turkey.y >= turkeyGroundY(state.turkey)) {
      state.distance = prevDistance + (speed * dt) / 46 * 0.45;
    }
  }

  // Obstacles: pass them for a point, hit them for a life.
  for (const ob of state.world.obstacles) {
    const x = worldToScreen(state.distance, ob.at, state.turkey.x);
    if (x < -160 || x > CONFIG.width + 200) continue;
    const box = hazardBox(ob.kind, x, state.time, ob.seed);
    if (!ob.passed && x < state.turkey.x - 40) {
      ob.passed = true;
      if (!ob.hit) state.score += 5;
    }
    if (!ob.hit && hazardHits(ob.kind, box, state.turkey)) {
      ob.hit = true;
      if (ob.kind === 'knifeDrop') {
        // A falling knife is a hard hit: two lives of scare, one lost.
        stumble();
      } else {
        stumble();
      }
    }
  }

  // Corn: collect by running through it, low corn by sliding.
  for (const c of state.world.corns) {
    if (c.taken) continue;
    const x = worldToScreen(state.distance, c.at, state.turkey.x);
    if (x < -40 || x > CONFIG.width + 40) continue;
    const cy = c.y === 0 ? CONFIG.groundY - 110 : CONFIG.groundY - 40;
    const dx = x - state.turkey.x;
    const dy = cy - (state.turkey.y + 30);
    if (Math.abs(dx) < 46 && Math.abs(dy) < 52) {
      c.taken = true;
      state.corn += 1;
      state.score += c.golden ? CONFIG.goldenCornScore : CONFIG.cornScore;
      state.farmer.gap = Math.min(CONFIG.farmer.farGap, state.farmer.gap + CONFIG.farmer.cornPush);
      if (c.golden) audio.golden();
      else audio.corn();
    }
  }

  // Reaching the forest gate ends the run in freedom.
  if (state.distance >= CONFIG.escapeDistance) {
    state.distance = CONFIG.escapeDistance;
    endRun(true);
  }
}

function render() {
  const t = state;
  drawBackground(ctx, t.distance, t.time);
  drawScenery(ctx, t.world.scenery, t.distance, t.turkey.x);

  // Corn and obstacles in world order.
  for (const c of t.world.corns) {
    if (c.taken) continue;
    const x = worldToScreen(t.distance, c.at, t.turkey.x);
    if (x < -40 || x > CONFIG.width + 40) continue;
    const cy = c.y === 0 ? CONFIG.groundY - 110 : CONFIG.groundY - 40;
    drawCorn(ctx, x, cy, c.golden, t.time);
  }
  for (const ob of t.world.obstacles) {
    const x = worldToScreen(t.distance, ob.at, t.turkey.x);
    if (x < -180 || x > CONFIG.width + 220) continue;
    drawHazard(ctx, ob.kind, x, t.time, ob.seed);
  }

  // Farmer first (behind), turkey in front.
  drawFarmer(ctx, t.farmer, farmerScreenX(t.farmer, t.turkey.x), t.time);
  if (!(t.invulnerable > 0 && Math.floor(t.time * 12) % 2 === 0)) {
    drawTurkey(ctx, t.turkey, t.time);
  }

  // Stage label on the ground at each stage change.
  const stage = stageFor(t.distance);
  ctx.fillStyle = 'rgba(43, 26, 16, 0.6)';
  ctx.font = 'bold 18px "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`— ${stage.name} —`, CONFIG.width / 2, CONFIG.groundY + 34);

  if (t.phase === 'play' || t.phase === 'caught' || t.phase === 'escaped') {
    drawHud(ctx, { ...t, farmerGap: t.farmer.gap, phase: t.phase });
  }
  if (t.phase === 'title') drawTitle(ctx, t.best);
  if (t.phase === 'caught' || t.phase === 'escaped') drawEnd(ctx, t);
}

function onAction(action, x, y) {
  if (action === 'mute') {
    state.muted = audio.toggleMute();
    return;
  }
  if (action === 'clickAt') {
    audio.unlock();
    if (state.phase === 'title' && hitButton(BUTTONS.start, x, y)) {
      startRun();
      return;
    }
    if ((state.phase === 'caught' || state.phase === 'escaped') && hitButton(BUTTONS.restart, x, y)) {
      startRun();
      return;
    }
    if (state.phase === 'play') {
      turkeyJump(state.turkey, audio);
    }
    return;
  }
  if (action === 'start' || action === 'restart') {
    if (state.phase === 'title' || state.phase === 'caught' || state.phase === 'escaped') {
      startRun();
    }
    return;
  }
  if (state.phase !== 'play') return;
  if (action === 'jump') turkeyJump(state.turkey, audio);
  if (action === 'slide') turkeySlide(state.turkey);
  if (action === 'dash') {
    if (turkeyDash(state.turkey, audio)) {
      state.farmer.gap = Math.min(CONFIG.farmer.farGap, state.farmer.gap + CONFIG.farmer.dashPush);
    }
  }
}

createInput(canvas, onAction);

// Read-only handle for play-testing: the current phase, distance,
// score and lives, so an automated check can tell a real run
// advanced without reaching into the loop.
window.__turkeyGame = {
  get phase() { return state.phase; },
  get distance() { return state.distance; },
  get score() { return state.score; },
  get lives() { return state.lives; },
  get farmerGap() { return state.farmer.gap; },
  get nextObstacle() {
    const next = state.world.obstacles.find((o) => !o.passed && o.at > state.distance);
    return next ? { kind: next.kind, ahead: next.at - state.distance } : null;
  },
};

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (!shot) update(dt);
  else state.time += dt;
  render();
  requestAnimationFrame(frame);
}

// In shot mode, render one posed frame at once so a screenshot
// catches the scene even before the first animation tick.
if (shot) {
  state.time = 1.6;
  render();
}
requestAnimationFrame(frame);
