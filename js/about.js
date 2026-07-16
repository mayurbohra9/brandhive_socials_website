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
