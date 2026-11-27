// The farmer: he never stops chasing. His screen position is the
// gap behind the turkey, and the gap is the game's real health bar:
// a stumble pulls him close, corn and dashes push him back.
import { CONFIG } from './config.js';

export function createFarmer() {
  return {
    gap: 200,
    runPhase: 0,
    grabbing: 0,
    shout: 0,
  };
}

export function updateFarmer(f, dt, speed, turkeyDashing) {
  f.runPhase += dt * (speed / 30);
  if (f.grabbing > 0) f.grabbing -= dt;
  if (f.shout > 0) f.shout -= dt;
  // He drifts closer on his own, slowly; the player must keep earning
  // distance with corn and dashes to stay ahead.
  f.gap -= dt * 3.5;
  if (turkeyDashing) f.gap += dt * 60;
  if (f.gap < CONFIG.farmer.catchGap) f.gap = CONFIG.farmer.catchGap;
  if (f.gap > CONFIG.farmer.farGap) f.gap = CONFIG.farmer.farGap;
}

export function farmerScreenX(f, turkeyX) {
  return turkeyX - f.gap - 60;
}

export function drawFarmer(ctx, f, x, time) {
  const legSwing = Math.sin(f.runPhase * 2) * 14;
  const bob = Math.abs(Math.sin(f.runPhase * 2)) * 4;
  const reach = f.grabbing > 0 ? 26 : 10 + Math.sin(f.runPhase * 2) * 6;

  ctx.save();
  ctx.translate(x, CONFIG.groundY - bob);

  // Legs, long strides.
  ctx.strokeStyle = '#3a2a1a';
  ctx.lineWidth = 9;
  ctx.beginPath();
  ctx.moveTo(-6, -52);
  ctx.lineTo(-6 + legSwing, 0);
  ctx.moveTo(6, -52);
  ctx.lineTo(6 - legSwing, 0);
  ctx.stroke();

  // Body: blue overalls over a red checked shirt.
  ctx.fillStyle = '#b03a2e';
  ctx.fillRect(-22, -118, 44, 66);
  ctx.fillStyle = '#2e5fa3';
  ctx.fillRect(-20, -92, 40, 42);
  ctx.fillStyle = '#f7e3b0';
  ctx.fillRect(-20, -92, 40, 6);

  // Reaching arm, always grabbing for the turkey.
  ctx.strokeStyle = '#b03a2e';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(14, -108);
  ctx.lineTo(14 + reach + 18, -96);
  ctx.stroke();
  ctx.fillStyle = '#e8b48a';
  ctx.beginPath();
  ctx.arc(14 + reach + 22, -95, 8, 0, Math.PI * 2);
  ctx.fill();

  // Other arm pumping.
  ctx.strokeStyle = '#b03a2e';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(-16, -108);
  ctx.lineTo(-30 - Math.sin(f.runPhase * 2) * 8, -84);
  ctx.stroke();

  // Head, moustache and straw hat.
  ctx.fillStyle = '#e8b48a';
  ctx.beginPath();
  ctx.arc(0, -132, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#5d3413';
  ctx.fillRect(-12, -128, 24, 5);
  ctx.fillStyle = '#e8c96a';
  ctx.beginPath();
  ctx.ellipse(0, -146, 30, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#d9a83c';
  ctx.fillRect(-14, -164, 28, 20);
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(6, -134, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(12, -134, 2.5, 0, Math.PI * 2);
  ctx.fill();

  if (f.shout > 0) {
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#7a4a21';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(62, -178, 66, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#7a2a1a';
    ctx.font = 'bold 14px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('COME BACK!', 62, -173);
  }

  ctx.restore();
}
