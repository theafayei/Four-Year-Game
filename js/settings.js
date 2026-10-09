// Backgrounds ("settings"). Each place is drawn procedurally with the helpers from scenery.js.
// Outdoor places are built from parallax strips that scroll at different speeds.
// Indoor rooms are baked into one picture and decorated with a few animated details.
//
// env = { w, ox, tk, T, t, variant }
//   w: scene width, ox: horizontal offset of this panel while walking, tk: time key (1-4 or 'noon'),
//   T: time-of-day palette, t: seconds (for animation), variant: small per-event changes.

const HORIZON = 62;   // where the back wall meets the floor / the fence meets the grass

function drawTiled(ctx, tile, shiftX, y, width) {
  const period = tile.width;
  for (let x = ((Math.round(shiftX) % period) + period) % period - period; x < width; x += period) ctx.drawImage(tile, x, y);
}

// ================= shared building blocks =================
function drawSkyView(ctx, T, x, y, w, h, stars) {
  const band = h / T.sky.length;
  T.sky.forEach((color, i) => rect(ctx, color, x, y + Math.floor(i * band), w, Math.ceil(band) + 1));
  if (T.night && stars) [[3, 3], [11, 8], [19, 2], [24, 12], [8, 15], [16, 19]].forEach(([sx, sy]) => {
    if (sx < w - 1 && sy < h - 1) rect(ctx, '#fff6c8', x + sx, y + sy, 1, 1);
  });
}
function drawWindow(ctx, T, x, y, w, h, frame = '#b78b6a') {
  rect(ctx, frame, x - 2, y - 2, w + 4, h + 4);
  drawSkyView(ctx, T, x, y, w, h, true);
  // distant trees and a cloud so the window shows a world
  rect(ctx, T.canopy[0], x, y + h - 5, w, 5);
  for (let i = 0; i < w; i += 5) rect(ctx, T.canopy[1], x + i, y + h - 7 + (i % 3), 4, 3);
  if (!T.night) rect(ctx, T.cloud, x + 4, y + 4, 9, 2), rect(ctx, T.cloud, x + 6, y + 3, 5, 1);
  rect(ctx, '#f6ecd6', x + Math.floor(w / 2), y, 1, h);
  rect(ctx, '#f6ecd6', x, y + Math.floor(h / 2), w, 1);
  rect(ctx, mix(frame, '#ffffff', 0.35), x - 3, y + h + 2, w + 6, 2);
}
function drawFloor(ctx, w, kind, colors) {
  const [a, b] = colors;
  rect(ctx, a, 0, HORIZON, w, SCENE_H - HORIZON);
  const rows = [HORIZON, 66, 71, 77, 84, 92];
  rows.forEach((y, i) => {
    rect(ctx, b, 0, y, w, 1);
    const next = rows[i + 1] || SCENE_H, spacing = 14 + i * 6;
    if (kind === 'wood') for (let x = (i % 2) * (spacing / 2); x < w; x += spacing) rect(ctx, b, Math.round(x), y, 1, next - y);
    if (kind === 'tile') for (let x = (i % 2) * (spacing / 2); x < w; x += spacing) {
      rect(ctx, b, Math.round(x), y, 1, next - y);
    }
  });
  if (kind === 'carpet') dither(ctx, b, 0, HORIZON + 1, w, SCENE_H - HORIZON, 0);
  rect(ctx, mix(a, '#000000', 0.25), 0, HORIZON, w, 1);
}
function drawBaseboard(ctx, w, color) { rect(ctx, color, 0, HORIZON - 3, w, 3); rect(ctx, mix(color, '#ffffff', 0.3), 0, HORIZON - 3, w, 1); }
function drawCeiling(ctx, w, color, lights) {
  rect(ctx, color, 0, 0, w, 5); rect(ctx, mix(color, '#000000', 0.2), 0, 5, w, 1);
  lights.forEach(x => { rect(ctx, '#fffdf0', x, 2, 22, 2); rect(ctx, '#ffffff', x + 2, 2, 18, 1); });
}
function drawPlant(ctx, x, y, big) {
  const h = big ? 14 : 9;
  rect(ctx, '#b4694b', x + 2, y + h, 8, 7); rect(ctx, '#8f4f3a', x + 2, y + h + 5, 8, 2);
  const leaf = ['#4e9a5a', '#6fb870', '#3b7d4c'];
  for (let i = 0; i < 5; i += 1) {
    const lx = x + i * 2, ly = y + Math.abs(2 - i) * 2 + (big ? 0 : 3);
    rect(ctx, leaf[i % 3], lx, ly, 3, h - Math.abs(2 - i) * 2 + 1);
  }
  rect(ctx, leaf[1], x + 4, y - 1, 3, 3);
}
function drawShelf(ctx, x, y, w, rows, spread = 0) {
  const wood = '#a8754f', dark = '#7f5438';
  rect(ctx, dark, x, y, w, rows * 11 + 2);
  for (let r = 0; r < rows; r += 1) {
    const sy = y + 1 + r * 11;
    rect(ctx, '#5c3f2c', x + 1, sy, w - 2, 10);
    const books = ['#e0743f', '#4a8fd1', '#f2c14e', '#6bbf7a', '#b06ad0', '#e5566f', '#f6ecd6'];
    for (let bx = x + 2, i = (r * 3 + x) % 7; bx < x + w - 3; i += 1) {
      const bw = 2 + (i % 3), bh = 6 + ((i * 5) % 4);
      rect(ctx, books[i % 7], bx, sy + 10 - bh, bw, bh);
      bx += bw + 1;
    }
    rect(ctx, wood, x, sy + 10, w, 1);
  }
}
function drawClock(ctx, cx, cy, hourFrac) {
  disc(ctx, '#4a3f55', cx, cy, 6); disc(ctx, '#fffdf5', cx, cy, 5);
  [[0, -4], [4, 0], [0, 4], [-4, 0]].forEach(([dx, dy]) => rect(ctx, '#4a3f55', cx + dx, cy + dy, 1, 1));
  const angle = hourFrac * Math.PI * 2 / 12;
  rect(ctx, '#2a2230', cx + Math.round(Math.sin(angle) * 2.5), cy - Math.round(Math.cos(angle) * 2.5), 1, 1);
  rect(ctx, '#2a2230', cx, cy - 1, 1, 1); rect(ctx, '#2a2230', cx, cy - 3, 1, 3);
}
function drawDesk(ctx, x, y, w, topColor = '#c28f62') {
  rect(ctx, topColor, x, y, w, 4); rect(ctx, mix(topColor, '#ffffff', 0.3), x, y, w, 1);
  rect(ctx, mix(topColor, '#000000', 0.25), x, y + 4, w, 1);
  rect(ctx, mix(topColor, '#000000', 0.35), x + 2, y + 5, 2, 9); rect(ctx, mix(topColor, '#000000', 0.35), x + w - 4, y + 5, 2, 9);
}
function drawGlow(ctx, color, cx, cy, radius) {
  for (let r = radius; r > 2; r -= 4) {
    ctx.globalAlpha = 0.045;
    disc(ctx, color, cx, cy, r);
  }
  ctx.globalAlpha = 1;
}
function nightOverlay(ctx, w, h, color, alpha) { ctx.globalAlpha = alpha; rect(ctx, color, 0, 0, w, h); ctx.globalAlpha = 1; }

