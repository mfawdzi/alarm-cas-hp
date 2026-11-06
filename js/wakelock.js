/*
 * wakelock.js
 * Menjaga layar tetap menyala selama sistem aktif (Screen Wake Lock API).
 * Jika browser tidak mendukung, fungsi ini diam saja.
 */
(function (global) {
  "use strict";

  var sentinel = null;
  var wanted = false;

  function request() {
    wanted = true;
    if (!("wakeLock" in navigator)) {
      return Promise.resolve(false);
    }
    return navigator.wakeLock.request("screen").then(function (s) {
      sentinel = s;
      s.addEventListener("release", function () { sentinel = null; });
      return true;
    }).catch(function () {
      return false;
    });
  }

  function release() {
    wanted = false;
    if (sentinel) {
      sentinel.release();
      sentinel = null;
    }
  }

  // Wake lock hilang saat tab disembunyikan, minta lagi saat kembali.
  document.addEventListener("visibilitychange", function () {
    if (wanted && !sentinel && document.visibilityState === "visible") {
      request();
    }
  });

  global.ScreenWakeLock = {
    request: request,
    release: release,
    isActive: function () { return !!sentinel; }
  };
})(window);
