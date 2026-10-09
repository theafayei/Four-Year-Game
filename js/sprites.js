// Approved 24 x 32 text grids, copied unchanged from sprite-test.html.
// . transparent; O outline; H/h hair; S/s skin; P/p/L clothing;
// W highlights/ID; E eyes; m mouth; t eye bags; B/b bag; X straps; D/d trousers; Q shoes.
const SPRITE_LOOKS = {
  "boy": {
    "freshman": [
      "........................",
      "........OOOOOOOO........",
      "......OOHHHHHHHHOO......",
      ".....OHHhhhhHHHHHHO.....",
      "....OHhhhhHHHHHHHHO.....",
      "....OHHHHHHHHHHHHHO.....",
      "....OHHHHSSSSHHHHHO.....",
      "....OHSSSSSSSSSSSHO.....",
      "....OSSOOSSSSOOSSSO.....",
      "....OsSWESSSSWESSsO.....",
      "....OsSSSSSSSSSSSsO.....",
      ".....OSSsSSmmSSsSSO.....",
      "......OssSSSSSSssO......",
      "........OOOOOOOO........",
      "..........OOOO..........",
      ".......OOOSsSOOO........",
      ".......OBBOOOOBBO.......",
      ".....OBPLPPPPPLPBO......",
      ".....OBPXPPPPPXpBO......",
      ".....OBPXPPPPPXpBO......",
      ".....OSSPPPPPPppSSO.....",
      ".....OSsPPPPPPppSsO.....",
      "......OOPPPPPPppOO......",
      ".......OPPPPPPppO.......",
      ".......OOOOOOOOOO.......",
      ".......ODDDddDDDO.......",
      ".......ODDdOOdddO.......",
      ".......ODDd..ODdO.......",
      ".......ODDd..ODdO.......",
      "......OQQQO..OQQQO......",
      "......OQWQO..OQWQO......",
      "......OOOOO..OOOOO......"
    ],
    "sophomore": [
      "........................",
      "........OOOOOOOO........",
      "......OOHHHHHHHHOO......",
      ".....OHHhhhhHHHHHHO.....",
      "....OHhhhhHHHHHHHHO.....",
      "....OHHHHHHHHHHHHHO.....",
      "....OHHHHSSSSHHHHHO.....",
      "....OHSSSSSSSSSSSHO.....",
      "....OSSOOSSSSOOSSSO.....",
      "....OsSWESSSSWESSsO.....",
      "....OsSSSSSSSSSSSsO.....",
      ".....OSSsSSmmSSsSSO.....",
      "......OssSSSSSSssO......",
      "........OOOOOOOO........",
      "..........OOOO..........",
      ".......OOOSsSOOO........",
      ".......OLPOOOPpO........",
      "......OPLPPPPPPpO.......",
      ".....OPPLWPPWPPppO......",
      ".....OPPLWPPWPPppO......",
      ".....OPpPPPPPPPppO......",
      ".....OSsPPPppPPPSSO.....",
      ".....OSsPpLLLLpPSsO.....",
      "......OOPppppppOO.......",
      ".......OOOOOOOOOO.......",
      ".......ODDDddDDDO.......",
      ".......ODDdOOdddO.......",
      ".......ODDd..ODdO.......",
      ".......ODDd..ODdO.......",
      "......OQQQO..OQQQO......",
      "......OQWQO..OQWQO......",
      "......OOOOO..OOOOO......"
    ],
    "junior": [
      "........................",
      "........OOOOOOOO........",
      "......OOHHHHHHHHOO......",
      ".....OHHhhhhHHHHHHO.....",
      "....OHhhhhHHHHHHHHO.....",
      "....OHHHHHHHHHHHHHO.....",
      "....OHHHHSSSSHHHHHO.....",
      "....OHSSSSSSSSSSSHO.....",
      "....OSSOOSSSSOOSSSO.....",
      "....OsSWESSSSWESSsO.....",
      "....OsSSSSSSSSSSSsO.....",
      ".....OSSsSSmmSSsSSO.....",
      "......OssSSSSSSssO......",
      "........OOOOOOOO........",
      "..........OOOO..........",
      ".......OOOSsSOOO........",
      ".......OLPOOOPpO........",
      "......OPLXPPPLXpO.......",
      ".....OPPLXPPXPpppO......",
      ".....OPPPPXWPPpppO......",
      ".....OSsPPWWPPppSSO.....",
      ".....OSsPPWWPXppSsO.....",
      "......OOPPPPPPXXOO......",
      ".......OPPPPPPOBBO......",
      ".......OOOOOOOBbbBO.....",
      ".......ODDDddOBbbBO.....",
      ".......ODDdOOOBbbBO.....",
      ".......ODDd..OOOOO......",
      ".......ODDd..ODdO.......",
      "......OQQQO..OQQQO......",
      "......OQWQO..OQWQO......",
      "......OOOOO..OOOOO......"
    ],
    "senior": [
      "........................",
      "........OOOOOOOO........",
      "......OOHHHHHHHHOO......",
      ".....OHHhhhhHHHHHHO.....",
      "....OHhhhhHHHHHHHHO.....",
      "....OHHHHHHHHHHHHHO.....",
      "....OHHHHSSSSHHHHHO.....",
      "....OHSSSSSSSSSSSHO.....",
      "....OSSOOSSSSOOSSSO.....",
      "....OsSWESSSSWESSsO.....",
      "....OsSttSSSSttSSsO.....",
      ".....OSSsSSmmSSsSSO.....",
      "......OssSSSSSSssO......",
      "........OOOOOOOO........",
      "..........OOOO..........",
      ".......OOOSsSOOO........",
      ".......OLLSsSLLpO.......",
      "......OPPLPOPPLppO......",
      ".....OPPLXPOPXPppO......",
      ".....OPPPPXWXPPppO......",
      ".....OSsPPWWPPppSSO.....",
      ".....OSsPPWWPPppSsO.....",
      "......OOPPPPPPppOO......",
      ".......OPPPPPPppO.......",
      ".......OOOOOOOOOO.......",
      ".......ODDDddDDDO.......",
      ".......ODDdOOdddO.......",
      ".......ODDd..ODdO.......",
      ".......ODDd..ODdO.......",
      "......OQQQO..OQQQO......",
      "......OQWQO..OQWQO......",
      "......OOOOO..OOOOO......"
    ]
  },
  "girl": {
    "freshman": [
      "........................",
      "........OOOOOOOO........",
      "......OOHHHHHHHHOO......",
      ".....OHHhhhhHHHHHHO.....",
      "....OHhhhhHHHHHHHHO.....",
      "....OHHHHHHHHHHHHHO.....",
      "....OHHHHSSSSSHHHHO.....",
      "....OHHSSSSSSSSSHHO.....",
      ".....OHSOOSSSSOOSHO.....",
      ".....OHsWESSSSWEsHO.....",
      ".....OHsSSSSSSSSsHO.....",
      ".....OHSSsSmmSsSSHO.....",
      ".....OHHssSSSSssHHO.....",
      ".....OHHOOOOOOOOHHO.....",
      "......OHHOSsSOHHO.......",
      "......OHHOOsOOHHO.......",
      ".......OBBOOOOBBO.......",
      ".....OBPLPPPPPLPBO......",
      ".....OBPXPPPPPXpBO......",
      ".....OBPXPPPPPXpBO......",
      ".....OSSPPPPPPppSSO.....",
      ".....OSsPPPPPPppSsO.....",
      "......OOPPPPPPppOO......",
      ".......OPPPPPPppO.......",
      ".......OOOOOOOOOO.......",
      ".......ODDDddDDDO.......",
      ".......ODDdOOdddO.......",
      ".......ODDd..ODdO.......",
      ".......ODDd..ODdO.......",
      "......OQQQO..OQQQO......",
      "......OQWQO..OQWQO......",
      "......OOOOO..OOOOO......"
    ],
    "sophomore": [
      "........................",
      "........OOOOOOOO........",
      "......OOHHHHHHHHOO......",
      ".....OHHhhhhHHHHHHO.....",
      "....OHhhhhHHHHHHHHO.....",
      "....OHHHHHHHHHHHHHO.....",
      "....OHHHHSSSSSHHHHO.....",
      "....OHHSSSSSSSSSHHO.....",
      ".....OHSOOSSSSOOSHO.....",
      ".....OHsWESSSSWEsHO.....",
      ".....OHsSSSSSSSSsHO.....",
      ".....OHSSsSmmSsSSHO.....",
      ".....OHHssSSSSssHHO.....",
      ".....OHHOOOOOOOOHHO.....",
      "......OHHOSsSOHHO.......",
      "......OHHOOsOOHHO.......",
      ".......OLPOOOPpO........",
      "......OPLPPPPPPpO.......",
      ".....OPPLWPPWPPppO......",
      ".....OPPLWPPWPPppO......",
      ".....OPpPPPPPPPppO......",
      ".....OSsPPPppPPPSSO.....",
      ".....OSsPpLLLLpPSsO.....",
      "......OOPppppppOO.......",
      ".......OOOOOOOOOO.......",
      ".......ODDDddDDDO.......",
      ".......ODDdOOdddO.......",
      ".......ODDd..ODdO.......",
      ".......ODDd..ODdO.......",
      "......OQQQO..OQQQO......",
      "......OQWQO..OQWQO......",
      "......OOOOO..OOOOO......"
    ],
    "junior": [
      "........................",
      "........OOOOOOOO........",
      "......OOHHHHHHHHOO......",
      ".....OHHhhhhHHHHHHO.....",
      "....OHhhhhHHHHHHHHO.....",
      "....OHHHHHHHHHHHHHO.....",
      "....OHHHHSSSSSHHHHO.....",
      "....OHHSSSSSSSSSHHO.....",
      ".....OHSOOSSSSOOSHO.....",
      ".....OHsWESSSSWEsHO.....",
      ".....OHsSSSSSSSSsHO.....",
      ".....OHSSsSmmSsSSHO.....",
      ".....OHHssSSSSssHHO.....",
      ".....OHHOOOOOOOOHHO.....",
      "......OHHOSsSOHHO.......",
      "......OHHOOsOOHHO.......",
      ".......OLPOOOPpO........",
      "......OPLXPPPLXpO.......",
      ".....OPPLXPPXPpppO......",
      ".....OPPPPXWPPpppO......",
      ".....OSsPPWWPPppSSO.....",
      ".....OSsPPWWPXppSsO.....",
      "......OOPPPPPPXXOO......",
      ".......OPPPPPPOBBO......",
      ".......OOOOOOOBbbBO.....",
      ".......ODDDddOBbbBO.....",
      ".......ODDdOOOBbbBO.....",
      ".......ODDd..OOOOO......",
      ".......ODDd..ODdO.......",
      "......OQQQO..OQQQO......",
      "......OQWQO..OQWQO......",
      "......OOOOO..OOOOO......"
    ],
    "senior": [
      "........................",
      "........OOOOOOOO........",
      "......OOHHHHHHHHOO......",
      ".....OHHhhhhHHHHHHO.....",
      "....OHhhhhHHHHHHHHO.....",
      "....OHHHHHHHHHHHHHO.....",
      "....OHHHHSSSSSHHHHO.....",
      "....OHHSSSSSSSSSHHO.....",
      ".....OHSOOSSSSOOSHO.....",
      ".....OHsWESSSSWEsHO.....",
      ".....OHsttSSSSttsHO.....",
      ".....OHSSsSmmSsSSHO.....",
      ".....OHHssSSSSssHHO.....",
      ".....OHHOOOOOOOOHHO.....",
      "......OHHOSsSOHHO.......",
      "......OHHOOsOOHHO.......",
      ".......OLLSsSLLpO.......",
      "......OPPLPOPPLppO......",
      ".....OPPLXPOPXPppO......",
      ".....OPPPPXWXPPppO......",
      ".....OSsPPWWPPppSSO.....",
      ".....OSsPPWWPPppSsO.....",
      "......OOPPPPPPppOO......",
      ".......OPPPPPPppO.......",
      ".......OOOOOOOOOO.......",
      ".......ODDDddDDDO.......",
      ".......ODDdOOdddO.......",
      ".......ODDd..ODdO.......",
      ".......ODDd..ODdO.......",
      "......OQQQO..OQQQO......",
      "......OQWQO..OQWQO......",
      "......OOOOO..OOOOO......"
    ]
  }
};
const SPRITE_PALETTE = {
  "O": "#191d32",
  "H": "#493448",
  "h": "#795068",
  "S": "#f5c7a0",
  "s": "#d9957d",
  "W": "#fff5db",
  "E": "#262137",
  "m": "#a75d68",
  "t": "#bd827e",
  "P": "#58bca7",
  "p": "#31867f",
  "L": "#a2e0c3",
  "B": "#b97642",
  "b": "#805239",
  "X": "#e5b876",
  "D": "#465679",
  "d": "#303c5e",
  "Q": "#34405d"
};
const SPRITE_COLORWAYS = {
  "boy": {
    "freshman": [
      "#58bca7",
      "#31867f",
      "#a2e0c3"
    ],
    "sophomore": [
      "#df965b",
      "#b86849",
      "#ffd091"
    ],
    "junior": [
      "#6da5d7",
      "#4777ae",
      "#acd5ef"
    ],
    "senior": [
      "#aca2da",
      "#756baf",
      "#d9d1f3"
    ]
  },
  "girl": {
    "freshman": [
      "#ed9b88",
      "#b7656c",
      "#ffd0af"
    ],
    "sophomore": [
      "#aa99d5",
      "#7966a4",
      "#dacbf2"
    ],
    "junior": [
      "#69b9c7",
      "#438897",
      "#afe2e1"
    ],
    "senior": [
      "#d4b46c",
      "#a17f48",
      "#f3dfa3"
    ]
  }
};