// ================= OUTDOOR: campus courtyard =================
function bakeSky(env) {
  const {T, w, tk} = env;
  return bake(`sky:${tk}:${w}`, w, HORIZON + 6, (ctx, cw, ch) => {
    const band = ch / T.sky.length;
    T.sky.forEach((color, i) => {
      rect(ctx, color, 0, Math.floor(i * band), cw, Math.ceil(band) + 1);
      if (i > 0) dither(ctx, color, 0, Math.floor(i * band) - 2, cw, 2, 0);   // soft blend between bands
    });
    if (T.night) {
      for (let i = 0; i < 46; i += 1) rect(ctx, '#e9ecff', (i * 53 + 7) % cw, (i * 29 + 3) % 40, 1, 1);
      disc(ctx, '#fff6c8', cw - 54, 24, 8); disc(ctx, T.sky[1], cw - 51, 21, 7);
    } else {
      const sx = Math.round(cw * (tk === 3 ? 0.2 : tk === 2 ? 0.7 : tk === 1 ? 0.78 : 0.5)), sy = tk === 3 ? 48 : tk === 2 ? 30 : 24;
      ditherDisc(ctx, mix(T.sun, T.sky[1], 0.4), sx, sy, 15);
      disc(ctx, mix(T.sun, T.sky[1], 0.35), sx, sy, 11);
      disc(ctx, T.sun, sx, sy, 8);
    }
  });
}
function bakeCloudTile(T, tk) {
  return bake(`clouds:${tk}`, 240, 44, ctx => {
    const puff = (x, y, s) => {
      rect(ctx, T.cloudShade, x + 2 * s, y + 3 * s, 14 * s, 2 * s);
      disc(ctx, T.cloud, x + 5 * s, y + 3 * s, 3 * s); disc(ctx, T.cloud, x + 10 * s, y + 2 * s, 4 * s);
      disc(ctx, T.cloud, x + 14 * s, y + 4 * s, 3 * s); rect(ctx, T.cloud, x + 3 * s, y + 3 * s, 12 * s, 2 * s);
      rect(ctx, T.cloudShade, x + 3 * s, y + 5 * s - 1, 12 * s, 1);
    };
    puff(8, 12, 2); puff(96, 2, 1); puff(150, 18, 2); puff(212, 8, 1);
  });
}
function bakeFarTile(T, tk) {
  return bake(`far:${tk}`, 192, 40, ctx => {
    for (let x = 0; x < 192; x += 1) {
      const h1 = 14 + Math.round(6 * Math.sin(x / 192 * Math.PI * 4) + 3 * Math.sin(x / 192 * Math.PI * 10));
      rect(ctx, T.far, x, 40 - h1, 1, h1);
      const h2 = 7 + Math.round(4 * Math.sin(x / 192 * Math.PI * 6 + 1.3));
      rect(ctx, T.far2, x, 40 - h2, 1, h2);
    }
    // a few distant towers
    [[30, 14, 7], [118, 18, 6]].forEach(([x, h, w]) => { rect(ctx, T.far2, x, 40 - h, w, h); rect(ctx, T.far, x + 1, 40 - h + 1, 1, 1); });
  });
}
function drawSchoolBlock(ctx, T, x, baseY, w, floors, tower) {
  const height = floors * 17 + 6, top = baseY - height;
  rect(ctx, T.wall, x, top, w, height); rect(ctx, T.wallShade, x, baseY - 4, w, 4);
  rect(ctx, T.wallShade, x, top + 6, w, 1);
  // roof ledge
  rect(ctx, T.roof, x - 2, top - 3, w + 4, 4); rect(ctx, T.roofShade, x - 2, top + 1, w + 4, 1);
  // windows
  for (let f = 0; f < floors; f += 1) {
    for (let wx = x + 6; wx < x + w - 8; wx += 12) {
      if (Math.abs(wx - (x + w / 2 - 3)) < 8 && f === floors - 1) continue;   // leave room for the door
      const wy = top + 9 + f * 17;
      rect(ctx, T.wallShade, wx - 1, wy - 1, 8, 10);
      rect(ctx, T.night ? T.glass : T.glass, wx, wy, 6, 8);
      rect(ctx, mix(T.glass, '#ffffff', 0.4), wx, wy, 2, 1);
      rect(ctx, T.wallShade, wx + 3, wy, 1, 8);
      if (T.night && (wx + f) % 3 === 0) rect(ctx, T.wallShade, wx, wy, 6, 8);   // some rooms are dark
    }
  }
  // entrance
  const dx = x + Math.round(w / 2) - 5;
  rect(ctx, T.wallShade, dx - 2, baseY - 15, 14, 15); rect(ctx, T.door, dx, baseY - 13, 10, 13);
  rect(ctx, mix(T.door, '#ffffff', 0.25), dx + 4, baseY - 13, 1, 13);
  rect(ctx, T.roof, dx - 3, baseY - 18, 16, 3);
  if (tower) {
    const tx = x + Math.round(w / 2) - 8, ty = top - 22;
    rect(ctx, T.wall, tx, ty, 16, 22); rect(ctx, T.wallShade, tx, ty + 18, 16, 4);
    rect(ctx, T.roof, tx - 2, ty - 3, 20, 4);
    for (let i = 0; i < 6; i += 1) rect(ctx, T.roof, tx + 2 + i, ty - 4 - i, 12 - i * 2, 1);
    disc(ctx, '#4a3f55', tx + 8, ty + 9, 6); disc(ctx, '#fffdf5', tx + 8, ty + 9, 5);
    rect(ctx, '#2a2230', tx + 8, ty + 6, 1, 4); rect(ctx, '#2a2230', tx + 8, ty + 9, 3, 1);
  }
}
function bakeSchoolTile(T, tk) {
  return bake(`school:${tk}`, 320, 62, ctx => {
    drawSchoolBlock(ctx, T, 8, 62, 138, 2, true);
    drawSchoolBlock(ctx, T, 188, 62, 112, 2, false);
    // little connecting wall
    rect(ctx, T.wallShade, 146, 52, 42, 10); rect(ctx, T.roof, 146, 50, 42, 2);
  });
}
function drawTree(ctx, T, x, baseY, size, sway) {
  rect(ctx, T.trunk, x + size - 1, baseY - size * 1.1, 4, size * 1.1);
  rect(ctx, mix(T.trunk, '#000000', 0.3), x + size + 2, baseY - size * 1.1, 1, size * 1.1);
  const cy = baseY - size * 2 - 4;
  disc(ctx, T.canopy[0], x + size, cy + 2, size + 4);
  disc(ctx, T.canopy[0], x + size - size / 2, cy + 5, size);
  disc(ctx, T.canopy[0], x + size + size / 2, cy + 5, size);
  disc(ctx, T.canopy[1], x + size - 1 + sway, cy - 1, size);
  disc(ctx, T.canopy[1], x + size - size / 2, cy + 3, size - 3);
  disc(ctx, T.canopy[2], x + size - 3 + sway, cy - 4, Math.max(2, size - 6));
  dither(ctx, T.canopy[2], x + size - 4, cy - 2, 6, 3, 0);
}
function bakeTreeTile(T, tk, frame) {
  return bake(`trees:${tk}:${frame}`, 176, 60, ctx => {
    drawTree(ctx, T, 6, 62, 10, frame);
    drawTree(ctx, T, 78, 62, 8, frame);
    drawTree(ctx, T, 128, 62, 11, frame);
  });
}
function bakeFenceTile(T, tk) {
  return bake(`fence:${tk}`, 16, 14, ctx => {
    rect(ctx, T.grass[1], 0, 6, 16, 8);
    rect(ctx, T.fence, 1, 0, 2, 9); rect(ctx, T.fence, 9, 0, 2, 9);
    rect(ctx, T.fenceShade, 3, 0, 1, 9); rect(ctx, T.fenceShade, 11, 0, 1, 9);
    rect(ctx, T.fence, 0, 2, 16, 1); rect(ctx, T.fence, 0, 6, 16, 1);
    rect(ctx, T.fenceShade, 0, 3, 16, 1); rect(ctx, T.fenceShade, 0, 7, 16, 1);
    rect(ctx, T.grass[2], 5, 9, 1, 2); rect(ctx, T.grass[0], 13, 10, 1, 2);
  });
}
function bakeGroundTile(T, tk) {
  return bake(`ground:${tk}`, 64, SCENE_H - 66, (ctx, cw, ch) => {
    // grass strip behind the path, then the paved path with a curb
    rect(ctx, T.grass[0], 0, 0, cw, 8);
    for (let x = 3; x < cw; x += 9) { rect(ctx, T.grass[2], x, 2 + (x % 4), 1, 2); rect(ctx, T.grass[1], x + 4, 5, 1, 2); }
    rect(ctx, T.fenceShade, 0, 8, cw, 2); rect(ctx, T.fence, 0, 8, cw, 1);
    rect(ctx, T.path[0], 0, 10, cw, ch - 10);
    for (let y = 18; y < ch; y += 9) {
      rect(ctx, T.path[2], 0, y, cw, 1);
      for (let x = ((y / 9) % 2) * 16; x < cw; x += 32) rect(ctx, T.path[2], x, y, 1, 9);
    }
    for (let i = 0; i < 14; i += 1) rect(ctx, T.path[1], (i * 23 + 5) % cw, 12 + (i * 11) % (ch - 14), 2, 1);
    rect(ctx, mix(T.path[2], '#000000', 0.15), 0, ch - 2, cw, 2);
  });
}
// props that sit on the grass strip, drawn at full speed
function drawBench(ctx, x, y, T) {
  rect(ctx, '#8a5a40', x, y, 22, 2); rect(ctx, '#a8704f', x, y + 3, 22, 2); rect(ctx, '#a8704f', x, y + 8, 22, 3);
  rect(ctx, '#5c3f2c', x + 1, y + 11, 2, 4); rect(ctx, '#5c3f2c', x + 19, y + 11, 2, 4); rect(ctx, '#5c3f2c', x + 1, y + 5, 2, 4); rect(ctx, '#5c3f2c', x + 19, y + 5, 2, 4);
}
function drawLamp(ctx, x, y, T) {
  rect(ctx, '#46405a', x + 1, y + 6, 2, 28); rect(ctx, '#46405a', x - 1, y + 32, 6, 2);
  rect(ctx, '#46405a', x - 2, y + 2, 8, 4); rect(ctx, T.lamps ? '#ffe39c' : '#e8e0c8', x - 1, y + 3, 6, 3);
}
function drawBin(ctx, x, y) { rect(ctx, '#4f8f8a', x, y, 8, 10); rect(ctx, '#3b7470', x, y, 8, 2); rect(ctx, '#78b8b0', x + 1, y + 3, 1, 6); rect(ctx, '#e8f0e0', x + 3, y + 5, 2, 2); }
function drawFlowerbed(ctx, x, y, T) {
  rect(ctx, '#8a5a40', x, y + 4, 26, 4); rect(ctx, T.canopy[0], x + 1, y + 2, 24, 3);
  [['#f48fb1', 2], ['#fff0a0', 7], ['#e5566f', 12], ['#b79cf0', 17], ['#fff0a0', 21]].forEach(([c, dx], i) => {
    rect(ctx, T.canopy[2], x + dx, y + 1 + (i % 2), 1, 3); rect(ctx, c, x + dx - 1, y - (i % 2), 3, 2); rect(ctx, '#fff', x + dx, y - (i % 2), 1, 1);
  });
}
function drawNoticeBoard(ctx, x, y, T) {
  rect(ctx, '#5c3f2c', x + 2, y + 18, 2, 12); rect(ctx, '#5c3f2c', x + 22, y + 18, 2, 12);
  rect(ctx, '#7a5438', x, y, 26, 20); rect(ctx, '#d9b48a', x + 2, y + 2, 22, 16);
  [['#fff3b0', 4, 4], ['#cfe8f5', 12, 3], ['#fbd0d8', 18, 6], ['#d7f0cf', 5, 11], ['#fff3b0', 13, 10]].forEach(([c, dx, dy]) => {
    rect(ctx, c, x + dx, y + dy, 6, 5); rect(ctx, '#e5566f', x + dx + 2, y + dy, 1, 1);
  });
}
function drawBikeRack(ctx, x, y) {
  rect(ctx, '#46405a', x, y + 9, 26, 2);
  for (let i = 0; i < 4; i += 1) { rect(ctx, '#6a6482', x + 2 + i * 6, y + 3, 1, 7); rect(ctx, '#6a6482', x + 2 + i * 6, y + 3, 4, 1); rect(ctx, '#6a6482', x + 5 + i * 6, y + 3, 1, 7); }
  disc(ctx, '#e0743f', x + 6, y + 12, 3); disc(ctx, '#4a3f55', x + 6, y + 12, 1); rect(ctx, '#e0743f', x + 6, y + 4, 8, 1);
}
function drawBooth(ctx, x, y, color, label) {
  rect(ctx, '#7a5438', x + 2, y + 16, 2, 22); rect(ctx, '#7a5438', x + 34, y + 16, 2, 22);
  for (let i = 0; i < 6; i += 1) rect(ctx, i % 2 ? '#fff7e6' : color, x + i * 7, y, 7, 8);
  for (let i = 0; i < 6; i += 1) rect(ctx, i % 2 ? '#fff7e6' : color, x + i * 7 + 1, y + 8, 5, 2);
  rect(ctx, '#d9b48a', x, y + 24, 38, 5); rect(ctx, '#a8704f', x, y + 29, 38, 9);
  rect(ctx, '#fffdf5', x + 4, y + 12, tinyWidth(label) + 4, 9); tinyText(ctx, label, x + 6, y + 14, '#4a3f55');
}
function bakeProp(key, w, h, fn) { return bake('prop:' + key, w, h, fn); }

