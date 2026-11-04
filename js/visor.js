/* ============================================================
   Visor de imágenes (lightbox) con galería
   Cielo Yenied Caicedo — Portafolio

   - En Trabajos, cada imagen está envuelta en un enlace al archivo
     original (.post-card__zoom). En el Inicio, las imágenes que se
     pueden ampliar llevan el atributo data-zoom.
   - Las imágenes del mismo trabajo (misma galería) se recorren con
     las flechas ‹ ›, con las teclas ← → o deslizando el dedo.
   - Si este script no se ejecuta, los enlaces siguen funcionando
     y la imagen se abre en el navegador: no se pierde nada.
   ============================================================ */

(function () {
  "use strict";

  var dialogo = document.getElementById("lightbox");
  if (!dialogo || typeof dialogo.showModal !== "function") return;

  var menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var figura = dialogo.querySelector(".lightbox__figure");
  var pie = dialogo.querySelector(".lightbox__caption");
  var cerrar = dialogo.querySelector(".lightbox__close");

  // Botones de anterior/siguiente y contador (se crean aquí para no
  // tener que repetirlos en el HTML de cada página)
  function crearBoton(clase, texto, etiqueta) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = clase;
    b.setAttribute("aria-label", etiqueta);
    b.innerHTML = '<span aria-hidden="true">' + texto + "</span>";
    dialogo.appendChild(b);
    return b;
  }
  var anterior = crearBoton("lightbox__nav lightbox__nav--anterior", "‹", "Imagen anterior");
  var siguiente = crearBoton("lightbox__nav lightbox__nav--siguiente", "›", "Imagen siguiente");
  var contador = document.createElement("p");
  contador.className = "lightbox__contador";
  contador.setAttribute("aria-live", "polite");
  figura.appendChild(contador);

  var grupo = [];        // imágenes de la galería abierta
  var actual = 0;
  var imagen = null;

  /* ---------- Qué se puede ampliar ---------- */
  function origen(el) {
    if (el.tagName === "A") return el.getAttribute("href");
    return el.getAttribute("data-zoom") || el.currentSrc || el.src;
  }

  function texto(el) {
    var img = el.tagName === "IMG" ? el : el.querySelector("img");
    return img ? img.getAttribute("alt") : "";
  }

  function galeriaDe(el) {
    var caja = el.closest("[data-galeria], .post-card__gallery");
    if (!caja) return [el];
    return Array.prototype.slice.call(caja.querySelectorAll(".post-card__zoom, [data-zoom]"));
  }

  /* ---------- Mostrar ---------- */
  function mostrar(indice, direccion) {
    actual = (indice + grupo.length) % grupo.length;
    var el = grupo[actual];
    var nueva = document.createElement("img");
    nueva.className = "lightbox__img";
    if (!menosMovimiento) {
      nueva.classList.add(direccion > 0 ? "lightbox__img--desde-der" : direccion < 0 ? "lightbox__img--desde-izq" : "lightbox__img--entra");
    }
    nueva.src = origen(el);
    nueva.alt = texto(el);
    if (imagen) imagen.remove();
    figura.insertBefore(nueva, pie);
    imagen = nueva;
    pie.textContent = nueva.alt;

    var varias = grupo.length > 1;
    anterior.hidden = !varias;
    siguiente.hidden = !varias;
    contador.hidden = !varias;
    contador.textContent = varias ? (actual + 1) + " de " + grupo.length : "";
  }

  function abrir(el) {
    grupo = galeriaDe(el);
    mostrar(Math.max(0, grupo.indexOf(el)), 0);
    if (!dialogo.open) dialogo.showModal();
  }

  /* ---------- Conectar las imágenes ---------- */
  document.querySelectorAll(".post-card__zoom, [data-zoom]").forEach(function (el) {
    if (el.tagName === "IMG") {
      // Una imagen suelta se vuelve "botón": se puede abrir con teclado
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "button");
      el.setAttribute("aria-label", "Ampliar: " + texto(el));
      el.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          abrir(el);
        }
      });
    }
    el.addEventListener("click", function (e) {
      e.preventDefault();
      abrir(el);
    });
  });

  // En las tarjetas con varias imágenes, la pista "Ampliar" dice cuántas son
  document.querySelectorAll(".post-card__gallery").forEach(function (g) {
    var n = g.querySelectorAll(".post-card__zoom").length;
    if (n < 2) return;
    g.querySelectorAll(".post-card__lupa").forEach(function (l) {
      l.textContent = "Ampliar · " + n + " imágenes";
    });
  });

  /* ---------- Controles del visor ---------- */
  anterior.addEventListener("click", function () { mostrar(actual - 1, -1); });
  siguiente.addEventListener("click", function () { mostrar(actual + 1, 1); });
  cerrar.addEventListener("click", function () { dialogo.close(); });

  dialogo.addEventListener("keydown", function (e) {
    if (grupo.length < 2) return;
    if (e.key === "ArrowRight") { e.preventDefault(); mostrar(actual + 1, 1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); mostrar(actual - 1, -1); }
  });

  // Clic por fuera de la imagen cierra (Escape ya lo maneja el <dialog>)
  dialogo.addEventListener("click", function (e) {
    if (e.target === dialogo) dialogo.close();
  });

  // Deslizar el dedo a los lados en el celular
  var inicioX = null;
  dialogo.addEventListener("touchstart", function (e) {
    inicioX = e.touches[0].clientX;
  }, { passive: true });
  dialogo.addEventListener("touchend", function (e) {
    if (inicioX === null || grupo.length < 2) return;
    var dx = e.changedTouches[0].clientX - inicioX;
    inicioX = null;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) mostrar(actual + 1, 1);
    else mostrar(actual - 1, -1);
  });
})();
