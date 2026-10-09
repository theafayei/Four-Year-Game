// Scene engine: the wide animated world that sits above the dialog, plus the title, character and ending stages.
// Art lives in scenery.js (toolkit) and settings.js (places). Characters come from sprites.js.

const smooth = value => { const v = Math.max(0, Math.min(1, value)); return v * v * (3 - 2 * v); };

// ---------- baked character frames ----------
function playerFrame(gender, year, pose) {   // pose: -1 = standing, 0..3 = walking
  return bake(`player:${gender}:${year}:${pose}`, 24, 32, ctx => {
    const g = SPRITE_LOOKS[gender] ? gender : 'boy';
    const colors = {...SPRITE_PALETTE};
    [colors.P, colors.p, colors.L] = SPRITE_COLORWAYS[g][getSpriteLook(year)];
    if (g === 'boy') { colors.H = '#30324a'; colors.h = '#535875'; }
    grid(ctx, pose >= 0 ? getWalkingSpriteData(g, year, pose) : getSpriteData(g, year), colors, 0, 0);
  });
}
function npcFrame(id, pose) {
  return bake(`npc:${id}:${pose}`, 24, 32, ctx => {
    const npc = NPC_SPRITES[id];
    if (!npc) return;
    grid(ctx, pose >= 0 ? [...npc.rows.slice(0, 25), ...WALK_LEGS[pose % 4]] : npc.rows, npc.palette, 0, 0);
  });
}
function drawActor(ctx, sprite, x, feetY, lift = 0) {
  ctx.globalAlpha *= 0.28;
  rect(ctx, '#1d1830', x + 5, feetY + 1, 14, 2); rect(ctx, '#1d1830', x + 3, feetY + 2, 18, 1);
  ctx.globalAlpha /= 0.28;
  ctx.drawImage(sprite, Math.round(x), Math.round(feetY - 31 - lift));
}
function drawEmote(ctx, name, actorX, actorTopY, age) {
  const bubble = emoteCanvas(name);
  const pop = age < 0.18 ? Math.round((1 - age / 0.18) * 5) : 0;
  const bob = Math.round(Math.sin(age * 4) * 1);
  ctx.drawImage(bubble, Math.round(actorX + 12 - bubble.width / 2), Math.round(actorTopY - bubble.height - 1 + pop + bob));
}

// Pick a whole-number zoom so the canvas is crisp and the dialog below still gets room.
function fitCanvas(canvas, host, maxHeight, minWidth = 190) {
  canvas.style.width = '1px';   // measure the space the layout gives us, not the size we set last time
  const availW = Math.max(1, host.clientWidth || 960);
  let scale = Math.floor(maxHeight / SCENE_H);
  scale = Math.max(1, Math.min(8, scale, Math.floor(availW / minWidth) || 1));
  const w = Math.floor(availW / scale);
  canvas.width = w * scale; canvas.height = SCENE_H * scale;
  canvas.style.width = canvas.width + 'px'; canvas.style.height = canvas.height + 'px';
  return {scale, w};
}

