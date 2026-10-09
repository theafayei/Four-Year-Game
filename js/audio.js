class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled && this.ctx) {
      this.ctx.suspend();
    } else if (this.enabled) {
      this.ensureContext();
    }
    return this.enabled;
  }

  beep(freq, duration, type = 'square', volume = 0.04) {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = volume;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  }

  success() {
    this.beep(660, 0.09, 'square', 0.05);
    setTimeout(() => this.beep(880, 0.11, 'triangle', 0.05), 90);
  }

  fail() {
    this.beep(180, 0.14, 'sawtooth', 0.04);
    setTimeout(() => this.beep(120, 0.18, 'sawtooth', 0.04), 120);
  }

  levelUp() {
    if (!this.enabled) return;
    [523,659,784,1047,784,1047].forEach((note,index) => {
      setTimeout(() => this.beep(note, index === 5 ? 0.4 : 0.13, 'triangle', 0.045), index * 145);
    });
  }

  click() {
    this.beep(440, 0.05, 'square', 0.04);
  }

  // Soft footstep tick while the student walks, and a little pop for emotes.
  step() {
    this.beep(110 + Math.random() * 30, 0.03, 'triangle', 0.025);
  }

  pop() {
    this.beep(700, 0.04, 'square', 0.03);
    setTimeout(() => this.beep(1000, 0.05, 'square', 0.03), 45);
  }
}

const soundEngine = new SoundEngine();
