/* ============================================================
   Alternador de Modo Oscuro / Claro
   Cielo Yenied Caicedo — Portafolio

   Va en el <head> SIN defer, a propósito: así el tema se pone
   antes de que se pinte la página y no hay "parpadeo" blanco.

   Cómo funciona:
   1. Lee si la persona ya eligió un tema antes (localStorage).
   2. Si nunca eligió, usa el del sistema operativo.
   3. Pone data-theme="dark" o "light" en la etiqueta <html>.
      El CSS cambia los colores según ese atributo.
   4. Cuando la página termina de cargar, conecta el botón.
   ============================================================ */

(function () {
  "use strict";

  var CLAVE = "tema-cielo";      // nombre con el que se guarda la elección
  var raiz = document.documentElement;

  // Lee la elección guardada (try/catch: algunos navegadores bloquean localStorage)
  function leerGuardado() {
    try {
      return localStorage.getItem(CLAVE);
    } catch (error) {
      return null;
    }
  }

  function guardar(tema) {
    try {
      localStorage.setItem(CLAVE, tema);
    } catch (error) {
      // Si no se puede guardar, el tema igual cambia; solo no se recuerda
    }
  }

  // Tema del sistema operativo (por si nunca ha elegido)
  function temaDelSistema() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function aplicar(tema) {
    raiz.setAttribute("data-theme", tema);
  }

  // 1, 2 y 3: se ejecuta de una vez, antes de pintar
  aplicar(leerGuardado() || temaDelSistema());

  // 4. Conectar el botón cuando ya existe en la página
  function actualizarBoton(boton) {
    var oscuro = raiz.getAttribute("data-theme") === "dark";
    // aria-pressed le dice al lector de pantalla si el modo oscuro está activo
    boton.setAttribute("aria-pressed", oscuro ? "true" : "false");
    var texto = boton.querySelector(".tema-btn__texto");
    var icono = boton.querySelector(".tema-btn__icono");
    if (texto) texto.textContent = oscuro ? "Modo claro" : "Modo oscuro";
    if (icono) icono.textContent = oscuro ? "☀" : "☾";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var boton = document.getElementById("botonTema");
    if (!boton) return;
    actualizarBoton(boton);

    boton.addEventListener("click", function () {
      var nuevo = raiz.getAttribute("data-theme") === "dark" ? "light" : "dark";
      aplicar(nuevo);
      guardar(nuevo);
      actualizarBoton(boton);
      // Aviso para los juegos: vuelven a leer los colores del CSS
      window.dispatchEvent(new CustomEvent("tema:cambio", { detail: nuevo }));
    });
  });
})();
