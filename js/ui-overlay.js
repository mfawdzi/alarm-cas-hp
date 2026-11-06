/*
 * ui-overlay.js
 * Layar alarm penuh yang muncul saat alarm berbunyi.
 */
(function (global) {
  "use strict";

  var shown = false;

  function $(id) { return document.getElementById(id); }

  function render(v) {
    var show = !!(v.signals.alarm && v.systemActive);
    $("ov-title").textContent = v.signals.penuh ? "Baterai penuh" : "Alarm manual";

    if (show !== shown) {
      shown = show;
      $("overlay").hidden = !show;
      if (show) { $("btn-ov-off").focus(); }
    }
  }

  function bind(actions) {
    $("btn-ov-off").addEventListener("click", function () {
      actions.setSystem(false);
    });
  }

  global.UIOverlay = { render: render, bind: bind };
})(window);