// ================= the game world =================
class WorldScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.host = document.getElementById('sceneViewport');
    this.scene = {room: 'courtyard', npcs: [], variant: ''};
    this.pending = null; this.from = null; this.to = null;
    this.npcEntrance = 1;
    this.mode = 'idle';           // idle | walking | entering
    this.clock = 0; this.sceneTime = 0; this.travelTime = 0; this.travelLength = 3.1;
    this.scroll = 0; this.cam = 0;
    this.onArrival = null;
    this.reaction = null; this.hop = 0; this.shake = 0;
    this.lastTime = null; this.lastStepFrame = -1;
    this.scale = 3; this.w = 320; this.compact = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    document.addEventListener('visibilitychange', () => { this.lastTime = null; });
    // Clicking the scene skips the walk, for players who are in a hurry.
    this.canvas.addEventListener('click', () => { if (this.mode === 'walking') this.travelTime = this.travelLength; });
    requestAnimationFrame(time => this.frame(time));
  }
  resize() {
    const top = this.host.getBoundingClientRect().top + window.scrollY;
    // Terminal bosses need a taller dialog, so the scene shrinks a little while they run.
    const reserve = this.compact ? 430 : (window.innerWidth >= 900 ? 270 : 250);
    const room = window.innerHeight - Math.max(0, top) - reserve;
    const {scale, w} = fitCanvas(this.canvas, this.host, Math.max(SCENE_H * 2, Math.min(room, window.innerHeight * 0.58)));
    this.scale = scale; this.w = w;
    this.draw();
  }
  setCompact(flag) { if (flag !== this.compact) { this.compact = flag; this.resize(); } }
  // ----- story hooks used by main.js -----
  configure(item) { this.pending = getEventScene(item); this.label(this.pending); }
  show(item) {   // jump straight to a scene (used when resuming a saved game)
    this.pending = null; this.scene = getEventScene(item);
    this.mode = 'idle'; this.npcEntrance = 1; this.onArrival = null; this.sceneTime = 0;
    this.label(this.scene);
  }
  label(scene) {
    // Only outdoor scenes show the time of day; rooms have their own lighting.
    const outdoor = SETTINGS[scene.room].kind === 'outdoor';
    document.getElementById('sceneYearLabel').textContent = SETTINGS[scene.room].label + (outdoor ? ' · ' + timeFor(this.timeKey(scene)).name : '');
  }
  travel(onArrival) {
    this.onArrival = onArrival;
    this.from = this.scene; this.to = this.pending || this.scene;
    this.travelTime = 0; this.scroll = 0; this.mode = 'walking'; this.reaction = null;
    document.getElementById('sceneStatus').textContent = 'Walking…';
  }
  cancel() {   // stop any walk and settle into the destination
    if (this.mode === 'walking' || this.mode === 'entering') { this.scene = this.to || this.scene; if (this.pending) this.scene = this.pending; }
    if (this.mode === 'walking' && this.isContinuous()) this.cam -= this.w;
    this.mode = 'idle'; this.onArrival = null; this.npcEntrance = 1;
  }
  reset() {   // a new game starts at the campus gate
    this.scene = {room: 'courtyard', npcs: [], variant: ''};
    this.pending = this.from = this.to = null; this.mode = 'idle'; this.onArrival = null;
    this.npcEntrance = 1; this.cam = 0; this.reaction = null;
  }
  react(kind) {   // a little emote and hop/shake after the player chooses
    const pool = kind === 'happy' ? ['heart', 'sparkle', 'note'] : ['sweat', 'anger', 'dots'];
    this.reaction = {name: pool[Math.floor(Math.random() * pool.length)], age: 0};
    if (kind === 'happy') this.hop = 0.01; else this.shake = 0.01;
  }
  timeKey(scene) { return scene.summer ? 'noon' : (GAME_STATE.player.year || 1); }
  isContinuous() { return this.from && this.to && this.from.room === this.to.room && SETTINGS[this.from.room].kind === 'outdoor'; }
  // ----- animation -----
  update(dt) {
    this.clock += dt; this.sceneTime += dt;
    if (this.reaction) { this.reaction.age += dt; if (this.reaction.age > 2.6) this.reaction = null; }
    if (this.hop) this.hop = this.hop + dt > 0.5 ? 0 : this.hop + dt;
    if (this.shake) this.shake = this.shake + dt > 0.45 ? 0 : this.shake + dt;
    if (this.mode === 'walking') {
      this.travelTime += dt;
      const duration = spriteMotion.matches ? 0.1 : this.travelLength;
      const progress = Math.min(1, this.travelTime / duration);
      this.scroll = Math.round(this.w * smooth(progress));
      if (progress >= 1) {
        if (this.isContinuous()) this.cam -= this.w;
        this.scene = this.to; this.pending = null; this.mode = 'entering'; this.sceneTime = 0;
        this.npcEntrance = spriteMotion.matches ? 1 : 0;
        document.getElementById('sceneStatus').textContent = 'Arrived';
      } else {
        const frame = Math.floor(this.scroll / 12) % 4;
        if (frame !== this.lastStepFrame && frame % 2 === 0 && typeof soundEngine !== 'undefined') soundEngine.step();
        this.lastStepFrame = frame;
      }
    }
    if (this.mode === 'entering') {
      this.npcEntrance = Math.min(1, this.npcEntrance + dt / 0.8);
      if (this.npcEntrance >= 1) {
        this.mode = 'idle';
        const callback = this.onArrival; this.onArrival = null;
        if (callback) callback();
      }
    }
  }
  frame(time) {
    const dt = this.lastTime === null ? 0 : Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;
    if (!document.hidden && GAME_STATE.screen === 'game') { this.update(dt); this.draw(); }
    requestAnimationFrame(next => this.frame(next));
  }
  // ----- drawing -----
  env(scene, ox, px) {
    const tk = this.timeKey(scene);
    return {w: this.w, ox, px: px ?? ox + this.cam, tk, T: timeFor(tk), t: this.clock, variant: scene.variant || ''};
  }
  drawPanelBack(scene, ox, clip) {
    const ctx = this.ctx, env = this.env(scene, ox), setting = SETTINGS[scene.room];
    ctx.save();
    if (clip) { ctx.beginPath(); ctx.rect(ox, 0, this.w, SCENE_H); ctx.clip(); }
    if (setting.kind === 'outdoor') { drawCourtyardBackdrop(ctx, env); drawCourtyardProps(ctx, env); }
    else { blit(ctx, bakeRoom(scene.room, env, false), ox, 0); ctx.translate(ox, 0); animateRoom(ctx, scene.room, env); }
    ctx.restore();
  }
  drawPanelFront(scene, ox) {
    const setting = SETTINGS[scene.room];
    if (setting.kind === 'outdoor') return;
    const env = this.env(scene, ox);
    if (scene.room === 'panel') blit(this.ctx, bakeRoom(scene.room, env, true), ox, 0);
  }
  tint(scene, ox) {
    const T = timeFor(this.timeKey(scene));
    if (T.tint && SETTINGS[scene.room].kind === 'outdoor') {
      this.ctx.globalAlpha = T.tint[1]; rect(this.ctx, T.tint[0], Math.max(0, ox), 0, this.w, SCENE_H); this.ctx.globalAlpha = 1;
    }
  }
  playerX(scene) { return Math.round(this.w * (scene.room === 'panel' ? 0.12 : 0.2)); }
  npcTargets(scene) {
    const n = scene.npcs.length, w = this.w;
    if (scene.room === 'panel') {
      const tx = Math.round(w * 0.36), panelCount = scene.npcs.filter(id => id.startsWith('panel')).length;
      let slot = 0;
      return scene.npcs.map(id => id.startsWith('panel') ? tx + 12 + (slot++) * Math.round(Math.min(34, (w - tx - 50) / Math.max(1, panelCount - 1))) : tx - 30);
    }
    if (n <= 1) return [Math.round(w * 0.58)];
    const start = Math.round(w * 0.42), end = w - 40;
    return scene.npcs.map((_, i) => Math.round(start + (end - start) * i / (n - 1)));
  }
  drawCast(scene, playerPose) {
    const ctx = this.ctx, year = GAME_STATE.player.year, gender = GAME_STATE.player.gender;
    const px = this.playerX(scene), idle = Math.floor(this.clock / 0.55) % 2;
    if (this.mode !== 'walking') {
      const targets = this.npcTargets(scene);
      scene.npcs.forEach((id, i) => {
        const target = targets[i], seated = scene.room === 'panel';
        const x = seated ? target : Math.round(target + (this.w - target) * (1 - smooth(this.npcEntrance)));
        const walking = !seated && this.mode === 'entering';
        let sprite = id, alpha = seated ? smooth(this.npcEntrance) : 1;
        if (scene.ghost) { if (this.sceneTime > 0.8) sprite = 'ghost'; if (this.mode === 'idle') alpha = Math.max(0, 1 - this.sceneTime / 2.5); }
        ctx.globalAlpha = alpha;
        const pose = walking ? Math.floor(this.clock * 7) % 4 : -1;
        drawActor(ctx, npcFrame(sprite, pose), x, FEET_Y, pose < 0 ? (Math.floor(this.clock / 0.6 + i) % 2) : (pose % 2));
        ctx.globalAlpha = 1;
      });
    }
    const lift = this.hop ? Math.round(Math.sin(this.hop / 0.5 * Math.PI) * 7) : 0;
    const dx = this.shake ? Math.round(Math.sin(this.shake * 50) * 1.5) : 0;
    const pose = playerPose >= 0 ? playerPose : -1;
    drawActor(ctx, playerFrame(gender, year, pose), px + dx, FEET_Y, lift + (pose < 0 ? idle : pose % 2));
    // emote above the head
    if (this.mode === 'idle' || this.mode === 'entering') {
      const name = this.reaction ? this.reaction.name : scene.emote;
      if (name) drawEmote(ctx, name, px + dx, FEET_Y - 31 - lift - idle, this.reaction ? this.reaction.age : Math.max(0, this.sceneTime - 0.4));
    }
  }
  draw() {
    const ctx = this.ctx, w = this.w;
    ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.globalAlpha = 1;
    if (this.mode === 'walking' && this.from && this.to) {
      const s = this.scroll, from = this.from, to = this.to;
      const walkFrame = Math.floor(s / 12) % 4;
      if (this.isContinuous()) {
        // one shared backdrop; both sets of props slide past
        const env = this.env(from, -s, -s + this.cam);
        drawCourtyardBackdrop(ctx, env);
        drawCourtyardProps(ctx, this.env(from, -s, -s + this.cam));
        drawCourtyardProps(ctx, this.env(to, w - s, -s + this.cam));
        this.tint(from, 0);
      } else {
        this.drawPanelBack(from, -s, true); this.tint(from, -s);
        this.drawPanelBack(to, w - s, true); this.tint(to, w - s);
        if (s > 0 && s < w) {   // a door frame marks the change of place
          const x = w - s;
          rect(ctx, '#3a2f44', x - 4, 0, 4, SCENE_H); rect(ctx, '#6a5a78', x - 4, 0, 1, SCENE_H); rect(ctx, '#2a2234', x, 0, 1, SCENE_H);
        }
      }
      this.drawCast(from, walkFrame);
      this.drawPanelFront(from, -s); this.drawPanelFront(to, w - s);
      this.canvas.setAttribute('aria-label', GAME_STATE.player.name + ' walking to ' + SETTINGS[to.room].label);
      return;
    }
    this.drawPanelBack(this.scene, 0, false);
    this.tint(this.scene, 0);
    this.drawCast(this.scene, -1);
    this.drawPanelFront(this.scene, 0);
    const names = (this.scene.npcs || []).map(id => NPC_SPRITES[id].label).join(', ');
    this.canvas.setAttribute('aria-label', SETTINGS[this.scene.room].label + ': ' + GAME_STATE.player.name + (names ? ' with ' + names : ''));
  }
}

