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
// Couche d'animation : fond animé, curseur, titres lettre par
// lettre, cartes 3D, boutons magnétiques, transitions de page…
// Tout est coupé si l'utilisateur préfère moins d'animations.
// ==========================================================
document.addEventListener("DOMContentLoaded", function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var hasIO = "IntersectionObserver" in window;

  function onVisible(els, cb, threshold) {
    if (!els.length) return;
    if (!hasIO) {
      els.forEach(cb);
      return;
    }
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            cb(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: threshold || 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach(function (el) {
      obs.observe(el);
    });
  }

  // ---- Barre de progression + bouton retour en haut ----
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.appendChild(progress);

  var toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.type = "button";
  toTop.setAttribute("aria-label", document.documentElement.lang === "en" ? "Back to top" : "Retour en haut");
  toTop.innerHTML =
    '<svg viewBox="0 0 48 48" aria-hidden="true"><defs><linearGradient id="toTopGrad" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#8b5cf6"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs>' +
    '<circle class="track" cx="24" cy="24" r="22"/><circle class="bar" cx="24" cy="24" r="22"/></svg>' +
    '<span class="chev" aria-hidden="true"></span>';
  document.body.appendChild(toTop);
  var toTopBar = toTop.querySelector(".bar");
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
    toTopBar.style.strokeDashoffset = 138.2 * (1 - ratio);
    toTop.classList.toggle("show", window.scrollY > 500);
    if (timeline && !reduced) {
      var r = timeline.getBoundingClientRect();
      var seen = (window.innerHeight * 0.75 - r.top) / r.height;
      timeline.style.setProperty("--line", Math.max(0, Math.min(seen, 1)));
    }
  }
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScroll);
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", updateScroll);
  updateScroll();

  // ---- CTA finale : fond intérieur pour la bordure animée ----
  document.querySelectorAll(".closing-cta").forEach(function (el) {
    var bg = document.createElement("span");
    bg.className = "cta-bg";
    bg.setAttribute("aria-hidden", "true");
    el.insertBefore(bg, el.firstChild);
  });

  // ---- Avatar : anneau et orbites ----
  var avatar = document.querySelector(".split-hero .avatar-wrap");
  if (avatar) {
    var stage = document.createElement("div");
    stage.className = "avatar-stage";
    avatar.parentNode.insertBefore(stage, avatar);
    stage.appendChild(avatar);
    stage.insertAdjacentHTML(
      "beforeend",
      '<span class="orbit" aria-hidden="true"><i></i><i></i></span><span class="orbit o2" aria-hidden="true"><i></i></span>'
    );
  }

  // ---- Apparitions en cascade dans les grilles ----
  var staggerEls = document.querySelectorAll(
    ".lang-grid, .interest-grid, .about-highlights, .stats-row, .radial-grid, .secondary-projects, .stat-chips, .contact-split .cards"
  );
  if (!reduced) {
    staggerEls.forEach(function (grid) {
      grid.classList.add("stagger");
      Array.prototype.forEach.call(grid.children, function (child, i) {
        child.style.setProperty("--si", i);
      });
    });
    onVisible(Array.prototype.slice.call(staggerEls), function (grid) {
      grid.classList.add("in");
      setTimeout(function () {
        grid.classList.add("done");
      }, 700 + grid.children.length * 90);
    });

    // Éléments des pages internes qui n'avaient pas encore d'apparition
    var extra = [];
    document.querySelectorAll(".project, .resume, .item, .case-study, .card").forEach(function (el) {
      if (el.closest(".reveal") || el.closest(".stagger")) return;
      el.classList.add("reveal");
      if (el.classList.contains("item")) el.classList.add("from-left");
      extra.push(el);
    });
    onVisible(extra, function (el) {
      el.classList.add("visible");
    });
  }

  // ---- Titres : découpage lettre par lettre ----
  if (!reduced) {
    document.querySelectorAll(".split-hero h1, h1.page-title, .contact-split h1").forEach(function (h) {
      var label = h.textContent.replace(/\s+/g, " ").trim();
      var ci = 0;
      function split(node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (child) {
          if (child.nodeType === 3) {
            var frag = document.createDocumentFragment();
            child.textContent.split(/(\s+)/).forEach(function (part) {
              if (!part) return;
              if (/^\s+$/.test(part)) {
                frag.appendChild(document.createTextNode(" "));
                return;
              }
              var word = document.createElement("span");
              word.className = "split-word";
              Array.from(part).forEach(function (ch) {
                var c = document.createElement("span");
                c.className = "split-char";
                c.textContent = ch;
                c.style.setProperty("--ci", ci++);
                word.appendChild(c);
              });
              frag.appendChild(word);
            });
            node.replaceChild(frag, child);
          } else if (child.nodeType === 1 && child.classList.contains("accent-word")) {
            // Le mot en dégradé apparaît d'un bloc (le dégradé ne survit pas au découpage)
            child.classList.add("split-block");
            child.style.setProperty("--ci", ci);
            ci += 4;
          } else if (child.nodeType === 1) {
            split(child);
          }
        });
      }
      split(h);
      h.setAttribute("aria-label", label);
      Array.prototype.forEach.call(h.children, function (c) {
        c.setAttribute("aria-hidden", "true");
      });
    });
  }

  // ---- Transitions entre les pages ----
  if (!reduced) {
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
      setTimeout(function () {
        window.location.href = a.href;
      }, 280);
    });
    window.addEventListener("pageshow", function (e) {
      if (e.persisted) document.body.classList.remove("page-leave");
    });
  }

  // ---- Effet d'onde au clic sur les boutons ----
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
      setTimeout(function () {
        dot.remove();
      }, 650);
    });
  });

  if (reduced) return;

  // ---- Tout ce qui suit dépend de la souris ----
  if (finePointer) {
    // Cartes inclinables en 3D
    document
      .querySelectorAll(".lang-card, .interest-card, .radial-card, .project, .highlight-item, .case-study .visual")
      .forEach(function (el) {
        el.classList.add("tilt");
        el.addEventListener("mousemove", function (e) {
          var r = el.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - 0.5;
          var y = (e.clientY - r.top) / r.height - 0.5;
          el.classList.add("tilting");
          el.style.transform =
            "perspective(700px) rotateX(" + (-y * 10).toFixed(2) + "deg) rotateY(" + (x * 10).toFixed(2) + "deg) translateY(-6px)";
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
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + x * 0.25 + "px," + y * 0.35 + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });

    // Parallaxe de l'avatar sur l'accueil
    var hero = document.querySelector(".split-hero");
    var heroVisual = hero && hero.querySelector(".visual");
    if (heroVisual) {
      hero.addEventListener("mousemove", function (e) {
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        heroVisual.style.transform =
          "translate(" + x * 24 + "px," + y * 24 + "px) rotateY(" + x * 12 + "deg) rotateX(" + -y * 12 + "deg)";
      });
      hero.addEventListener("mouseleave", function () {
        heroVisual.style.transform = "";
      });
    }

    // Curseur personnalisé
    var dot = document.createElement("div");
    var ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    dot.setAttribute("aria-hidden", "true");
    ring.setAttribute("aria-hidden", "true");
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener("mousemove", function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px)";
      document.body.classList.add("cursor-on");
      var interactive = e.target.closest && e.target.closest("a, button, .tilt, .chip");
      document.body.classList.toggle("cursor-hover", !!interactive);
    });
    document.addEventListener("mouseleave", function () {
      document.body.classList.remove("cursor-on");
    });
    document.addEventListener("mousedown", function () {
      document.body.classList.add("cursor-down");
    });
    document.addEventListener("mouseup", function () {
      document.body.classList.remove("cursor-down");
    });
    (function follow() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = "translate(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px)";
      requestAnimationFrame(follow);
    })();
  }

  // ---- Fond animé : constellation de particules ----
  var canvas = document.createElement("canvas");
  canvas.className = "bg-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.insertBefore(canvas, document.body.firstChild);
  var ctx = canvas.getContext("2d");
  if (!ctx) return;
  var W, H, dpr, particles = [];
  var mouse = { x: -9999, y: -9999 };
  var LINK = 130;
  var colors = ["139,92,246", "236,72,153", "198,255,59"];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var target = Math.round(Math.min(80, (W * H) / 16000));
    while (particles.length < target) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
        c: colors[Math.random() < 0.08 ? 2 : Math.random() < 0.5 ? 0 : 1]
      });
    }
    particles.length = target;
  }
  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  var running = true;
  document.addEventListener("visibilitychange", function () {
    running = !document.hidden;
    if (running) requestAnimationFrame(draw);
  });

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;

      // La souris attire doucement les particules proches
      var dxm = mouse.x - p.x, dym = mouse.y - p.y;
      var dm = Math.sqrt(dxm * dxm + dym * dym);
      if (dm < 180) {
        p.x += dxm * 0.006;
        p.y += dym * 0.006;
        ctx.strokeStyle = "rgba(236,72,153," + (1 - dm / 180) * 0.35 + ")";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }

      for (var j = i + 1; j < particles.length; j++) {
        var q = particles[j];
        var dx = p.x - q.x, dy = p.y - q.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < LINK * LINK) {
          ctx.strokeStyle = "rgba(139,92,246," + (1 - Math.sqrt(d2) / LINK) * 0.22 + ")";
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = "rgba(" + p.c + ",0.85)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(function () {
    canvas.classList.add("ready");
    draw();
  });
});
