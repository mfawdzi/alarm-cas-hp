/*
 * navigation.js
 * Pindah antar layar lewat menu bawah.
 */
(function (global) {
  "use strict";

  var TITLES = { home: "Alarm Cas", logic: "Logika gerbang", settings: "Pengaturan" };

  function show(name) {
    var screens = document.querySelectorAll(".screen");
    for (var i = 0; i < screens.length; i++) {
      screens[i].hidden = screens[i].id !== "screen-" + name;
    }

    var items = document.querySelectorAll(".nav-item");
    for (var j = 0; j < items.length; j++) {
      if (items[j].getAttribute("data-screen") === name) {
        items[j].setAttribute("aria-current", "page");
      } else {
        items[j].removeAttribute("aria-current");
      }
    }

    document.getElementById("appbar-title").textContent = TITLES[name];
    document.getElementById("screens").scrollTop = 0;
  }

  function init() {
    var items = document.querySelectorAll(".nav-item");
    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener("click", function (e) {
        show(e.currentTarget.getAttribute("data-screen"));
      });
    }
  }

  global.Navigation = { init: init, show: show };
})(window);