// ================= decorative stages (title, character screen, ending) =================
class StageScene {
  constructor(canvas, host, options) {
    this.canvas = canvas; this.host = host; this.ctx = canvas.getContext('2d');
    this.options = options; this.clock = 0; this.cam = 0; this.running = false; this.lastTime = null;
    this.hop = {}; this.fx = [];
    this.fit();
    window.addEventListener('resize', () => this.fit());
  }
  fit() {
    const {scale, w} = fitCanvas(this.canvas, this.host, this.options.maxHeight());
    this.scale = scale; this.w = w; this.draw();
  }
  start() { if (this.running) return; this.running = true; this.lastTime = null; this.fit(); requestAnimationFrame(t => this.loop(t)); }
  stop() { this.running = false; }
  loop(time) {
    if (!this.running) return;
    const dt = this.lastTime === null ? 0 : Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;
    if (!document.hidden) { this.clock += dt; this.options.update?.(this, dt); this.draw(); }
    requestAnimationFrame(next => this.loop(next));
  }
  // helpers the option callbacks use
  env(tk, variant = '') { return {w: this.w, ox: 0, px: this.cam, tk, T: timeFor(tk), t: this.clock, variant}; }
  backdrop(tk) {
    const env = this.env(tk), ctx = this.ctx;
    drawCourtyardBackdrop(ctx, env); drawCourtyardProps(ctx, env);
    const T = env.T;
    if (T.tint) { ctx.globalAlpha = T.tint[1]; rect(ctx, T.tint[0], 0, 0, this.w, SCENE_H); ctx.globalAlpha = 1; }
  }
  draw() {
    const ctx = this.ctx;
    ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
    ctx.imageSmoothingEnabled = false; ctx.globalAlpha = 1;
    this.options.draw(this, ctx);
  }
  poke(name = 'player') { this.hop[name] = 0.01; }   // make a character hop
  lift(name, dt) {
    if (!this.hop[name]) return 0;
    return Math.round(Math.sin(Math.min(this.hop[name], 0.5) / 0.5 * Math.PI) * 7);
  }
  tickHops(dt) { Object.keys(this.hop).forEach(k => { this.hop[k] += dt; if (this.hop[k] > 0.5) delete this.hop[k]; }); }
}

