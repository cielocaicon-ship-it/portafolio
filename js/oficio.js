/* ============================================================
   Interacciones de "Lo que hago" (index.html) y de la
   Hoja de vida (hoja-de-vida.html)
   Cielo Yenied Caicedo — Portafolio

   1. Tarjetas que se voltean al tocarlas y llevan a un trabajo al azar.
   2. Contadores que suben de 0 al número cuando aparecen en pantalla.
   3. Línea de tiempo: cada punto se "enciende" al llegar a él.
   Sin este script todo se ve completo: las tarjetas muestran
   su texto y los números ya están escritos en el HTML.
   ============================================================ */

(function () {
  "use strict";

  var menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("con-js");

  /* ---------- 1. Tarjetas que se voltean ----------
     Por delante: ícono y nombre del área. Al tocarla se voltea y
     muestra qué hago ahí, con qué programas y un botón
     "Ver un trabajo" que lleva cada vez a un trabajo distinto. */
  var TRABAJOS = {
    diseno: ["blog.html#trabajo-cajita", "blog.html#trabajo-perfumeria", "blog.html#trabajo-revista",
             "blog.html#trabajo-granorte", "blog.html#trabajo-pixel-art", "blog.html#trabajo-ferrari"],
    audiovisual: ["blog.html#trabajo-colegio", "blog.html#trabajo-perfumeria-video", "blog.html#trabajo-empaque-animado"],
    animacion: ["blog.html#trabajo-empaque-animado", "juegos.html#juego-condor-de-los-andes", "juegos.html#juego-noche-de-espantos", "juegos.html#juego-turbopix-gp"],
    juegos: ["juegos.html#juego-petugol", "juegos.html#juego-petupong", "juegos.html#juego-noche-de-espantos",
             "juegos.html#juego-condor-de-los-andes", "juegos.html#juego-estanco-nucita", "juegos.html#juego-turbopix-gp"],
    web: ["blog.html#trabajo-slotnova", "juegos.html#juego-petugol", "juegos.html#juego-petupong"],
    marketing: ["blog.html#trabajo-perfumeria", "blog.html#trabajo-perfumeria-video", "blog.html#trabajo-granorte"]
  };

  // Elige uno al azar, sin repetir el último que se vio de esa área
  function alAzar(area) {
    var lista = TRABAJOS[area] || [];
    if (!lista.length) return null;
    var clave = "ultimo-trabajo-" + area;
    var ultimo = null;
    try { ultimo = sessionStorage.getItem(clave); } catch (error) { /* bloqueado */ }
    var opciones = lista.length > 1 ? lista.filter(function (t) { return t !== ultimo; }) : lista;
    var elegido = opciones[Math.floor(Math.random() * opciones.length)];
    try { sessionStorage.setItem(clave, elegido); } catch (error) { /* bloqueado */ }
    return elegido;
  }

  document.querySelectorAll(".oficio-card").forEach(function (tarjeta) {
    var frente = tarjeta.querySelector(".oficio-card__cara--frente");
    var volver = tarjeta.querySelector(".oficio-card__volver");
    var ver = tarjeta.querySelector(".oficio-card__ver");

    function voltear(mostrarAtras) {
      tarjeta.classList.toggle("oficio-card--volteada", mostrarAtras);
      frente.setAttribute("aria-expanded", mostrarAtras ? "true" : "false");
      if (mostrarAtras) {
        if (ver) setTimeout(function () { ver.focus({ preventScroll: true }); }, 50);
      } else {
        frente.focus({ preventScroll: true });
      }
    }

    frente.addEventListener("click", function () { voltear(true); });
    if (volver) volver.addEventListener("click", function () { voltear(false); });

    if (ver) {
      ver.addEventListener("click", function (e) {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
        var destino = alAzar(tarjeta.getAttribute("data-area"));
        if (!destino) return;
        e.preventDefault();
        tarjeta.classList.add("oficio-card--sale");
        setTimeout(function () { window.location.href = destino; }, menosMovimiento ? 0 : 280);
      });
    }
  });

  // Al volver con el botón Atrás, las tarjetas quedan normales
  window.addEventListener("pageshow", function () {
    document.querySelectorAll(".oficio-card--sale").forEach(function (t) { t.classList.remove("oficio-card--sale"); });
  });

  if (!("IntersectionObserver" in window)) return;

  /* ---------- 2. Contadores ---------- */
  function contar(el) {
    var hasta = parseInt(el.getAttribute("data-hasta"), 10) || 0;
    var sufijo = el.getAttribute("data-sufijo") || "";
    if (menosMovimiento) {
      el.textContent = hasta + sufijo;
      return;
    }
    var duracion = 1200;      // milisegundos
    var inicio = null;
    function paso(ahora) {
      if (inicio === null) inicio = ahora;
      var avance = Math.min((ahora - inicio) / duracion, 1);
      var suave = 1 - Math.pow(1 - avance, 3);   // frena al final
      el.textContent = Math.round(hasta * suave) + sufijo;
      if (avance < 1) requestAnimationFrame(paso);
    }
    el.textContent = "0" + sufijo;
    requestAnimationFrame(paso);
  }

  var vigiaContador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      contar(entrada.target);
      vigiaContador.unobserve(entrada.target);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll(".contador").forEach(function (el) {
    vigiaContador.observe(el);
  });

  /* ---------- 3. Línea de tiempo ---------- */
  var vigiaLinea = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add("linea__item--visto");
      vigiaLinea.unobserve(entrada.target);
    });
  }, { rootMargin: "0px 0px -15% 0px" });

  document.querySelectorAll(".linea__item").forEach(function (item) {
    vigiaLinea.observe(item);
  });
})();
