/**
 * Pricing packages slider — replaces Framer pricing table inside black panel.
 * Delayed + debounced so Framer preloader is not starved.
 */
(function () {
  "use strict";

  if (window.__brandhivePackagesLoaded) return;
  window.__brandhivePackagesLoaded = true;

  var LABEL = "Packages";
  var HEADING_BEFORE = "Choose the Right ";
  var HEADING_EMPHASIS = "Package";
  var HEADING_AFTER = " for You";
  var SUBTEXT =
    "From personal branding foundations to full lead generation - pick the tier that matches your goals and growth stage on LinkedIn.";

  var CHECK_SVG =
    '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M2.2 6.2l2.4 2.4 5.2-5.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var PACKAGES = [
    {
      num: "Package 01",
      name: "The Foundation",
      tag: "Personal Branding Only",
      featured: false,
      badge: null,
      features: [
        "Banner, headline & SEO-optimized About section",
        "Monthly content calendar (6–12 posts)",
        "Infographics, carousels & static creatives",
        "300+ connection requests every month",
        "Paid amplification for guaranteed engagement",
      ],
    },
    {
      num: "Package 02",
      name: "The Immersion",
      tag: "Personal Branding + Lead Generation",
      featured: true,
      badge: "Most Chosen",
      features: [
        "Everything in The Foundation",
        "400+ lead requests via Sales Navigator",
        "ICP messaging, follow-ups & sales funnel",
        "Sales Navigator Advanced included",
        "Priority WhatsApp support & strategy calls",
      ],
    },
    {
      num: "Package 03",
      name: "Lead Generation, Refined",
      tag: "Lead Generation Only",
      featured: false,
      badge: null,
      features: [
        "400+ lead requests sent every month",
        "ICP messaging & a structured sales funnel",
        "Sales Navigator Advanced included",
      ],
    },
  ];

  var viewObserved = new WeakSet();
  var boundSliders = new WeakSet();
  var observer = null;
  var scheduled = null;
  var mutating = false;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function buildCard(pkg) {
    var classes = "bh-pkg";
    if (pkg.featured) classes += " bh-pkg--featured";
    var badge = pkg.badge
      ? '<span class="bh-pkg__badge">' + escapeHtml(pkg.badge) + "</span>"
      : "";
    var items = pkg.features
      .map(function (f) {
        return (
          '<li><span class="bh-pkg__check" aria-hidden="true">' +
          CHECK_SVG +
          "</span>" +
          escapeHtml(f) +
          "</li>"
        );
      })
      .join("");

    return (
      '<article class="' +
      classes +
      '" data-bh-pkg>' +
      '<div class="bh-pkg__top">' +
      '<p class="bh-pkg__num">' +
      escapeHtml(pkg.num) +
      "</p>" +
      badge +
      "</div>" +
      '<h3 class="bh-pkg__name">' +
      escapeHtml(pkg.name) +
      "</h3>" +
      '<p class="bh-pkg__tag">' +
      escapeHtml(pkg.tag) +
      "</p>" +
      '<hr class="bh-pkg__rule" />' +
      '<p class="bh-pkg__includes">What\'s Included</p>' +
      '<ul class="bh-pkg__list">' +
      items +
      "</ul>" +
      '<a class="bh-pkg__cta" href="./contact">' +
      "Book a call" +
      '<span class="bh-pkg__cta-dot" aria-hidden="true"></span>' +
      "</a>" +
      "</article>"
    );
  }

  function buildMarkup() {
    var cards = PACKAGES.map(buildCard).join("");
    return (
      '<div id="bh-packages" class="bh-packages bh-packages--panel" data-bh-packages="true" data-bh-version="7">' +
      '<header class="bh-packages__header">' +
      '<p class="bh-packages__label">' +
      '<span class="bh-packages__label-icon" aria-hidden="true"></span>' +
      escapeHtml(LABEL) +
      "</p>" +
      '<h2 class="bh-packages__title">' +
      '<span class="bh-packages__title-muted">' +
      escapeHtml(HEADING_BEFORE.trim()) +
      "&nbsp;</span>" +
      '<span class="bh-packages__title-keep">' +
      '<span class="bh-packages__title-strong">' +
      escapeHtml(HEADING_EMPHASIS) +
      "</span>" +
      '<span class="bh-packages__title-muted">' +
      escapeHtml(HEADING_AFTER) +
      "</span>" +
      "</span>" +
      "</h2>" +
      '<p class="bh-packages__subtitle">' +
      escapeHtml(SUBTEXT) +
      "</p>" +
      "</header>" +
      '<div class="bh-packages__slider">' +
      '<button type="button" class="bh-packages__nav bh-packages__nav--prev" aria-label="Previous package">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "</button>" +
      '<div class="bh-packages__track" tabindex="0" role="region" aria-label="Pricing packages">' +
      cards +
      "</div>" +
      '<button type="button" class="bh-packages__nav bh-packages__nav--next" aria-label="Next package">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "</button>" +
      "</div>" +
      '<div class="bh-packages__dots" role="tablist" aria-label="Package slides"></div>' +
      "</div>"
    );
  }

  function reveal(el) {
    if (!el || viewObserved.has(el)) return;
    viewObserved.add(el);
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      el.classList.add("in-view");
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    io.observe(el);
  }

  function bindSlider(root) {
    if (!root || boundSliders.has(root)) return;
    boundSliders.add(root);

    var track = root.querySelector(".bh-packages__track");
    var dotsWrap = root.querySelector(".bh-packages__dots");
    var prev = root.querySelector(".bh-packages__nav--prev");
    var next = root.querySelector(".bh-packages__nav--next");
    var cards = root.querySelectorAll("[data-bh-pkg]");
    if (!track || !cards.length || !dotsWrap) return;

    dotsWrap.innerHTML = "";
    cards.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "bh-packages__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", "Go to package " + (i + 1));
      dot.addEventListener("click", function () {
        cards[i].scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      });
      dotsWrap.appendChild(dot);
    });

    function scrollByCard(dir) {
      var card = cards[0];
      if (!card) return;
      track.scrollBy({
        left: (card.offsetWidth + 18) * dir,
        behavior: "smooth",
      });
    }

    if (prev) prev.addEventListener("click", function () { scrollByCard(-1); });
    if (next) next.addEventListener("click", function () { scrollByCard(1); });

    track.addEventListener(
      "scroll",
      function () {
        var center = track.scrollLeft + track.clientWidth / 2;
        var active = 0;
        cards.forEach(function (card, i) {
          var left = card.offsetLeft;
          var right = left + card.offsetWidth;
          if (center >= left && center < right) active = i;
        });
        dotsWrap.querySelectorAll(".bh-packages__dot").forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === active);
        });
      },
      { passive: true },
    );
  }

  function findMount() {
    var section = document.querySelector('section[data-framer-name="Pricing"]');
    if (!section) return null;
    return (
      section.querySelector('[data-framer-name="Container"]') ||
      section.querySelector(".framer-pvk990") ||
      section
    );
  }

  function ensurePackages() {
    if (mutating) return;
    var mount = findMount();
    if (!mount) return;

    var existing = document.getElementById("bh-packages");
    if (
      existing &&
      existing.querySelector("[data-bh-pkg]") &&
      existing.querySelector(".bh-packages__title-strong") &&
      existing.querySelector(".bh-pkg__cta") &&
      existing.getAttribute("data-bh-version") === "7"
    ) {
      bindSlider(existing);
      reveal(existing);
      return;
    }

    mutating = true;
    try {
      if (observer) observer.disconnect();
      var wrap = document.createElement("div");
      wrap.innerHTML = buildMarkup();
      var block = wrap.firstElementChild;
      if (existing && existing.parentNode) {
        existing.parentNode.replaceChild(block, existing);
      } else {
        var table = mount.querySelector('[data-framer-name="Table container"]');
        if (table) mount.insertBefore(block, table);
        else mount.appendChild(block);
      }
      bindSlider(block);
      reveal(block);
    } finally {
      mutating = false;
      observe();
    }
  }

  function scheduleEnsure() {
    if (scheduled || mutating) return;
    scheduled = setTimeout(function () {
      scheduled = null;
      ensurePackages();
    }, 800);
  }

  function observe() {
    if (!observer || !document.body) return;
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function start() {
    ensurePackages();
    if ("MutationObserver" in window && document.body) {
      observer = new MutationObserver(function (mutations) {
        if (mutating) return;
        for (var i = 0; i < mutations.length; i++) {
          var m = mutations[i];
          if (!m.addedNodes || !m.addedNodes.length) continue;
          // Ignore our own packages subtree churn.
          if (
            m.target &&
            m.target.closest &&
            m.target.closest("#bh-packages")
          ) {
            continue;
          }
          scheduleEnsure();
          return;
        }
      });
      observe();
    }
    setTimeout(ensurePackages, 2500);
    setTimeout(ensurePackages, 5500);
  }

  // Wait until window load so Framer preloader can finish first.
  function boot() {
    if (document.readyState === "complete") {
      setTimeout(start, 600);
      return;
    }
    window.addEventListener("load", function () {
      setTimeout(start, 600);
    });
    // Failsafe if load never fires cleanly
    setTimeout(start, 5000);
  }

  boot();
})();