function getSpriteLook(year) {
  return ['freshman', 'sophomore', 'junior', 'senior'][Math.max(0, Math.min(3, year - 1))];
}

function getSpriteData(character, year, tired = false) {
  const set = SPRITE_LOOKS[character] || SPRITE_LOOKS.boy;
  return set[getSpriteLook(year)]; // Senior artwork already includes the approved tired eyes.
}

const animatedSprites = new Map();
let spriteFrame = 0;
const spriteMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function drawCharacterFrame(canvas, character, year, frame) {
  const ctx = canvas.getContext('2d');
  const gender = SPRITE_LOOKS[character] ? character : 'boy';
  const rows = getSpriteData(gender, year);
  const colors = {...SPRITE_PALETTE};
  [colors.P, colors.p, colors.L] = SPRITE_COLORWAYS[gender][getSpriteLook(year)];
  if (gender === 'boy') { colors.H = '#30324a'; colors.h = '#535875'; }
  const scale = Math.max(1, Math.floor(Math.min(canvas.width / 24, canvas.height / 34)));
  const left = Math.floor((canvas.width - 24 * scale) / 2);
  const top = Math.floor((canvas.height - 34 * scale) / 2);
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#151b2d';
  ctx.fillRect(left + 6 * scale, top + 33 * scale, 12 * scale, scale);
  rows.forEach((row, y) => [...row].forEach((letter, x) => {
    if (letter === '.') return;
    ctx.fillStyle = colors[letter];
    ctx.fillRect(left + x * scale, top + (y + frame) * scale, scale, scale);
  }));
}

