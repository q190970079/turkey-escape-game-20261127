// The road ahead: a seeded stream of obstacles, corn and stage
// scenery from the farmyard, through the barn, into the kitchen.
// Everything is placed by distance in metres, so the same seed
// always builds the same escape route.
import { makeRng, pick, range } from './random.js';
import { CONFIG } from './config.js';

const FARM_OBSTACLES = ['fence', 'hay', 'puddle'];
const BARN_OBSTACLES = ['crate', 'knifeDrop', 'hay'];
const KITCHEN_OBSTACLES = ['oven', 'knifeDrop', 'pot', 'rollingPin'];

export function stageFor(distance) {
  for (const stage of CONFIG.stageBounds) {
    if (distance < stage.until) return stage;
  }
  return CONFIG.stageBounds[CONFIG.stageBounds.length - 1];
}

export function stageIndexFor(distance) {
  for (let i = 0; i < CONFIG.stageBounds.length; i += 1) {
    if (distance < CONFIG.stageBounds[i].until) return i;
  }
  return CONFIG.stageBounds.length - 1;
}

export function createWorld(seed) {
  const rng = makeRng(seed);
  const obstacles = [];
  const corns = [];
  let cursor = 14;
  let lastKind = '';

  while (cursor < CONFIG.escapeDistance + 40) {
    const stage = stageIndexFor(cursor);
    const table = stage === 0 ? FARM_OBSTACLES : stage === 1 ? BARN_OBSTACLES : KITCHEN_OBSTACLES;
    let kind = pick(rng, table);
    if (kind === lastKind && rng() < 0.6) kind = pick(rng, table);
    lastKind = kind;
    const gap = range(rng, 9, 15) - stage * 1.2;
    obstacles.push({ at: cursor, kind, hit: false, passed: false, seed: rng() });
    // A trail of corn after most obstacles, rewarding a clean dodge.
    if (rng() < 0.8) {
      const n = 3 + Math.floor(rng() * 3);
      for (let i = 0; i < n; i += 1) {
        corns.push({
          at: cursor + 2.5 + i * 1.6,
          y: pick(rng, [0, 0, 1]),
          golden: rng() < 0.08,
          taken: false,
        });
      }
    }
    cursor += Math.max(7, gap);
  }

  return {
    obstacles,
    corns,
    // Scenery anchors, placed once per stage for the parallax painter.
    scenery: [
      { at: 8, kind: 'farmhouse' }, { at: 60, kind: 'tree' }, { at: 120, kind: 'pumpkin' },
      { at: 180, kind: 'tree' }, { at: 240, kind: 'fenceRow' },
      { at: 320, kind: 'barnDoor' }, { at: 380, kind: 'hayStack' }, { at: 450, kind: 'lantern' },
      { at: 520, kind: 'crateStack' }, { at: 580, kind: 'barnDoor' },
      { at: 630, kind: 'table' }, { at: 700, kind: 'ovenBig' }, { at: 770, kind: 'table' },
      { at: 840, kind: 'window' }, { at: 890, kind: 'forestGate' },
    ],
  };
}

// Metres to screen x: the turkey holds a fixed screen spot and the
// world scrolls past it.
export function worldToScreen(distance, at, turkeyX) {
  const pxPerMetre = 46;
  return turkeyX + (at - distance) * pxPerMetre;
}
