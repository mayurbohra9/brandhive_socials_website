/**
 * BrandHive Socials - Custom runtime modules
 * Merged deferred scripts. Each module is an isolated IIFE with its own guard.
 * Order: about → testimonials → cta-banner → packages → strategy-call → quote-bridge → why-us → nav
 */

/* --- about.js --- */
(function () {
  "use strict";

  var sectionTemplate = null;
  var observedSections = new WeakSet();
  var viewObserver = null;

  function revealOnScroll(section) {
    if (!section || observedSections.has(section)) return;
    observedSections.add(section);

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      section.classList.add("in-view");
      return;
    }

    if (!viewObserver) {
      viewObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("in-view");
            viewObserver.unobserve(entry.target);
          });
        },
        {
          root: null,
          rootMargin: "0px 0px -10% 0px",
          threshold: 0.15,
        },
      );
    }

    viewObserver.observe(section);
  }

  function findInsertAnchor() {
    return (
      document.querySelector('section[data-framer-name="Testimonials"]') ||
      document.querySelector("section.framer-dvu3oi") ||
      null
    );
  }

  function ensureAboutSection() {
    var section = document.getElementById("about");
    var anchor = findInsertAnchor();

    // Hide any leftover Showreel clones Framer may rehydrate.
    document
      .querySelectorAll('section.framer-1dgpip1:not(#about)')
      .forEach(function (el) {
        el.style.display = "none";
      });

    if (!section && sectionTemplate && anchor && anchor.parentNode) {
      section = sectionTemplate.cloneNode(true);
      anchor.parentNode.insertBefore(section, anchor);
    }

    if (section) revealOnScroll(section);
  }

  function initAboutSection() {
    var section = document.getElementById("about");
    if (!section) return;

    sectionTemplate = section.cloneNode(true);
    revealOnScroll(section);

    if ("MutationObserver" in window && document.body) {
      new MutationObserver(ensureAboutSection).observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAboutSection);
  } else {
    initAboutSection();
  }
})();


/* --- testimonials.js --- */
/**
 * Testimonials: keep Intro card fixed; put all review cards in one
 * right-to-left auto-scrolling marquee. Extra reviews clone Framer cards
 * so design/typography stay identical.
 */