function renderCharacterSprite(canvas, character, year, tired = false) {
  if (!canvas) return;
  animatedSprites.set(canvas, {character, year});
  drawCharacterFrame(canvas, character, year, spriteMotion.matches ? 0 : spriteFrame);
}

// One shared timer: a one-pixel bob, with no fractional scaling or smoothing.
setInterval(() => {
  spriteFrame = spriteMotion.matches ? 0 : 1 - spriteFrame;
  for (const [canvas, sprite] of animatedSprites) {
    if (!canvas.isConnected) { animatedSprites.delete(canvas); continue; }
    if (document.hidden || canvas.closest('.hidden')) continue;
    drawCharacterFrame(canvas, sprite.character, sprite.year, spriteFrame);
  }
}, 550);

// Phase 1: original campus tiles and HUD icons. All art uses text grids.
function drawPixelGrid(ctx, rows, palette, left, top, scale = 1) {
  ctx.imageSmoothingEnabled = false;
  rows.forEach((row, y) => [...row].forEach((pixel, x) => {
    if (pixel === '.') return;
    ctx.fillStyle = palette[pixel];
    ctx.fillRect(Math.round(left) + x * scale, Math.round(top) + y * scale, scale, scale);
  }));
}

const CAMPUS_TILES = {
  cloud: [
    '.........WWWWW..........', '......WWWWWWWWWW........',
    '....WWWWWWWWWWWWWW......', '..WWWWWWWWWWWWWWWWWWWW..',
    '.WWWWWWWWWWWWWWWWWWWWWW.', '..cccccccccccccccccccc..'
  ],
  school: [
    '................RRRRRRRR................',
    '...............RRRRRRRRRR...............',
    '..............RRRRRRRRRRRR..............',
    '.............RRRRRRRRRRRRRR.............',
    '..............BBBBBBBBBBBB..............',
    '..RRRRRRRRRRRRBBBBBWWBBBBBRRRRRRRRRRRR..',
    '.RRRRRRRRRRRRRBBBBBWWBBBBBRRRRRRRRRRRRR.',
    '..BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB..',
    '..BLLLLBLLLLBBBBBBWWWWBBBBBBLLLLBLLLLB..',
    '..BLwwLBLwwLBBBBBBWDDWBBBBBBLwwLBLwwLB..',
    '..BLLLLBLLLLBBBBBBWWWWBBBBBBLLLLBLLLLB..',
    '..BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB..',
    '..bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb..',
    '..BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB..',
    '..BLLLLBLLLLBBBBBBBBBBBBBBBBLLLLBLLLLB..',
    '..BLwwLBLwwLBBBBBBBBBBBBBBBBLwwLBLwwLB..',
    '..BLLLLBLLLLBBBBBBBBBBBBBBBBLLLLBLLLLB..',
    '..BBBBBBBBBBBBBBBbbbbbbBBBBBBBBBBBBBBB..',
    '..BBBBBBBBBBBBBBBBDDDDBBBBBBBBBBBBBBBB..',
    '..BBBBBBBBBBBBBBBBDDDDBBBBBBBBBBBBBBBB..',
    '..BBBBBBBBBBBBBBBBWDDWBBBBBBBBBBBBBBBB..',
    '..BBBBBBBBBBBBBBBBDDDDBBBBBBBBBBBBBBBB..',
    '.bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.',
    'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
  ],
  tree: [
    '.......gggggg.......', '.....ggGGGGgggg.....',
    '....gGGGGGGGGggg....', '..ggGGGGGGGGGGgggg..',
    '.gGGGGGGGGGGGGGGggg.', 'ggGGGGGGGGGGGGGGgggg',
    'ggGGGGGGGGGGGGGggggg', '.ggGGGGGGGGGGgggggg.',
    '..ggggGGGGGggggggg..', '....ggggTTgggggg....',
    '........TtTT........', '........TtTT........',
    '........TtTT........', '.......TTtTTT.......'
  ],
  fence: [
    '.F......F.......', '.F......F.......',
    'FFFFFFFFFFFFFFFF', '.f......f.......',
    '.f......f.......', 'ffffffffffffffff',
    '.f......f.......', '.f......f.......'
  ],
  path: [
    'eeeeeeeeeeeeeeee', 'PPPPPPPPPPPPPPPP',
    'PPPPpPPPPPPPPPPP', 'PPPPPPPPPPPPPPPP',
    'PPPPPPPPPPPPpPPP', 'PPPPPPPPPPPPPPPP',
    'PPPPPPPPPPPPPPPP', 'PPpPPPPPPPPPPPPP',
    'PPPPPPPPPPPPPPPP', 'pppppppppppppppp'
  ],
  star: ['..W..', '..W..', 'WWWWW', '..W..', '..W..']
};

