/*
 * gates.js
 * Gerbang logika dan rangkaian utama alarm.
 * Nilai sinyal selalu 0 atau 1.
 */
(function (global) {
  "use strict";

  // Gerbang NOT: membalik sinyal.
  function NOT(a) {
    return a ? 0 : 1;
  }

  // Gerbang OR: 1 jika salah satu masukan bernilai 1.
  function OR(a, b) {
    return (a || b) ? 1 : 0;
  }

  // Gerbang AND: 1 hanya jika kedua masukan bernilai 1.
  function AND(a, b) {
    return (a && b) ? 1 : 0;
  }

  /*
   * input = {
   *   level:         angka 0-100 (persen baterai),
   *   threshold:     angka 1-100 (batas dianggap penuh),
   *   cablePlugged:  true jika kabel cas terpasang,
   *   manualPressed: true jika tombol alarm manual ditekan
   * }
   */
  function evaluate(input) {
    // Sinyal kabel: 1 = dicabut, 0 = terpasang.
    var sinyalDicabut = input.cablePlugged ? 0 : 1;

    // NOT: dicabut dibalik menjadi "sedang dicas".
    var dicas = NOT(sinyalDicabut);

    var penuh = input.level >= input.threshold ? 1 : 0;
    var manual = input.manualPressed ? 1 : 0;

    // OR: siap bunyi jika baterai penuh ATAU tombol manual ditekan.
    var siap = OR(penuh, manual);

    // AND: bunyi hanya jika siap DAN kabel masih tersambung.
    var alarm = AND(siap, dicas);

    return {
      sinyalDicabut: sinyalDicabut,
      dicas: dicas,
      penuh: penuh,
      manual: manual,
      siap: siap,
      alarm: alarm
    };
  }

  global.Gates = { NOT: NOT, OR: OR, AND: AND, evaluate: evaluate };
})(window);
