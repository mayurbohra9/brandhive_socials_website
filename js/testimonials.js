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
