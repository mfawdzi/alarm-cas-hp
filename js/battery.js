/*
 * battery.js
 * Membaca level baterai dan status cas lewat Battery Status API.
 * API ini ada di Chrome/Edge Android dan desktop, tidak ada di iPhone/Safari.
 */
(function (global) {
  "use strict";

  var battery = null;
  var listeners = [];
  var reading = { level: 0, charging: false };

  function read() {
    reading.level = Math.round(battery.level * 100);
    reading.charging = !!battery.charging;
  }

  function notify() {
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](reading);
    }
  }

  // Mengembalikan Promise<boolean>: true jika pembacaan baterai tersedia.
  function init() {
    if (!navigator.getBattery) {
      return Promise.resolve(false);
    }
    return navigator.getBattery().then(function (b) {
      battery = b;
      read();
      b.addEventListener("levelchange", function () { read(); notify(); });
      b.addEventListener("chargingchange", function () { read(); notify(); });
      return true;
    }).catch(function () {
      return false;
    });
  }

  // Baca ulang manual (dipakai sebagai cadangan jika event terlewat).
  function refresh() {
    if (battery) { read(); }
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  function getReading() {
    return reading;
  }

  global.BatteryMonitor = {
    init: init,
    refresh: refresh,
    onChange: onChange,
    getReading: getReading
  };
})(window);
