/**
 * One-time Strategy Call banner — kept directly before Packages/Pricing.
 */
(function () {
  "use strict";

  if (window.__brandhiveStrategyCallLoaded) return;
  window.__brandhiveStrategyCallLoaded = true;

  var markup =
    '<section id="strategy-call" data-framer-name="StrategyCall" aria-labelledby="strategy-call-title">' +
    '<div class="strategy-call__shell">' +
    '<div class="strategy-call__content">' +
    '<p class="strategy-call__label"><span class="strategy-call__label-icon" aria-hidden="true"></span>Strategy call</p>' +
    '<h2 id="strategy-call-title" class="strategy-call__heading">Looking for a one-time <span class="strategy-call__heading-emphasis">Strategy Call</span> instead?</h2>' +
    '<p class="strategy-call__copy">Get focused, practical guidance for your LinkedIn positioning, content and growth strategy—built around your goals.</p>' +
    '<a class="strategy-call__button" href="./contact">Book a 1:1 with Saakshi<span class="strategy-call__button-dot" aria-hidden="true"></span></a>' +
    "</div>" +
    '<div class="strategy-call__visual" aria-hidden="true">' +
    '<div class="strategy-call__orb"></div>' +
    '<img class="strategy-call__portrait" src="assets/founder-strategy-cutout.png" alt="" loading="lazy" decoding="async" />' +
    '<div class="strategy-call__founder"><small>Founder:</small><strong>Saakshi Jadhav</strong></div>' +
    '<div class="strategy-call__metric strategy-call__metric--followers"><span><strong>35K+</strong><small>Followers</small></span></div>' +
    '<div class="strategy-call__metric strategy-call__metric--choice"><span><strong>People\'s</strong><small>Choice</small></span></div>' +
    '<div class="strategy-call__metric strategy-call__metric--community"><span><strong>Community</strong><small>Care</small></span></div>' +
    '<div class="strategy-call__metric strategy-call__metric--rating"><span><strong>5/5 Rated</strong><small>On Topmate</small></span></div>' +
    '<div class="strategy-call__metric strategy-call__metric--top"><span><strong>Top 5%</strong><small>Topmate</small></span></div>' +
    '<div class="strategy-call__metric strategy-call__metric--bookings"><span><strong>13</strong><small>Bookings</small></span></div>' +
    '<div class="strategy-call__metric strategy-call__metric--views"><span><strong>243M+</strong><small>Views generated</small></span></div>' +
    "</div>" +
    "</div>" +
    "</section>";

  var mutating = false;
  var scheduled = null;

  function ensureSection() {
    if (mutating) return;
    var pricing = document.querySelector(
      'section[data-framer-name="Pricing"]',
    );
    if (!pricing || !pricing.parentNode) return;

    var section = document.getElementById("strategy-call");
    if (section && section.nextElementSibling === pricing) return;

    mutating = true;
    try {
      if (!section) {
        var wrap = document.createElement("div");
        wrap.innerHTML = markup;
        section = wrap.firstElementChild;
      }
      pricing.parentNode.insertBefore(section, pricing);
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
          if (
            target &&
            target.closest &&
            target.closest("#strategy-call")
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
