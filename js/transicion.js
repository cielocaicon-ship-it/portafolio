/* ============================================================
   Cortina de color al cambiar de página
   Cielo Yenied Caicedo — Portafolio

   Al tocar un enlace a otra página del portafolio:
   1. Suben tres franjas de color (terracota, azul y verde) que
      tapan la pantalla.
   2. Se abre la página nueva.
   3. En la página nueva las franjas siguen subiendo y la destapan.

   Va en el <head> SIN defer: así la página nueva empieza tapada
   y no se ve un "parpadeo" antes de que la cortina se vaya.
   Si la persona pidió "reducir movimiento", no hay cortina.
   ============================================================ */

(function () {
  "use strict";

  var CLAVE = "cortina-cielo";
  var raiz = document.documentElement;
  var menosMovimiento = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (menosMovimiento) return;

  /* ---------- 3. Llegada: la cortina se va ---------- */
  var vieneConCortina = false;
  try {
    vieneConCortina = sessionStorage.getItem(CLAVE) === "1";
    sessionStorage.removeItem(CLAVE);
  } catch (error) {
    vieneConCortina = false;
  }

  if (vieneConCortina) {
    raiz.classList.add("cortina-llega");
    setTimeout(function () { raiz.classList.remove("cortina-llega"); }, 1000);
  }

  /* ---------- 1 y 2. Salida: la cortina sube y se abre la página ---------- */
  function esPaginaInterna(enlace) {
    if (!enlace || !enlace.href) return false;
    if (enlace.target && enlace.target !== "_self") return false;
    if (enlace.hasAttribute("download")) return false;
    var url;
    try {
      url = new URL(enlace.href, location.href);
    } catch (error) {
      return false;
    }
    if (url.origin !== location.origin) return false;
    // Solo páginas .html (no imágenes, videos ni documentos)
    if (!/(\.html|\/)$/.test(url.pathname)) return false;
    // Un salto dentro de la misma página (#algo) no lleva cortina
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return false;
    return true;
  }

  function cerrarCortina(destino) {
    var cortina = document.createElement("div");
    cortina.className = "cortina";
    cortina.setAttribute("aria-hidden", "true");
    cortina.innerHTML = "<span></span><span></span><span></span>";
    document.body.appendChild(cortina);
    void cortina.offsetWidth;            // para que la animación arranque
    cortina.classList.add("cortina--sube");
    try {
      sessionStorage.setItem(CLAVE, "1");
    } catch (error) {
      // sin almacenamiento solo no habrá cortina al llegar
    }
    setTimeout(function () { window.location.href = destino; }, 560);
  }

  // Otros scripts (por ejemplo "Ver un trabajo") pueden usarla también
  window.cortinaA = cerrarCortina;

  document.addEventListener("click", function (e) {
    // Si otro script ya se encargó del clic (el visor, las cartas
    // de los juegos...), la cortina no se mete
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    var enlace = e.target.closest && e.target.closest("a");
    if (!esPaginaInterna(enlace)) return;
    e.preventDefault();
    cerrarCortina(enlace.href);
  });

  // Si se vuelve con el botón Atrás, se quita la cortina que quedó puesta
  window.addEventListener("pageshow", function (e) {
    if (!e.persisted) return;
    document.querySelectorAll(".cortina").forEach(function (c) { c.remove(); });
    raiz.classList.remove("cortina-llega");
  });
})();