const CAMPUS_THEMES = {
  1: {name: 'Bright morning', sky: '#91cddd', horizon: '#c5e5dd', grass: '#6eae79',
    W: '#fff5db', c: '#d4e8e3', R: '#678392', B: '#e0cda7', b: '#ab9e88',
    L: '#f4e8ce', w: '#75adb7', D: '#536e80', G: '#79b96d', g: '#448a62',
    T: '#665d50', t: '#9b8461', F: '#e3dcc3', f: '#abb8a4', P: '#d8bc91', p: '#c5a57f', e: '#ecdbb5'},
  2: {name: 'Golden afternoon', sky: '#e4ba87', horizon: '#f0d5a1', grass: '#9fa567',
    W: '#fff0ca', c: '#e9c29b', R: '#817883', B: '#e8bd8c', b: '#b48e77',
    L: '#ffdbad', w: '#978f9b', D: '#645772', G: '#b2b361', g: '#788e58',
    T: '#765945', t: '#ae7e54', F: '#ebd0a0', f: '#b69b7d', P: '#d6ae80', p: '#bd926b', e: '#f3d2a0'},
  3: {name: 'Sunset', sky: '#a178aa', horizon: '#efaa91', grass: '#776c86',
    W: '#ffd6b1', c: '#d99d9e', R: '#5b567e', B: '#bf9d9a', b: '#8a788b',
    L: '#dfbec0', w: '#f4ca91', D: '#4d4568', G: '#887b96', g: '#575b77',
    T: '#4f455d', t: '#857084', F: '#c1a5af', f: '#867f9c', P: '#af8790', p: '#916e84', e: '#d4aaa0'},
  4: {name: 'Night campus', sky: '#1f294b', horizon: '#394568', grass: '#3b5862',
    W: '#fff0b5', c: '#394568', R: '#343c5b', B: '#65718a', b: '#45516f',
    L: '#b8a385', w: '#ffe39c', D: '#29354f', G: '#456b70', g: '#2b4c5b',
    T: '#283747', t: '#516171', F: '#899aab', f: '#5c718a', P: '#63718a', p: '#4e5d79', e: '#8d9bb1'}
};

const STAT_ICON_GRIDS = {
  grades: ['............', '.OOOOOOOOOO.', '.OBBBBOWWWO.', '.OBLBBOWWWO.', '.OBLBBOWWWO.', '.OBBBBOWWWO.', '.OBBBBOWWWO.', '.OBBBBOWWWO.', '.OBBBBOWWWO.', '.OOOOOOOOOO.', '..OOOOOOOO..', '............'],
  sanity: ['............', '..OOO.OOO...', '.OPPPOPPPO..', 'OPLLPPPPPsO.', 'OPLPPPPPPsO.', 'OPPPPPPPssO.', '.OPPPPPssO..', '..OPPPssO...', '...OPssO....', '....OsO.....', '.....O......', '............'],
  money: ['....OOOO....', '..OOYYYYOO..', '.OYYLLLLYYO.', '.OYL Y YLYO.'.replaceAll(' ', 'Y'), 'OYYLYLYLYYYO', 'OYYLYLYLYYYO', 'OYYYLYLYYYYO', 'OYYLYLYLYYYO', '.OYYLLLLYYO.', '.OYYYYYYYYO.', '..OOYYYYOO..', '....OOOO....'],
  friends: ['..OOO..OOO..', '.OSSSOOSSSO.', 'OSSSSSSSSSSO', 'OSOSOSOSOSSO', 'OSSSSSSSSSSO', '.OSmSOSmSSO.', '..OSO..OSO..', '.OBBBOOPPPO.', 'OBBBBOPPPPPO', 'OBBBBOPPPPPO', '.OOOO..OOOO.', '............'],
  skill: ['......OOO...', '.....OYYO...', '....OYLO....', '...OYYO.....', '..OYYOOOOO..', '.OYYYYYYYO..', '.OOOOYYYO...', '....OYYO....', '...OYYO.....', '..OYYO......', '..OYO.......', '..OO........']
};
const STAT_ICON_PALETTE = {O: '#202b43', B: '#66c2d5', L: '#fff0bd', W: '#faf0d3',
  P: '#ed8c9b', s: '#bf5e81', Y: '#eebd65', S: '#efc49c', m: '#9c5b65'};
function drawStatIcon(canvas, key) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPixelGrid(ctx, STAT_ICON_GRIDS[key], STAT_ICON_PALETTE, 0, 0, canvas.width / 12);
}

// Four distinct leg poses. The approved head, outfit, accessories and idle stay unchanged.
const WALK_LEGS = [
  ['.......ODDDddDDDO.......', '......ODDDdOOdddO.......', '.....ODDDd...OdddO......',
   '....ODDdd.....ODddO.....', '...OQQQO......OQQQO.....', '...OQWQO......OQWQO.....', '...OOOOO......OOOOO.....'],
  ['.......ODDDddDDDO.......', '.......ODDdOOdddO.......', '.......ODDd.OdddO.......',
   '.......ODDd.OdddO.......', '.......OQQO.OQQQO.......', '.......OQWO.OQWQO.......', '.......OOOO.OOOOO.......'],
  ['.......ODDDddDDDO.......', '.......ODDdOOdddO.......', '......ODDdd..OdddO......',
   '.....ODDdd....ODddO.....', '.....OQQQO.....OQQQO....', '.....OQWQO.....OQWQO....', '.....OOOOO.....OOOOO....'],
  ['.......ODDDddDDDO.......', '.......ODDdOOdddO.......', '........ODDdOdddO.......',
   '........ODDdOdddO.......', '........OQQOOQQQO.......', '........OQWOOQWQO.......', '........OOOOOOOOO.......']
];
function getWalkingSpriteData(character, year, frame) {
  const rows = [...getSpriteData(character, year)];
  const legs = WALK_LEGS[frame % 4];
  for (let y = 25; y < 32; y += 1) {
    // Retain the junior laptop bag where it overlaps the legs.
    rows[y] = [...legs[y - 25]].map((pixel, x) =>
      year === 3 && x >= 13 && y <= 27 ? rows[y][x] : pixel).join('');
  }
  return rows;
}
function drawScenePlayer(ctx, character, year, left, top, walking, frame) {
  const gender = SPRITE_LOOKS[character] ? character : 'boy';
  const colors = {...SPRITE_PALETTE};
  [colors.P, colors.p, colors.L] = SPRITE_COLORWAYS[gender][getSpriteLook(year)];
  if (gender === 'boy') { colors.H = '#30324a'; colors.h = '#535875'; }
  const rows = walking ? getWalkingSpriteData(gender, year, frame) : getSpriteData(gender, year);
  const bob = walking ? frame % 2 : frame % 2;
  ctx.fillStyle = '#283c4c';
  ctx.fillRect(left + 12, top + 65, 24, 2);
  drawPixelGrid(ctx, rows, colors, left, top + bob, 2);
}

