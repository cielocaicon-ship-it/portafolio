/* ============================================================
   Cosas para jugar en el jardín (juegos.html)
   Cielo Yenied Caicedo — Portafolio

   1. Tocar el sol: se hace de noche (o de día). Usa el mismo
      botón de modo claro / oscuro de la página.
   2. Tocar una nube: llueve un ratito y las petunias crecen
      contentas.
   3. Pasar el mouse por una petunia: suelta brillitos.
   (Tocar el pasto para que María lance la pelota ya lo hace
   js/jardin.js.)
   ============================================================ */

(function () {
  "use strict";

  var escena = document.querySelector(".jardin--portada .jardin__escena");
  if (!escena) return;
  var NS = "http://www.w3.org/2000/svg";
  var menosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Pasa un punto de la pantalla a las coordenadas del dibujo
  function alDibujo(x, y) {
    var p = escena.createSVGPoint();
    p.x = x;
    p.y = y;
    return p.matrixTransform(escena.getScreenCTM().inverse());
  }

  /* ---------- 1. El sol: de día a noche ---------- */
  var sol = escena.querySelector(".jardin__sol");
  var botonTema = document.getElementById("botonTema");
  if (sol && botonTema) {
    sol.addEventListener("click", function () {
      sol.classList.remove("jardin__sol--gira");
      void sol.getBoundingClientRect();
      sol.classList.add("jardin__sol--gira");
      botonTema.click();
    });
  }

  /* ---------- 2. Las nubes: lluvia y flores que crecen ---------- */
  var flores = Array.prototype.slice.call(escena.querySelectorAll(".flor"));
  var lloviendo = false;

  function llover(nube) {
    if (lloviendo) return;
    lloviendo = true;
    var caja = nube.getBoundingClientRect();
    var arriba = alDibujo(caja.left, caja.bottom - caja.height * 0.3);
    var abajo = alDibujo(caja.right, caja.bottom);
    var grupo = document.createElementNS(NS, "g");
    grupo.setAttribute("class", "lluvia");
    for (var i = 0; i < 30; i++) {
      var gota = document.createElementNS(NS, "line");
      var x = arriba.x + Math.random() * (abajo.x - arriba.x);
      var y = arriba.y + Math.random() * 20;
      gota.setAttribute("x1", x);
      gota.setAttribute("y1", y);
      gota.setAttribute("x2", x - 4);
      gota.setAttribute("y2", y + 22);
      gota.style.animationDelay = (Math.random() * 0.8).toFixed(2) + "s";
      grupo.appendChild(gota);
    }
    nube.parentNode.insertBefore(grupo, nube);
    nube.classList.add("nube--llueve");

    // Las petunias que quedan debajo de la lluvia crecen
    setTimeout(function () {
      flores.forEach(function (f) {
        var fx = parseFloat(f.getAttribute("data-x"));
        if (fx > arriba.x - 120 && fx < abajo.x + 120) {
          f.classList.remove("flor--riega");
          void f.getBoundingClientRect();
          f.classList.add("flor--riega");
        }
      });
    }, 700);

    setTimeout(function () {
      grupo.remove();
      nube.classList.remove("nube--llueve");
      lloviendo = false;
    }, 2400);
  }

  escena.querySelectorAll(".nube").forEach(function (nube) {
    nube.addEventListener("click", function () { llover(nube); });
  });

  /* ---------- 3. Brillitos al pasar por una petunia ---------- */
  if (!menosMovimiento) {
    flores.forEach(function (f) {
      f.addEventListener("mouseenter", function () {
        var cabeza = f.querySelector(".flor__cabeza");
        if (!cabeza) return;
        var c = cabeza.getBoundingClientRect();
        var centro = alDibujo(c.left + c.width / 2, c.top + c.height / 2);
        for (var i = 0; i < 6; i++) {
          var b = document.createElementNS(NS, "path");
          b.setAttribute("class", "brillito");
          b.setAttribute("d", "M0 -7 C1 -2 2 -1 7 0 C2 1 1 2 0 7 C-1 2 -2 1 -7 0 C-2 -1 -1 -2 0 -7 Z");
          var angulo = (Math.PI * 2 * i) / 6 + Math.random() * 0.5;
          b.setAttribute("transform", "translate(" + centro.x + " " + centro.y + ")");
          b.style.setProperty("--dx", (Math.cos(angulo) * 55).toFixed(0) + "px");
          b.style.setProperty("--dy", (Math.sin(angulo) * 55).toFixed(0) + "px");
          escena.appendChild(b);
          setTimeout(function (el) { el.remove(); }.bind(null, b), 900);
        }
      });
    });
  }
})();
