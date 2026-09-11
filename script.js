// Portfolio — Siaci Abdennour
// Comportement partagé par toutes les pages : effet de scroll sur la nav,
// menu mobile, animations au scroll, effet de frappe et compteurs animés.

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

  // ---- Animations au scroll (reveal) ----
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
      );
      revealEls.forEach(function (el) {
        io.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add("visible");
      });
    }
  }

  // ---- Barres de compétence animées (se remplissent au scroll) ----
  var langCards = document.querySelectorAll(".lang-card");
  if (langCards.length && "IntersectionObserver" in window) {
    var langIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            langIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    langCards.forEach(function (el) {
      langIo.observe(el);
    });
  } else {
    langCards.forEach(function (el) {
      el.classList.add("revealed");
    });
  }

  // ---- Compteurs animés (stats) ----
  var stats = document.querySelectorAll(".stat .num[data-count]");
  if (stats.length) {
    var animateCount = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      var duration = 1200;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var value = Math.round(progress * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    };
    if ("IntersectionObserver" in window) {
      var statIo = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              statIo.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      stats.forEach(function (el) {
        statIo.observe(el);
      });
    } else {
      stats.forEach(animateCount);
    }
  }

  // ---- Effet de frappe sur le sous-titre du hero ----
  var typedEl = document.querySelector("[data-typed]");
  if (typedEl) {
    var roles = typedEl.getAttribute("data-typed").split("|");
    var roleIndex = 0;
    var charIndex = 0;
    var deleting = false;

    var textSpan = document.createElement("span");
    var cursorSpan = document.createElement("span");
    cursorSpan.className = "typed-cursor";
    typedEl.textContent = "";
    typedEl.appendChild(textSpan);
    typedEl.appendChild(cursorSpan);

    function tick() {
      var current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        textSpan.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
        setTimeout(tick, 55);
      } else {
        charIndex--;
        textSpan.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(tick, 300);
          return;
        }
        setTimeout(tick, 30);
      }
    }
    tick();
  }
});
