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
          // Autoplay blocked — still reveal once we have a frame if possible.
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
