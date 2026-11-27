// Deterministic screenshot states: ?shot=start|play|kitchen|end
// (with &seed=N) poses the game with its own render code, so a
// screenshot is a real render of the game, never a mock-up.
// The game reads these only when the query is present; normal play
// never touches them.
export function parseShot() {
  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (!shot) return null;
  return { shot, seed: Number(params.get('seed') || 1) };
}

// Build the exact game state a named shot shows. Returns the state
// object main.js renders, with phase and numbers already set.
export function shotState(shot, seed, fresh) {
  if (shot === 'start') {
    const s = fresh(seed);
    s.phase = 'title';
    s.distance = 0;
    s.score = 0;
    s.best = 0;
    s.farmer.gap = 200;
    return s;
  }
  if (shot === 'play') {
    const s = fresh(seed);
    s.phase = 'play';
    s.distance = 128;
    s.score = 340;
    s.lives = 3;
    s.corn = 12;
    s.turkey.y = s.turkey.y - 120;
    s.turkey.vy = -220;
    s.farmer.gap = 92;
    s.farmer.shout = 1;
    return s;
  }
  if (shot === 'kitchen') {
    const s = fresh(seed);
    s.phase = 'play';
    s.distance = 712;
    s.score = 890;
    s.lives = 2;
    s.corn = 31;
    s.farmer.gap = 118;
    s.turkey.sliding = 0.4;
    return s;
  }
  if (shot === 'end') {
    const s = fresh(seed);
    s.phase = 'escaped';
    s.distance = 900;
    s.score = 2140;
    s.lives = 2;
    s.corn = 58;
    s.best = 2140;
    return s;
  }
  return null;
}
