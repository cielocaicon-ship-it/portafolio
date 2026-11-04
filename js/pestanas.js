/* ============================================================
   Pestañas de la sección Trabajos
   Cielo Yenied Caicedo — Portafolio

   Sin este script, la barra de pestañas queda oculta por CSS y
   los tres grupos se ven uno debajo del otro: el contenido nunca
   queda inalcanzable. El script enciende la barra y deja visible
   un grupo a la vez.
   ============================================================ */

(function () {
  "use strict";

  var seccion = document.querySelector(".obra");
  if (!seccion) {
    return;
  }

  var pestanas = seccion.querySelectorAll(".obra__tab");
  var paneles = seccion.querySelectorAll(".obra__panel");

  if (!pestanas.length || pestanas.length !== paneles.length) {
    return;
  }

  /* Esta clase es la que muestra la barra: solo aparece si el
     script llegó hasta acá. */
  seccion.classList.add("obra--interactiva");

  function activar(pestana, moverFoco) {
    Array.prototype.forEach.call(pestanas, function (otra) {
      var elegida = otra === pestana;
      otra.setAttribute("aria-selected", elegida ? "true" : "false");
      otra.tabIndex = elegida ? 0 : -1;
      document.getElementById(otra.getAttribute("aria-controls")).hidden = !elegida;
    });

    if (moverFoco) {
      pestana.focus();
    }
  }

  Array.prototype.forEach.call(pestanas, function (pestana, indice) {
    pestana.addEventListener("click", function () {
      activar(pestana, false);
    });

    /* Flechas izquierda y derecha para moverse entre pestañas,
       Inicio y Fin para saltar a los extremos. */
    pestana.addEventListener("keydown", function (evento) {
      var destino = null;

      if (evento.key === "ArrowRight") {
        destino = pestanas[(indice + 1) % pestanas.length];
      } else if (evento.key === "ArrowLeft") {
        destino = pestanas[(indice - 1 + pestanas.length) % pestanas.length];
      } else if (evento.key === "Home") {
        destino = pestanas[0];
      } else if (evento.key === "End") {
        destino = pestanas[pestanas.length - 1];
      }

      if (destino) {
        evento.preventDefault();
        activar(destino, true);
      }
    });
  });

  /* Si se llega con un enlace como blog.html#videojuegos o blog.html#web
     se abre directo esa pestaña. Y si el enlace es a un trabajo
     (blog.html#trabajo-granorte), se abre su pestaña, se baja hasta él
     y se resalta un momento. */
  var porEnlace = { "#diseno": "tab-diseno", "#posproduccion": "tab-post", "#videojuegos": "tab-juegos", "#web": "tab-web" };
  var hash = window.location.hash;
  var elegida = document.getElementById(porEnlace[hash] || "");
  var trabajo = null;
  if (!elegida && hash.indexOf("#trabajo-") === 0) {
    trabajo = document.getElementById(hash.slice(1));
    var panel = trabajo && trabajo.closest(".obra__panel");
    if (panel) elegida = seccion.querySelector('[aria-controls="' + panel.id + '"]');
  }
  if (elegida) {
    activar(elegida, false);
    if (trabajo) {
      trabajo.scrollIntoView({ block: "center" });
      trabajo.classList.add("trabajo--destacado");
      setTimeout(function () { trabajo.classList.remove("trabajo--destacado"); }, 2600);
    } else {
      seccion.scrollIntoView();
    }
  }
})();