(function () {
  "use strict";

  if (window.__bhTestimonialsLoaded) return;
  window.__bhTestimonialsLoaded = true;

  var EXTRA = [
    {
      name: "Soheb Manyar",
      role: "Entrepreneur",
      quote:
        "Saakshi helped me gain clarity on how I should position myself on LinkedIn. I had been confused for a long time, and the session was incredibly helpful. Thank you, Saakshi!",
      avatar: "assets/images/7XElicIcn53vdnwyFHTpct98.jpg",
    },
    {
      name: "Rakshit Pagariya",
      role: "Consultation Client",
      quote:
        "I had a very insightful and amazing session with Saakshi. She has precise strategies that can help improve your LinkedIn presence. The session was extremely value-driven, detailed, and she made every concept easy to understand.",
      avatar: "assets/images/D53nCbgrC45WamdByYxomUf9c.jpg",
    },
    {
      name: "Sushma Pattar",
      role: "Consultation Client",
      quote:
        "I loved the way you tailored your strategy according to my needs. It truly was a value-driven call. I can't wait to implement all the suggestions and see the results. Thank you so much!",
      avatar: "assets/images/fqOOPJWEd96G4368QW9n1dcVU.jpg",
    },
    {
      name: "Nivithasri",
      role: "Consultation Client",
      quote:
        "I had a consultation call with Saakshi and thoroughly enjoyed the session. She explained everything in detail and suggested practical solutions for my personal branding challenges. I would highly recommend her to anyone struggling with personal branding.",
      avatar: "assets/images/lVMA2BWo8D0yz8GINpzGpDx4.jpg",
    },
  ];

  var mutating = false;

  function fillCard(root, item) {
    var name = root.querySelector(".framer-oyhvcg p");
    if (name) name.textContent = item.name;

    var role = root.querySelector(".framer-1wuq2o9 p");
    if (role) role.textContent = item.role;

    var quote = root.querySelector(".framer-j1a15y p");
    if (quote) quote.textContent = item.quote;

    var img = root.querySelector(".framer-1ibhtdp img");
    if (img) {
      img.src = item.avatar;
      img.removeAttribute("srcset");
      img.removeAttribute("sizes");
      img.alt = item.name;
    }
  }

  function unhideAppear(clone) {
    var nodes = [clone];
    clone.querySelectorAll("*").forEach(function (el) {
      nodes.push(el);
    });
    nodes.forEach(function (el) {
      el.removeAttribute("data-framer-appear-id");
      if (!el.style) return;
      if (el.style.opacity === "0" || el.style.opacity === "0.001") {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.willChange = "auto";
      }
    });
  }

  function isShown(el) {
    if (!el || !el.isConnected) return false;
    try {
      var style = window.getComputedStyle(el);
      if (style.display === "none" || style.visibility === "hidden") return false;
    } catch (e) {
      return true;
    }
    return true;
  }

  function cardMount(host) {
    return (
      host.querySelector(".bh-testimonials-marquee__track-source") || host
    );
  }

  function templateNodesFor(host, reversed) {
    var className = reversed
      ? "framer-1hllsft-container"
      : "framer-181puib-container";
    var scope = cardMount(host);
    var out = [];
    Array.prototype.forEach.call(scope.children, function (child) {
      if (child.hasAttribute("data-bh-extra")) return;
      if (child.hasAttribute("data-bh-marquee-clone")) return;
      if (
        child.classList.contains(className) ||
        child.querySelector("." + className)
      ) {
        out.push(child);
      }
    });
    // Fallback: q96ctn is also a stock review card in SSR.
    if (!out.length) {
      Array.prototype.forEach.call(scope.children, function (child) {
        if (child.hasAttribute("data-bh-extra")) return;
        if (child.hasAttribute("data-bh-marquee-clone")) return;
        if (
          child.classList.contains("framer-q96ctn-container") ||
          child.querySelector(".framer-q96ctn-container")
        ) {
          out.push(child);
        }
      });
    }
    return out;
  }

  function ensureMarquee(host) {
    var existing = host.querySelector(".bh-testimonials-marquee");
    if (existing) return existing;

    var marquee = document.createElement("div");
    marquee.className = "bh-testimonials-marquee";
    marquee.setAttribute("data-bh-marquee", "true");
    marquee.setAttribute("aria-label", "Client testimonials");

    var viewport = document.createElement("div");
    viewport.className = "bh-testimonials-marquee__viewport";

    var track = document.createElement("div");
    track.className = "bh-testimonials-marquee__track";

    var source = document.createElement("div");
    source.className = "bh-testimonials-marquee__track-source";

    var cloneWrap = document.createElement("div");
    cloneWrap.className = "bh-testimonials-marquee__track-clone";
    cloneWrap.setAttribute("aria-hidden", "true");

    track.appendChild(source);
    track.appendChild(cloneWrap);
    viewport.appendChild(track);
    marquee.appendChild(viewport);
    host.appendChild(marquee);
    return marquee;
  }

  function collectReviewNodes(host, intro) {
    var nodes = [];
    Array.prototype.forEach.call(host.children, function (child) {
      if (child === intro) return;
      if (child.classList.contains("bh-testimonials-marquee")) return;
      if (!isShown(child)) return;
      // Review card wrappers / containers
      if (
        child.classList.contains("framer-q96ctn-container") ||
        child.classList.contains("framer-1hllsft-container") ||
        child.classList.contains("framer-181puib-container") ||
        child.hasAttribute("data-bh-extra") ||
        child.querySelector(
          ".framer-q96ctn-container, .framer-1hllsft-container, .framer-181puib-container, .framer-k80mU",
        )
      ) {
        nodes.push(child);
      }
    });
    return nodes;
  }

  function syncMarqueeClones(marquee) {
    var source = marquee.querySelector(".bh-testimonials-marquee__track-source");
    var cloneWrap = marquee.querySelector(".bh-testimonials-marquee__track-clone");
    if (!source || !cloneWrap) return;

    cloneWrap.innerHTML = "";
    Array.prototype.forEach.call(source.children, function (child) {
      var clone = child.cloneNode(true);
      clone.setAttribute("data-bh-marquee-clone", "true");
      clone.removeAttribute("data-bh-extra");
      // Avoid duplicate interactive focus targets in the clone strip.
      clone.querySelectorAll("a, button").forEach(function (el) {
        el.setAttribute("tabindex", "-1");
      });
      cloneWrap.appendChild(clone);
    });
  }

  function setupMarquee(host) {
    var intro =
      host.querySelector(':scope > [data-framer-name="Intro"]') ||
      host.querySelector(":scope > .framer-1gh0xjw");
    if (!intro) return;

    host.classList.add("bh-testimonials-layout");
    var marquee = ensureMarquee(host);
    var source = marquee.querySelector(".bh-testimonials-marquee__track-source");
    if (!source) return;

    // Move any loose review cards into the source strip.
    var loose = collectReviewNodes(host, intro);
    loose.forEach(function (node) {
      source.appendChild(node);
      unhideAppear(node);
    });

    // Also pull any review cards that somehow stayed as host siblings inside
    // hidden wrappers after hydration (no-op if already moved).
    syncMarqueeClones(marquee);
  }

  function applyExtras() {
    if (mutating) return;
    var section =
      document.querySelector('section[data-framer-name="Testimonials"]') ||
      document.querySelector("section.framer-dvu3oi");
    if (!section) return;

    section.querySelectorAll(".framer-bn2dx9 .framer-text").forEach(function (el) {
      el.innerHTML =
        '<span class="framer-text" style="--framer-text-color: rgba(10, 10, 10, 0.6)">Trusted by founders</span> ' +
        "and professionals" +
        '<span class="framer-text" style="--framer-text-color: rgba(0, 0, 0, 0.6)"> to build stronger LinkedIn presence and generate meaningful results.</span>';
    });

    section
      .querySelectorAll('.framer-1xp3t2u[data-framer-name="Rating Count"]')
      .forEach(function (el) {
        el.style.display = "none";
      });

    var host = section.querySelector(".framer-mr0vhf");
    if (!host) return;

    mutating = true;
    try {
      // Ensure marquee exists early so extras append into the strip.
      setupMarquee(host);

      var mount = cardMount(host);
      var have = mount.querySelectorAll(
        "[data-bh-extra]:not([data-bh-marquee-clone])",
      ).length;
      var normalTemplates = templateNodesFor(host, false);
      var reversedTemplates = templateNodesFor(host, true);
      if (!normalTemplates.length && !reversedTemplates.length) {
        setupMarquee(host);
        return;
      }

      var perItem =
        (reversedTemplates.length || normalTemplates.length) ||
        normalTemplates.length ||
        reversedTemplates.length;
      var expected = EXTRA.length * perItem;
      // Cap: after hydration usually 1 template per orientation.
      if (!expected) expected = EXTRA.length;

      if (have !== expected) {
        mount
          .querySelectorAll("[data-bh-extra]:not([data-bh-marquee-clone])")
          .forEach(function (el) {
            el.remove();
          });

        EXTRA.forEach(function (item, i) {
          var templates = i % 2 === 0 ? reversedTemplates : normalTemplates;
          if (!templates.length) {
            templates = normalTemplates.length
              ? normalTemplates
              : reversedTemplates;
          }
          templates.forEach(function (tpl) {
            var clone = tpl.cloneNode(true);
            clone.setAttribute("data-bh-extra", String(i));
            unhideAppear(clone);
            fillCard(clone, item);
            mount.appendChild(clone);
          });
        });
      }

      setupMarquee(host);
    } finally {
      mutating = false;
    }
  }

  function init() {
    applyExtras();
    // Hydration can reshuffle DOM after first paint.
    [800, 2000, 4500].forEach(function (ms) {
      setTimeout(applyExtras, ms);
    });

    if ("MutationObserver" in window && document.body) {
      var timer = null;
      var scheduling = false;
      new MutationObserver(function (mutations) {
        if (scheduling || mutating) return;
        var relevant = mutations.some(function (m) {
          if (
            m.target &&
            m.target.closest &&
            (m.target.closest("[data-bh-extra]") ||
              m.target.closest("[data-bh-marquee]") ||
              m.target.closest(".bh-testimonials-marquee"))
          ) {
            return false;
          }
          return true;
        });
        if (!relevant) return;
        scheduling = true;
        clearTimeout(timer);
        timer = setTimeout(function () {
          scheduling = false;
          applyExtras();
        }, 200);
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


/* --- cta-banner.js --- */
/**
 * Strategy CTA: keep video hidden until ready (no poster/color flash),
 * re-insert before Footer if Framer removes it.
 */
(function () {
  "use strict";

  var sectionTemplate = null;
  var boundVideos = new WeakSet();

  function bindVideo(section) {
    if (!section) return;
    var video = section.querySelector(".cta-banner__video");
    if (!video || boundVideos.has(video)) return;
    boundVideos.add(video);

    // Drop poster so a colorful still never flashes before grayscale video.
    video.removeAttribute("poster");
    video.setAttribute("preload", "metadata");

    function markReady() {
      video.classList.add("is-ready");
    }

    function tryPlay() {
      var playPromise = video.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.then(markReady).catch(function () {
          // Autoplay blocked - still reveal once we have a frame if possible.
          if (video.readyState >= 2) markReady();
        });
      } else if (video.readyState >= 2) {
        markReady();
      }
    }

    video.addEventListener("playing", markReady);
    video.addEventListener("canplay", tryPlay, { once: true });

    if (video.readyState >= 2) {
      tryPlay();
    } else if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            tryPlay();
            io.disconnect();
          });
        },
        { root: null, rootMargin: "120px 0px", threshold: 0.01 },
      );
      io.observe(section);
    } else {
      tryPlay();
    }
  }

  function findFooter() {
    return (
      document.querySelector('footer[data-framer-name="Footer"]') ||
      document.querySelector("footer.framer-11bxfef") ||
      document.querySelector("footer")
    );
  }

  function ensureSection() {
    var section = document.getElementById("cta-banner");
    var footer = findFooter();

    if (!section && sectionTemplate && footer && footer.parentNode) {
      section = sectionTemplate.cloneNode(true);
      var clonedVideo = section.querySelector(".cta-banner__video");
      if (clonedVideo) clonedVideo.classList.remove("is-ready");
      footer.parentNode.insertBefore(section, footer);
    }

    if (section) bindVideo(section);
  }

  function init() {
    var section = document.getElementById("cta-banner");
    if (!section) return;

    sectionTemplate = section.cloneNode(true);
    bindVideo(section);

    if ("MutationObserver" in window && document.body) {
      var scheduled = null;
      new MutationObserver(function () {
        if (scheduled) return;
        scheduled = setTimeout(function () {
          scheduled = null;
          ensureSection();
        }, 200);
      }).observe(document.body, {
        childList: true,
        subtree: true,
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


/* --- packages.js --- */
/**
 * Pricing packages slider - replaces Framer pricing table inside black panel.
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
        "Monthly content calendar (6-12 posts)",
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
      '<a class="bh-pkg__cta" href="https://topmate.io/saakshi_jadhav?utm_source=public_profile&utm_campaign=saakshi_jadhav" target="_blank" rel="noopener noreferrer">' +
      "Enquire" +
      '<span class="bh-pkg__cta-dot" aria-hidden="true"></span>' +
      "</a>" +
      "</article>"
    );
  }

  function buildMarkup() {
    var cards = PACKAGES.map(buildCard).join("");
    return (
      '<div id="bh-packages" class="bh-packages bh-packages--panel" data-bh-packages="true" data-bh-version="9">' +
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
      existing.getAttribute("data-bh-version") === "9"
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


/* --- strategy-call.js --- */
/**
 * One-time Strategy Call banner - kept directly before Packages/Pricing.
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
    '<p class="strategy-call__copy">Get focused, practical guidance for your LinkedIn positioning, content and growth strategy-built around your goals.</p>' +
    '<a class="strategy-call__button" href="https://topmate.io/saakshi_jadhav?utm_source=public_profile&utm_campaign=saakshi_jadhav" target="_blank" rel="noopener noreferrer">Book a 1:1 with Saakshi<span class="strategy-call__button-dot" aria-hidden="true"></span></a>' +
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

    // Keep Strategy Call before the quote bridge (when present), else Packages.
    var anchor =
      document.getElementById("quote-bridge") || pricing;

    var section = document.getElementById("strategy-call");
    if (section && section.nextElementSibling === anchor) return;

    mutating = true;
    try {
      if (!section) {
        var wrap = document.createElement("div");
        wrap.innerHTML = markup;
        section = wrap.firstElementChild;
      }
      pricing.parentNode.insertBefore(section, anchor);
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


/* --- quote-bridge.js --- */
/**
 * Quote bridge - sits between Strategy Call and Packages/Pricing.
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
    '<p class="quote-bridge__text">Great LinkedIn presence isn’t about posting more - it’s about positioning with ' +
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


/* --- why-us.js --- */
/**
 * Why us - scroll-linked zoom, corner slide-ins, counters, text reveals.
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
    '<p class="why-us__blurb">Measurable LinkedIn growth for founders and B2B brands - from impressions and content output to client results that compound over time.</p>' +
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

  /* ----- Injection (Framer hydration-safe) ----- */

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

  /* ----- Animation helpers ----- */

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

  /* ----- Counters ----- */

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

  /* ----- Middle text reveals ----- */

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

  /* ----- Stats slide ----- */

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

  /* ----- Zoom BG + trigger track ----- */

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

  /* ----- Boot ----- */

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


/* --- nav.js --- */
/**
 * Navbar section links for the top bar and hamburger menu.
 * Keeps Framer's existing menu structure and animation behavior.
 */
(function () {
  "use strict";

  if (window.__brandhiveNavLoaded) return;
  window.__brandhiveNavLoaded = true;

  // Top bar only: About, Services, Projects, Packages
  var TOP_BY_HREF = {
    "./Socials": { label: "About", href: "#about" },
    "./socials": { label: "About", href: "#about" },
    "./projects": { label: "Projects", href: "#projects" },
    "./Projects": { label: "Projects", href: "#projects" },
    "./blog": { label: "Services", href: "#services" },
    "./Blog": { label: "Services", href: "#services" },
    "./contact": { label: "Packages", href: "#packages" },
    "./Contact": { label: "Packages", href: "#packages" },
  };

  var TOP_BY_LABEL = {
    Socials: { label: "About", href: "#about" },
    About: { label: "About", href: "#about" },
    Projects: { label: "Projects", href: "#projects" },
    Blog: { label: "Services", href: "#services" },
    Services: { label: "Services", href: "#services" },
    Contact: { label: "Packages", href: "#packages" },
    Packages: { label: "Packages", href: "#packages" },
  };

  var MENU_ITEMS = [
    { label: "Home", href: "#hero" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "#projects" },
    { label: "About", href: "#about" },
    { label: "Packages", href: "#packages" },
  ];

  var mutating = false;
  var scheduled = null;

  function ensureSectionIds() {
    var map = [
      ['section[data-framer-name="Hero"]', "hero"],
      ['section[data-framer-name="Projects"]', "projects"],
      ['section[data-framer-name="Services"]', "services"],
      ["#about, section.about-section", "about"],
      ['section[data-framer-name="Pricing"]', "packages"],
      ["#cta-banner, section[data-framer-name='StrategyCTA']", "cta-banner"],
    ];
    map.forEach(function (pair) {
      var el = document.querySelector(pair[0]);
      if (el && !el.id) el.id = pair[1];
    });
  }

  function setLinkText(anchor, label) {
    anchor.querySelectorAll(".framer-text, p, span").forEach(function (el) {
      var t = (el.textContent || "").trim();
      if (!t) return;
      if (/^\d+$/.test(t)) {
        el.textContent = "";
        return;
      }
      if (t === label) return;
      if (
        /^(Home|Socials|About|Projects|Blog|Services|Packages|Contact)$/i.test(t)
      ) {
        el.textContent = label;
      }
    });
  }

  function applyTarget(anchor, target) {
    if (!anchor || !target) return;
    var currentHref = anchor.getAttribute("href") || "";
    if (currentHref !== target.href) {
      anchor.setAttribute("href", target.href);
    }
    anchor.removeAttribute("data-framer-page-link-current");
    setLinkText(anchor, target.label);
    if (!anchor.dataset.bhNavBound) {
      anchor.dataset.bhNavBound = "1";
      anchor.addEventListener("click", onNavClick, true);
    }
  }

  function closeHamburgerMenu(anchor) {
    var header = anchor.closest("header");
    if (!header) return;
    var toggle =
      header.querySelector(
        'nav[data-framer-name="Top"] [data-framer-name="Button container"]',
      ) ||
      header.querySelector(
        'nav[data-framer-name="Top"] [data-framer-name="Open"]',
      );
    if (toggle) toggle.click();
  }

  function onNavClick(event) {
    var anchor = event.currentTarget;
    var href = anchor.getAttribute("href") || "";
    if (href.charAt(0) !== "#") return;
    var id = href.slice(1);
    var target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    if (anchor.closest('nav[data-framer-name="Navigation"]')) {
      closeHamburgerMenu(anchor);
    }
    document.documentElement.classList.remove("bh-menu-open");
    window.setTimeout(function () {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      try {
        history.replaceState(null, "", href);
      } catch (e) {}
    }, 40);
  }

  function isTopNavLink(anchor) {
    return !!(
      anchor.closest('nav[data-framer-name="Top"]') &&
      !anchor.closest('nav[data-framer-name="Navigation"]') &&
      !anchor.closest('[data-framer-name="Body"]') &&
      !anchor.closest('[data-framer-name="Bottom"]')
    );
  }

  function patchHamburgerMenus() {
    document
      .querySelectorAll('nav[data-framer-name="Navigation"]')
      .forEach(function (nav) {
        var anchors = nav.querySelectorAll(
          ':scope > [data-framer-name="Item container"] a[href]',
        );
        Array.prototype.forEach.call(anchors, function (anchor, index) {
          if (MENU_ITEMS[index]) applyTarget(anchor, MENU_ITEMS[index]);
        });
      });
  }

  function syncMenuState() {
    var open = false;
    document
      .querySelectorAll('header [data-framer-name="Body"]')
      .forEach(function (body) {
        if (open) return;
        try {
          var style = window.getComputedStyle(body);
          if (
            style.visibility !== "hidden" &&
            parseFloat(style.opacity || "0") > 0.2
          ) {
            open = true;
          }
        } catch (e) {}
      });
    document.documentElement.classList.toggle("bh-menu-open", open);
  }

  function patchNav() {
    if (mutating) return;
    mutating = true;
    try {
      ensureSectionIds();

      document
        .querySelectorAll('nav[data-framer-name="Top"] a[href]')
        .forEach(function (anchor) {
          // Never touch hamburger overlay / body links
          if (!isTopNavLink(anchor)) return;
          // Skip brand logo link
          if (anchor.getAttribute("data-framer-name") === "Link") return;
          if (anchor.querySelector && anchor.querySelector(".framer-uNobG"))
            return;

          var href = anchor.getAttribute("href") || "";
          var labelEl = anchor.querySelector(".framer-text, p");
          var label = labelEl ? (labelEl.textContent || "").trim() : "";
          var topTarget =
            TOP_BY_HREF[href] ||
            TOP_BY_LABEL[label] ||
            (href.indexOf("#") === 0 ? TOP_BY_LABEL[label] : null);
          if (topTarget) applyTarget(anchor, topTarget);
        });
      patchHamburgerMenus();
      syncMenuState();
    } finally {
      mutating = false;
    }
  }

  function schedulePatch() {
    if (scheduled) return;
    scheduled = window.setTimeout(function () {
      scheduled = null;
      patchNav();
    }, 200);
  }

  function init() {
    patchNav();
    [600, 1600, 3500].forEach(function (ms) {
      window.setTimeout(patchNav, ms);
    });

    if ("MutationObserver" in window && document.body) {
      new MutationObserver(function () {
        if (mutating) return;
        schedulePatch();
      }).observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["class", "style"],
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();


