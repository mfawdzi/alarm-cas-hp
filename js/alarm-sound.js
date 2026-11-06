/*
 * alarm-sound.js
 * Suara alarm memakai Web Audio API (tanpa file audio).
 * Ada empat nada, volume, dan getar yang bisa diatur lewat configure().
 * Browser mewajibkan audio dimulai setelah pengguna mengetuk sesuatu,
 * karena itu ada fungsi unlock().
 */
(function (global) {
  "use strict";

  var ctx = null;
  var timer = null;
  var playing = false;
  var options = { tone: "klasik", volume: 80, vibrate: true };

  function unlock() {
    if (!ctx) {
      var AC = global.AudioContext || global.webkitAudioContext;
      if (!AC) { return false; }
      ctx = new AC();
    }
    if (ctx.state === "suspended") { ctx.resume(); }
    return true;
  }

  // Satu nada dengan awal cepat dan peluruhan.
  function note(type, f0, f1, t, dur, peak) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) { osc.frequency.linearRampToValueAtTime(f1, t + dur); }
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  // Setiap nada: interval ulang (ms) dan cara memainkan satu putaran.
  var TONES = {
    klasik: {
      interval: 600,
      play: function (t, p) {
        note("square", 880, 880, t, 0.18, p);
        note("square", 660, 660, t + 0.18, 0.18, p);
      }
    },
    sirine: {
      interval: 950,
      play: function (t, p) {
        note("sawtooth", 600, 1000, t, 0.45, p * 0.8);
        note("sawtooth", 1000, 600, t + 0.45, 0.45, p * 0.8);
      }
    },
    lonceng: {
      interval: 1400,
      play: function (t, p) {
        note("sine", 1318, 1318, t, 1.2, p * 1.4);
        note("sine", 2636, 2636, t, 0.7, p * 0.5);
      }
    },
    bip: {
      interval: 450,
      play: function (t, p) {
        note("square", 1000, 1000, t, 0.08, p);
        note("square", 1000, 1000, t + 0.16, 0.08, p);
      }
    }
  };

  function currentTone() {
    return TONES[options.tone] || TONES.klasik;
  }

  function cycle() {
    if (!ctx) { return; }
    var peak = 0.5 * (options.volume / 100);
    currentTone().play(ctx.currentTime, peak);
    if (options.vibrate && navigator.vibrate) { navigator.vibrate(200); }
  }

  function start() {
    if (playing) { return; }
    if (!unlock()) { return; }
    playing = true;
    cycle();
    timer = setInterval(cycle, currentTone().interval);
  }

  function stop() {
    if (!playing) { return; }
    playing = false;
    clearInterval(timer);
    timer = null;
    if (navigator.vibrate) { navigator.vibrate(0); }
  }

  // Ubah nada, volume, atau getar. Jika sedang bunyi, terapkan langsung.
  function configure(opts) {
    var wasPlaying = playing;
    if (wasPlaying) { stop(); }
    for (var k in opts) {
      if (Object.prototype.hasOwnProperty.call(opts, k)) { options[k] = opts[k]; }
    }
    if (wasPlaying) { start(); }
  }

  // Bunyikan satu putaran untuk uji coba.
  function preview() {
    if (unlock()) { cycle(); }
  }

  function isPlaying() { return playing; }

  global.AlarmSound = {
    unlock: unlock,
    start: start,
    stop: stop,
    configure: configure,
    preview: preview,
    isPlaying: isPlaying
  };
})(window);
