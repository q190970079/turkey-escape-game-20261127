// Tiny WebAudio sound effects, synthesized at run time. No sound
// files are shipped, so the game stays a handful of static files.
export function createAudio() {
  let ctx = null;
  let muted = false;

  function ensure() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctx = new AudioCtx();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, dur, type, vol, slideTo) {
    if (muted) return;
    const ac = ensure();
    if (!ac) return;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, ac.currentTime + dur);
    gain.gain.setValueAtTime(vol || 0.12, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + dur);
  }

  return {
    toggleMute() {
      muted = !muted;
      return muted;
    },
    get muted() { return muted; },
    unlock() { ensure(); },
    jump() { tone(420, 0.16, 'sine', 0.1, 760); },
    doubleJump() { tone(560, 0.14, 'triangle', 0.1, 920); },
    dash() { tone(220, 0.18, 'sawtooth', 0.06, 520); },
    corn() { tone(880, 0.09, 'sine', 0.12); setTimeout(() => tone(1320, 0.12, 'sine', 0.1), 70); },
    golden() { tone(660, 0.1, 'triangle', 0.12); setTimeout(() => tone(990, 0.1, 'triangle', 0.12), 80); setTimeout(() => tone(1320, 0.16, 'triangle', 0.12), 160); },
    stumble() { tone(180, 0.3, 'sawtooth', 0.14, 70); },
    alarm() { tone(520, 0.12, 'square', 0.06, 380); setTimeout(() => tone(520, 0.12, 'square', 0.06, 380), 150); },
    caught() { tone(300, 0.5, 'sawtooth', 0.14, 60); },
    escaped() {
      [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 0.22, 'triangle', 0.12), i * 130));
    },
    gobble() { tone(180, 0.09, 'square', 0.08, 120); setTimeout(() => tone(150, 0.09, 'square', 0.08, 100), 110); },
  };
}
