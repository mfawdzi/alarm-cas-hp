/*
 * ui-home.js
 * Layar Beranda: gauge baterai, spanduk status, saklar alarm, tombol manual.
 */
(function (global) {
  "use strict";

  var CIRCUMFERENCE = 527.79; // 2 * pi * 84

  function $(id) { return document.getElementById(id); }

  function banner(v) {
    var s = v.signals;
    if (s.alarm && v.systemActive) {
      return {
        cls: "ringing",
        title: "Alarm berbunyi",
        detail: "Baterai penuh dan kabel masih terpasang. Cabut kabel untuk mematikan."
      };
    }
    if (s.alarm && !v.systemActive) {
      return {
        cls: "standby",
        title: "Alarm siap, suara mati",
        detail: "Syarat alarm terpenuhi, tapi alarm otomatis belum dinyalakan."
      };
    }
    if (!s.dicas) {
      return {
        cls: "",
        title: "Alarm diam",
        detail: "Kabel dicabut, alarm tidak akan bunyi."
      };
    }
    return {
      cls: "",
      title: "Alarm diam",
      detail: "Sedang dicas. Alarm bunyi saat baterai mencapai " + v.settings.threshold + "%."
    };
  }

  function render(v) {
    var s = v.signals;
    var ringing = s.alarm && v.systemActive;

    // Gauge
    var offset = CIRCUMFERENCE * (1 - Math.min(100, Math.max(0, v.level)) / 100);
    $("g-progress").style.strokeDashoffset = String(offset);
    $("g-level").textContent = v.level + "%";
    $("g-chip-text").textContent = v.charging ? "Sedang dicas" : "Tidak dicas";
    $("gauge").setAttribute("class", "gauge" + (ringing ? " ringing" : (v.charging ? " charging" : "")));

    // Spanduk
    var b = banner(v);
    $("banner").setAttribute("class", "card banner" + (b.cls ? " " + b.cls : ""));
    $("banner-title").textContent = b.title;
    $("banner-detail").textContent = b.detail;

    // Saklar alarm otomatis
    $("sw-system").checked = v.systemActive;
    $("sys-sub").textContent = v.systemActive
      ? "Aktif. Alarm bunyi saat baterai mencapai " + v.settings.threshold + "%."
      : "Nyalakan agar suara alarm diizinkan";

    // Tombol manual
    var man = $("btn-manual");
    man.setAttribute("aria-pressed", v.manual ? "true" : "false");
    $("btn-manual-text").textContent = v.manual ? "Lepas alarm manual" : "Tekan alarm manual";

    // Ubin ringkasan
    $("tile-threshold").textContent = v.settings.threshold + "%";
    $("tile-tone").textContent = global.Settings.TONE_LABELS[v.settings.tone];
    $("tile-source").textContent = v.simulating ? "Simulasi" : "Baterai HP";
  }

  function bind(actions) {
    $("sw-system").addEventListener("change", function (e) {
      actions.setSystem(e.target.checked);
    });
    $("btn-manual").addEventListener("click", actions.toggleManual);
  }

  global.UIHome = { render: render, bind: bind };
})(window);
