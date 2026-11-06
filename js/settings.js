/*
 * settings.js
 * Pengaturan aplikasi dan penyimpanannya di localStorage.
 * Nilai simulasi sengaja tidak disimpan supaya tiap buka aplikasi mulai dari data asli.
 */
(function (global) {
  "use strict";

  var KEY = "alarmCasHp.settings.v1";

  var TONES = ["klasik", "sirine", "lonceng", "bip"];
  var TONE_LABELS = { klasik: "Klasik", sirine: "Sirine", lonceng: "Lonceng", bip: "Bip cepat" };
  var THEMES = ["sistem", "terang", "gelap"];

  var DEFAULTS = {
    threshold: 100,
    tone: "klasik",
    volume: 80,
    vibrate: true,
    keepAwake: true,
    theme: "sistem",
    simulate: false,
    simLevel: 60,
    simCharging: false
  };

  var PERSISTED = ["threshold", "tone", "volume", "vibrate", "keepAwake", "theme"];

  function clamp(v, min, max, fallback) {
    v = parseInt(v, 10);
    if (isNaN(v)) { return fallback; }
    return Math.min(max, Math.max(min, v));
  }

  function sanitize(s) {
    return {
      threshold: clamp(s.threshold, 1, 100, DEFAULTS.threshold),
      tone: TONES.indexOf(s.tone) >= 0 ? s.tone : DEFAULTS.tone,
      volume: clamp(s.volume, 10, 100, DEFAULTS.volume),
      vibrate: !!s.vibrate,
      keepAwake: !!s.keepAwake,
      theme: THEMES.indexOf(s.theme) >= 0 ? s.theme : DEFAULTS.theme,
      simulate: !!s.simulate,
      simLevel: clamp(s.simLevel, 0, 100, DEFAULTS.simLevel),
      simCharging: !!s.simCharging
    };
  }

  function load() {
    var s = {};
    for (var k in DEFAULTS) { s[k] = DEFAULTS[k]; }
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        PERSISTED.forEach(function (key) {
          if (key in saved) { s[key] = saved[key]; }
        });
      }
    } catch (e) { /* abaikan jika penyimpanan tidak tersedia */ }
    return sanitize(s);
  }

  function save(s) {
    try {
      var out = {};
      PERSISTED.forEach(function (key) { out[key] = s[key]; });
      localStorage.setItem(KEY, JSON.stringify(out));
    } catch (e) { /* abaikan */ }
  }

  global.Settings = {
    load: load,
    save: save,
    sanitize: sanitize,
    TONES: TONES,
    TONE_LABELS: TONE_LABELS,
    THEMES: THEMES
  };
})(window);
