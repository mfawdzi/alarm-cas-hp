/*
 * ui-logic.js
 * Layar Logika: diagram gerbang NOT, OR, AND yang menyala sesuai nilai sinyal.
 */
(function (global) {
  "use strict";

  function $(id) { return document.getElementById(id); }

  function setWire(id, on) {
    $(id).setAttribute("class", "wire" + (on ? " on" : ""));
  }

  function setBubble(id, value) {
    var g = $(id);
    g.setAttribute("class", "bubble" + (value ? " on" : ""));
    g.querySelector("text").textContent = String(value);
  }

  function setGate(id, out) {
    $(id).setAttribute("class", "gate" + (out ? " out-on" : ""));
  }

  function render(v) {
    var s = v.signals;

    $("val-battery").textContent = v.level + "%";
    $("val-button").textContent = v.manual ? "Ditekan" : "Lepas";
    $("val-cable").textContent = v.charging ? "Terpasang" : "Dicabut";
    $("cmp-label").textContent = "≥ " + v.settings.threshold + "%";

    setWire("wire-S", s.sinyalDicabut);
    setWire("wire-A", s.penuh);
    setWire("wire-B", s.manual);
    setWire("wire-C", s.dicas);
    setWire("wire-D", s.siap);
    setWire("wire-Q", s.alarm);

    setBubble("bub-S", s.sinyalDicabut);
    setBubble("bub-A", s.penuh);
    setBubble("bub-B", s.manual);
    setBubble("bub-C", s.dicas);
    setBubble("bub-D", s.siap);
    setBubble("bub-Q", s.alarm);

    setGate("node-cmp", s.penuh);
    setGate("gate-not", s.dicas);
    setGate("gate-or", s.siap);
    setGate("gate-and", s.alarm);

    $("node-alarm").setAttribute("class", "alarm-node" + (s.alarm ? " on" : ""));
    $("val-alarm").textContent = s.alarm ? "Berbunyi" : "Diam";
  }

  global.UILogic = { render: render };
})(window);
