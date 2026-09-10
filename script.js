// Portfolio — Siaci Abdennour
// Comportement partagé par toutes les pages : effet de scroll sur la nav,
// menu mobile, et repli propre si la photo de profil est absente.

document.addEventListener("DOMContentLoaded", function () {
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  // Effet de scroll sur la navbar
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 50) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Menu hamburger mobile
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.textContent = isOpen ? "✕" : "☰";
    });

    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "☰";
      });
    });
  }

  // Note : le repli sur les initiales si photo.jpg est absente est géré
  // directement par l'attribut onerror de la balise <img> (index.html),
  // car l'événement "error" se déclenche souvent avant que ce script
  // n'ait eu le temps d'attacher un écouteur.
});
