// Tuning for Turkey's Great Escape: one place for every number that
// decides how the chase feels. Distances are in metres, speeds in
// pixels per second on a 1280x720 stage.
export const CONFIG = {
  width: 1280,
  height: 720,
  groundY: 600,
  gravity: 2600,
  jumpVelocity: -980,
  doubleJumpVelocity: -820,
  slideTime: 0.55,
  dashTime: 0.28,
  dashSpeed: 1150,
  baseSpeed: 340,
  maxSpeed: 620,
  startLives: 3,
  escapeDistance: 900,
  cornScore: 10,
  goldenCornScore: 50,
  stageBounds: [
    { name: 'FARMYARD', until: 300, sky: '#f7c873', far: '#e8a34c', near: '#c97e2e' },
    { name: 'BARN', until: 600, sky: '#d98d4e', far: '#a8642f', near: '#7d4a22' },
    { name: 'KITCHEN', until: 900, sky: '#e9b96a', far: '#b96a35', near: '#8a4a24' },
  ],
  farmer: {
    catchGap: 26,
    farGap: 190,
    closeWarning: 110,
    stumbleClose: 55,
    cornPush: 26,
    dashPush: 34,
    recover: 42,
  },
};