// ----- title screen: two students and a cat walk through four school years -----
function createTitleStage(canvas, host, onPhase) {
  const PHASE = 10;
  const boyEmotes = ['nowifi', 'coffee', 'code', 'sweat'], girlEmotes = ['heart', 'note', 'bulb', 'star'];
  let lastPhase = -1;
  return new StageScene(canvas, host, {
    maxHeight: () => Math.max(SCENE_H * 3, Math.min(window.innerHeight * 0.56, 620)),
    update(stage, dt) {
      stage.tickHops(dt);
      const u = stage.clock % (PHASE * 4), phase = Math.floor(u / PHASE), local = u - phase * PHASE;
      stage.walking = local < 3.4 || local > 7.6;
      stage.phase = phase; stage.local = local;
      if (stage.walking) stage.cam -= dt * 24 * (local < 0.8 ? local / 0.8 : local > 9.2 ? (PHASE - local) / 0.8 : 1);
      if (phase !== lastPhase) { lastPhase = phase; onPhase?.(phase); }
      if (Math.abs(local - 3.9) < dt) stage.poke('boy');
      if (Math.abs(local - 5.6) < dt) stage.poke('girl');
    },
    draw(stage, ctx) {
      const phase = stage.phase || 0, local = stage.local || 0, year = phase + 1;
      stage.backdrop(year);
      const cx = Math.round(stage.w / 2), feet = FEET_Y + 4;
      const walkPose = Math.floor(-stage.cam / 11) % 4, idle = Math.floor(stage.clock / 0.55) % 2;
      const pose = stage.walking ? walkPose : -1, step = stage.walking ? pose % 2 : idle;
      // the cat trots behind, then sits while the students chat
      const catFrame = stage.walking ? (Math.floor(stage.clock * 6) % 2 ? 'walk1' : 'walk0') : 'sit';
      const cat = catCanvas(catFrame);
      ctx.globalAlpha = 0.25; rect(ctx, '#1d1830', cx + 47, feet + 1, 14, 2); ctx.globalAlpha = 1;
      ctx.drawImage(cat, cx + 44, feet - 10);
      drawActor(ctx, playerFrame('girl', year, pose), cx + 12, feet, stage.lift('girl') + step);
      drawActor(ctx, playerFrame('boy', year, pose), cx - 26, feet, stage.lift('boy') + step);
      if (!stage.walking && local < 7.4) {
        if (local > 3.7 && local < 5.6) drawEmote(ctx, boyEmotes[phase], cx - 26, feet - 31 - idle, local - 3.7);
        if (local > 5.4) drawEmote(ctx, girlEmotes[phase], cx + 12, feet - 31 - idle, local - 5.4);
      }
      // fade between school years
      const fade = local < 0.5 ? 1 - local / 0.5 : local > PHASE - 0.5 ? (local - (PHASE - 0.5)) / 0.5 : 0;
      if (fade > 0) { ctx.globalAlpha = fade; rect(ctx, '#2a2234', 0, 0, stage.w, SCENE_H); ctx.globalAlpha = 1; }
    }
  });
}

