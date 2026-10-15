// Tiny synthesized cat sounds (Web Audio, no audio files). The context is
// created on the first click, which counts as the user gesture browsers need.
let context: AudioContext | null = null;

function audio() {
  if (typeof window === "undefined") return null;
  try {
    context ??= new AudioContext();
    if (context.state === "suspended") void context.resume();
    return context;
  } catch { return null; }
}

/** A voiced cry: a buzzy tone through two moving formant filters. */
function voice(ctx: AudioContext, start: number, length: number, pitch: [number, number, number], formants: [number, number][], gain: number, wave: OscillatorType) {
  const out = ctx.createGain(); out.connect(ctx.destination);
  out.gain.setValueAtTime(0, start);
  out.gain.linearRampToValueAtTime(gain, start + .04);
  out.gain.setValueAtTime(gain, start + length * .55);
  out.gain.exponentialRampToValueAtTime(.0001, start + length);
  const osc = ctx.createOscillator(); osc.type = wave;
  osc.frequency.setValueAtTime(pitch[0], start);
  osc.frequency.linearRampToValueAtTime(pitch[1], start + length * .35);
  osc.frequency.exponentialRampToValueAtTime(pitch[2], start + length);
  // A little vibrato keeps it from sounding like a synth.
  const lfo = ctx.createOscillator(), depth = ctx.createGain();
  lfo.frequency.value = 6.5; depth.gain.value = pitch[1] * .018; lfo.connect(depth).connect(osc.frequency);
  formants.forEach(([from, to]) => {
    const band = ctx.createBiquadFilter(); band.type = "bandpass"; band.Q.value = 6;
    band.frequency.setValueAtTime(from, start); band.frequency.linearRampToValueAtTime(to, start + length * .45); band.frequency.linearRampToValueAtTime(from * .9, start + length);
    osc.connect(band).connect(out);
  });
  osc.start(start); lfo.start(start); osc.stop(start + length + .05); lfo.stop(start + length + .05);
}

/** Breath noise, for the hiss under a growl. */
function hiss(ctx: AudioContext, start: number, length: number, gain: number) {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * length), ctx.sampleRate), data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const source = ctx.createBufferSource(); source.buffer = buffer;
  const high = ctx.createBiquadFilter(); high.type = "highpass"; high.frequency.value = 2400;
  const out = ctx.createGain(); out.gain.setValueAtTime(0, start); out.gain.linearRampToValueAtTime(gain, start + .05); out.gain.exponentialRampToValueAtTime(.0001, start + length);
  source.connect(high).connect(out).connect(ctx.destination); source.start(start);
}

export function meow() {
  const ctx = audio(); if (!ctx) return;
  const at = ctx.currentTime + .01, pitch = 1 + (Math.random() - .5) * .12;
  // "mi-aaa-ow": rising then falling pitch, the vowel opening from i to a to u.
  voice(ctx, at, .62, [520 * pitch, 760 * pitch, 430 * pitch], [[1900, 1100], [3200, 2600]], .16, "sawtooth");
}

export function rawr() {
  const ctx = audio(); if (!ctx) return;
  const at = ctx.currentTime + .01;
  // An annoyed hiss, then a low rolling growl that rises into a short yowl.
  hiss(ctx, at, .45, .07);
  const growl = ctx.createOscillator(), roll = ctx.createOscillator(), rollDepth = ctx.createGain(), low = ctx.createBiquadFilter(), out = ctx.createGain();
  growl.type = "sawtooth"; growl.frequency.setValueAtTime(110, at + .3); growl.frequency.linearRampToValueAtTime(150, at + .9);
  roll.frequency.value = 26; rollDepth.gain.value = .5;
  low.type = "lowpass"; low.frequency.value = 900;
  out.gain.setValueAtTime(0, at + .3); out.gain.linearRampToValueAtTime(.2, at + .4); out.gain.setValueAtTime(.2, at + .8); out.gain.exponentialRampToValueAtTime(.0001, at + 1.05);
  const tremolo = ctx.createGain(); tremolo.gain.value = .5; roll.connect(rollDepth).connect(tremolo.gain);
  growl.connect(low).connect(tremolo).connect(out).connect(ctx.destination);
  growl.start(at + .3); roll.start(at + .3); growl.stop(at + 1.1); roll.stop(at + 1.1);
  voice(ctx, at + .85, .55, [300, 520, 260], [[900, 1300], [2400, 2000]], .14, "sawtooth");
}