// The campus is drawn in two parts so two campus panels can share one continuous backdrop while walking:
//   backdrop: parallax strips, scrolled by env.px      props + life: anchored to the panel, moved by env.ox
function drawCourtyardBackdrop(ctx, env) {
  const {w, px, T, tk, t} = env;
  blit(ctx, bakeSky(env), 0, 0);
  drawTiled(ctx, bakeCloudTile(T, tk), px * 0.08 + t * 1.6, 8, w);
  drawTiled(ctx, bakeFarTile(T, tk), px * 0.18, 32, w);
  drawTiled(ctx, bakeSchoolTile(T, tk), px * 0.32, 6, w);
  drawTiled(ctx, bakeTreeTile(T, tk, Math.floor(t / 0.9) % 2), px * 0.55, 8, w);
  drawTiled(ctx, bakeFenceTile(T, tk), px * 0.8, 58, w);
  drawTiled(ctx, bakeGroundTile(T, tk), px, 66, w);
}
function drawCourtyardProps(ctx, env) {
  const {w, ox, T, tk, t, variant} = env;
  if (variant === 'cast') {
    blit(ctx, bakeProp('boothA:' + tk, 38, 38, c => drawBooth(c, 0, 0, '#e5566f', 'CODE')), ox + Math.round(w * 0.04), 36);
    blit(ctx, bakeProp('boothB:' + tk, 38, 38, c => drawBooth(c, 0, 0, '#4a8fd1', 'TYPE')), ox + w - 52, 36);
    drawBunting(ctx, ox, w, t, T);
  } else {
    blit(ctx, bakeProp('board:' + tk, 26, 30, c => drawNoticeBoard(c, 0, 0, T)), ox + Math.round(w * 0.06), 44);
    blit(ctx, bakeProp('rack:' + tk, 26, 16, c => drawBikeRack(c, 0, 0)), ox + w - 40, 60);
  }
  blit(ctx, bakeProp('lamp:' + tk, 10, 36, c => drawLamp(c, 3, 0, T)), ox + Math.round(w * 0.16), 36);
  blit(ctx, bakeProp('lamp:' + tk, 10, 36, c => drawLamp(c, 3, 0, T)), ox + Math.round(w * 0.78), 36);
  blit(ctx, bakeProp('bench:' + tk, 22, 15, c => drawBench(c, 0, 0, T)), ox + Math.round(w * 0.46), 62);
  blit(ctx, bakeProp('bin:' + tk, 8, 10, c => drawBin(c, 0, 0)), ox + Math.round(w * 0.7), 66);
  blit(ctx, bakeProp('flowers:' + tk, 26, 10, c => drawFlowerbed(c, 0, 1, T)), ox + Math.round(w * 0.27), 66);
  if (T.lamps) {
    ctx.globalAlpha = 1;
    [0.16, 0.78].forEach(f => { ctx.globalAlpha = 0.5 + Math.sin(t * 3 + f * 9) * 0.04; drawGlow(ctx, '#ffe39c', ox + Math.round(w * f) + 3, 44, 22); });
    ctx.globalAlpha = 1;
  }
  // life: birds, a butterfly, falling leaves
  if (!T.night) {
    for (let i = 0; i < 2; i += 1) {
      const bx = ((t * (9 + i * 3) + i * 150) % (w + 40)) - 20, by = 22 + i * 12 + Math.sin(t * 2 + i) * 2;
      const frame = BIRD_FRAMES[Math.floor(t * 4 + i) % 2];
      grid(ctx, frame, {'#': '#4a3f55'}, bx, by);
    }
    if (tk === 'noon' || tk === 1) {
      const fx = (t * 7) % (w + 20), fy = 64 + Math.sin(t * 2.4) * 5;
      const fr = BUTTERFLY_FRAMES[Math.floor(t * 6) % 2]; grid(ctx, fr.rows, fr.pal, fx, fy);
    }
  } else {
    for (let i = 0; i < 6; i += 1) {   // fireflies
      const fx = (i * 67 + t * 4) % w, fy = 56 + ((i * 13) % 24) + Math.sin(t * 2 + i) * 3;
      if (Math.sin(t * 3 + i * 2) > 0) rect(ctx, '#f6f08a', fx, fy, 1, 1);
    }
  }
  if (tk === 2 || tk === 3) {
    for (let i = 0; i < 5; i += 1) {
      const lx = (i * 71 + t * 14) % w, ly = ((t * 12 + i * 23) % 60) + 8;
      rect(ctx, tk === 2 ? '#d98c3c' : '#e8a090', lx, ly, 2, 1);
    }
  }
}
function drawBunting(ctx, ox, w, t, T) {
  const colors = ['#e5566f', '#f2c14e', '#4a8fd1', '#6bbf7a'];
  rect(ctx, '#7a5438', ox + 3, 24, 2, 46); rect(ctx, '#7a5438', ox + w - 5, 24, 2, 46);
  for (let x = 6; x < w - 6; x += 1) {
    const sag = Math.round(Math.sin(((x - 6) / (w - 12)) * Math.PI) * 6);
    rect(ctx, '#46405a', ox + x, 25 + sag, 1, 1);
    if ((x - 6) % 9 === 4) {
      const wave = Math.round(Math.sin(t * 3 + x) * 1);
      rect(ctx, colors[((x - 6) / 9 | 0) % 4], ox + x - 1 + wave, 26 + sag, 4, 3); rect(ctx, colors[((x - 6) / 9 | 0) % 4], ox + x + wave, 29 + sag, 2, 2);
    }
  }
  rect(ctx, '#fff7e6', ox + Math.round(w / 2) - 22, 30, 44, 10); rect(ctx, '#e5566f', ox + Math.round(w / 2) - 22, 30, 44, 1);
  tinyText(ctx, 'CAST DAY', ox + Math.round(w / 2) - 15, 33, '#4a3f55');
}

