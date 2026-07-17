/**
 * Why us — scroll-linked zoom, corner slide-ins, counters, text reveals.
 * Injected directly above the Services section; keeps the extract's
 * Framer-style scroll-trigger behavior (zoom + scroll 1..4).
 */
(function () {
  "use strict";

  if (window.__brandhiveWhyUsLoaded) return;
  window.__brandhiveWhyUsLoaded = true;

  var MOBILE_MQ = "(max-width: 809.98px)";
  var REDUCE_MQ = "(prefers-reduced-motion: reduce)";

  var markup =
    '<section id="why-us" data-framer-name="Why us" aria-label="Our Impact">' +
    '<div class="why-us__container">' +
    '<div class="why-us__pattern" aria-hidden="true"></div>' +
    '<div class="why-us__side why-us__side--left">' +
    '<div class="why-us__stats">' +
    '<div class="stat stat--from-left" data-stat="1">' +
    '<div class="stat__value" aria-label="200 plus"><span data-counter="clients">0</span><span>+</span></div>' +
    '<p class="stat__label">Clients Served</p>' +
    "</div>" +
    '<div class="stat stat--from-left" data-stat="2">' +
    '<div class="stat__value" aria-label="46 thousand plus"><span data-counter="posts">0</span><span>K+</span></div>' +
    '<p class="stat__label">Posts Created</p>' +
    "</div>" +
    "</div>" +
    "</div>" +
    '<div class="why-us__middle">' +
    '<div class="why-us__bg"></div>' +
    '<div class="why-us__text">' +
    '<div class="why-us__badge">' +
    '<div class="why-us__dot" aria-hidden="true"></div>' +
    '<p class="why-us__badge-label">Our Impact</p>' +
    "</div>" +
    '<h2 class="why-us__headline"><span>Numbers</span> <span>That</span> <span>Speak</span> <span>Louder</span> <span>Than</span> <span class="why-us__headline-em">Words</span></h2>' +
    "</div>" +
    '<div class="why-us__sign">' +
    '<p class="why-us__blurb">Measurable LinkedIn growth for founders and B2B brands — from impressions and content output to client results that compound over time.</p>' +
    "</div>" +
    "</div>" +
    '<div class="why-us__side why-us__side--right">' +
    '<div class="why-us__stats">' +
    '<div class="stat stat--from-right" data-stat="3">' +
    '<div class="stat__value" aria-label="500 million plus"><span data-counter="impressions">0</span><span>M+</span></div>' +
    '<p class="stat__label">Impressions Generated</p>' +
    "</div>" +
    '<div class="stat stat--from-right" data-stat="4">' +
    '<div class="stat__value" aria-label="35 thousand plus"><span data-counter="leads">0</span><span>K+</span></div>' +
    '<p class="stat__label">Leads Generated</p>' +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    '<div class="why-us__triggers" aria-hidden="true">' +
    '<div class="why-us__zoom-trigger" data-why-zoom></div>' +
    '<div class="why-us__text-triggers">' +
    '<div data-why-trigger="1"></div>' +
    '<div data-why-trigger="2"></div>' +
    '<div data-why-trigger="3"></div>' +
    '<div data-why-trigger="4"></div>' +
    "</div>" +
    "</div>" +
    "</section>";

  /* ————— Injection (Framer hydration-safe) ————— */

  var mutating = false;
  var scheduled = null;

  function ensureSection() {
    if (mutating) return;
    var services = document.querySelector(
      'section[data-framer-name="Services"]',
    );
    if (!services || !services.parentNode) return;

    var section = document.getElementById("why-us");
    if (
      section &&
      section.nextElementSibling === services &&
      section.getAttribute("data-bh-why-us") === "v4"
    ) {
      return;
    }

    mutating = true;
    try {
      var wrap = document.createElement("div");
      wrap.innerHTML = markup;
      var fresh = wrap.firstElementChild;
      fresh.setAttribute("data-bh-why-us", "v4");
      if (section && section.parentNode) {
        section.parentNode.replaceChild(fresh, section);
      } else {
        services.parentNode.insertBefore(fresh, services);
      }
      section = fresh;
      // Reset animation state when content is replaced.
      counterDone = [false, false, false, false];
      midRevealed = false;
      requestTick();
    } finally {
      mutating = false;
    }
  }

  function scheduleEnsure() {
    if (scheduled || mutating) return;
    scheduled = setTimeout(function () {
      scheduled = null;
      ensureSection();
    }, 250);
  }

  /* ————— Animation helpers ————— */

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /** How far through the element relative to viewport (sticky pin friendly). */
  function triggerProgress(el) {
    var rect = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var total = rect.height + vh;
    var traveled = vh - rect.top;
    return clamp(traveled / total, 0, 1);
  }

  function isMobile() {
    return window.matchMedia(MOBILE_MQ).matches;
  }

  function prefersReduced() {
    return window.matchMedia(REDUCE_MQ).matches;
  }

  function q(sel) {
    var root = document.getElementById("why-us");
    return root ? root.querySelector(sel) : null;
  }

  function qa(sel) {
    var root = document.getElementById("why-us");
    return root ? root.querySelectorAll(sel) : [];
  }

  /* ————— Counters ————— */

  var counterTargets = [
    { sel: '[data-counter="clients"]', target: 200 },
    { sel: '[data-counter="posts"]', target: 46 },
    { sel: '[data-counter="impressions"]', target: 500 },
    { sel: '[data-counter="leads"]', target: 35 },
  ];

  var counterDone = [false, false, false, false];

  function setCounter(i, value) {
    var el = q(counterTargets[i].sel);
    if (el) el.textContent = String(Math.round(value));
  }

  function animateCounter(i, duration) {
    if (counterDone[i]) return;
    counterDone[i] = true;
    var to = counterTargets[i].target;
    var start = performance.now();

    function frame(now) {
      var t = clamp((now - start) / duration, 0, 1);
      setCounter(i, to * easeOutCubic(t));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function showFinalCounters() {
    counterTargets.forEach(function (c, i) {
      setCounter(i, c.target);
      counterDone[i] = true;
    });
  }

  /* ————— Middle text reveals ————— */

  var midRevealed = false;

  function revealMiddle() {
    if (midRevealed) return;
    midRevealed = true;

    var badge = q(".why-us__badge");
    var blurb = q(".why-us__blurb");
    var headlineWords = qa(".why-us__headline span");

    if (badge) {
      badge.style.transition = "opacity 0.7s ease, transform 0.7s ease";
      badge.style.opacity = "1";
      badge.style.transform = "none";
    }

    Array.prototype.forEach.call(headlineWords, function (span, i) {
      span.style.transition =
        "opacity 0.55s ease " +
        i * 0.06 +
        "s, transform 0.55s ease " +
        i * 0.06 +
        "s";
      span.style.opacity = "1";
      span.style.transform = "none";
    });

    if (blurb) {
      blurb.style.transition =
        "opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s";
      blurb.style.opacity = "1";
      blurb.style.transform = "none";
    }
  }

  /* ————— Stats slide ————— */

  var statShown = [false, false, false, false];

  function showStat(i) {
    if (statShown[i]) return;
    statShown[i] = true;
    var el = q('[data-stat="' + (i + 1) + '"]');
    if (el) {
      el.style.transition =
        "opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1), transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)";
      el.style.opacity = "1";
      el.style.transform = "none";
    }
    animateCounter(i, 1200);
  }

  /* ————— Zoom BG + trigger track ————— */

  function updateZoom() {
    var bg = q(".why-us__bg");
    var zoomTrigger = q("[data-why-zoom]");
    if (!bg || !zoomTrigger || isMobile()) return;
    var p = triggerProgress(zoomTrigger);
    var scale = 10 - 9 * easeOutCubic(p);
    bg.style.transform = "scale(" + scale + ")";
    if (p > 0.15) revealMiddle();
  }

  function updateStatsFromTriggers() {
    if (isMobile()) return;
    for (var i = 1; i <= 4; i++) {
      var el = q('[data-why-trigger="' + i + '"]');
      if (el && triggerProgress(el) > 0.35) showStat(i - 1);
    }
  }

  function setStatic() {
    var bg = q(".why-us__bg");
    if (bg) bg.style.transform = "none";
    revealMiddle();
    showFinalCounters();
    for (var i = 1; i <= 4; i++) {
      var el = q('[data-stat="' + i + '"]');
      if (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      }
    }
  }

  function onScroll() {
    if (!document.getElementById("why-us")) return;

    if (prefersReduced() || isMobile()) {
      setStatic();
      return;
    }

    updateZoom();
    updateStatsFromTriggers();
  }

  var ticking = false;
  function requestTick() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      onScroll();
      ticking = false;
    });
  }

  /* ————— Boot ————— */

  function init() {
    ensureSection();
    [800, 2000, 4500].forEach(function (ms) {
      setTimeout(ensureSection, ms);
    });

    if ("MutationObserver" in window && document.body) {
      new MutationObserver(function (mutations) {
        if (mutating) return;
        for (var i = 0; i < mutations.length; i++) {
          var target = mutations[i].target;
          if (target && target.closest && target.closest("#why-us")) {
            continue;
          }
          scheduleEnsure();
          return;
        }
      }).observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);
    requestTick();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
