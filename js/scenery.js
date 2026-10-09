// Scenery toolkit: tiny drawing helpers, a 3x5 pixel font, small sprites and time-of-day palettes.
// One logical pixel here is one art pixel. The canvas is scaled up with whole numbers so it stays crisp.
const SCENE_H = 96;   // logical height of every scene
const FEET_Y = 86;    // the line where characters' feet touch the ground

// ---------- baking: draw something once onto a hidden canvas, then just copy it every frame ----------
const bakedCache = new Map();
function bake(key, w, h, draw) {
  let canvas = bakedCache.get(key);
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.ceil(w));
    canvas.height = Math.max(1, Math.ceil(h));
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    draw(ctx, canvas.width, canvas.height);
    bakedCache.set(key, canvas);
    if (bakedCache.size > 300) bakedCache.delete(bakedCache.keys().next().value);
  }
  return canvas;
}
function blit(ctx, canvas, x, y) { ctx.drawImage(canvas, Math.round(x), Math.round(y)); }

// ---------- primitives ----------
function rect(ctx, color, x, y, w, h) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}
// Checkerboard of one colour: the classic way to blend two colours in pixel art.
function dither(ctx, color, x, y, w, h, phase = 0) {
  ctx.fillStyle = color;
  for (let j = 0; j < h; j += 1) {
    for (let i = (j + phase) & 1; i < w; i += 2) ctx.fillRect(Math.round(x) + i, Math.round(y) + j, 1, 1);
  }
}
// A circle filled with a checkerboard, for soft halos.
function ditherDisc(ctx, color, cx, cy, r) {
  ctx.fillStyle = color;
  for (let dy = -r; dy <= r; dy += 1) {
    for (let dx = -r; dx <= r; dx += 1) {
      if (dx * dx + dy * dy <= r * r && ((dx + dy) & 1) === 0) ctx.fillRect(Math.round(cx) + dx, Math.round(cy) + dy, 1, 1);
    }
  }
}
function disc(ctx, color, cx, cy, r) {
  ctx.fillStyle = color;
  for (let dy = -r; dy <= r; dy += 1) {
    const half = Math.floor(Math.sqrt(r * r - dy * dy + 0.5));
    ctx.fillRect(Math.round(cx) - half, Math.round(cy) + dy, half * 2 + 1, 1);
  }
}
// Draw a text grid (one character per pixel, "." is empty).
function grid(ctx, rows, palette, left, top) {
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x += 1) {
      const color = palette[row[x]];
      if (!color) continue;
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(left) + x, Math.round(top) + y, 1, 1);
    }
  });
}
function bakeGrid(key, rows, palette) {
  return bake(key, Math.max(...rows.map(row => row.length)), rows.length, ctx => grid(ctx, rows, palette, 0, 0));
}
function mix(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = shift => Math.round(((pa >> shift) & 255) * (1 - t) + ((pb >> shift) & 255) * t);
  return '#' + ((1 << 24) | (ch(16) << 16) | (ch(8) << 8) | ch(0)).toString(16).slice(1);
}