// NPC review artwork. Not placed into gameplay until the user approves the review.
const NPC_SPRITES = {
  "teacher": {
    "label": "Teacher",
    "description": "Gray hair, glasses, mustache, tie, ID and papers.",
    "rows": [
      "........................",
      "........OOOOOOOO........",
      "......OOHHHHHHHHOO......",
      ".....OHHhhhhHHHHHHO.....",
      "....OHhhhhHHHHHHHHO.....",
      "....OHHHHHHHHHHHHHO.....",
      "....OHHHHSSSSHHHHHO.....",
      "....OHSSSSSSSSSSSHO.....",
      "....OSOOOOSOOOOSSSO.....",
      "....OsOWEOOOEWOSSsO.....",
      "....OsOOOOSOOOOSSsO.....",
      ".....OSSshhOOhhsSSO.....",
      "......OssSSSSSSssO......",
      "........OOOOOOOO........",
      "..........OOOO..........",
      ".......OOOSsSOOO........",
      ".......OLLSWWLLpO.......",
      "......OPPLPXXPLppO......",
      ".....OPPLXPXXXPppO......",
      ".....OPPPPXXXPOOOOOO....",
      ".....OSsPPWWPPOBWWBO....",
      ".....OSsPPWWPPOBWWBO....",
      "......OOPPPPPPOBbbBO....",
      ".......OPPPPPPOBWWBO....",
      ".......OOOOOOOOOOOOO....",
      ".......ODDDddDDDO.......",
      ".......ODDdOOdddO.......",
      ".......ODDd..ODdO.......",
      ".......ODDd..ODdO.......",
      "......OQQQO..OQQQO......",
      "......OQWQO..OQWQO......",
      "......OOOOO..OOOOO......"
    ],
    "palette": {
      "O": "#191d32",
      "H": "#8994a2",
      "h": "#c8ced0",
      "S": "#f5c7a0",
      "s": "#d9957d",
      "W": "#fff5db",
      "E": "#262137",
      "m": "#a75d68",
      "t": "#bd827e",
      "P": "#e6d9b6",
      "p": "#b6a789",
      "L": "#fff0cf",
      "B": "#b97642",
      "b": "#805239",
      "X": "#e5b876",
      "D": "#465679",
      "d": "#303c5e",
      "Q": "#34405d",
      "R": "#b95066",
      "r": "#ef8d89"
    }
  },
  "studious": {
    "label": "Studious friend",
    "description": "Quiet and prepared. Glasses and a book.",
    "rows": [
      "........................",
      "........OOOOOOOO........",
      "......OOHHHHHHHHOO......",
      ".....OHHhhhhHHHHHHO.....",
      "....OHhhhhHHHHHHHHO.....",
      "....OHHHHHHHHHHHHHO.....",
      "....OHHHHSSSSSHHHHO.....",
      "....OHHSSSSSSSSSHHO.....",
      ".....OOOOOSOOOOOSHO.....",
      ".....OOWEOOOEWOEsHO.....",
      ".....OOOOOSOOOOSsHO.....",
      ".....OHSSsSmmSsSSHO.....",
      ".....OHHssSSSSssHHO.....",
      ".....OHHOOOOOOOOHHO.....",
      "......OHHOSsSOHHO.......",
      "......OHHOOsOOHHO.......",
      ".......OBBOOOOBBO.......",
      ".....OBPLPPPPPLPBO......",
      ".....OBPXPPPPPXpBO......",
      ".....OOOOOOOPPXpBO......",
      ".....OOLLBOOPPppSSO.....",
      ".....OOLBBOOPPppSsO.....",
      "......OLBBOOPPppOO......",
      "......OLBBOOPPppO.......",
      "......OOOOOOOOOOO.......",
      ".......ODDDddDDDO.......",
      ".......ODDdOOdddO.......",
      ".......ODDd..ODdO.......",
      ".......ODDd..ODdO.......",
      "......OQQQO..OQQQO......",
      "......OQWQO..OQWQO......",
      "......OOOOO..OOOOO......"
    ],
    "palette": {
      "O": "#191d32",
      "H": "#684732",
      "h": "#a47b55",
      "S": "#f5c7a0",
      "s": "#d9957d",
      "W": "#fff5db",
      "E": "#262137",
      "m": "#a75d68",
      "t": "#bd827e",
      "P": "#88b698",
      "p": "#59816d",
      "L": "#c3ddac",
      "B": "#b97642",
      "b": "#805239",
      "X": "#e5b876",
      "D": "#465679",
      "d": "#303c5e",
      "Q": "#34405d",
      "R": "#b95066",
      "r": "#ef8d89"
    }
  },
  "clown": {
    "label": "Class clown",
    "description": "Red cap, striped shirt, and a big grin.",
    "rows": [
      "........................",
      "........OOOOOOOO........",
      "......ORRRRRRRRHOO......",
      ".....ORRrrrrrRRRHHO.....",
      "....ORRRRRRRRRRRRHO.....",
      "....OHHHHHHRRRRRRHO.....",
      "....OHHHHSSSSHHHHHO.....",
      "....OHSSSSSSSSSSSHO.....",
      "....OSSOOSSSSOOSSSO.....",
      "....OsSWESSSSWESSsO.....",
      "....OsSSSSSSSSSSSsO.....",
      ".....OSSsSOWWWOsSSO.....",
      "......OssSSOOOSssO......",
      "........OOOOOOOO........",
      "..........OOOO..........",
      ".......OOOSsSOOO........",
      ".......OBBOOOOBBO.......",
      ".....OBPLPPPPPLPBO......",
      ".....OBPXPPPPPXpBO......",
      ".....OBPXPPPPPXpBO......",
      ".....OSSPPPPPPppSSO.....",
      ".....OSsPPPPPPppSsO.....",
      "......OOPPPPPPppOO......",
      ".......OPPPPPPppO.......",
      ".......OOOOOOOOOO.......",
      ".......ODDDddDDDO.......",
      ".......ODDdOOdddO.......",
      ".......ODDd..ODdO.......",
      ".......ODDd..ODdO.......",
      "......OQQQO..OQQQO......",
      "......OQWQO..OQWQO......",
      "......OOOOO..OOOOO......"
    ],
    "palette": {
      "O": "#191d32",
      "H": "#a45d40",
      "h": "#d98a5d",
      "S": "#f5c7a0",
      "s": "#d9957d",
      "W": "#fff5db",
      "E": "#262137",
      "m": "#a75d68",
      "t": "#bd827e",
      "P": "#e5ad65",
      "p": "#b67b4e",
      "L": "#f9dca3",
      "B": "#b97642",
      "b": "#805239",
      "X": "#e5b876",
      "D": "#465679",
      "d": "#303c5e",
      "Q": "#34405d",
      "R": "#b95066",
      "r": "#ef8d89"
    }
  },
  "gamer": {
    "label": "Gamer friend",
    "description": "Purple hoodie, headset, and a relaxed smile.",
    "rows": [
      "........................",
      "........OOOOOOOO........",
      "......OOHHHHHHHHOO......",
      ".....OHHhhhhHHHHHHO.....",
      "....OHhhhhHHHHHHHHO.....",
      "....OHHHHHHHHHHHHHO.....",
      "....OHHHHSSSSHHHHHO.....",
      "....OHSSSSSSSSSSSHO.....",
      "....OSSOOSSSSOOSSSO.....",
      "....OsSWESSSSWESSsO.....",
      "....OsSSSSSSSSSSSsO.....",
      ".....OSSsSSmmSSsSSO.....",
      "......OssSSSSSSssO......",
      "........OOOOOOOO........",
      "..........OOOO..........",
      "......EEOOSsSOEE........",
      "......EELPOOOLEE........",
      "......EEOOOOOOEEO.......",
      ".....OPPLWPPWPPppO......",
      ".....OPPLWPPWPPppO......",
      ".....OPpPPPPPPPppO......",
      ".....OSsPPPppPPPSSO.....",
      ".....OSsPpLLLLpPSsO.....",
      "......OOPppppppOO.......",
      ".......OOOOOOOOOO.......",
      ".......ODDDddDDDO.......",
      ".......ODDdOOdddO.......",
      ".......ODDd..ODdO.......",
      ".......ODDd..ODdO.......",
      "......OQQQO..OQQQO......",
      "......OQWQO..OQWQO......",
      "......OOOOO..OOOOO......"
    ],
    "palette": {
      "O": "#191d32",
      "H": "#302b46",
      "h": "#635773",
      "S": "#c68c68",
      "s": "#996b52",
      "W": "#fff5db",
      "E": "#262137",
      "m": "#a75d68",
      "t": "#bd827e",
      "P": "#a895d0",
      "p": "#766b9f",
      "L": "#d8c6eb",
      "B": "#b97642",
      "b": "#805239",
      "X": "#e5b876",
      "D": "#465679",
      "d": "#303c5e",
      "Q": "#34405d",
      "R": "#b95066",
      "r": "#ef8d89"
    }
  },
  "officer": {
    "label": "Org officer",
    "description": "Organized and upbeat. Lanyard and clipboard.",
    "rows": [
      "........................",
      "........OOOOOOOO........",
      "......OOHHHHHHHHOO......",
      ".....OHHhhhhHHHHHHO.....",
      "....OHhhhhHHHHHHHHO.....",
      "....OHHHHHHHHHHHHHO.....",
      "....OHHHHSSSSSHHHHO.....",
      "....OHHSSSSSSSSSHHO.....",
      ".....OHSOOSSSSOOSHO.....",
      ".....OHsWESSSSWEsHO.....",
      ".....OHsSSSSSSSSsHO.....",
      ".....OHSSsSmmSsSSHO.....",
      ".....OHHssSSSSssHHO.....",
      ".....OHHOOOOOOOOHHO.....",
      "......OHHOSsSOHHO.......",
      "......OHHOOsOOHHO.......",
      ".......OLPOOOPpO........",
      "......OPLXPPPLXpO.......",
      ".....OPPLXPPXPpppO......",
      ".....OPPPPXWPPOOOOOO....",
      ".....OSsPPWWPPOBWWBO....",
      ".....OSsPPWWPXOBWWBO....",
      "......OOPPPPPPOBbbBO....",
      ".......OPPPPPPOBWWBO....",
      ".......OOOOOOOOOOOOO....",
      ".......ODDDddOBbbBO.....",
      ".......ODDdOOOBbbBO.....",
      ".......ODDd..OOOOO......",
      ".......ODDd..ODdO.......",
      "......OQQQO..OQQQO......",
      "......OQWQO..OQWQO......",
      "......OOOOO..OOOOO......"
    ],
    "palette": {
      "O": "#191d32",
      "H": "#302e3b",
      "h": "#5b5467",
      "S": "#d9a780",
      "s": "#b98069",
      "W": "#fff5db",
      "E": "#262137",
      "m": "#a75d68",
      "t": "#bd827e",
      "P": "#81b7c4",
      "p": "#548c9e",
      "L": "#bae0df",
      "B": "#b97642",
      "b": "#805239",
      "X": "#e5b876",
      "D": "#465679",
      "d": "#303c5e",
      "Q": "#34405d",
      "R": "#b95066",
      "r": "#ef8d89"
    }
  },
  "ghost": {
    "label": "Groupmate ghost",
    "description": "The class clown disappearing when work arrives.",
    "rows": [
      "........................",
      "........OOOOOOOO........",
      "......ORRRRRRRRHOO......",
      ".....ORRrrrrrRRRHHO.....",
      "....ORRRRRRRRRRRRHO.....",
      "....OHHHHHHRRRRRRHO.....",
      "....OHHHHSSSSHHHHHO.....",
      "....OHSSSSSSSSSSSHO.....",
      "....OSSOOSSSSOOSSSO.....",
      "....OsSWESSSSWESSsO.....",
      "....OsSSSSSSSSSSSsO.....",
      ".....OSSsSOWWWOsSSO.....",
      "......OssSSOOOSssO......",
      "........OOOOOOOO........",
      "..........OOOO..........",
      ".......OOOSsSOOO........",
      ".......OBBOOOOBBO.......",
      ".....OBPLPPPPPLPBO......",
      ".....OBPXPPPPPXpBO......",
      ".....OBPXPPPPPXpBO......",
      ".....OSSPPPPPPppSSO.....",
      ".....OSsPPPPPPppSsO.....",
      "......OOPPPPPPppOO......",
      ".......OPPPPPPppO.......",
      ".......OOOOOOOOOO.......",
      ".......ODDDddDDDO.......",
      ".......ODDdOOdddO.......",
      ".......ODDd..ODdO.......",
      ".......ODDd..ODdO.......",
      "......OQQQO..OQQQO......",
      "......OQWQO..OQWQO......",
      "......OOOOO..OOOOO......"
    ],
    "palette": {
      "O": "#191d32",
      "H": "#a9b6b8",
      "h": "#d6e0d9",
      "S": "#d6e1d9",
      "s": "#abc4c2",
      "W": "#fff5db",
      "E": "#262137",
      "m": "#a75d68",
      "t": "#bd827e",
      "P": "#afc8c8",
      "p": "#839fa7",
      "L": "#e5eded",
      "B": "#b97642",
      "b": "#805239",
      "X": "#e5b876",
      "D": "#465679",
      "d": "#303c5e",
      "Q": "#34405d",
      "R": "#b95066",
      "r": "#ef8d89"
    }
  },
  "client": {
    "label": "Client",
    "description": "Business jacket, collared shirt, laptop bag.",
    "rows": [
      "........................",
      "........OOOOOOOO........",
      "......OOHHHHHHHHOO......",
      ".....OHHhhhhHHHHHHO.....",
      "....OHhhhhHHHHHHHHO.....",
      "....OHHHHHHHHHHHHHO.....",
      "....OHHHHSSSSSHHHHO.....",
      "....OHHSSSSSSSSSHHO.....",
      ".....OHSOOSSSSOOSHO.....",
      ".....OHsWESSSSWEsHO.....",
      ".....OHsSSSSSSSSsHO.....",
      ".....OHSSsSmmSsSSHO.....",
      ".....OHHssSSSSssHHO.....",
      ".....OHHOOOOOOOOHHO.....",
      "......OHHOSsSOHHO.......",
      "......OHHOOsOOHHO.......",
      ".......OLPOWWPpO........",
      "......OPLXPXXLXpO.......",
      ".....OPPLXPXXPpppO......",
      ".....OPPPPXXXPpppO......",
      ".....OSsPPWWPPppSSO.....",
      ".....OSsPPWWPXppSsO.....",
      "......OOPPPPPPXXOO......",
      ".......OPPPPPPOBBO......",
      ".......OOOOOOOBbbBO.....",
      ".......ODDDddOBbbBO.....",
      ".......ODDdOOOBbbBO.....",
      ".......ODDd..OOOOO......",
      ".......ODDd..ODdO.......",
      "......OQQQO..OQQQO......",
      "......OQWQO..OQWQO......",
      "......OOOOO..OOOOO......"
    ],
    "palette": {
      "O": "#191d32",
      "H": "#4d323b",
      "h": "#795360",
      "S": "#f5c7a0",
      "s": "#d9957d",
      "W": "#fff5db",
      "E": "#262137",
      "m": "#a75d68",
      "t": "#bd827e",
      "P": "#65748c",
      "p": "#414d65",
      "L": "#e8d8bd",
      "B": "#b97642",
      "b": "#805239",
      "X": "#e5b876",
      "D": "#465679",
      "d": "#303c5e",
      "Q": "#34405d",
      "R": "#b95066",
      "r": "#ef8d89"
    }
  },
  "panel1": {
    "label": "Panel chair",
    "description": "Calm chairperson with silver hair and glasses.",
    "rows": [
      "........................",
      "........OOOOOOOO........",
      "......OOHHHHHHHHOO......",
      ".....OHHhhhhHHHHHHO.....",
      "....OHhhhhHHHHHHHHO.....",
      "....OHHHHHHHHHHHHHO.....",
      "....OHHHHSSSSHHHHHO.....",
      "....OHSSSSSSSSSSSHO.....",
      "....OSOOOOSOOOOSSSO.....",
      "....OsOWEOOOEWOSSsO.....",
      "....OsOOOOSOOOOSSsO.....",
      ".....OSSsSSmmSSsSSO.....",
      "......OssSSSSSSssO......",
      "........OOOOOOOO........",
      "..........OOOO..........",
      ".......OOOSsSOOO........",
      ".......OLLSWWLLpO.......",
      "......OPPLPXXPLppO......",
      ".....OPPLXPXXXPppO......",
      ".....OPPPPXXXPPppO......",
      ".....OSsPPWWPPppSSO.....",
      ".....OSsPPWWPPppSsO.....",
      "......OOPPPPPPppOO......",
      ".......OPPPPPPppO.......",
      ".......OOOOOOOOOO.......",
      ".......ODDDddDDDO.......",
      ".......ODDdOOdddO.......",
      ".......ODDd..ODdO.......",
      ".......ODDd..ODdO.......",
      "......OQQQO..OQQQO......",
      "......OQWQO..OQWQO......",
      "......OOOOO..OOOOO......"
    ],
    "palette": {
      "O": "#191d32",
      "H": "#a6a5a4",
      "h": "#dfd8cc",
      "S": "#f5c7a0",
      "s": "#d9957d",
      "W": "#fff5db",
      "E": "#262137",
      "m": "#a75d68",
      "t": "#bd827e",
      "P": "#8c8baf",
      "p": "#686787",
      "L": "#d1c3e2",
      "B": "#b97642",
      "b": "#805239",
      "X": "#e5b876",
      "D": "#465679",
      "d": "#303c5e",
      "Q": "#34405d",
      "R": "#b95066",
      "r": "#ef8d89"
    }
  },
  "panel2": {
    "label": "Panel reviewer",
    "description": "Warm expression, brown hair, green jacket.",
    "rows": [
      "........................",
      "........OOOOOOOO........",
      "......OOHHHHHHHHOO......",
      ".....OHHhhhhHHHHHHO.....",
      "....OHhhhhHHHHHHHHO.....",
      "....OHHHHHHHHHHHHHO.....",
      "....OHHHHSSSSSHHHHO.....",
      "....OHHSSSSSSSSSHHO.....",
      ".....OHSOOSSSSOOSHO.....",
      ".....OHsWESSSSWEsHO.....",
      ".....OHsttSSSSttsHO.....",
      ".....OHSSsSmmSsSSHO.....",
      ".....OHHssSSSSssHHO.....",
      ".....OHHOOOOOOOOHHO.....",
      "......OHHOSsSOHHO.......",
      "......OHHOOsOOHHO.......",
      ".......OLLSWWLLpO.......",
      "......OPPLPXXPLppO......",
      ".....OPPLXPXXXPppO......",
      ".....OPPPPXXXPPppO......",
      ".....OSsPPWWPPppSSO.....",
      ".....OSsPPWWPPppSsO.....",
      "......OOPPPPPPppOO......",
      ".......OPPPPPPppO.......",
      ".......OOOOOOOOOO.......",
      ".......ODDDddDDDO.......",
      ".......ODDdOOdddO.......",
      ".......ODDd..ODdO.......",
      ".......ODDd..ODdO.......",
      "......OQQQO..OQQQO......",
      "......OQWQO..OQWQO......",
      "......OOOOO..OOOOO......"
    ],
    "palette": {
      "O": "#191d32",
      "H": "#75503b",
      "h": "#a87d55",
      "S": "#f5c7a0",
      "s": "#d9957d",
      "W": "#fff5db",
      "E": "#262137",
      "m": "#a75d68",
      "t": "#bd827e",
      "P": "#91a892",
      "p": "#61796e",
      "L": "#ccd5b1",
      "B": "#b97642",
      "b": "#805239",
      "X": "#e5b876",
      "D": "#465679",
      "d": "#303c5e",
      "Q": "#34405d",
      "R": "#b95066",
      "r": "#ef8d89"
    }
  },
  "panel3": {
    "label": "Panel reviewer",
    "description": "Curly dark hair and a peach collared shirt.",
    "rows": [
      "........................",
      "........OOOOOOOO........",
      "......OOHHHHHHHHOO......",
      ".....OHHhhhhHHHHHHO.....",
      "....OHhhhhHHHHHHHHO.....",
      "....OHHHHHHHHHHHHHO.....",
      "....OHHHHSSSSHHHHHO.....",
      "....OHSSSSSSSSSSSHO.....",
      "....OSOOOOSOOOOSSSO.....",
      "....OsOWEOOOEWOSSsO.....",
      "....OsOOOOSOOOOSSsO.....",
      ".....OSSsSSmmSSsSSO.....",
      "......OssSSSSSSssO......",
      "........OOOOOOOO........",
      "..........OOOO..........",
      ".......OOOSsSOOO........",
      ".......OLLSsSLLpO.......",
      "......OPPLPOPPLppO......",
      ".....OPPLXPOPXPppO......",
      ".....OPPPPXWXPPppO......",
      ".....OSsPPWWPPppSSO.....",
      ".....OSsPPWWPPppSsO.....",
      "......OOPPPPPPppOO......",
      ".......OPPPPPPppO.......",
      ".......OOOOOOOOOO.......",
      ".......ODDDddDDDO.......",
      ".......ODDdOOdddO.......",
      ".......ODDd..ODdO.......",
      ".......ODDd..ODdO.......",
      "......OQQQO..OQQQO......",
      "......OQWQO..OQWQO......",
      "......OOOOO..OOOOO......"
    ],
    "palette": {
      "O": "#191d32",
      "H": "#393443",
      "h": "#685466",
      "S": "#b97e5e",
      "s": "#916048",
      "W": "#fff5db",
      "E": "#262137",
      "m": "#a75d68",
      "t": "#bd827e",
      "P": "#dea294",
      "p": "#b57a77",
      "L": "#f7ceb1",
      "B": "#b97642",
      "b": "#805239",
      "X": "#e5b876",
      "D": "#465679",
      "d": "#303c5e",
      "Q": "#34405d",
      "R": "#b95066",
      "r": "#ef8d89"
    }
  }
};
function drawNPC(ctx, id, left, top, scale = 2, frame = 0, walking = false) {
  const npc = NPC_SPRITES[id];
  if (!npc) return;
  const rows = walking ? [...npc.rows.slice(0,25), ...WALK_LEGS[frame % 4]] : npc.rows;
  ctx.save();
  if (id === 'ghost') ctx.globalAlpha = 0.2 + (1 - frame / 4) * 0.45;
  drawPixelGrid(ctx, rows, npc.palette, left, top + (frame % 2) * scale, scale);
  ctx.restore();
}

