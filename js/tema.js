/* ============================================================
   Alternador de Modo Oscuro / Claro
   Cielo Yenied Caicedo — Portafolio

   Va en el <head> SIN defer, a propósito: así el tema se pone
   antes de que se pinte la página y no hay "parpadeo".

   Cómo funciona:
   1. La página SIEMPRE empieza en modo claro, sin importar si el
      celular o el computador están en modo oscuro.
   2. Si la persona toca el botón, se guarda su elección y se
      respeta al cambiar de página.
   3. La elección se guarda en tres lugares, por si el navegador
      bloquea alguno (pasa en modo incógnito o en vistas previas):
      localStorage, sessionStorage y window.name (este último
      sobrevive al cambiar de página en la misma pestaña).
   4. Pone data-theme="dark" o "light" en la etiqueta <html>.
      El CSS cambia los colores según ese atributo.
   ============================================================ */

(function () {
  "use strict";

  var CLAVE = "tema-cielo";      // nombre con el que se guarda la elección
  var raiz = document.documentElement;

  function valido(tema) {
    return tema === "dark" || tema === "light" ? tema : null;
  }

  // Lee window.name, que guarda algo como "tema-cielo=dark"
  function leerNombreVentana() {
    try {
      var m = /(?:^|;)tema-cielo=(dark|light)/.exec(window.name || "");
      return m ? m[1] : null;
    } catch (error) {
      return null;
    }
  }

  // Primero lo más reciente de esta pestaña (window.name y sessionStorage)
  // y después lo guardado de visitas anteriores (localStorage)
  function leerGuardado() {
    var tema = leerNombreVentana();
    if (!tema) {
      try { tema = valido(sessionStorage.getItem(CLAVE)); } catch (error) { /* bloqueado */ }
    }
    if (!tema) {
      try { tema = valido(localStorage.getItem(CLAVE)); } catch (error) { /* bloqueado */ }
    }
    return tema;
  }

  function guardar(tema) {
    try { localStorage.setItem(CLAVE, tema); } catch (error) { /* bloqueado */ }
    try { sessionStorage.setItem(CLAVE, tema); } catch (error) { /* bloqueado */ }
    try {
      var resto = (window.name || "").replace(/(?:^|;)tema-cielo=(dark|light)/, "");
      window.name = (resto ? resto + ";" : "") + "tema-cielo=" + tema;
    } catch (error) { /* bloqueado */ }
  }

  function aplicar(tema) {
    raiz.setAttribute("data-theme", tema);
  }

  // 1 y 4: claro, salvo que la persona haya elegido oscuro antes
  aplicar(leerGuardado() || "light");

  function actualizarBoton(boton) {
    var oscuro = raiz.getAttribute("data-theme") === "dark";
    // aria-pressed le dice al lector de pantalla si el modo oscuro está activo
    boton.setAttribute("aria-pressed", oscuro ? "true" : "false");
    // El botón solo muestra un ícono: en claro la luna (para pasar a oscuro)
    // y en oscuro el sol. El nombre lo leen los lectores de pantalla.
    var etiqueta = oscuro ? "Activar modo claro" : "Activar modo oscuro";
    boton.setAttribute("aria-label", etiqueta);
    boton.setAttribute("title", oscuro ? "Modo claro" : "Modo oscuro");
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
      // Pequeño giro del ícono al cambiar
      boton.classList.remove("tema-btn--gira");
      void boton.offsetWidth;
      boton.classList.add("tema-btn--gira");
      // Aviso para los juegos: vuelven a leer los colores del CSS
      window.dispatchEvent(new CustomEvent("tema:cambio", { detail: nuevo }));
    });
  });

  // 2. Si se vuelve con el botón Atrás, la página puede venir de la memoria
  //    con el tema viejo: se vuelve a leer la elección.
  window.addEventListener("pageshow", function () {
    var tema = leerGuardado() || "light";
    if (raiz.getAttribute("data-theme") !== tema) {
      aplicar(tema);
      var boton = document.getElementById("botonTema");
      if (boton) actualizarBoton(boton);
    }
  });
})();
