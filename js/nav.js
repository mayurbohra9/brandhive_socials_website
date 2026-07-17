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
