/**
 * Testimonials: add reviews 4-7 by cloning the existing Framer cards,
 * so every card keeps the exact same design, typography and hover chrome.
 * Reviews 1-3 are baked into the SSR HTML and the Framer bundle.
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
      // Only clear appear-animation state (opacity 0); keep design opacities.
      if (el.style.opacity === "0" || el.style.opacity === "0.001") {
        el.style.opacity = "1";
        el.style.transform = "none";
        el.style.willChange = "auto";
      }
    });
  }

  function templateNodesFor(host, reversed) {
    // Direct grid children holding reusable stock cards. Pre-hydration these
    // are .ssr-variant wrappers (one per breakpoint); after hydration a
    // single container element. Use the reversed card to continue the
    // alternating top/bottom pattern.
    var className = reversed
      ? "framer-1hllsft-container"
      : "framer-181puib-container";
    var out = [];
    Array.prototype.forEach.call(host.children, function (child) {
      if (child.hasAttribute("data-bh-extra")) return;
      if (child.classList.contains(className) || child.querySelector("." + className)) {
        out.push(child);
      }
    });
    return out;
  }

  function applyExtras() {
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

    var have = host.querySelectorAll("[data-bh-extra]").length;
    var normalTemplates = templateNodesFor(host, false);
    var reversedTemplates = templateNodesFor(host, true);
    if (!normalTemplates.length && !reversedTemplates.length) return;

    var expected = EXTRA.reduce(function (sum, _item, i) {
      var templates = i % 2 === 0 ? reversedTemplates : normalTemplates;
      return sum + (templates.length || normalTemplates.length || reversedTemplates.length);
    }, 0);
    if (have === expected) return;

    // Rebuild cleanly to avoid partial/duplicate states after hydration.
    host.querySelectorAll("[data-bh-extra]").forEach(function (el) {
      el.remove();
    });

    EXTRA.forEach(function (item, i) {
      var templates = i % 2 === 0 ? reversedTemplates : normalTemplates;
      if (!templates.length) templates = normalTemplates.length
        ? normalTemplates
        : reversedTemplates;
      templates.forEach(function (tpl) {
        var clone = tpl.cloneNode(true);
        clone.setAttribute("data-bh-extra", String(i));
        unhideAppear(clone);
        fillCard(clone, item);
        host.appendChild(clone);
      });
    });
  }

  function init() {
    applyExtras();

    if ("MutationObserver" in window && document.body) {
      var timer = null;
      var scheduling = false;
      new MutationObserver(function (mutations) {
        if (scheduling) return;
        var relevant = mutations.some(function (m) {
          return !(
            m.target &&
            m.target.closest &&
            m.target.closest("[data-bh-extra]")
          );
        });
        if (!relevant) return;
        scheduling = true;
        clearTimeout(timer);
        timer = setTimeout(function () {
          scheduling = false;
          applyExtras();
        }, 150);
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
