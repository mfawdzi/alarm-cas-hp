/*
 * app.js
 * Penghubung semua bagian: membaca masukan, menjalankan gerbang logika,
 * mengatur suara dan layar, lalu menggambar ulang semua layar.
 */
(function () {
  "use strict";

  var settings = Settings.load();

  var state = {
    systemActive: false,
    manual: false,
    sensorSupported: false,
    lastCharging: null,
    installPrompt: null
  };

  function simulating() {
    return settings.simulate || !state.sensorSupported;
  }

  function readInput() {
    if (simulating()) {
      return { level: settings.simLevel, charging: settings.simCharging };
    }
    var r = BatteryMonitor.getReading();
    return { level: r.level, charging: r.charging };
  }

  function applyAudio() {
    AlarmSound.configure({
      tone: settings.tone,
      volume: settings.volume,
      vibrate: settings.vibrate
    });
  }

  function applyWakeLock() {
    if (state.systemActive && settings.keepAwake) {
      ScreenWakeLock.request();
    } else {
      ScreenWakeLock.release();
    }
  }

  function update() {
    var input = readInput();

    // Tombol manual lepas lagi setiap kali status kabel berubah.
    if (state.lastCharging !== null && state.lastCharging !== input.charging) {
      state.manual = false;
    }
    state.lastCharging = input.charging;

    var signals = Gates.evaluate({
      level: input.level,
      threshold: settings.threshold,
      cablePlugged: input.charging,
      manualPressed: state.manual
    });

    if (signals.alarm && state.systemActive) {
      AlarmSound.start();
    } else {
      AlarmSound.stop();
    }

    var view = {
      level: input.level,
      charging: input.charging,
      manual: state.manual,
      signals: signals,
      systemActive: state.systemActive,
      settings: settings,
      sensorSupported: state.sensorSupported,
      simulating: simulating(),
      canInstall: !!state.installPrompt
    };

    UIHome.render(view);
    UISettings.render(view);
    UIOverlay.render(view);
  }

  var actions = {
    setSystem: function (on) {
      state.systemActive = on;
      if (on) { AlarmSound.unlock(); }
      applyWakeLock();
      update();
    },

    toggleManual: function () {
      state.manual = !state.manual;
      update();
    },

    setSetting: function (key, value) {
      settings[key] = value;
      settings = Settings.sanitize(settings);

      if (key === "simulate" && settings.simulate && state.sensorSupported) {
        // Mulai dari nilai baterai asli supaya tidak melompat.
        var r = BatteryMonitor.getReading();
        settings.simLevel = r.level;
        settings.simCharging = r.charging;
      }
      if (key === "theme") { Theme.apply(settings.theme); }
      if (key === "tone" || key === "volume" || key === "vibrate") { applyAudio(); }
      if (key === "keepAwake") { applyWakeLock(); }

      Settings.save(settings);
      update();
    },

    testSound: function () {
      applyAudio();
      AlarmSound.preview();
    },

    install: function () {
      if (!state.installPrompt) { return; }
      state.installPrompt.prompt();
      state.installPrompt = null;
      update();
    }
  };

  function registerServiceWorker() {
    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register("sw.js").catch(function () { /* abaikan */ });
    }
  }

  function start() {
    Theme.apply(settings.theme);
    applyAudio();

    UIHome.bind(actions);
    UISettings.bind(actions);
    UIOverlay.bind(actions);
    Navigation.init();

    BatteryMonitor.onChange(update);

    // Cadangan jika ada event baterai yang terlewat.
    setInterval(function () {
      BatteryMonitor.refresh();
      update();
    }, 3000);

    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") {
        BatteryMonitor.refresh();
        update();
      }
    });

    window.addEventListener("beforeinstallprompt", function (e) {
      e.preventDefault();
      state.installPrompt = e;
      update();
    });

    registerServiceWorker();

    BatteryMonitor.init().then(function (ok) {
      state.sensorSupported = ok;
      if (ok) {
        var r = BatteryMonitor.getReading();
        settings.simLevel = r.level;
        settings.simCharging = r.charging;
      }
      update();
    });
  }

  document.addEventListener("DOMContentLoaded", start);
})();