// ================= INDOOR: rooms =================
// Each builder paints a w x 96 backdrop (and optional foreground that covers the characters' legs).
function buildClassroom(ctx, env, front) {
  const {w, T, variant} = env;
  if (front) return;
  rect(ctx, '#efe3c8', 0, 0, w, HORIZON); rect(ctx, '#c9d6bf', 0, 44, w, HORIZON - 44); rect(ctx, '#a9b8a0', 0, 44, w, 1);
  drawFloor(ctx, w, 'wood', ['#c99a76', '#b5845f']);
  drawBaseboard(ctx, w, '#8f6b52');
  drawCeiling(ctx, w, '#e0d4ba', [Math.round(w * 0.18), Math.round(w * 0.58)]);
  drawWindow(ctx, T, 14, 20, 30, 24); drawWindow(ctx, T, 56, 20, 30, 24);
  if (!T.night) { ctx.globalAlpha = 0.12; for (let i = 0; i < 2; i += 1) { ctx.fillStyle = '#fff6c8'; ctx.beginPath(); ctx.moveTo(14 + i * 42, 38); ctx.lineTo(44 + i * 42, 38); ctx.lineTo(70 + i * 42, 90); ctx.lineTo(30 + i * 42, 90); ctx.fill(); } ctx.globalAlpha = 1; }
  // blackboard
  const bx = Math.round(w * 0.5) - 8, by = 19;
  rect(ctx, '#8a5a3c', bx - 2, by - 2, 86, 34); rect(ctx, '#2f5c4a', bx, by, 82, 30); dither(ctx, '#3a6e58', bx, by, 82, 30, 0);
  rect(ctx, '#d9c8a0', bx - 2, by + 30, 86, 3);
  const chalk = variant === 'exam' ? 'QUIZ TODAY' : 'LESSON 1';
  tinyText(ctx, chalk, bx + 8, by + 5, '#f6f0dc');
  rect(ctx, '#f6f0dc', bx + 8, by + 13, 40, 1); rect(ctx, '#f6f0dc', bx + 8, by + 18, 28, 1); rect(ctx, '#f6f0dc', bx + 8, by + 23, 52, 1);
  tinyText(ctx, '1+1=2', bx + 54, by + 5, '#9fd6e8');
  drawClock(ctx, bx + 94, 27, 9.0);
  // flag, shelf, plant, notice
  drawShelf(ctx, w - 30, 26, 24, 3);
  drawPlant(ctx, w - 44, 40, true);
  rect(ctx, '#d9b48a', Math.round(w * 0.5) + 82, 40, 22, 14); [['#fff3b0', 2, 2], ['#fbd0d8', 11, 3], ['#cfe8f5', 5, 8]].forEach(([c, dx, dy]) => rect(ctx, c, Math.round(w * 0.5) + 82 + dx, 40 + dy, 8, 5));
  // student desks along the back, teacher desk to the right
  for (let i = 0; i < 4; i += 1) {
    const dx = 6 + i * 24, dy = 58;
    rect(ctx, '#5a6a8a', dx + 4, dy - 6, 10, 8); rect(ctx, '#46556f', dx + 4, dy - 6, 10, 1);   // chair back
    drawDesk(ctx, dx, dy, 20, '#d4a373');
  }
  drawDesk(ctx, w - 76, 60, 40, '#b8794e');
  rect(ctx, '#e5566f', w - 70, 56, 4, 4); rect(ctx, '#4e9a5a', w - 69, 55, 1, 1);   // apple
  rect(ctx, '#f6ecd6', w - 58, 57, 8, 3);                                          // papers
}
function buildLab(ctx, env, front) {
  const {w, T, variant} = env;
  if (front) return;
  rect(ctx, '#cfdce0', 0, 0, w, HORIZON); rect(ctx, '#8fa7b2', 0, 44, w, HORIZON - 44); rect(ctx, '#6f8a96', 0, 44, w, 1);
  drawFloor(ctx, w, 'carpet', ['#5f7380', '#53666f']);
  drawBaseboard(ctx, w, '#4a5c66');
  drawCeiling(ctx, w, '#dfe8ea', [Math.round(w * 0.12), Math.round(w * 0.46), Math.round(w * 0.78)]);
  // whiteboard with a network diagram
  rect(ctx, '#7a8a94', 12, 15, 78, 28); rect(ctx, '#f8fbfb', 14, 17, 74, 24);
  [[26, 23], [51, 23], [76, 23], [38, 34], [64, 34]].forEach(([x, y]) => rect(ctx, '#4a8fd1', x - 3, y - 2, 7, 5));
  [[26, 23, 51, 23], [51, 23, 76, 23], [51, 23, 38, 34], [51, 23, 64, 34]].forEach(([x1, y1, x2, y2]) => {
    for (let s = 0; s <= 10; s += 1) rect(ctx, '#4a3f55', Math.round(x1 + (x2 - x1) * s / 10), Math.round(y1 + (y2 - y1) * s / 10), 1, 1);
  });
  tinyText(ctx, 'LAN', 17, 35, '#e5566f');
  // long desk with monitors
  rect(ctx, '#9aa7ab', 0, 56, w, 5); rect(ctx, '#bac5c8', 0, 56, w, 1); rect(ctx, '#6f7d82', 0, 61, w, 1);
  for (let x = 4, i = 0; x < w - 52; x += 34, i += 1) {
    rect(ctx, '#2a2f3a', x, 40, 22, 15); rect(ctx, '#4a5160', x, 40, 22, 1);
    const kind = (i + (variant === 'alarm' ? 1 : 0)) % 3;
    const screen = variant === 'alarm' ? '#7a1f2c' : kind === 0 ? '#1d2a44' : kind === 1 ? '#0e1a14' : '#2e5a8a';
    rect(ctx, screen, x + 2, 42, 18, 11);
    if (kind === 1 && variant !== 'alarm') for (let r = 0; r < 4; r += 1) rect(ctx, '#5ee08a', x + 3, 43 + r * 2, 4 + (r * 5 + i) % 9, 1);
    if (kind === 0 && variant !== 'alarm') { rect(ctx, '#4a8fd1', x + 3, 43, 8, 4); rect(ctx, '#f6ecd6', x + 4, 44, 6, 1); }
    if (kind === 2) { rect(ctx, '#f6ecd6', x + 4, 44, 5, 5); rect(ctx, '#e0743f', x + 11, 44, 6, 2); }
    rect(ctx, '#4a5160', x + 9, 55, 4, 2); rect(ctx, '#e8edf0', x + 1, 58, 12, 2);
  }
  // server rack on the right
  const rx = w - 28;
  rect(ctx, '#2f3b55', rx, 18, 22, 44); rect(ctx, '#46557a', rx, 18, 22, 2);
  for (let u = 0; u < 6; u += 1) { rect(ctx, '#3d4b6c', rx + 2, 22 + u * 6, 18, 5); rect(ctx, '#1d2538', rx + 12, 24 + u * 6, 7, 1); }
  rect(ctx, '#46557a', rx, 60, 22, 2);
  if (variant === 'router') {
    rect(ctx, '#2f3b55', Math.round(w * 0.5) - 8, 52, 18, 5); rect(ctx, '#46557a', Math.round(w * 0.5) - 8, 52, 18, 1);
    for (let c = 0; c < 4; c += 1) rect(ctx, c % 2 ? '#4a8fd1' : '#e0743f', Math.round(w * 0.5) - 6 + c * 4, 56, 1, 4 + c % 3);
    rect(ctx, '#2a2230', Math.round(w * 0.5) - 6, 48, 1, 4); rect(ctx, '#2a2230', Math.round(w * 0.5) + 6, 46, 1, 6);
  }
  if (variant === 'note') {
    const nx = Math.round(w * 0.5) - 3 + 34; rect(ctx, '#f5e27a', nx, 43, 8, 8); rect(ctx, '#e5566f', nx + 3, 42, 2, 2);
    tinyText(ctx, '::', nx + 1, 45, '#4a3f55'); rect(ctx, '#4a3f55', nx + 1, 49, 5, 1);
  }
  drawPlant(ctx, w - 50, 42, true);
  // two office chairs pulled out from the desk, and a bin
  [Math.round(w * 0.42), Math.round(w * 0.88)].forEach(cx => {
    rect(ctx, '#3a4560', cx, 60, 12, 8); rect(ctx, '#2d3650', cx, 60, 12, 1); rect(ctx, '#3a4560', cx + 5, 68, 2, 6); rect(ctx, '#2d3650', cx + 1, 74, 10, 2);
    rect(ctx, '#1d2538', cx + 1, 76, 2, 1); rect(ctx, '#1d2538', cx + 9, 76, 2, 1);
  });
  rect(ctx, '#5f7380', 8, 64, 8, 10); rect(ctx, '#4a5c66', 8, 64, 8, 2);
}
function buildServerRoom(ctx, env, front) {
  const {w, variant} = env;
  if (front) return;
  rect(ctx, '#1b2336', 0, 0, w, HORIZON); rect(ctx, '#232e47', 0, 0, w, 6);
  drawFloor(ctx, w, 'tile', ['#25304a', '#3a4a6e']);
  rect(ctx, '#46557a', 0, 5, w, 2);
  for (let x = 0; x < w; x += 4) rect(ctx, '#46557a', x, 7, 1, 3 + (x % 3));   // cables hanging from the tray
  for (let x = 6, i = 0; x < w - 18; x += 30, i += 1) {
    rect(ctx, '#46557a', x - 1, 12, 26, 52); rect(ctx, '#2a3550', x, 13, 24, 50);
    for (let u = 0; u < 7; u += 1) {
      rect(ctx, '#3a4a6e', x + 2, 16 + u * 6, 20, 5); rect(ctx, '#1d2538', x + 13, 18 + u * 6, 8, 1); rect(ctx, '#1d2538', x + 13, 20 + u * 6, 8, 1);
    }
    rect(ctx, '#46557a', x - 1, 62, 26, 3);
  }
  rect(ctx, '#2c3a5c', 0, HORIZON - 2, w, 2);
  nightOverlay(ctx, w, SCENE_H, '#3a6fd8', 0.07);
  if (variant === 'disk') {
    const lx = Math.round(w * 0.5) - 20;   // maintenance panel showing the full disk
    rect(ctx, '#0e1a14', lx, 20, 40, 22); rect(ctx, '#46557a', lx - 1, 19, 42, 1); rect(ctx, '#46557a', lx - 1, 42, 42, 1);
    tinyText(ctx, 'DISK 100%', lx + 3, 24, '#e0503f'); rect(ctx, '#e0503f', lx + 3, 32, 34, 4);
    tinyText(ctx, '/VAR FULL', lx + 3, 37, '#f2c14e');
  }
}
// Dorm: a boarding-house room at night.
function buildDorm(ctx, env, front) {
  const {w, T, variant} = env;
  if (front) return;
  const night = {night: true, sky: TIMES[4].sky, canopy: TIMES[4].canopy, cloud: TIMES[4].cloud};
  rect(ctx, '#5f4f7d', 0, 0, w, HORIZON); rect(ctx, '#54456f', 0, 0, w, 4);
  for (let y = 6; y < HORIZON; y += 8) dither(ctx, '#66568a', 0, y, w, 1, 0);
  drawFloor(ctx, w, 'wood', ['#7a5a64', '#664852']);
  drawBaseboard(ctx, w, '#4a3a5c');
  // rug
  rect(ctx, '#9a6a8a', Math.round(w * 0.32), 78, Math.round(w * 0.3), 12); rect(ctx, '#b88aa6', Math.round(w * 0.32) + 2, 80, Math.round(w * 0.3) - 4, 8);
  // bed
  rect(ctx, '#6b4a3a', 4, 36, 4, 36); rect(ctx, '#6b4a3a', 4, 56, 60, 14); rect(ctx, '#e8dcc6', 8, 52, 56, 8);
  rect(ctx, '#fffdf5', 10, 49, 16, 6); rect(ctx, '#eee2ce', 10, 53, 16, 2);
  rect(ctx, '#5f9fb3', 26, 54, 38, 12); for (let x = 28; x < 64; x += 6) rect(ctx, '#7bbfd0', x, 54, 3, 12);
  rect(ctx, '#4a7f90', 26, 64, 38, 2); rect(ctx, '#5a3d30', 8, 70, 3, 5); rect(ctx, '#5a3d30', 58, 70, 3, 5);
  // window with the moon
  drawWindow(ctx, night, Math.round(w * 0.3), 12, 30, 26, '#8a6a5a');
  disc(ctx, '#fff6c8', Math.round(w * 0.3) + 22, 20, 4); disc(ctx, '#27356a', Math.round(w * 0.3) + 24, 19, 3);
  rect(ctx, '#b86a7a', Math.round(w * 0.3) - 5, 10, 4, 32); rect(ctx, '#b86a7a', Math.round(w * 0.3) + 31, 10, 4, 32);
  // poster and clock
  rect(ctx, '#2a2f4a', Math.round(w * 0.3) + 44, 16, 22, 28); rect(ctx, '#4a8fd1', Math.round(w * 0.3) + 46, 18, 18, 24);
  tinyText(ctx, 'IT', Math.round(w * 0.3) + 51, 22, '#fff7e6'); rect(ctx, '#f2c14e', Math.round(w * 0.3) + 49, 32, 12, 2); rect(ctx, '#e5566f', Math.round(w * 0.3) + 49, 36, 8, 2);
  // desk, laptop, lamp, router shelf
  const dx = w - 98;
  drawDesk(ctx, dx, 58, 76, '#8a5a40');
  rect(ctx, '#46556f', dx + 28, 62, 22, 3); rect(ctx, '#6a6482', dx + 30, 46, 20, 13); rect(ctx, '#1d2538', dx + 32, 48, 16, 9);
  rect(ctx, '#46405a', dx + 28, 58, 24, 2);
  const screenColor = variant === 'error' || variant === 'capstone' ? '#7a1f2c' : '#2e5a8a';
  rect(ctx, screenColor, dx + 32, 48, 16, 9);
  if (variant === 'error' || variant === 'capstone') { tinyText(ctx, '500', dx + 36, 49, '#ffd0d0'); rect(ctx, '#ff9a9a', dx + 34, 55, 12, 1); }
  else { rect(ctx, '#9fd6e8', dx + 34, 50, 10, 1); rect(ctx, '#f6ecd6', dx + 34, 52, 6, 1); rect(ctx, '#6bbf7a', dx + 34, 54, 9, 1); }
  rect(ctx, '#46405a', dx + 12, 48, 2, 10); rect(ctx, '#46405a', dx + 8, 48, 8, 2); rect(ctx, '#ffe39c', dx + 7, 49, 4, 2);
  rect(ctx, '#f6ecd6', dx + 58, 54, 6, 5); rect(ctx, '#e0743f', dx + 60, 55, 2, 1);
  if (variant === 'clock') { rect(ctx, '#d9d2c8', dx + 66, 54, 5, 5); rect(ctx, '#e5566f', dx + 66, 55, 5, 2); rect(ctx, '#6bbf7a', dx + 3, 55, 5, 4); rect(ctx, '#f2c14e', dx + 70, 57, 4, 2); }
  // chair
  rect(ctx, '#b86a7a', dx + 30, 66, 18, 3); rect(ctx, '#b86a7a', dx + 32, 56, 14, 5);
  // wall shelf with router
  rect(ctx, '#8a5a40', dx + 18, 36, 50, 3); drawPlant(ctx, dx + 20, 25, false);
  rect(ctx, '#2a2f4a', dx + 40, 30, 20, 6); rect(ctx, '#46557a', dx + 40, 30, 20, 1);
  rect(ctx, '#2a2f4a', dx + 42, 22, 1, 8); rect(ctx, '#2a2f4a', dx + 57, 24, 1, 6);
  drawPlant(ctx, w - 14, 40, true);
  nightOverlay(ctx, w, SCENE_H, '#0f1030', 0.28);
  if (variant === 'capstone') {   // a reminder note pinned up, drawn after the dimming so it stays readable
    const nx = Math.round(w * 0.3) + 70;
    rect(ctx, '#f6ecd6', nx, 32, 36, 16); rect(ctx, '#e5566f', nx + 16, 31, 3, 2);
    tinyText(ctx, 'DEFENSE', nx + 4, 35, '#e5566f'); tinyText(ctx, 'AT 8:00', nx + 4, 42, '#4a3f55');
  }
  drawGlow(ctx, '#ffd88a', dx + 9, 50, 34);
  drawGlow(ctx, '#7fb4ff', dx + 40, 52, 26);
}
function buildCafe(ctx, env, front) {
  const {w, T} = env;
  if (front) return;
  rect(ctx, '#bd7550', 0, 0, w, HORIZON);
  for (let y = 0; y < 44; y += 4) { rect(ctx, '#a4603f', 0, y, w, 1); for (let x = (y / 4 % 2) * 6; x < w; x += 12) rect(ctx, '#a4603f', x, y, 1, 4); }
  rect(ctx, '#7a4e3a', 0, 44, w, HORIZON - 44); rect(ctx, '#5c3a2a', 0, 44, w, 2); rect(ctx, '#8f6048', 0, 46, w, 1);
  for (let x = 6; x < w; x += 12) rect(ctx, '#6b4533', x, 47, 1, 15);
  drawFloor(ctx, w, 'tile', ['#efdfbf', '#c9a47a']);
  dither(ctx, '#d2b48a', 0, HORIZON + 1, w, SCENE_H - HORIZON, 0);
  drawWindow(ctx, T, 12, 14, 52, 26, '#6b4533');
  // hanging lamps
  [Math.round(w * 0.32), Math.round(w * 0.5), Math.round(w * 0.66)].forEach(x => {
    rect(ctx, '#46405a', x, 0, 1, 12); rect(ctx, '#e0a85a', x - 4, 12, 9, 4); rect(ctx, '#ffe39c', x - 2, 16, 5, 2);
  });
  // menu board and neon sign
  const mx = w - 92;
  rect(ctx, '#7a5438', mx - 2, 14, 56, 30); rect(ctx, '#2f3a3a', mx, 16, 52, 26);
  tinyText(ctx, 'MENU', mx + 4, 18, '#f6f0dc'); tinyText(ctx, 'COFFEE 3', mx + 4, 25, '#f2c14e'); tinyText(ctx, 'LATTE 4', mx + 4, 31, '#f6f0dc'); tinyText(ctx, 'CAKE 5', mx + 4, 37, '#f48fb1');
  const nx = Math.round(w * 0.5) - 38;
  rect(ctx, '#2a1f35', nx - 1, 18, 38, 11); tinyText(ctx, 'FREE WIFI', nx + 2, 21, '#7fe0ff'); rect(ctx, '#7fe0ff', nx + 2, 27, 32, 1);
  // counter with machine and cakes
  const cx = w - 92;
  rect(ctx, '#6b4330', cx, 60, 92, 24); rect(ctx, '#8a5a40', cx, 60, 92, 2); rect(ctx, '#d9b48a', cx - 2, 56, 96, 5); rect(ctx, '#f0d3a8', cx - 2, 56, 96, 1);
  rect(ctx, '#c9ced4', cx + 56, 38, 22, 18); rect(ctx, '#9aa1aa', cx + 56, 38, 22, 2); rect(ctx, '#2a2f3a', cx + 60, 46, 14, 3); rect(ctx, '#e5566f', cx + 74, 41, 2, 2);
  rect(ctx, '#e8edf0', cx + 8, 44, 34, 12); rect(ctx, '#bfe3ee', cx + 9, 45, 32, 10);
  [['#f48fb1', 12], ['#fff0a0', 20], ['#c98f6b', 28], ['#f48fb1', 35]].forEach(([c, x]) => { rect(ctx, c, cx + x, 50, 5, 4); rect(ctx, '#fff', cx + x + 1, 49, 3, 1); });
  // table and chairs
  const tx = Math.round(w * 0.3);
  rect(ctx, '#5c3f2c', tx + 11, 66, 3, 14); rect(ctx, '#d9b48a', tx, 62, 25, 4); rect(ctx, '#f0d3a8', tx, 62, 25, 1); rect(ctx, '#5c3f2c', tx + 5, 80, 15, 2);
  rect(ctx, '#e8e6ea', tx + 5, 58, 11, 4); rect(ctx, '#4a5160', tx + 6, 55, 9, 4); rect(ctx, '#7fb4ff', tx + 7, 56, 7, 2);
  rect(ctx, '#e8e6ea', tx + 18, 59, 4, 3);
  rect(ctx, '#a8704f', tx - 8, 56, 3, 22); rect(ctx, '#a8704f', tx - 8, 66, 8, 2); rect(ctx, '#a8704f', tx + 30, 56, 3, 22); rect(ctx, '#a8704f', tx + 25, 66, 8, 2);
  drawPlant(ctx, 6, 40, true);
  nightOverlay(ctx, w, SCENE_H, '#ff9a3c', 0.05);
  [Math.round(w * 0.32), Math.round(w * 0.5), Math.round(w * 0.66)].forEach(x => drawGlow(ctx, '#ffd88a', x, 20, 22));
}
function buildPanel(ctx, env, front) {
  const {w, variant} = env;
  const tx = Math.round(w * 0.36);
  if (front) {
    // table front covers the legs of the panel members so they look seated
    rect(ctx, '#6b4733', tx, 72, w - tx - 4, 14); rect(ctx, '#8a5e45', tx, 72, w - tx - 4, 2); rect(ctx, '#7a5440', tx + 2, 75, w - tx - 8, 9);
    for (let x = tx + 8; x < w - 12; x += 26) rect(ctx, '#5c3a2a', x, 74, 1, 10);
    rect(ctx, '#b98560', tx - 2, 69, w - tx, 4); rect(ctx, '#d9a878', tx - 2, 69, w - tx, 1);
    rect(ctx, '#4a2f22', tx + 2, 86, 4, 6); rect(ctx, '#4a2f22', w - 10, 86, 4, 6);
    // name plates and a water jug
    for (let i = 0; i < 3; i += 1) { rect(ctx, '#fffdf5', tx + 14 + i * 34, 66, 10, 3); rect(ctx, '#4a3f55', tx + 16 + i * 34, 67, 6, 1); }
    rect(ctx, '#bfe3ee', tx + 6, 61, 4, 8); rect(ctx, '#fff', tx + 7, 62, 1, 5);
    return;
  }
  rect(ctx, '#d8d2c0', 0, 0, w, HORIZON); rect(ctx, '#8d6648', 0, 40, w, HORIZON - 40); rect(ctx, '#a77c5a', 0, 40, w, 2);
  for (let x = 0; x < w; x += 14) rect(ctx, '#7a5640', x, 43, 1, 19);
  drawFloor(ctx, w, 'carpet', ['#6a4f66', '#5a4256']);
  drawCeiling(ctx, w, '#cbbfa8', [Math.round(w * 0.2), Math.round(w * 0.5), Math.round(w * 0.8)]);
  // projector screen
  const sx = Math.round(w * 0.5) - 44;
  rect(ctx, '#3a3445', sx - 2, 12, 92, 34); rect(ctx, '#f8f6ee', sx, 14, 88, 30);
  tinyText(ctx, variant === 'client' ? 'CLIENT NOTES' : 'CAPSTONE', sx + 6, 17, '#e5566f');
  tinyText(ctx, 'DEFENSE', sx + 6, 24, '#4a3f55');
  rect(ctx, '#4a8fd1', sx + 6, 31, 30, 2); rect(ctx, '#4a8fd1', sx + 6, 36, 22, 2); rect(ctx, '#6bbf7a', sx + 46, 27, 8, 14); rect(ctx, '#f2c14e', sx + 58, 33, 8, 8); rect(ctx, '#e5566f', sx + 70, 30, 8, 11);
  // flags and plant
  rect(ctx, '#6b4733', 8, 22, 2, 42); rect(ctx, '#e5566f', 10, 22, 16, 10); rect(ctx, '#f2c14e', 10, 26, 16, 2);
  rect(ctx, '#6b4733', 30, 26, 2, 38); rect(ctx, '#4a8fd1', 32, 26, 14, 9);
  drawPlant(ctx, 6, 44, false);
  // chairs
  for (let i = 0; i < 2; i += 1) { rect(ctx, '#3a4a6e', 40 + i * 22, 56, 10, 14); rect(ctx, '#2a3550', 40 + i * 22, 66, 10, 4); }
}