// Original room furniture and courtyard props, drawn with the same grid renderer.
const PROP_PALETTE = {O:'#514a5d',W:'#fff2d2',B:'#7cb6b9',b:'#55878f',T:'#b78469',t:'#815f59',G:'#71a679',g:'#4e806a',P:'#e99a9c',Y:'#edc477',L:'#c5dac0',D:'#36556b',C:'#97ddd9'};
const PROP_TILES = {
  desk:['................','..TTTTTTTTTTTT..','.TTTTTTTTTTTTTT.','.tttttttttttttt.','..t..........t..','..t..........t..','..t..........t..','..t..........t..'],
  chair:['.OOOOOO.','.OBBBBO.','.OBBBBO.','.OBBBBO.','.OOOOOO.','.T....T.','TTTTTTTT','.t....t.','.t....t.'],
  computer:['OOOOOOOOOOOO','OCCCCCCCCCCO','OCDDDDDDDCCO','OCCCCCCCCCCO','OCDDDDDCCCCO','OCCCCCCCCCCO','OOOOOOOOOOOO','.....OO.....','...OOOOOO...'],
  board:['TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT','TGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGT','TGWWWWWWWWGGWWWWWGGGGGGGGGGGGGGT','TGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGT','TGWWWGGGWWWWWWGGGWWWWWGGGGGGGGGGT','TGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGT','TGWWWGGGWWWWWGGGGGGGGGGGGGGGGGGT','TGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGT','TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT','tttttttttttttttttttttttttttttttt'],
  plant:['.....GG.....','..GG.Gg.GG..','.GGGGGgGGGG.','..ggGGgGgg..','.....gg.....','...TTTTTT...','...TPPPTT...','....TTTT....'],
  shelf:['TTTTTTTTTTTT','TBWYPBWYWWBT','TBWYPBWYWWBT','TTTTTTTTTTTT','TYBWBWYBPWYT','TYBWBWYBPWYT','TTTTTTTTTTTT','T..........T'],
  clock:['..OOOO..','.OWWWWO.','OWWWOWWO','OWWWOWWO','OWWWOOWO','OWWWWWWO','.OWWWWO.','..OOOO..'],
  coffee:['.WWWWWW..','.WTTTTWOW','.WTTTTWOW','.WTTTTWW.','..WWWW...','WWWWWWWW.'],
  router:['.O......O.','.O......O.','OOOOOOOOOO','OBBBBBBBBO','OBYBYBWBBO','OOOOOOOOOO'],
  note:['YYYYYY','YOOYYY','YOOOOY','YOOYYY','YYYYYY'],
  bench:['TTTTTTTTTTTTTTTT','tTTTTTTTTTTTTTTt','t..............t','TTTTTTTTTTTTTTTT','tttttttttttttttt','.t............t.','.t............t.'],
  flowers:['..P...Y....P....','.PPP.YYY..PPP...','..G...G....G....','gGGggGGGggGGgggg'],
  bin:['.OOOOOO.','OBBBBBBO','OBBOBBBO','OBBOBBBO','OBBOBBBO','OBBBBBBO','.OOOOOO.'],
  lamp:['..YYYY..','.OYYYYO.','..OOOO..','...TT...','...TT...','...TT...','...TT...','...TT...','...TT...','..TTTT..'],
  wifi:['..OOOOOOO..','.O.......O.','...OOOOO...','..O.....O..','.....O.....','....OOO....','.....O.....'],
  sweat:['..C..','.CCC.','CCCCC','.CCC.'],
  heart:['.PP.PP.','PPPPPPP','.PPPPP.','..PPP..','...P...']
};
function drawProp(ctx, name, x, y, scale = 2) {
  drawPixelGrid(ctx, PROP_TILES[name], PROP_PALETTE, x, y, scale);
}