// ----- character screen: your student walks in place and reacts when you change something -----
function createCharacterStage(canvas, host, getPlayer) {
  const emotes = ['sparkle', 'note', 'heart', 'bulb'];
  return new StageScene(canvas, host, {
    maxHeight: () => Math.max(SCENE_H * 3, Math.min(window.innerHeight * 0.5, 420)),
    update(stage, dt) {
      stage.tickHops(dt);
      stage.cam -= dt * 18;
      stage.emote = Math.floor(stage.clock / 4) % emotes.length;
      stage.emoteAge = stage.clock % 4;
    },
    draw(stage, ctx) {
      const player = getPlayer();
      stage.backdrop(1);
      const feet = FEET_Y + 4, x = Math.round(stage.w / 2) - 12, pose = Math.floor(-stage.cam / 11) % 4;
      drawActor(ctx, playerFrame(player.gender, 1, pose), x, feet, stage.lift('player') + pose % 2);
      if (stage.emoteAge > 0.6 && stage.emoteAge < 3.4) drawEmote(ctx, emotes[stage.emote], x, feet - 31, stage.emoteAge - 0.6);
      const cat = catCanvas(Math.floor(stage.clock * 5) % 2 ? 'walk1' : 'walk0');
      ctx.drawImage(cat, x - 26, feet - 10);
    }
  });
}

