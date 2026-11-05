/* ============================================================
   Pantalla de juego (futbol.html, pingpong.html y los demás)
   Cielo Yenied Caicedo — Portafolio

   El juego va dentro de un <iframe> que ocupa toda la pantalla,
   con una barrita arriba para volver al portafolio.
   Este script hace tres cosas:
   0. Si la página se abrió desde el QR de una sala (?sala=CODIGO),
      le pasa ese código al juego.
   1. Le pasa el teclado al juego apenas carga (así no hay que
      hacer clic primero).
   2. Si el juego recibe la tecla Escape mientras la ayuda está
      abierta, cierra la ayuda.
   ============================================================ */

(function () {
  "use strict";

  var juego = document.getElementById("juego");
  var ayuda = document.querySelector(".jugador__ayuda");

  // 0. Si llegaste escaneando el QR de una sala (…?sala=CODIGO),
  //    el código pasa al juego para que entres directo a esa sala
  var sala = "";
  try {
    sala = new URLSearchParams(location.search).get("sala") || "";
  } catch (error) {
    sala = "";
  }
  sala = sala.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
  if (sala) {
    juego.src = juego.getAttribute("src").split("?")[0] + "?sala=" + sala;
    try {
      history.replaceState(null, "", location.pathname);
    } catch (error) {
      // Si el navegador no deja, la dirección queda con el código
    }
  }

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
