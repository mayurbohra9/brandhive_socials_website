/**
 * Quote bridge — sits between Strategy Call and Packages/Pricing.
 * Includes rotating word animation on the final keyword.
 */
(function () {
  "use strict";

  if (window.__brandhiveQuoteBridgeLoaded) return;
  window.__brandhiveQuoteBridgeLoaded = true;

  var ROTATING_WORDS = ["intent", "strategy", "impact", "authority"];
  var wordTimer = null;
  var wordIndex = 0;
  var activeInner = null;

  var markup =
    '<section id="quote-bridge" data-framer-name="QuoteBridge" aria-label="Quote">' +
    '<div class="quote-bridge__inner">' +
    '<p class="quote-bridge__mark" aria-hidden="true">“</p>' +
    '<p class="quote-bridge__text">Great LinkedIn presence isn’t about posting more — it’s about positioning with ' +
    '<span class="quote-bridge__word" aria-live="polite">' +
    '<span class="quote-bridge__word-inner">intent</span>.' +
    "</span></p>" +
    '<div class="quote-bridge__rule" aria-hidden="true"></div>' +
    '<p class="quote-bridge__attr">BrandHive Socials</p>' +
    "</div>" +
    "</section>";

  var mutating = false;
  var scheduled = null;

  function prefersReducedMotion() {
    try {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      return false;
    }
  }

  function stopWordRotation() {
    if (wordTimer) {
      window.clearInterval(wordTimer);
      wordTimer = null;
    }
    activeInner = null;
  }

  function swapWord(inner) {
    if (!inner || !inner.isConnected) return;
    inner.classList.remove("is-enter");
    inner.classList.add("is-exit");

    window.setTimeout(function () {
      if (!inner.isConnected) return;
      wordIndex = (wordIndex + 1) % ROTATING_WORDS.length;
      inner.textContent = ROTATING_WORDS[wordIndex];
      inner.classList.remove("is-exit");
      // Force reflow so enter animation can re-trigger.
      void inner.offsetWidth;
      inner.classList.add("is-enter");
      window.setTimeout(function () {
        if (inner.isConnected) inner.classList.remove("is-enter");
      }, 360);
    }, 300);
  }

  function initWordRotation() {
    var section = document.getElementById("quote-bridge");
    if (!section) return;

    var inner = section.querySelector(".quote-bridge__word-inner");
    if (!inner) return;

    // Already bound to this live element.
    if (activeInner === inner && wordTimer) return;

    stopWordRotation();
    activeInner = inner;
    wordIndex = 0;
    inner.textContent = ROTATING_WORDS[0];
    inner.classList.remove("is-exit", "is-enter");

    if (prefersReducedMotion()) return;

    // First swap after a short delay so users notice the animation.
    wordTimer = window.setInterval(function () {
      if (!activeInner || !activeInner.isConnected) {
        stopWordRotation();
        initWordRotation();
        return;
      }
      swapWord(activeInner);
    }, 2400);
  }

  function ensureSection() {
    if (mutating) return;
    var pricing = document.querySelector(
      'section[data-framer-name="Pricing"]',
    );
    if (!pricing || !pricing.parentNode) return;

    var section = document.getElementById("quote-bridge");
    if (section && section.nextElementSibling === pricing) {
      var strategy = document.getElementById("strategy-call");
      if (strategy && strategy.nextElementSibling !== section) {
        mutating = true;
        try {
          section.parentNode.insertBefore(strategy, section);
        } finally {
          mutating = false;
        }
      }
      initWordRotation();
      return;
    }

    mutating = true;
    try {
      if (!section) {
        var wrap = document.createElement("div");
        wrap.innerHTML = markup;
        section = wrap.firstElementChild;
      }
      pricing.parentNode.insertBefore(section, pricing);

      var strategyCall = document.getElementById("strategy-call");
      if (strategyCall && strategyCall.nextElementSibling !== section) {
        section.parentNode.insertBefore(strategyCall, section);
      }
    } finally {
      mutating = false;
    }

    initWordRotation();
  }

  function scheduleEnsure() {
    if (scheduled || mutating) return;
    scheduled = setTimeout(function () {
      scheduled = null;
      ensureSection();
    }, 250);
  }

  function init() {
    ensureSection();
    [600, 1500, 3000, 6000].forEach(function (ms) {
      setTimeout(ensureSection, ms);
    });

    if ("MutationObserver" in window && document.body) {
      new MutationObserver(function (mutations) {
        if (mutating) return;
        for (var i = 0; i < mutations.length; i++) {
          var target = mutations[i].target;
          if (
            target &&
            target.closest &&
            target.closest("#quote-bridge")
          ) {
            continue;
          }
          scheduleEnsure();
          return;
        }
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
