// The painted world: autumn sky, parallax hills, fences and trees
// in the farmyard, timber and lanterns in the barn, tiles and a big
// oven in the kitchen. Every stage keeps the same warm palette so
// the turkey and the farmer always read first.
import { CONFIG } from './config.js';
import { stageFor, worldToScreen } from './world.js';

function drawCloud(ctx, x, y, scale) {
  ctx.fillStyle = 'rgba(255, 248, 230, 0.9)';
  ctx.beginPath();
  ctx.ellipse(x, y, 42 * scale, 18 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 28 * scale, y + 4 * scale, 30 * scale, 14 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 30 * scale, y + 5 * scale, 26 * scale, 12 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawPumpkin(ctx, x, y, scale) {
  ctx.fillStyle = '#d96a1e';
  ctx.beginPath();
  ctx.ellipse(x, y, 22 * scale, 17 * scale, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#a84e12';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(x, y, 12 * scale, 17 * scale, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#4a7a2e';
  ctx.fillRect(x - 2, y - 24 * scale, 5, 10 * scale);
}

function drawTree(ctx, x, y, scale) {
  ctx.fillStyle = '#7d4a22';
  ctx.fillRect(x - 6 * scale, y - 70 * scale, 12 * scale, 70 * scale);
  ctx.fillStyle = '#c96a1e';
  ctx.beginPath();
  ctx.arc(x, y - 92 * scale, 34 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e8a34c';
  ctx.beginPath();
  ctx.arc(x - 16 * scale, y - 78 * scale, 20 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 18 * scale, y - 80 * scale, 18 * scale, 0, Math.PI * 2);
  ctx.fill();
}

export function drawBackground(ctx, distance, time) {
  const stage = stageFor(distance);
  const stageIndex = CONFIG.stageBounds.indexOf(stage);

  if (stageIndex === 1) {
    // Barn interior: timber plank walls, a beam, warm lantern light.
    ctx.fillStyle = '#8a5a2a';
    ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);
    ctx.fillStyle = 'rgba(0,0,0,0.14)';
    for (let x = 0; x < CONFIG.width; x += 86) {
      ctx.fillRect(x, 0, 5, CONFIG.groundY);
    }
    ctx.fillStyle = '#5d3413';
    ctx.fillRect(0, 120, CONFIG.width, 22);
    ctx.fillRect(0, 300, CONFIG.width, 14);
    // Hayloft window with evening light.
    ctx.fillStyle = '#f7c873';
    ctx.fillRect(880, 40, 180, 80);
    ctx.strokeStyle = '#5d3413';
    ctx.lineWidth = 6;
    ctx.strokeRect(880, 40, 180, 80);
    ctx.beginPath();
    ctx.moveTo(970, 40);
    ctx.lineTo(970, 120);
    ctx.moveTo(880, 80);
    ctx.lineTo(1060, 80);
    ctx.stroke();
    ctx.fillStyle = '#c9a34a';
    ctx.fillRect(0, CONFIG.groundY, CONFIG.width, CONFIG.height - CONFIG.groundY);
    ctx.fillStyle = '#a87c1e';
    ctx.fillRect(0, CONFIG.groundY, CONFIG.width, 10);
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    for (let i = 0; i < 14; i += 1) {
      const gx = ((i * 173 - distance * 46) % 1400 + 1400) % 1400 - 60;
      ctx.fillRect(gx, CONFIG.groundY + 30 + (i % 4) * 22, 26, 5);
    }
    ctx.fillStyle = 'rgba(43, 26, 16, 0.55)';
    ctx.fillRect(0, CONFIG.groundY - 4, CONFIG.width, 2);
    return;
  }

  if (stageIndex === 2) {
    // Kitchen interior: cream tile wall, a window, hanging pans,
    // and a long counter along the ground line.
    ctx.fillStyle = '#f3e3c2';
    ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);
    ctx.strokeStyle = 'rgba(122, 74, 33, 0.25)';
    ctx.lineWidth = 2;
    for (let y = 0; y < CONFIG.groundY; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CONFIG.width, y);
      ctx.stroke();
    }
    for (let x = 0; x < CONFIG.width; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CONFIG.groundY);
      ctx.stroke();
    }
    // Window with the autumn evening outside.
    ctx.fillStyle = '#7d9bb5';
    ctx.fillRect(880, 60, 220, 160);
    ctx.fillStyle = '#ffd23e';
    ctx.beginPath();
    ctx.arc(1030, 110, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e8a34c';
    ctx.beginPath();
    ctx.ellipse(940, 190, 60, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#5d3413';
    ctx.lineWidth = 6;
    ctx.strokeRect(880, 60, 220, 160);
    ctx.beginPath();
    ctx.moveTo(990, 60);
    ctx.lineTo(990, 220);
    ctx.moveTo(880, 140);
    ctx.lineTo(1100, 140);
    ctx.stroke();
    // Hanging pans.
    for (let i = 0; i < 3; i += 1) {
      const px = 150 + i * 120;
      ctx.strokeStyle = '#5d3413';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, 70);
      ctx.stroke();
      ctx.fillStyle = '#3a3a44';
      ctx.beginPath();
      ctx.arc(px, 96, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#565664';
      ctx.beginPath();
      ctx.arc(px, 96, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    // Counter top.
    ctx.fillStyle = '#a86a3a';
    ctx.fillRect(0, CONFIG.groundY - 26, CONFIG.width, 26);
    ctx.fillStyle = '#7d4a22';
    ctx.fillRect(0, CONFIG.groundY, CONFIG.width, CONFIG.height - CONFIG.groundY);
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    for (let i = 0; i < 14; i += 1) {
      const gx = ((i * 173 - distance * 46) % 1400 + 1400) % 1400 - 60;
      ctx.fillRect(gx, CONFIG.groundY + 30 + (i % 4) * 22, 26, 5);
    }
    ctx.fillStyle = 'rgba(43, 26, 16, 0.55)';
    ctx.fillRect(0, CONFIG.groundY - 4, CONFIG.width, 2);
    return;
  }

  // Sky.
  const sky = ctx.createLinearGradient(0, 0, 0, CONFIG.height);
  sky.addColorStop(0, stage.sky);
  sky.addColorStop(0.7, '#f3d9a4');
  sky.addColorStop(1, '#e8b96a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

  // Sun.
  ctx.fillStyle = '#fff3c4';
  ctx.beginPath();
  ctx.arc(1080, 110, 46, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffd23e';
  ctx.beginPath();
  ctx.arc(1080, 110, 36, 0, Math.PI * 2);
  ctx.fill();

  // Clouds drift slowly.
  for (let i = 0; i < 4; i += 1) {
    const cx = ((i * 340 - distance * 8 + time * 6) % 1500 + 1500) % 1500 - 110;
    drawCloud(ctx, cx, 80 + i * 34, 0.8 + (i % 2) * 0.3);
  }

  // Far hills.
  ctx.fillStyle = stage.far;
  ctx.beginPath();
  ctx.moveTo(0, 470);
  for (let x = 0; x <= CONFIG.width; x += 80) {
    const hill = Math.sin((x + distance * 14) * 0.006) * 36;
    ctx.lineTo(x, 450 + hill);
  }
  ctx.lineTo(CONFIG.width, CONFIG.height);
  ctx.lineTo(0, CONFIG.height);
  ctx.closePath();
  ctx.fill();

  // Near ground.
  ctx.fillStyle = stageIndex === 2 ? '#c98d5a' : '#b97e33';
  ctx.fillRect(0, CONFIG.groundY, CONFIG.width, CONFIG.height - CONFIG.groundY);
  ctx.fillStyle = stageIndex === 2 ? '#a86a3a' : '#96682a';
  ctx.fillRect(0, CONFIG.groundY, CONFIG.width, 10);

  // Ground texture dashes rushing past.
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  for (let i = 0; i < 14; i += 1) {
    const gx = ((i * 173 - distance * 46) % 1400 + 1400) % 1400 - 60;
    ctx.fillRect(gx, CONFIG.groundY + 30 + (i % 4) * 22, 26, 5);
  }

  // Stage banner on the ground line.
  ctx.fillStyle = 'rgba(43, 26, 16, 0.55)';
  ctx.fillRect(0, CONFIG.groundY - 4, CONFIG.width, 2);
}

export function drawScenery(ctx, scenery, distance, turkeyX) {
  for (const item of scenery) {
    const x = worldToScreen(distance, item.at, turkeyX);
    if (x < -160 || x > CONFIG.width + 160) continue;
    if (item.kind === 'farmhouse') {
      ctx.fillStyle = '#a84e12';
      ctx.fillRect(x - 90, CONFIG.groundY - 150, 180, 150);
      ctx.fillStyle = '#7d3410';
      ctx.beginPath();
      ctx.moveTo(x - 104, CONFIG.groundY - 148);
      ctx.lineTo(x, CONFIG.groundY - 210);
      ctx.lineTo(x + 104, CONFIG.groundY - 148);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fff3c4';
      ctx.fillRect(x - 60, CONFIG.groundY - 120, 30, 30);
      ctx.fillRect(x + 30, CONFIG.groundY - 120, 30, 30);
      ctx.fillStyle = '#5d3413';
      ctx.fillRect(x - 16, CONFIG.groundY - 70, 32, 70);
    } else if (item.kind === 'tree') {
      drawTree(ctx, x, CONFIG.groundY, 1.1);
    } else if (item.kind === 'pumpkin') {
      drawPumpkin(ctx, x - 30, CONFIG.groundY - 16, 1);
      drawPumpkin(ctx, x + 24, CONFIG.groundY - 12, 0.7);
    } else if (item.kind === 'fenceRow') {
      ctx.fillStyle = '#8a5a2a';
      for (let i = 0; i < 5; i += 1) {
        ctx.fillRect(x - 80 + i * 40, CONFIG.groundY - 52, 7, 52);
      }
      ctx.fillRect(x - 88, CONFIG.groundY - 44, 200, 7);
      ctx.fillRect(x - 88, CONFIG.groundY - 24, 200, 7);
    } else if (item.kind === 'barnDoor') {
      ctx.fillStyle = '#8a4a24';
      ctx.fillRect(x - 70, CONFIG.groundY - 190, 140, 190);
      ctx.strokeStyle = '#5d3413';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x - 70, CONFIG.groundY - 190);
      ctx.lineTo(x + 70, CONFIG.groundY);
      ctx.moveTo(x + 70, CONFIG.groundY - 190);
      ctx.lineTo(x - 70, CONFIG.groundY);
      ctx.stroke();
      ctx.fillStyle = '#e8c96a';
      ctx.beginPath();
      ctx.arc(x, CONFIG.groundY - 120, 10, 0, Math.PI * 2);
      ctx.fill();
    } else if (item.kind === 'hayStack') {
      ctx.fillStyle = '#d9a83c';
      ctx.beginPath();
      ctx.moveTo(x - 70, CONFIG.groundY);
      ctx.quadraticCurveTo(x, CONFIG.groundY - 130, x + 70, CONFIG.groundY);
      ctx.closePath();
      ctx.fill();
    } else if (item.kind === 'lantern') {
      ctx.strokeStyle = '#5d3413';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, CONFIG.groundY - 190);
      ctx.lineTo(x, CONFIG.groundY - 150);
      ctx.stroke();
      ctx.fillStyle = '#ffd23e';
      ctx.fillRect(x - 12, CONFIG.groundY - 150, 24, 30);
      ctx.fillStyle = '#7d4a22';
      ctx.fillRect(x - 14, CONFIG.groundY - 154, 28, 6);
    } else if (item.kind === 'crateStack') {
      ctx.fillStyle = '#a8642f';
      ctx.fillRect(x - 40, CONFIG.groundY - 58, 58, 58);
      ctx.fillRect(x + 4, CONFIG.groundY - 58, 58, 58);
      ctx.fillRect(x - 18, CONFIG.groundY - 116, 58, 58);
    } else if (item.kind === 'table') {
      ctx.fillStyle = '#7d4a22';
      ctx.fillRect(x - 80, CONFIG.groundY - 90, 160, 14);
      ctx.fillRect(x - 70, CONFIG.groundY - 76, 12, 76);
      ctx.fillRect(x + 58, CONFIG.groundY - 76, 12, 76);
      ctx.fillStyle = '#fff';
      ctx.fillRect(x - 70, CONFIG.groundY - 104, 140, 14);
    } else if (item.kind === 'ovenBig') {
      ctx.fillStyle = '#4a4a52';
      ctx.fillRect(x - 70, CONFIG.groundY - 170, 140, 170);
      ctx.fillStyle = '#e8a020';
      ctx.fillRect(x - 70, CONFIG.groundY - 170, 140, 10);
      ctx.fillStyle = '#2e2e36';
      ctx.fillRect(x - 52, CONFIG.groundY - 140, 104, 90);
      ctx.fillStyle = '#ff7b24';
      ctx.fillRect(x - 44, CONFIG.groundY - 132, 88, 74);
    } else if (item.kind === 'window') {
      ctx.fillStyle = '#7d9bb5';
      ctx.fillRect(x - 50, CONFIG.groundY - 260, 100, 110);
      ctx.fillStyle = '#fff3c4';
      ctx.fillRect(x - 42, CONFIG.groundY - 252, 84, 94);
      ctx.strokeStyle = '#5d3413';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, CONFIG.groundY - 252);
      ctx.lineTo(x, CONFIG.groundY - 158);
      ctx.moveTo(x - 42, CONFIG.groundY - 205);
      ctx.lineTo(x + 42, CONFIG.groundY - 205);
      ctx.stroke();
    } else if (item.kind === 'forestGate') {
      ctx.fillStyle = '#2e5d23';
      ctx.fillRect(x - 8, CONFIG.groundY - 200, 16, 200);
      ctx.fillRect(x - 90, CONFIG.groundY - 200, 16, 200);
      ctx.fillStyle = '#4a7a2e';
      ctx.fillRect(x - 98, CONFIG.groundY - 214, 196, 18);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px "Trebuchet MS", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FREEDOM', x, CONFIG.groundY - 226);
    }
  }
}
