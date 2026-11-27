// The turkey: a big, readable bird drawn from shapes, with jump,
// double jump, slide and dash. Its body is the hit box the hazards
// test against.
import { CONFIG } from './config.js';

export function createTurkey() {
  return {
    x: 300,
    y: CONFIG.groundY - 74,
    vy: 0,
    jumps: 0,
    sliding: 0,
    dashing: 0,
    dashCooldown: 0,
    runPhase: 0,
    stumble: 0,
    w: 74,
    h: 74,
  };
}

export function turkeyGroundY(t) {
  return CONFIG.groundY - (t.sliding > 0 ? 44 : 74);
}

export function turkeyJump(t, audio) {
  if (t.jumps === 0) {
    t.vy = CONFIG.jumpVelocity;
    t.jumps = 1;
    audio.jump();
    return true;
  }
  if (t.jumps === 1 && t.vy > -200) {
    t.vy = CONFIG.doubleJumpVelocity;
    t.jumps = 2;
    audio.doubleJump();
    return true;
  }
  return false;
}

export function turkeySlide(t) {
  if (t.y >= CONFIG.groundY - 74) {
    t.sliding = CONFIG.slideTime;
    return true;
  }
  return false;
}

export function turkeyDash(t, audio) {
  if (t.dashCooldown <= 0 && t.dashing <= 0) {
    t.dashing = CONFIG.dashTime;
    t.dashCooldown = 0.9;
    audio.dash();
    return true;
  }
  return false;
}

export function updateTurkey(t, dt, speed) {
  t.runPhase += dt * (speed / 34);
  if (t.dashCooldown > 0) t.dashCooldown -= dt;
  if (t.sliding > 0) t.sliding -= dt;
  if (t.dashing > 0) t.dashing -= dt;
  if (t.stumble > 0) t.stumble -= dt;
  t.vy += CONFIG.gravity * dt;
  t.y += t.vy * dt;
  const ground = turkeyGroundY(t);
  if (t.y >= ground) {
    t.y = ground;
    t.vy = 0;
    t.jumps = 0;
  }
  t.h = t.sliding > 0 ? 44 : 74;
}

export function drawTurkey(ctx, t, time) {
  const bob = Math.sin(t.runPhase * 2) * (t.y >= turkeyGroundY(t) ? 3 : 0);
  const cx = t.x;
  const cy = t.y + 37 + bob;
  const wobble = t.stumble > 0 ? Math.sin(time * 40) * 4 : 0;

  ctx.save();
  ctx.translate(cx + wobble, cy);

  // Fanned tail feathers, the turkey's silhouette at a glance.
  const tailColors = ['#b4552d', '#d97b2f', '#e8a34c', '#8a4a24', '#c96a1e'];
  for (let i = -2; i <= 2; i += 1) {
    ctx.save();
    ctx.rotate(i * 0.34);
    ctx.fillStyle = tailColors[i + 2];
    ctx.beginPath();
    ctx.ellipse(-30, -26, 11, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f7e3b0';
    ctx.beginPath();
    ctx.ellipse(-30, -48, 5, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Body.
  ctx.fillStyle = '#7a4a21';
  ctx.beginPath();
  ctx.ellipse(0, 0, 36, 30, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#9c6228';
  ctx.beginPath();
  ctx.ellipse(4, -4, 28, 22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Wing, flapping with the run.
  const flap = Math.sin(t.runPhase * 2) * 6;
  ctx.fillStyle = '#5d3413';
  ctx.beginPath();
  ctx.ellipse(-4, -2 + flap * 0.4, 20, 12, -0.4 + flap * 0.02, 0, Math.PI * 2);
  ctx.fill();

  // Neck and head.
  ctx.fillStyle = '#8a4a24';
  ctx.fillRect(24, -52, 12, 30);
  ctx.fillStyle = '#e8b48a';
  ctx.beginPath();
  ctx.arc(31, -56, 13, 0, Math.PI * 2);
  ctx.fill();
  // Beak, snood and wattle.
  ctx.fillStyle = '#e8a020';
  ctx.beginPath();
  ctx.moveTo(42, -58);
  ctx.lineTo(58, -53);
  ctx.lineTo(42, -49);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c93a2e';
  ctx.beginPath();
  ctx.ellipse(46, -50, 4, 8, 0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(34, -60, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(35, -60, 2, 0, Math.PI * 2);
  ctx.fill();

  // Legs, scissoring while running.
  const legSwing = Math.sin(t.runPhase * 2) * 12;
  ctx.strokeStyle = '#e8a020';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-10, 26);
  ctx.lineTo(-10 + legSwing, 40);
  ctx.moveTo(10, 26);
  ctx.lineTo(10 - legSwing, 40);
  ctx.stroke();

  ctx.restore();
}