// ---------- tiny 3x5 font for signs, boards and screens ----------
const TINY_FONT = {
  A: '.#./#.#/###/#.#/#.#', B: '##./#.#/##./#.#/##.', C: '.##/#../#../#../.##', D: '##./#.#/#.#/#.#/##.',
  E: '###/#../##./#../###', F: '###/#../##./#../#..', G: '.##/#../#.#/#.#/.##', H: '#.#/#.#/###/#.#/#.#',
  I: '###/.#./.#./.#./###', J: '..#/..#/..#/#.#/.#.', K: '#.#/#.#/##./#.#/#.#', L: '#../#../#../#../###',
  M: '#.#/###/###/#.#/#.#', N: '##./#.#/#.#/#.#/#.#', O: '.#./#.#/#.#/#.#/.#.', P: '##./#.#/##./#../#..',
  Q: '.#./#.#/#.#/##./.##', R: '##./#.#/##./#.#/#.#', S: '.##/#../.#./..#/##.', T: '###/.#./.#./.#./.#.',
  U: '#.#/#.#/#.#/#.#/###', V: '#.#/#.#/#.#/#.#/.#.', W: '#.#/#.#/###/###/#.#', X: '#.#/#.#/.#./#.#/#.#',
  Y: '#.#/#.#/.#./.#./.#.', Z: '###/..#/.#./#../###',
  0: '###/#.#/#.#/#.#/###', 1: '.#./##./.#./.#./###', 2: '##./..#/.#./#../###', 3: '##./..#/.#./..#/##.',
  4: '#.#/#.#/###/..#/..#', 5: '###/#../##./..#/##.', 6: '.##/#../###/#.#/###', 7: '###/..#/.#./.#./.#.',
  8: '###/#.#/###/#.#/###', 9: '###/#.#/###/..#/##.',
  ':': '.../.#./.../.#./...', '.': '.../.../.../.../.#.', '>': '#../.#./..#/.#./#..', '<': '..#/.#./#../.#./..#',
  '/': '..#/..#/.#./#../#..', '-': '.../.../###/.../...', '!': '.#./.#./.#./.../.#.', '?': '##./..#/.#./.../.#.',
  '_': '.../.../.../.../###', '{': '.##/.#./##./.#./.##', '}': '##./.#./.##/.#./##.', '=': '.../###/.../###/...',
  '%': '#.#/..#/.#./#../#.#', '*': '.../#.#/.#./#.#/...', '+': '.../.#./###/.#./...', '#': '#.#/###/#.#/###/#.#',
  '$': '.##/##./.#./.##/##.', ' ': '.../.../.../.../...', '[': '##./#../#../#../##.', ']': '.##/..#/..#/..#/.##',
  '(': '.#./#../#../#../.#.', ')': '.#./..#/..#/..#/.#.', ',': '.../.../.../.#./#..', '"': '#.#/#.#/.../.../...',
  "'": '.#./.#./.../.../...', ';': '.../.#./.../.#./#..', '&': '.#./#.#/.#./#.#/.##'
};
function tinyWidth(text) { return Math.max(0, String(text).length * 4 - 1); }
function tinyText(ctx, text, x, y, color) {
  ctx.fillStyle = color;
  let cursor = Math.round(x);
  for (const ch of String(text).toUpperCase()) {
    const glyph = (TINY_FONT[ch] || TINY_FONT['?']).split('/');
    glyph.forEach((row, j) => {
      for (let i = 0; i < 3; i += 1) if (row[i] === '#') ctx.fillRect(cursor + i, Math.round(y) + j, 1, 1);
    });
    cursor += 4;
  }
  return cursor - Math.round(x);
}

