/* ============================================================
   Pantalla de juego (futbol.html, pingpong.html y los demás)
   Cielo Yenied Caicedo — Portafolio

   El juego va dentro de un <iframe> que ocupa toda la pantalla,
   con una barrita arriba para volver al portafolio.
   Este script solo hace dos cosas:
   1. Le pasa el teclado al juego apenas carga (así no hay que
      hacer clic primero).
   2. Si el juego recibe la tecla Escape mientras la ayuda está
      abierta, cierra la ayuda.
   ============================================================ */

(function () {
  "use strict";

  var juego = document.getElementById("juego");
  var ayuda = document.querySelector(".jugador__ayuda");

  // 1. Al cargar el juego, el foco (teclado) pasa al juego
  juego.addEventListener("load", function () {
    try {
      juego.contentWindow.focus();
    } catch (error) {
      // Si el navegador no deja, basta con tocar el juego
    }
  });

  // 2. Al cerrar la ayuda, el teclado vuelve al juego
  if (ayuda) {
    ayuda.addEventListener("toggle", function () {
      if (!ayuda.open) juego.focus();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && ayuda.open) ayuda.open = false;
    });
  }
})();