// ----- ending screen: your student at sunset, with weather that matches how it went -----
const ENDING_STAGES = {
  'dropout': {tk: 3, fx: 'rain', emote: 'dots', tired: true},
  'lost-final-boss': {tk: 3, fx: 'rain', emote: 'sweat', tired: true},
  'honor-student': {tk: 2, fx: 'sparkle', emote: 'bulb', npcs: []},
  'burned-out-employed': {tk: 3, fx: 'sparkle', emote: 'coffee', npcs: []},
  'group-project-hero': {tk: 2, fx: 'confetti', emote: 'heart', npcs: ['studious', 'clown', 'gamer']},
  'rich-freelancer': {tk: 'noon', fx: 'coins', emote: 'star', npcs: ['client']},
  'barely-graduated': {tk: 2, fx: 'confetti', emote: 'check', npcs: []}
};
function createEndingStage(canvas, host, getPlayer, getEndingId) {
  const colors = ['#e5566f', '#f2c14e', '#4a8fd1', '#6bbf7a', '#b79cf0'];
  return new StageScene(canvas, host, {
    maxHeight: () => Math.max(SCENE_H * 2, Math.min(window.innerHeight * 0.34, 340)),
    update(stage, dt) { stage.tickHops(dt); stage.cam -= dt * 3; },
    draw(stage, ctx) {
      const config = ENDING_STAGES[getEndingId()] || ENDING_STAGES['barely-graduated'], player = getPlayer(), t = stage.clock;
      stage.backdrop(config.tk);
      const feet = FEET_Y + 4, x = Math.round(stage.w / 2) - 12, idle = Math.floor(t / 0.7) % 2;
      (config.npcs || []).forEach((id, i) => drawActor(ctx, npcFrame(id, -1), x + 34 + i * 30, feet, Math.floor(t / 0.6 + i) % 2));
      drawActor(ctx, playerFrame(player.gender, 4, -1), x, feet, idle);
      ctx.drawImage(catCanvas('sit'), x - 22, feet - 10);
      drawEmote(ctx, config.emote, x, feet - 31 - idle, t);
      for (let i = 0; i < 40; i += 1) {
        const seed = i * 97.13;
        const fx = (seed * 7 + Math.sin(t * 0.8 + i) * 6) % stage.w;
        if (config.fx === 'rain') { const fy = (t * 70 + seed * 3) % (SCENE_H + 10) - 10; rect(ctx, '#8aa6cf', Math.abs(fx), fy, 1, 3); }
        else if (config.fx === 'confetti') { const fy = (t * (14 + (i % 5) * 3) + seed) % (SCENE_H + 10) - 10; rect(ctx, colors[i % 5], Math.abs(fx), fy, 2, 2); }
        else if (config.fx === 'coins') { const fy = (t * 22 + seed) % (SCENE_H + 10) - 10; rect(ctx, '#f2c14e', Math.abs(fx), fy, 3, 3); rect(ctx, '#fff0a0', Math.abs(fx), fy, 1, 1); }
        else if (config.fx === 'sparkle' && i < 14) { if (Math.sin(t * 3 + i * 2) > 0.5) rect(ctx, '#fff0a0', Math.abs(fx), 20 + (seed % 50), 1, 1); }
      }
      if (config.fx === 'rain') { ctx.globalAlpha = 0.22; rect(ctx, '#2a3a5c', 0, 0, stage.w, SCENE_H); ctx.globalAlpha = 1; }
    }
  });
}
