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

  // ---- Anneaux de progression radiaux (compétences détaillées) ----
  var radialCards = document.querySelectorAll(".radial-card");
  if (radialCards.length && "IntersectionObserver" in window) {
    var radialIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            radialIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    radialCards.forEach(function (el) {
      radialIo.observe(el);
    });
  } else {
    radialCards.forEach(function (el) {
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
        else el.classList.add("counted");
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

  // ---- Effet "spotlight" qui suit la souris sur les cartes ----
  var glowSelector = ".card, .lang-card, .interest-card, .project, .radial-card, .resume, .case-study, .ai-tools-tag";
  var glowEls = document.querySelectorAll(glowSelector);
  if (glowEls.length && window.matchMedia("(hover: hover)").matches) {
    glowEls.forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--mx", x + "%");
        el.style.setProperty("--my", y + "%");
      });
    });
  }
});

// ==========================================================
// Couche d'animation : curseurs pixel colorés, inspecteur qui suit
// la souris, apparitions au scroll, cartes 3D, boutons magnétiques.
// Tout est coupé si l'utilisateur préfère moins d'animations.
// ==========================================================
document.addEventListener("DOMContentLoaded", function () {
  var root = document.documentElement;
  var isEN = root.lang === "en";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var hasIO = "IntersectionObserver" in window;

  function onVisible(els, cb, threshold) {
    els = Array.prototype.slice.call(els);
    if (!els.length) return;
    if (!hasIO) return els.forEach(cb);
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            obs.unobserve(entry.target);
            cb(entry.target);
          }
        });
      },
      { threshold: threshold || 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach(function (el) {
      obs.observe(el);
    });
  }

  // ---------- Barre de progression + retour en haut ----------
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  var toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.type = "button";
  toTop.setAttribute("aria-label", isEN ? "Back to top" : "Retour en haut");
  toTop.innerHTML = '<span class="fill" aria-hidden="true"></span><span class="chev" aria-hidden="true"></span>';
  document.body.appendChild(toTop);
  var toTopFill = toTop.querySelector(".fill");
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  });

  var timeline = document.querySelector(".timeline");
  var ticking = false;
  function updateScroll() {
    ticking = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    progress.style.transform = "scaleX(" + ratio + ")";
    toTopFill.style.transform = "scaleY(" + ratio + ")";
    toTop.classList.toggle("show", window.scrollY > 500);
    if (timeline && !reduced) {
      var r = timeline.getBoundingClientRect();
      var seen = (window.innerHeight * 0.75 - r.top) / r.height;
      timeline.style.setProperty("--line", Math.max(0, Math.min(seen, 1)));
    }
  }
  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateScroll);
    }
  }, { passive: true });
  window.addEventListener("resize", updateScroll);
  updateScroll();

  // ---------- Avatar dans un cadre d'inspecteur ----------
  var avatar = document.querySelector(".split-hero .avatar-wrap");
  if (avatar) {
    var stage = document.createElement("div");
    stage.className = "avatar-stage";
    avatar.parentNode.insertBefore(stage, avatar);
    stage.appendChild(avatar);
    var frame = document.createElement("span");
    frame.className = "avatar-frame";
    frame.setAttribute("aria-hidden", "true");
    frame.innerHTML = "<i></i><i></i><i></i><i></i><b>Siaci Abdennour · Java</b><u></u>";
    stage.appendChild(frame);
    var sizeLabel = frame.querySelector("u");
    var setSize = function () {
      sizeLabel.textContent = Math.round(avatar.offsetWidth) + " × " + Math.round(avatar.offsetHeight);
    };
    setSize();
    window.addEventListener("resize", setSize);
  }

  // ---------- Effet d'onde au clic sur les boutons ----------
  document.querySelectorAll(".btn, .btn-outline").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      if (reduced) return;
      var r = btn.getBoundingClientRect();
      var size = Math.max(r.width, r.height);
      var dot = document.createElement("span");
      dot.className = "ripple";
      dot.style.width = dot.style.height = size + "px";
      dot.style.left = e.clientX - r.left - size / 2 + "px";
      dot.style.top = e.clientY - r.top - size / 2 + "px";
      btn.appendChild(dot);
      setTimeout(function () { dot.remove(); }, 650);
    });
  });

  if (reduced) return;

  // Nom court d'un élément, façon inspecteur de code (ex. « a.btn »)
  function labelFor(el) {
    var tag = el.tagName.toLowerCase();
    var cls = (el.className && typeof el.className === "string" ? el.className : "")
      .split(/\s+/)
      .filter(function (c) {
        return c && !/^(reveal|visible|tilt|tilting|stagger|in|done|from-left)$/.test(c);
      })[0];
    return tag + (cls ? "." + cls : "");
  }

  // ---------- Apparitions en cascade dans les grilles ----------
  var staggerEls = document.querySelectorAll(
    ".lang-grid, .interest-grid, .about-highlights, .stats-row, .radial-grid, .secondary-projects, .stat-chips, .contact-split .cards"
  );
  staggerEls.forEach(function (grid) {
    grid.classList.add("stagger");
    Array.prototype.forEach.call(grid.children, function (child, i) {
      child.style.setProperty("--si", i);
    });
  });

  // Éléments des pages internes qui n'avaient pas d'apparition
  document.querySelectorAll(".project, .resume, .item, .case-study, .card").forEach(function (el) {
    if (el.closest(".reveal") || el.closest(".stagger")) return;
    el.classList.add("reveal");
    if (el.classList.contains("item")) el.classList.add("from-left");
  });

  onVisible(staggerEls, function (grid) {
    grid.classList.add("in");
    setTimeout(function () { grid.classList.add("done"); }, 700 + grid.children.length * 80);
  });

  onVisible(document.querySelectorAll(".reveal"), function (el) {
    el.classList.add("visible");
  });

  // ---------- Transitions entre les pages ----------
  document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === "_blank" || a.hasAttribute("download")) return;
    var href = a.getAttribute("href") || "";
    if (!href || href.charAt(0) === "#" || /^(mailto:|tel:|javascript:)/i.test(href) || /\.pdf($|\?)/i.test(href)) return;
    if (a.origin !== window.location.origin) return;
    if (a.pathname === window.location.pathname && a.hash) return;
    e.preventDefault();
    document.body.classList.add("page-leave");
    setTimeout(function () { window.location.href = a.href; }, 260);
  });
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) document.body.classList.remove("page-leave");
  });

  // ---------- Curseurs pixel colorés (canvas) ----------
  var canvas = document.createElement("canvas");
  canvas.className = "pixel-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.insertBefore(canvas, document.body.firstChild);
  var ctx = canvas.getContext("2d");
  var W = 0, H = 0, dpr = 1;
  var COLORS = ["#3d7bff", "#ff8a1f", "#3ddc84", "#ff4d8d", "#ffd23d", "#38d9f5", "#a77bff"];
  // Flèche de curseur en pixel art : 1 = couleur, 2 = reflet clair
  var ARROW = [
    "1.......",
    "11......",
    "121.....",
    "1221....",
    "12221...",
    "122221..",
    "1222221.",
    "12222221",
    "1221111.",
    "121.11..",
    "11...11.",
    "1....11."
  ];
  var CHEVRON = ["1..", ".1.", "..1", ".1.", "1.."];
  var sprites = [];
  var mouse = { x: -9999, y: -9999 };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
  }
  resize();
  window.addEventListener("resize", resize);

  function spawn(x, y, speed, life, kind) {
    var a = Math.random() * Math.PI * 2;
    var s = speed * (0.5 + Math.random());
    sprites.push({
      x: x, y: y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      kind: kind || (Math.random() < 0.55 ? "arrow" : "streak"),
      px: Math.random() < 0.5 ? 2 : 3,
      life: life,
      max: life,
      wobble: Math.random() * 6
    });
  }

  var ambient = W < 700 ? 6 : 11;
  for (var k = 0; k < ambient; k++) {
    spawn(Math.random() * W, Math.random() * H, 0.9, Infinity);
  }

  function drawPattern(p, rows, alpha) {
    ctx.globalAlpha = alpha;
    for (var r = 0; r < rows.length; r++) {
      for (var c = 0; c < rows[r].length; c++) {
        var ch = rows[r].charAt(c);
        if (ch === ".") continue;
        ctx.fillStyle = ch === "2" ? "rgba(255,255,255,0.85)" : p.color;
        ctx.fillRect(c * p.px, r * p.px, p.px, p.px);
      }
    }
  }

  var running = true;
  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
    if (running) requestAnimationFrame(draw);
  });

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    for (var i = sprites.length - 1; i >= 0; i--) {
      var p = sprites[i];
      // Les curseurs s'écartent de la souris
      var dx = p.x - mouse.x, dy = p.y - mouse.y;
      var d2 = dx * dx + dy * dy;
      if (d2 < 120 * 120 && d2 > 1) {
        var f = 0.35 / Math.sqrt(d2);
        p.vx += dx * f * 0.08;
        p.vy += dy * f * 0.08;
      }
      if (p.life === Infinity) {
        var sp = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (sp > 1.6) { p.vx *= 0.97; p.vy *= 0.97; }
      } else {
        p.vx *= 0.975;
        p.vy *= 0.975;
        p.life--;
        if (p.life <= 0) { sprites.splice(i, 1); continue; }
      }
      p.x += p.vx;
      p.y += p.vy;
      if (p.life === Infinity) {
        if (p.x < -40) p.x = W + 40;
        if (p.x > W + 40) p.x = -40;
        if (p.y < -40) p.y = H + 40;
        if (p.y > H + 40) p.y = -40;
      }
      var alpha = p.life === Infinity ? 0.7 : Math.min(1, p.life / (p.max * 0.4));
      var angle = Math.atan2(p.vy, p.vx);
      ctx.save();
      ctx.translate(Math.round(p.x), Math.round(p.y));
      if (p.kind === "arrow") {
        // La pointe du curseur (en haut à gauche) regarde vers la direction
        ctx.rotate(angle + Math.PI * 0.75);
        drawPattern(p, ARROW, alpha);
      } else {
        ctx.rotate(angle);
        for (var n = 0; n < 4; n++) {
          ctx.save();
          ctx.translate(-n * p.px * 4, 0);
          drawPattern(p, CHEVRON, alpha * (1 - n * 0.22));
          ctx.restore();
        }
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);

  window.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // Un clic n'importe où fait jaillir quelques curseurs
  document.addEventListener("pointerdown", function (e) {
    for (var b = 0; b < 7; b++) spawn(e.clientX, e.clientY, 4, 70 + Math.random() * 40);
  });

  // ---------- Interactions à la souris (ordinateurs) ----------
  if (!finePointer) return;

  // Cartes inclinables en 3D
  document.querySelectorAll(".lang-card, .interest-card, .radial-card, .project, .highlight-item, .case-study .visual")
    .forEach(function (el) {
      el.classList.add("tilt");
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        el.classList.add("tilting");
        el.style.transform = "perspective(700px) rotateX(" + (-y * 8).toFixed(2) + "deg) rotateY(" + (x * 8).toFixed(2) + "deg) translateY(-4px)";
      });
      el.addEventListener("mouseleave", function () {
        el.classList.remove("tilting");
        el.style.transform = "";
      });
    });

  // Boutons magnétiques
  document.querySelectorAll(".btn, .btn-outline, .to-top").forEach(function (btn) {
    btn.addEventListener("mousemove", function (e) {
      var r = btn.getBoundingClientRect();
      btn.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.22 + "px," + (e.clientY - r.top - r.height / 2) * 0.3 + "px)";
    });
    btn.addEventListener("mouseleave", function () {
      btn.style.transform = "";
    });
  });

  // Parallaxe de la photo sur l'accueil
  var hero = document.querySelector(".split-hero");
  var heroVisual = hero && hero.querySelector(".visual");
  if (heroVisual) {
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      heroVisual.style.transform = "translate(" + x * 20 + "px," + y * 20 + "px) rotateY(" + x * 10 + "deg) rotateX(" + -y * 10 + "deg)";
    });
    hero.addEventListener("mouseleave", function () {
      heroVisual.style.transform = "";
    });
  }

  // Inspecteur : un cadre se cale sur l'élément survolé, coordonnées près du curseur
  var inspect = document.createElement("div");
  inspect.className = "inspect-box";
  inspect.setAttribute("aria-hidden", "true");
  inspect.innerHTML = "<b></b>";
  var inspectLabel = inspect.firstChild;
  var coords = document.createElement("div");
  coords.className = "cursor-coords";
  coords.setAttribute("aria-hidden", "true");
  document.body.appendChild(inspect);
  document.body.appendChild(coords);
  var hovered = null;

  function placeInspect() {
    if (!hovered) return;
    var r = hovered.getBoundingClientRect();
    inspect.style.transform = "translate(" + (r.left - 4) + "px," + (r.top - 4) + "px)";
    inspect.style.width = r.width + 8 + "px";
    inspect.style.height = r.height + 8 + "px";
    inspectLabel.textContent = labelFor(hovered) + " · " + Math.round(r.width) + "×" + Math.round(r.height);
  }

  document.addEventListener("mousemove", function (e) {
    document.body.classList.add("cursor-on");
    coords.style.transform = "translate(" + (e.clientX + 16) + "px," + (e.clientY + 18) + "px)";
    coords.textContent = "x:" + e.clientX + " y:" + (e.clientY + Math.round(window.scrollY));
    var t = e.target.closest && e.target.closest("a, button, .chip, .lang-card, .interest-card, .highlight-item, .stat, .radial-card");
    if (t !== hovered) {
      hovered = t;
      inspect.classList.toggle("on", !!t);
      placeInspect();
    }
  });
  window.addEventListener("scroll", placeInspect, { passive: true });
  document.addEventListener("mouseleave", function () {
    document.body.classList.remove("cursor-on");
    inspect.classList.remove("on");
    hovered = null;
  });
});
