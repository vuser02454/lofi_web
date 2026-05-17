import { Howl } from 'howler';

/**
 * MusicEngine - Generative lofi music using Web Audio API + Howler.js
 * Generates warm chord pad loops offline, then plays them through Howler
 */

const PROGRESSIONS = [
  // Cm: C-Eb-G-Bb
  { name: 'Midnight Drift', chords: [[130.81,155.56,196.00,233.08],[174.61,207.65,261.63,311.13],[146.83,174.61,220.00,261.63],[116.54,138.59,174.61,207.65]], bpm: 68 },
  // Fmaj: F-A-C-E
  { name: 'Amber Glow', chords: [[174.61,220.00,261.63,329.63],[146.83,174.61,220.00,277.18],[130.81,164.81,196.00,246.94],[155.56,196.00,233.08,293.66]], bpm: 72 },
  // Dm: D-F-A-C
  { name: 'Neon Dreams', chords: [[146.83,174.61,220.00,261.63],[130.81,155.56,196.00,233.08],[116.54,146.83,174.61,220.00],[155.56,185.00,220.00,277.18]], bpm: 65 },
  // Am: A-C-E-G
  { name: 'Rainy Horizons', chords: [[110.00,130.81,164.81,196.00],[130.81,155.56,196.00,233.08],[146.83,174.61,220.00,261.63],[123.47,146.83,185.00,220.00]], bpm: 70 },
];

function audioBufferToWav(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataLength = buffer.length * blockAlign;
  const headerLength = 44;
  const totalLength = headerLength + dataLength;
  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);

  const writeStr = (offset, str) => { for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i)); };

  writeStr(0, 'RIFF');
  view.setUint32(4, totalLength - 8, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeStr(36, 'data');
  view.setUint32(40, dataLength, true);

  const channels = [];
  for (let c = 0; c < numChannels; c++) channels.push(buffer.getChannelData(c));

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, channels[c][i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
  }
  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

async function generateLofiLoop(progressionIndex = 0) {
  const prog = PROGRESSIONS[progressionIndex];
  const sampleRate = 44100;
  const chordDuration = (60 / prog.bpm) * 4;
  const totalDuration = chordDuration * prog.chords.length;
  const length = Math.ceil(sampleRate * totalDuration);
  const offlineCtx = new OfflineAudioContext(2, length, sampleRate);

  // Master chain: filter -> gain -> compressor -> destination
  const masterFilter = offlineCtx.createBiquadFilter();
  masterFilter.type = 'lowpass';
  masterFilter.frequency.value = 700;
  masterFilter.Q.value = 0.7;

  const masterGain = offlineCtx.createGain();
  masterGain.gain.value = 0.35;

  const compressor = offlineCtx.createDynamicsCompressor();
  compressor.threshold.value = -20;
  compressor.ratio.value = 4;

  masterFilter.connect(masterGain);
  masterGain.connect(compressor);
  compressor.connect(offlineCtx.destination);

  // Generate chords
  prog.chords.forEach((chord, chordIdx) => {
    const startTime = chordIdx * chordDuration;
    const fadeIn = 0.6;
    const fadeOut = 0.8;

    chord.forEach((freq, noteIdx) => {
      // Main oscillator
      const osc = offlineCtx.createOscillator();
      osc.type = noteIdx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.value = freq;
      osc.detune.value = (Math.random() - 0.5) * 12;

      // Sub oscillator (octave down for warmth)
      const sub = offlineCtx.createOscillator();
      sub.type = 'sine';
      sub.frequency.value = freq * 0.5;
      sub.detune.value = (Math.random() - 0.5) * 6;

      const noteGain = offlineCtx.createGain();
      noteGain.gain.setValueAtTime(0, startTime);
      noteGain.gain.linearRampToValueAtTime(0.12, startTime + fadeIn);
      noteGain.gain.setValueAtTime(0.12, startTime + chordDuration - fadeOut);
      noteGain.gain.linearRampToValueAtTime(0, startTime + chordDuration);

      const subGain = offlineCtx.createGain();
      subGain.gain.setValueAtTime(0, startTime);
      subGain.gain.linearRampToValueAtTime(0.06, startTime + fadeIn);
      subGain.gain.setValueAtTime(0.06, startTime + chordDuration - fadeOut);
      subGain.gain.linearRampToValueAtTime(0, startTime + chordDuration);

      osc.connect(noteGain);
      sub.connect(subGain);
      noteGain.connect(masterFilter);
      subGain.connect(masterFilter);

      osc.start(startTime);
      osc.stop(startTime + chordDuration);
      sub.start(startTime);
      sub.stop(startTime + chordDuration);
    });
  });

  const audioBuffer = await offlineCtx.startRendering();
  return audioBufferToWav(audioBuffer);
}

class MusicEngine {
  constructor() {
    this.howl = null;
    this.currentTrack = -1;
    this.loading = false;
    this.blobUrls = [];
  }

  async loadTrack(index) {
    if (this.loading) return;
    this.loading = true;

    try {
      // Stop current
      if (this.howl) {
        this.howl.fade(this.howl.volume(), 0, 500);
        setTimeout(() => { this.howl?.unload(); }, 600);
      }

      const blob = await generateLofiLoop(index);
      const url = URL.createObjectURL(blob);
      this.blobUrls.push(url);

      return new Promise((resolve) => {
        this.howl = new Howl({
          src: [url],
          format: ['wav'],
          loop: true,
          volume: 0,
          onload: () => {
            this.currentTrack = index;
            this.loading = false;
            resolve(true);
          },
          onloaderror: () => {
            this.loading = false;
            resolve(false);
          },
        });
      });
    } catch (e) {
      console.error('Failed to generate track:', e);
      this.loading = false;
      return false;
    }
  }

  play(volume = 0.5) {
    if (!this.howl) return;
    this.howl.play();
    this.howl.fade(0, volume, 1500);
  }

  pause() {
    if (!this.howl) return;
    this.howl.fade(this.howl.volume(), 0, 800);
    setTimeout(() => { this.howl?.pause(); }, 900);
  }

  setVolume(vol) {
    if (!this.howl) return;
    this.howl.volume(vol);
  }

  isPlaying() {
    return this.howl?.playing() || false;
  }

  destroy() {
    if (this.howl) this.howl.unload();
    this.blobUrls.forEach((u) => URL.revokeObjectURL(u));
    this.blobUrls = [];
    this.howl = null;
    this.currentTrack = -1;
  }
}

const musicEngine = new MusicEngine();
export default musicEngine;
export { PROGRESSIONS };
