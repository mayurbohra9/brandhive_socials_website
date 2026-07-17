/**
 * Why us — scroll-linked zoom, corner slide-ins, counters, text reveals.
 * Recreates the Framer scroll-trigger behavior (#zoom, #scroll-1..4).
 */
(function () {
  "use strict";

  var MOBILE_MQ = "(max-width: 809.98px)";
  var REDUCE_MQ = "(prefers-reduced-motion: reduce)";

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /** Progress 0–1 of how much `el` has scrolled through the viewport center. */
  function scrollProgress(el) {
    var rect = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    // Start when top hits bottom of viewport; end when bottom hits top
    var start = vh;
    var end = -rect.height;
    var current = rect.top;
    if (start === end) return 1;
    return clamp((start - current) / (start - end), 0, 1);
  }

  /** How far through the element relative to viewport (sticky pin friendly). */
  function triggerProgress(el) {
    var rect = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    // 0 when element top is at bottom of screen; 1 when element bottom has left top
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

  // —— Counters ——
  var counters = [
    { el: document.querySelector('[data-counter="apps"]'), target: 20, suffix: "" },
    { el: document.querySelector('[data-counter="revenue"]'), target: 2, suffix: "" },
    { el: document.querySelector('[data-counter="users"]'), target: 50, suffix: "" },
    { el: document.querySelector('[data-counter="sites"]'), target: 50, suffix: "" },
  ];

  var counterDone = [false, false, false, false];

  function setCounter(i, value) {
    var c = counters[i];
    if (!c || !c.el) return;
    c.el.textContent = String(Math.round(value));
  }

  function animateCounter(i, duration) {
    if (counterDone[i]) return;
    counterDone[i] = true;
    var c = counters[i];
    if (!c || !c.el) return;
    var start = performance.now();
    var from = 0;
    var to = c.target;

    function frame(now) {
      var t = clamp((now - start) / duration, 0, 1);
      setCounter(i, from + (to - from) * easeOutCubic(t));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function showFinalCounters() {
    counters.forEach(function (c, i) {
      if (c && c.el) {
        setCounter(i, c.target);
        counterDone[i] = true;
      }
    });
  }

  // —— Middle text reveals ——
  var badge = document.querySelector(".why-us__badge");
  var signature = document.querySelector(".why-us__signature");
  var blurb = document.querySelector(".why-us__blurb");
  var headlineWords = document.querySelectorAll(".why-us__headline span");
  var midRevealed = false;

  function revealMiddle() {
    if (midRevealed) return;
    midRevealed = true;

    if (badge) {
      badge.style.transition = "opacity 0.7s ease, transform 0.7s ease";
      badge.style.opacity = "1";
      badge.style.transform = "none";
    }

    headlineWords.forEach(function (span, i) {
      span.style.transition =
        "opacity 0.55s ease " + i * 0.06 + "s, transform 0.55s ease " + i * 0.06 + "s";
      span.style.opacity = "1";
      span.style.transform = "none";
    });

    if (signature) {
      signature.style.transition = "opacity 0.8s ease 0.25s";
      signature.style.opacity = "1";
    }

    if (blurb) {
      blurb.style.transition = "opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s";
      blurb.style.opacity = "1";
      blurb.style.transform = "none";
    }
  }

  // —— Stats slide ——
  var stats = [
    document.querySelector('[data-stat="1"]'),
    document.querySelector('[data-stat="2"]'),
    document.querySelector('[data-stat="3"]'),
    document.querySelector('[data-stat="4"]'),
  ];

  function setStatVisible(el, visible) {
    if (!el) return;
    el.style.transition = "opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1), transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)";
    if (visible) {
      el.style.opacity = "1";
      el.style.transform = "none";
    }
  }

  var statShown = [false, false, false, false];

  function showStat(i) {
    if (statShown[i]) return;
    statShown[i] = true;
    setStatVisible(stats[i], true);
    animateCounter(i, 1200);
  }

  // —— Zoom BG ——
  var bg = document.querySelector(".why-us__bg");
  var zoomTrigger = document.getElementById("zoom");
  var scrollTriggers = [
    document.getElementById("scroll-1"),
    document.getElementById("scroll-2"),
    document.getElementById("scroll-3"),
    document.getElementById("scroll-4"),
  ];

  function updateZoom() {
    if (!bg || !zoomTrigger || isMobile()) return;
    var p = triggerProgress(zoomTrigger);
    // scale 10 → 1
    var scale = 10 - 9 * easeOutCubic(p);
    bg.style.transform = "scale(" + scale + ")";
    if (p > 0.15) revealMiddle();
  }

  function updateStatsFromTriggers() {
    if (isMobile()) return;
    scrollTriggers.forEach(function (el, i) {
      if (!el) return;
      var p = triggerProgress(el);
      // Fire when trigger is meaningfully in view
      if (p > 0.35) showStat(i);
    });
  }

  function setMobileStatic() {
    if (bg) bg.style.transform = "none";
    revealMiddle();
    showFinalCounters();
    stats.forEach(function (el) {
      if (el) {
        el.style.opacity = "1";
        el.style.transform = "none";
      }
    });
  }

  function onScroll() {
    if (prefersReduced()) {
      if (bg) bg.style.transform = "none";
      revealMiddle();
      showFinalCounters();
      stats.forEach(function (el) {
        if (el) {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      });
      return;
    }

    if (isMobile()) {
      setMobileStatic();
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

  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);
  onScroll();
})();
