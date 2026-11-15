/* ============================================================
   Ver los videos en grande (Trabajos)
   Cielo Yenied Caicedo — Portafolio

   Cada video de las tarjetas lleva un botón "Ampliar". Al tocarlo
   se abre una ventana oscura con el video grande, en el mismo
   punto donde iba, y con sonido. Se cierra con la X, con Escape
   o tocando fuera del video.
   ============================================================ */

(function () {
  "use strict";

  var videos = document.querySelectorAll(".blog__list .post-card__video");
  if (!videos.length || typeof HTMLDialogElement === "undefined") return;

  // Una sola ventana para todos los videos
  var ventana = document.createElement("dialog");
  ventana.className = "video-grande";
  ventana.setAttribute("aria-label", "Video ampliado");
  ventana.innerHTML =
    '<button class="video-grande__cerrar" type="button" aria-label="Cerrar el video">&times;</button>' +
    '<video class="video-grande__video" controls playsinline></video>';
  document.body.appendChild(ventana);

  var grande = ventana.querySelector(".video-grande__video");
  var deDonde = null;   // el video de la tarjeta que se amplió

  function abrir(chico) {
    deDonde = chico;
    var fuente = chico.querySelector("source");
    grande.src = fuente ? fuente.src : chico.currentSrc;
    grande.poster = chico.poster || "";
    grande.classList.toggle("video-grande__video--vertical",
      chico.classList.contains("post-card__video--vertical"));
    var desde = chico.currentTime || 0;
    chico.pause();
    ventana.showModal();
    grande.addEventListener("loadedmetadata", function irAlPunto() {
      grande.removeEventListener("loadedmetadata", irAlPunto);
      if (desde) grande.currentTime = desde;
      grande.play().catch(function () { /* si el navegador no deja, se le da play a mano */ });
    });
  }

  function cerrar() {
    if (deDonde && grande.currentTime) {
      deDonde.currentTime = grande.currentTime;   // la tarjeta sigue donde quedó
    }
    grande.pause();
    grande.removeAttribute("src");
    grande.load();
    if (ventana.open) ventana.close();
  }

  videos.forEach(function (chico) {
    var boton = document.createElement("button");
    boton.type = "button";
    boton.className = "video-ampliar";
    boton.innerHTML = '<span aria-hidden="true">⤢</span> Ampliar';
    boton.setAttribute("aria-label", "Ver el video en grande");
    boton.addEventListener("click", function () { abrir(chico); });
    chico.parentElement.appendChild(boton);
  });

  ventana.querySelector(".video-grande__cerrar").addEventListener("click", cerrar);
  ventana.addEventListener("cancel", function (e) { e.preventDefault(); cerrar(); });
  // Tocar el fondo oscuro (fuera del video) también cierra
  ventana.addEventListener("click", function (e) {
    if (e.target === ventana) cerrar();
  });
})();
