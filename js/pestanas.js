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

  /* [Parcial 2] Si se llega con blog.html#videojuegos (por ejemplo,
     al volver de los juegos), se abre directo la pestaña Videojuegos. */
  if (window.location.hash === "#videojuegos") {
    var juegos = document.getElementById("tab-juegos");
    if (juegos) {
      activar(juegos, false);
      seccion.scrollIntoView();
    }
  }
})();