// ---------- small sprites: emotes, cat, birds, butterfly ----------
const EMOTE_ICONS = {
  heart: {pal: {'#': '#e5566f', '+': '#ff9aa8'}, rows: ['.##.##.', '#+#####', '#######', '.#####.', '..###..', '...#...']},
  exclaim: {pal: {'#': '#e0503f'}, rows: ['.#.', '.#.', '.#.', '.#.', '...', '.#.']},
  question: {pal: {'#': '#5b7fd1'}, rows: ['.##.', '#..#', '..#.', '.#..', '....', '.#..']},
  sweat: {pal: {'#': '#4aa8dd', '+': '#a8e2fa'}, rows: ['..#..', '.#+#.', '.#+#.', '#+###', '#####', '.###.']},
  sparkle: {pal: {'#': '#f2b43a', '+': '#fff0a0'}, rows: ['..#..', '..#..', '##+##', '..#..', '..#..']},
  note: {pal: {'#': '#7a5bc4'}, rows: ['...###.', '...#.##', '...#...', '...#...', '.###...', '.###...']},
  bulb: {pal: {'#': '#f2b43a', '+': '#fff0a0', '-': '#8a8190'}, rows: ['.###.', '#+###', '#+###', '.###.', '..-..', '..-..']},
  check: {pal: {'#': '#3fa468'}, rows: ['......#', '.....##', '#...##.', '##.##..', '.###...', '..#....']},
  cross: {pal: {'#': '#e0503f'}, rows: ['#...#', '.#.#.', '..#..', '.#.#.', '#...#']},
  coffee: {pal: {'#': '#8a5a44', 'w': '#ffffff', '+': '#c98f6b', '~': '#b9b0bd'}, rows: ['.~.~.', '~.~..', '#####', '#+++##', '#+++##', '.###.']},
  wifi: {pal: {'#': '#4a8fd1'}, rows: ['.#####.', '#.....#', '..###..', '.#...#.', '.......', '...#...']},
  nowifi: {pal: {'#': '#4a8fd1', 'x': '#e0503f'}, rows: ['.#####.x', '#.....#.', '..###.x.', '.#...#x.', '.....x..', '...#..xx']},
  anger: {pal: {'#': '#e0503f'}, rows: ['#.#.#', '.###.', '#####', '.###.', '#.#.#']},
  dots: {pal: {'#': '#7a6f85'}, rows: ['.......', '.......', '#.#.#.#']},
  star: {pal: {'#': '#f2b43a', '+': '#fff0a0'}, rows: ['...#...', '..#+#..', '#######', '.#+++#.', '.##.##.', '#.....#']}
};
// A speech bubble with the icon inside, ready to draw above a character's head.
function emoteCanvas(name) {
  const key = 'emoteFull:' + name;
  const hit = bakedCache.get(key);
  if (hit) return hit;
  let content;
  if (name === 'zzz' || name === 'code') {
    const text = name === 'zzz' ? 'ZZ' : '</>';
    content = bake('emoteText:' + name, tinyWidth(text), 5, ctx => tinyText(ctx, text, 0, 0, name === 'zzz' ? '#5b7fd1' : '#3fa468'));
  } else {
    const icon = EMOTE_ICONS[name] || EMOTE_ICONS.exclaim;
    content = bakeGrid('emoteIcon:' + name, icon.rows, icon.pal);
  }
  const bw = content.width + 6, bh = content.height + 6;
  return bake(key, bw, bh + 3, ctx => {
    const edge = '#4a3f55', fill = '#fffdf5';
    rect(ctx, edge, 1, 0, bw - 2, bh);
    rect(ctx, edge, 0, 1, bw, bh - 2);
    rect(ctx, fill, 1, 1, bw - 2, bh - 2);
    const cx = Math.floor(bw / 2);
    rect(ctx, fill, cx - 1, bh - 1, 2, 1);          // opening in the bottom edge
    rect(ctx, edge, cx - 2, bh, 1, 1); rect(ctx, fill, cx - 1, bh, 2, 1); rect(ctx, edge, cx + 1, bh, 1, 1);
    rect(ctx, edge, cx - 1, bh + 1, 2, 1); rect(ctx, edge, cx - 1, bh + 2, 1, 1);
    ctx.drawImage(content, 3, 3);
  });
}

const CAT_PAL = {O: '#4a3640', o: '#e8a05c', d: '#c4763c', w: '#fff1dc', e: '#2a2230', n: '#f08aa0'};
// Side view, facing right. Every row is exactly 15 pixels wide.
const CAT_HEAD = [
  '.........O...O.', '........OoO.OoO', '........OoooooO', '........OoeoeoO', '........OownwoO'
];
const CAT_FRAMES = {
  walk0: [...CAT_HEAD,
    'OdO.OOOOOOOOOO.', 'OdOOoodoodooO..', '.OOOoowwwwwooO.', '...OdOOOOOOOdO.', '..OdO.....OdO..', '..OOO.....OOO..'],
  walk1: [...CAT_HEAD,
    '.O..OOOOOOOOOO.', 'OdO.OoodoodooO.', 'OOOOoowwwwwooO.', '...OdOOOOOOOdO.', '....OdO.OdO....', '....OOO.OOO....'],
  sit: [...CAT_HEAD,
    '.OO.OOOOOOOOOO.', 'OdOOoodoodooO..', 'OdOOoowwwwwoO..', '.OOOdOOOOOOOdO.', '...OOOOOOOOOO..', '...............']
};
function catCanvas(frame) {
  const rows = (CAT_FRAMES[frame] || CAT_FRAMES.walk0).map(row => row.padEnd(15, '.'));
  return bakeGrid('cat:' + frame, rows, CAT_PAL);
}

const BIRD_FRAMES = [['#.#', '.#.'], ['.#.', '#.#']];
const BUTTERFLY_FRAMES = [
  {rows: ['p.p', '.o.', 'p.p'], pal: {p: '#f48fb1', o: '#4a3f55'}},
  {rows: ['...', 'pop', '...'], pal: {p: '#f48fb1', o: '#4a3f55'}}
];

