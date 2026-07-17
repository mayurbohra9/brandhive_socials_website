/**
 * Lock the browser tab title to BrandHive Socials.
 * Framer hydration can briefly set an old Fabrica title; intercept that.
 */
(function () {
  "use strict";

  var DESIRED =
    "BrandHive Socials - Web Design, Branding & Digital Growth";

  function normalizeTitle(value) {
    var next = String(value || "");
    if (!next) return DESIRED;
    if (/fabrica/i.test(next)) return DESIRED;
    if (next.indexOf("BrandHive") === -1 && /studio/i.test(next)) return DESIRED;
    return next;
  }

  var proto = Document.prototype;
  var titleDescriptor = Object.getOwnPropertyDescriptor(proto, "title");

  function applyTitle() {
    if (normalizeTitle(document.title) !== DESIRED || document.title !== DESIRED) {
      if (titleDescriptor && titleDescriptor.set) {
        titleDescriptor.set.call(document, DESIRED);
      } else {
        var el = document.querySelector("title");
        if (el) el.textContent = DESIRED;
      }
    }
    var titleEl = document.querySelector("title");
    if (titleEl && titleEl.textContent !== DESIRED) {
      titleEl.textContent = DESIRED;
    }
  }

  if (titleDescriptor && titleDescriptor.configurable) {
    Object.defineProperty(document, "title", {
      configurable: true,
      enumerable: true,
      get: function () {
        return titleDescriptor.get.call(document);
      },
      set: function (value) {
        titleDescriptor.set.call(document, normalizeTitle(value));
      },
    });
  }

  applyTitle();

  function watchTitleNode() {
    var titleEl = document.querySelector("title");
    if (!titleEl || titleEl.__bhTitleWatched) return;
    titleEl.__bhTitleWatched = true;
    new MutationObserver(applyTitle).observe(titleEl, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  watchTitleNode();

  if (document.head) {
    new MutationObserver(function () {
      watchTitleNode();
      applyTitle();
    }).observe(document.head, { childList: true, subtree: true });
  }

  document.addEventListener("DOMContentLoaded", function () {
    watchTitleNode();
    applyTitle();
  });

  [0, 50, 150, 400, 1000, 2000, 4000].forEach(function (ms) {
    setTimeout(function () {
      watchTitleNode();
      applyTitle();
    }, ms);
  });
})();
