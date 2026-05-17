/**
 * AmbientEngine - Generates ambient sounds using Web Audio API
 * Produces rain, cafe murmur, wind, and vinyl crackle procedurally
 */
class AmbientEngine {
  constructor() {
    this.ctx = null;
    this.nodes = {};
    this.started = false;
  }

  async init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    this._createRain();
    this._createCafe();
    this._createWind();
    this._createCrackle();
    this.started = true;
  }

  _createNoiseBuffer(duration = 2) {
    const size = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  _createBrownNoiseBuffer(duration = 2) {
    const size = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < size; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    return buffer;
  }

  _createRain() {
    const noise = this.ctx.createBufferSource();
    noise.buffer = this._createNoiseBuffer(4);
    noise.loop = true;

    const hiPass = this.ctx.createBiquadFilter();
    hiPass.type = 'highpass';
    hiPass.frequency.value = 4000;

    const loPass = this.ctx.createBiquadFilter();
    loPass.type = 'lowpass';
    loPass.frequency.value = 9000;

    const gain = this.ctx.createGain();
    gain.gain.value = 0;

    // Add a subtle modulation for natural variation
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = 0.15;
    lfoGain.gain.value = 0.08;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start();

    noise.connect(hiPass);
    hiPass.connect(loPass);
    loPass.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();

    this.nodes.rain = { source: noise, gain, lfo };
  }

  _createCafe() {
    const noise = this.ctx.createBufferSource();
    noise.buffer = this._createBrownNoiseBuffer(4);
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;
    filter.Q.value = 0.5;

    const gain = this.ctx.createGain();
    gain.gain.value = 0;

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 0.05;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start();

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();

    this.nodes.cafe = { source: noise, gain, lfo };
  }

  _createWind() {
    const noise = this.ctx.createBufferSource();
    noise.buffer = this._createNoiseBuffer(4);
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 300;
    filter.Q.value = 0.3;

    const gain = this.ctx.createGain();
    gain.gain.value = 0;

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.value = 0.05;
    lfoGain.gain.value = 0.15;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start();

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();

    this.nodes.wind = { source: noise, gain, lfo };
  }

  _createCrackle() {
    const noise = this.ctx.createBufferSource();
    const size = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) {
      data[i] = Math.random() < 0.002 ? (Math.random() * 2 - 1) * 0.5 : 0;
    }
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;

    const gain = this.ctx.createGain();
    gain.gain.value = 0;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();

    this.nodes.crackle = { source: noise, gain };
  }

  setVolume(type, volume) {
    if (this.nodes[type]?.gain) {
      const g = this.nodes[type].gain.gain;
      g.cancelScheduledValues(this.ctx.currentTime);
      g.setTargetAtTime(volume * 0.5, this.ctx.currentTime, 0.3);
    }
  }

  destroy() {
    Object.values(this.nodes).forEach((n) => {
      try { n.source?.stop(); } catch {}
      try { n.lfo?.stop(); } catch {}
    });
    this.nodes = {};
    if (this.ctx) this.ctx.close();
    this.ctx = null;
    this.started = false;
  }
}

const ambientEngine = new AmbientEngine();
export default ambientEngine;
