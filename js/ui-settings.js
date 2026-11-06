/*
 * ui-settings.js
 * Layar Pengaturan: menyamakan kontrol dengan nilai pengaturan dan
 * meneruskan perubahan ke app.js lewat actions.setSetting().
 */
(function (global) {
  "use strict";

  function $(id) { return document.getElementById(id); }

  function checkRadio(name, value) {
    var radios = document.querySelectorAll('input[name="' + name + '"]');
    for (var i = 0; i < radios.length; i++) {
      radios[i].checked = radios[i].value === value;
    }
  }

  function sensorNote(v) {
    if (!v.sensorSupported) {
      return "Browser ini tidak bisa membaca baterai, jadi simulasi dipakai terus. Buka di Chrome Android untuk baterai asli.";
    }
    if (v.settings.simulate) {
      return "Aktif. Data baterai asli tidak dipakai.";
    }
    return "Membaca baterai HP ini secara langsung.";
  }

  function render(v) {
    var st = v.settings;

    $("set-threshold").value = String(st.threshold);
    $("set-threshold-text").textContent = st.threshold + "%";
    $("set-volume").value = String(st.volume);
    $("set-volume-text").textContent = st.volume + "%";
    $("set-vibrate").checked = st.vibrate;
    $("set-keepawake").checked = st.keepAwake;

    checkRadio("tone", st.tone);
    checkRadio("theme", st.theme);

    var sim = $("set-simulate");
    sim.checked = v.simulating;
    sim.disabled = !v.sensorSupported;
    $("sensor-note").textContent = sensorNote(v);
    $("sim-panel").hidden = !v.simulating;
    $("sim-level").value = String(st.simLevel);
    $("sim-level-text").textContent = st.simLevel + "%";
    $("sim-charging").checked = st.simCharging;

    $("btn-install").hidden = !v.canInstall;
    $("install-divider").hidden = !v.canInstall;
  }

  function bind(actions) {
    $("set-threshold").addEventListener("input", function (e) {
      actions.setSetting("threshold", parseInt(e.target.value, 10));
    });
    $("set-volume").addEventListener("input", function (e) {
      actions.setSetting("volume", parseInt(e.target.value, 10));
    });
    $("set-volume").addEventListener("change", actions.testSound);
    $("set-vibrate").addEventListener("change", function (e) {
      actions.setSetting("vibrate", e.target.checked);
    });
    $("set-keepawake").addEventListener("change", function (e) {
      actions.setSetting("keepAwake", e.target.checked);
    });

    var tones = document.querySelectorAll('input[name="tone"]');
    for (var i = 0; i < tones.length; i++) {
      tones[i].addEventListener("change", function (e) {
        actions.setSetting("tone", e.target.value);
        actions.testSound();
      });
    }

    var themes = document.querySelectorAll('input[name="theme"]');
    for (var j = 0; j < themes.length; j++) {
      themes[j].addEventListener("change", function (e) {
        actions.setSetting("theme", e.target.value);
      });
    }

    $("btn-test").addEventListener("click", actions.testSound);

    $("set-simulate").addEventListener("change", function (e) {
      actions.setSetting("simulate", e.target.checked);
    });
    $("sim-level").addEventListener("input", function (e) {
      actions.setSetting("simLevel", parseInt(e.target.value, 10));
    });
    $("sim-charging").addEventListener("change", function (e) {
      actions.setSetting("simCharging", e.target.checked);
    });

    $("btn-install").addEventListener("click", actions.install);
  }

  global.UISettings = { render: render, bind: bind };
})(window);