// ---------- times of day (one per school year, plus a bright summer) ----------
const TIMES = {
  1: {name: 'Bright morning', night: false, lamps: false,
    sky: ['#7ec8e3', '#98d4e8', '#b4e0ec', '#cdeae9'], sun: '#fff6b8', cloud: '#ffffff', cloudShade: '#dbeaf0',
    far: '#a9c9c8', far2: '#93b9b6', wall: '#efe0bc', wallShade: '#d3be93', roof: '#8798ab', roofShade: '#6c7f94',
    glass: '#79b3c6', door: '#7a5f58', canopy: ['#4f9d5f', '#68b56a', '#86cb7a'], trunk: '#7b5a45',
    grass: ['#74bf78', '#62ab69', '#8dd085'], path: ['#ead7ae', '#dcc597', '#cdb184'], fence: '#f1e6cb', fenceShade: '#c7b793',
    tint: null},
  2: {name: 'Golden afternoon', night: false, lamps: false,
    sky: ['#f2b872', '#f6c984', '#f9d99d', '#fbe6b9'], sun: '#fff0b0', cloud: '#fff2d6', cloudShade: '#f0cfa0',
    far: '#c9a98f', far2: '#b8977f', wall: '#f2c99b', wallShade: '#d5a577', roof: '#8b7a8c', roofShade: '#6f6173',
    glass: '#a4b7bd', door: '#7a5648', canopy: ['#8a9b4a', '#a7b45a', '#c4cb6e'], trunk: '#7a5642',
    grass: ['#a7b765', '#95a657', '#b9c775'], path: ['#e8c898', '#d7b284', '#c79c70'], fence: '#f3dfb4', fenceShade: '#c9ad82',
    tint: ['#ff9a3c', 0.07]},
  3: {name: 'Sunset', night: false, lamps: true,
    sky: ['#6c5a9c', '#a46aa5', '#e08a8f', '#f5b48a'], sun: '#ffd29a', cloud: '#f0a6a0', cloudShade: '#c27c92',
    far: '#6f5f8c', far2: '#5e5280', wall: '#d9a39d', wallShade: '#b4808c', roof: '#5d5580', roofShade: '#484069',
    glass: '#ffe29a', door: '#5e4452', canopy: ['#5f7a5e', '#78906a', '#93a678'], trunk: '#5a4552',
    grass: ['#6f8a66', '#5f7b5d', '#7d996f'], path: ['#c9a1a0', '#b58b92', '#a07784'], fence: '#d9b9bd', fenceShade: '#a98a9b',
    tint: ['#ff6a8a', 0.08]},
  4: {name: 'Night campus', night: true, lamps: true,
    sky: ['#141a3a', '#1c2750', '#27356a', '#33447c'], sun: '#fff6c8', cloud: '#44507f', cloudShade: '#313a66',
    far: '#232e55', far2: '#1b2447', wall: '#4e5b7e', wallShade: '#3a4666', roof: '#2c3452', roofShade: '#222842',
    glass: '#ffe39c', door: '#2b3350', canopy: ['#25435a', '#2f5568', '#3b6a78'], trunk: '#2e3a4d',
    grass: ['#2e4d5c', '#27424f', '#375a66'], path: ['#56648a', '#48557a', '#3d4a6c'], fence: '#8798b8', fenceShade: '#5c6c8c',
    tint: ['#0b1030', 0.18]},
  noon: {name: 'Sunny summer day', night: false, lamps: false,
    sky: ['#5db8ea', '#7ccaf0', '#a1dcf2', '#c4ecf0'], sun: '#fffbd0', cloud: '#ffffff', cloudShade: '#d7ecf4',
    far: '#8fc4b0', far2: '#7bb4a0', wall: '#f5e6c0', wallShade: '#d9c595', roof: '#7f98ab', roofShade: '#667f94',
    glass: '#74b4d0', door: '#7a5f58', canopy: ['#3f9f55', '#59b865', '#7fd07c'], trunk: '#7b5a45',
    grass: ['#67c46f', '#54b25f', '#80d283'], path: ['#f0dfb8', '#e2cda0', '#d2bb8e'], fence: '#f7edd4', fenceShade: '#ccbd9a',
    tint: null}
};
function timeFor(key) { return TIMES[key] || TIMES[1]; }
