// Organic sound synthesis using Web Audio API
// This avoids needing external MP3s and creates perfect, zero-latency UI sounds

let audioCtx: AudioContext | null = null;

function getContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

export function playWaterDrop() {
  const ctx = getContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') ctx.resume();

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Pitch sweep for water drop effect
  osc.frequency.setValueAtTime(400, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);

  // Envelope
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);

  // Trigger haptic feedback if available (mobile)
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(15);
  }
}

export function playSuccessChime() {
  const ctx = getContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') ctx.resume();

  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc1.connect(gainNode);
  osc2.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Major third interval for a happy chime
  osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
  osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

  osc1.start(ctx.currentTime);
  osc2.start(ctx.currentTime);
  osc1.stop(ctx.currentTime + 0.8);
  osc2.stop(ctx.currentTime + 0.8);

  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate([20, 50, 20]);
  }
}