// ================= registry =================
const SETTINGS = {
  courtyard: {kind: 'outdoor', label: 'Campus courtyard'},
  classroom: {kind: 'indoor', label: 'Classroom', build: buildClassroom},
  lab: {kind: 'indoor', label: 'Computer lab', build: buildLab},
  serverRoom: {kind: 'indoor', label: 'Server room', build: buildServerRoom},
  dorm: {kind: 'indoor', label: 'Dorm room', build: buildDorm},
  cafe: {kind: 'indoor', label: 'Campus cafe', build: buildCafe},
  panel: {kind: 'indoor', label: 'Defense room', build: buildPanel}
};

function bakeRoom(id, env, front) {
  const setting = SETTINGS[id];
  const key = `room:${id}:${front ? 'f' : 'b'}:${env.variant || ''}:${env.tk}:${env.w}`;
  return bake(key, env.w, SCENE_H, ctx => setting.build(ctx, env, front));
}

// Small animated details drawn over a room's backdrop (panel coordinates; ctx is already translated).
function animateRoom(ctx, id, env) {
  const {w, t, variant, T} = env;
  const blink = (rate, phase = 0) => Math.sin(t * rate + phase) > 0;
  if (id === 'lab') {
    for (let x = 4, i = 0; x < w - 52; x += 34, i += 1) {
      if ((i + (variant === 'alarm' ? 1 : 0)) % 3 === 1 && variant !== 'alarm') {
        const scroll = Math.floor(t * 3 + i) % 4;
        rect(ctx, '#0e1a14', x + 2, 42, 18, 11);
        for (let r = 0; r < 4; r += 1) rect(ctx, '#5ee08a', x + 3, 43 + ((r + scroll) % 4) * 2, 4 + ((r + scroll) * 5 + i) % 9, 1);
        if (blink(6, i)) rect(ctx, '#5ee08a', x + 3, 51, 2, 1);
      }
    }
    const rx = w - 28;
    for (let u = 0; u < 6; u += 1) { rect(ctx, blink(5 + u, u) ? '#6bf09a' : '#2f6b48', rx + 4, 24 + u * 6, 1, 1); rect(ctx, blink(3 + u, u * 2) ? '#f2c14e' : '#6b5a2a', rx + 7, 24 + u * 6, 1, 1); }
    if (variant === 'router') for (let c = 0; c < 4; c += 1) if (blink(7 + c, c)) rect(ctx, '#6bf09a', Math.round(w * 0.5) - 6 + c * 4, 53, 1, 1);
    if (variant === 'alarm') {
      ctx.globalAlpha = 0.1 + 0.08 * Math.max(0, Math.sin(t * 5)); rect(ctx, '#ff3b4a', 0, 0, w, SCENE_H); ctx.globalAlpha = 1;
      rect(ctx, '#e0503f', w - 44, 10, 8, 6); rect(ctx, blink(8) ? '#ffd0d0' : '#a02030', w - 42, 11, 4, 3);
    }
  }
  if (id === 'serverRoom') {
    for (let x = 6, i = 0; x < w - 18; x += 30, i += 1) {
      for (let u = 0; u < 7; u += 1) {
        const color = variant === 'disk' && u % 3 === 0 ? (blink(6, u + i) ? '#ff5a5a' : '#7a2a2a') : (blink(4 + u, u * 2 + i) ? '#6bf09a' : '#2f6b48');
        rect(ctx, color, x + 4, 18 + u * 6, 1, 1); rect(ctx, blink(2 + u, i * 3 + u) ? '#f2c14e' : '#6b5a2a', x + 7, 18 + u * 6, 1, 1);
      }
    }
    if (variant === 'disk') {
      ctx.globalAlpha = 0.07 + 0.06 * Math.max(0, Math.sin(t * 4)); rect(ctx, '#ff3b4a', 0, 0, w, SCENE_H); ctx.globalAlpha = 1;
      rect(ctx, '#e0503f', w - 20, 8, 8, 4); rect(ctx, blink(6) ? '#ffd0d0' : '#a02030', w - 18, 9, 4, 2);
    }
  }
  if (id === 'dorm') {
    for (let x = 4, i = 0; x < w - 4; x += 7, i += 1) {   // string lights
      const sag = Math.round(Math.sin(x / w * Math.PI * 3) * 2);
      rect(ctx, '#3a2f50', x, 7 + sag, 3, 1);
      const on = Math.sin(t * 2.4 + i * 1.7) > -0.3;
      rect(ctx, on ? ['#ffd88a', '#ff9ab0', '#9fe0ff', '#b9f0a0'][i % 4] : '#5a4a6a', x + 1, 8 + sag, 1, 2);
    }
    const dx = w - 98;
    ctx.globalAlpha = 0.08 + 0.03 * Math.sin(t * 5); drawGlow(ctx, variant === 'error' || variant === 'capstone' ? '#ff6a6a' : '#7fb4ff', dx + 40, 52, 24); ctx.globalAlpha = 1;
    // router LED
    const red = variant === 'router';
    rect(ctx, red ? (blink(6) ? '#ff4a4a' : '#6a1f2a') : '#6bf09a', dx + 44, 33, 2, 2);
    rect(ctx, red ? '#6a1f2a' : (blink(9) ? '#6bf09a' : '#2f6b48'), dx + 50, 33, 2, 2);
    if (variant === 'clock') {   // zzz-free but tired: coffee steam
      rect(ctx, '#d8d2e8', dx + 60 + (Math.floor(t * 2) % 2), 49 - Math.floor(t * 4) % 4, 1, 2);
    }
    for (let i = 0; i < 6; i += 1) if (Math.sin(t * 1.5 + i * 2) > 0.2) rect(ctx, '#fff6c8', Math.round(w * 0.3) + 3 + (i * 5) % 26, 14 + (i * 7) % 18, 1, 1);
    drawClock(ctx, Math.round(w * 0.3) + 80, 24, variant === 'clock' ? 2 : 10);   // not dimmed, so the 2 AM is readable
    if (variant === 'clock') tinyText(ctx, '02:07', Math.round(w * 0.3) + 71, 33, '#ffb3b3');
  }
  if (id === 'cafe') {
    const cx = w - 92;
    for (let i = 0; i < 3; i += 1) {   // steam from the machine and the cup
      const phase = (t * 1.3 + i * 0.33) % 1;
      rect(ctx, '#f6f0ea', cx + 62 + i * 4 + Math.round(Math.sin(t * 3 + i) * 1), 36 - Math.round(phase * 10), 1, 2);
    }
    const tx = Math.round(w * 0.3);
    for (let i = 0; i < 2; i += 1) rect(ctx, '#f6f0ea', tx + 19 + i * 2 + Math.round(Math.sin(t * 3 + i)), 56 - Math.round(((t * 1.6 + i * 0.5) % 1) * 7), 1, 2);
  }
  if (id === 'classroom') {
    drawClock(ctx, Math.round(w * 0.5) - 8 + 94, 27, 9.0);
    const sec = Math.floor(t) % 4;   // a ticking second hand
    rect(ctx, '#e5566f', Math.round(w * 0.5) + 86 + [0, 3, 0, -3][sec], 27 + [-3, 0, 3, 0][sec], 1, 1);
    if (!T.night) for (let i = 0; i < 6; i += 1) {   // dust in the sunbeams
      const dxp = 20 + ((i * 17 + t * 3) % 60), dyp = 40 + ((i * 13 + t * 2) % 40);
      if (Math.sin(t + i) > -0.2) rect(ctx, '#fff6c8', dxp, dyp, 1, 1);
    }
    if (Math.floor(t * 0.5) % 9 === 0 && (t * 10) % 2 < 1) { ctx.globalAlpha = 0.1; rect(ctx, '#ffffff', 0, 0, w, 6); ctx.globalAlpha = 1; }
  }
  if (id === 'panel') {
    const sx = Math.round(w * 0.5) - 44;
    ctx.globalAlpha = 0.05 + 0.02 * Math.sin(t * 6); rect(ctx, '#ffffff', sx, 14, 88, 30); ctx.globalAlpha = 1;
  }
}
