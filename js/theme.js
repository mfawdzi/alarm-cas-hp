/*
 * theme.js
 * Menerapkan tema terang, gelap, atau mengikuti sistem.
 */
(function (global) {
  "use strict";

  var current = "sistem";
  var media = global.matchMedia ? global.matchMedia("(prefers-color-scheme: dark)") : null;

  function syncMetaColor() {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) { return; }
    var bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
    if (bg) { meta.setAttribute("content", bg); }
  }

  function apply(name) {
    current = name;
    var root = document.documentElement;
    if (name === "terang") {
      root.setAttribute("data-theme", "light");
    } else if (name === "gelap") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    syncMetaColor();
  }

  if (media && media.addEventListener) {
    media.addEventListener("change", function () {
      if (current === "sistem") { syncMetaColor(); }
    });
  }

  global.Theme = { apply: apply };
})(window);
