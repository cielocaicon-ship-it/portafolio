/* ============================================================
   Movimiento al bajar por la página
   Cielo Yenied Caicedo — Portafolio

   Hace dos cosas:
   1. Crea la barra de lectura de tres colores que va arriba.
   2. Hace que las secciones aparezcan al llegar a ellas.

   Sin este script la página se ve completa: nada empieza oculto
   en el HTML ni en el CSS. Solo se esconde lo que este mismo
   script sabe que después va a destapar.
   ============================================================ */

(function () {
  "use strict";

  var raiz = document.documentElement;

  /* ---------- 1. Barra de lectura ---------- */
  var barra = document.createElement("span");
  barra.className = "progreso";
  barra.setAttribute("aria-hidden", "true");
  document.body.appendChild(barra);

  var pendiente = false;

  function medir() {
    pendiente = false;
    var recorrido = raiz.scrollHeight - window.innerHeight;
    var avance = recorrido > 0 ? window.scrollY / recorrido : 0;
    avance = Math.min(1, Math.max(0, avance));
    barra.style.setProperty("--avance", avance.toFixed(4));
  }

  /* requestAnimationFrame: se recalcula como mucho una vez por cuadro,
     así el scroll no se pone pesado. */
  window.addEventListener("scroll", function () {
    if (!pendiente) {
      pendiente = true;
      window.requestAnimationFrame(medir);
    }
  }, { passive: true });

  window.addEventListener("resize", medir);
  medir();

  /* ---------- 2. Aparecer al bajar ---------- */
  var menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (menosMovimiento || !("IntersectionObserver" in window)) {
    return;
  }

  var selectores = [
    "main > section > .section-title",
    ".about__text",
    ".about__subtitle",
    ".tool-list",
    ".about__portrait",
    ".skills__list li",
    ".skills__aside",
    ".projects__item"
  ];

  var elementos = document.querySelectorAll(selectores.join(","));

  var vigia = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.classList.remove("revela--espera");
        entrada.target.classList.add("revela--visto");
        vigia.unobserve(entrada.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.1 });

  var altoPantalla = window.innerHeight;

  Array.prototype.forEach.call(elementos, function (elemento) {
    /* Lo que ya se ve al cargar no se toca: el primer pantallazo
       siempre está completo. */
    if (elemento.getBoundingClientRect().top < altoPantalla) {
      return;
    }

    /* Los elementos de una lista entran uno detrás de otro. */
    if (elemento.tagName === "LI") {
      var orden = Array.prototype.indexOf.call(elemento.parentElement.children, elemento);
      elemento.style.setProperty("--orden", orden % 6);
    }

    elemento.classList.add("revela--espera");
    vigia.observe(elemento);
  });
})();
