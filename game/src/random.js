// Small seeded random number generator, so a screenshot seed always
// builds the same stretch of farm, barn and kitchen.
export function makeRng(seed) {
  let s = seed >>> 0;
  if (s === 0) s = 0x9e3779b9;
  return function next() {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 4294967296;
  };
}

export function pick(rng, items) {
  return items[Math.floor(rng() * items.length)];
}

export function range(rng, min, max) {
  return min + rng() * (max - min);
}
