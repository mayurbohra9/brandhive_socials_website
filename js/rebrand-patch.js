/**
 * Runtime rebrand for page text/metadata.
 * IMPORTANT: Does NOT touch the preloader ([data-framer-appear-id="1b4e3p4"]).
 * Framer's native character appear effect owns that animation.
 *
 * Mutation handling is debounced and skips the preloader overlay so Framer
 * animations are not starved (that previously froze the site on loading).
 */
(function () {
  "use strict";

  if (window.__brandhiveRebrandPatchLoaded) return;
  window.__brandhiveRebrandPatchLoaded = true;

  var BRAND = "BrandHive Socials";
  var DESIRED_TITLE =
    "BrandHive Socials – Web Design, Branding & Digital Growth";
  var FOOTER_COPYRIGHT = "© 2026 BrandHive Socials. All rights reserved.";
  var FOOTER_HIRE_EMAIL = "saakshi@brandhivesocials.com";
  var FOOTER_JOIN_EMAIL = "careers@brandhivesocials.com";
  var FOOTER_HIRE_HEADING = "Hire us:";
  var FOOTER_JOIN_HEADING = "Join us:";
  var FOOTER_HIRE_LABEL = FOOTER_HIRE_HEADING + " " + FOOTER_HIRE_EMAIL;
  var FOOTER_JOIN_LABEL = FOOTER_JOIN_HEADING + " " + FOOTER_JOIN_EMAIL;
  var FOOTER_INSTAGRAM_URL = "https://www.instagram.com/brandhivesocials/";
  var FOOTER_LINKEDIN_URL =
    "https://www.linkedin.com/company/brandhive-socials/";
  var HERO_LEAD = "No generic branding. No empty content strategies.";
  var HERO_DETAIL =
    "Just LinkedIn profiles, content, and positioning that help founders, CXOs, and business leaders attract qualified leads and build lasting authority.";
  var HERO_SERVICES = [
    "LinkedIn Personal Branding",
    "LinkedIn Company Branding",
    "LinkedIn Influencer Marketing",
    "Lead Generation, Corporate",
    "School LinkedIn Seminars",
  ];
  var FAQ_ITEMS = [
    {
      q: "Who is this service for?",
      a: "Founders, CXOs, and B2B leaders who want LinkedIn to drive authority and qualified leads - not vanity metrics. Whether you need The Foundation, The Immersion, Lead Generation, Refined, or Company Page Branding, we match the package to where you are and where you want to go.",
    },
    {
      q: "Will my posts actually sound like me?",
      a: "Yes. Every package that includes content starts with a discovery questionnaire and voice capture session - your tone, stories, and point of view stay intact.",
    },
    {
      q: "How long before I see results?",
      a: "Most clients see stronger impressions, profile traction, and inbound conversations by month three - when strategy, content, and outreach have time to compound.",
    },
    {
      q: "Do I need to be active online myself?",
      a: "No. We handle writing, publishing, design, and outreach based on your package. You stay as visible or as private as you prefer.",
    },
    {
      q: "Who all will be working on my account?",
      a: "A dedicated team: strategist, ghostwriter, social media manager, graphic designer, and - for lead-gen packages - a lead generation specialist.",
    },
    {
      q: "What's the minimum time commitment?",
      a: "Three months minimum. That's the runway a LinkedIn brand needs - enough time to build strategy, publish consistently, and let outreach compound.",
    },
    {
      q: "Is Sales Navigator included, or do I pay extra?",
      a: "Included in The Immersion and Lead Generation, Refined. Your Sales Navigator Advanced subscription is bundled - nothing extra on top.",
    },
  ];
  var SERVICE_CARDS = [
    {
      num: "001",
      title: "LinkedIn Personal Branding",
      description:
        "Build a powerful personal brand on LinkedIn with an optimized profile, strategic content, and authentic storytelling that positions you as an industry authority and attracts qualified opportunities.",
      categories: [
        "Profile Optimization",
        "Ghostwriting",
        "Content Strategy",
        "Personal Branding",
        "Thought Leadership",
        "Audience Growth",
      ],
      image: "assets/images/service-linkedin-personal-branding.jpg",
    },
    {
      num: "002",
      title: "LinkedIn Company Branding",
      description:
        "Transform your company page into a professional brand presence with engaging content, employer branding, and a consistent visual identity that builds trust and attracts customers and talent.",
      categories: [
        "Company Branding",
        "Employer Branding",
        "Company Page",
        "Visual Identity",
        "Content Marketing",
        "Brand Strategy",
      ],
      image: "assets/images/service-linkedin-company-branding.jpg",
    },
    {
      num: "003",
      title: "LinkedIn Lead Generation",
      description:
        "Generate qualified B2B leads through targeted LinkedIn outreach, Sales Navigator, strategic messaging, and optimized sales funnels that create meaningful business conversations.",
      categories: [
        "Lead Generation",
        "Sales Navigator",
        "B2B Outreach",
        "ICP Targeting",
        "Sales Funnel",
        "Business Growth",
      ],
      image: "assets/images/service-linkedin-lead-generation.jpg",
    },
    {
      num: "004",
      title: "LinkedIn Workshops & Seminars",
      description:
        "Interactive LinkedIn workshops for schools, colleges, and organizations that help students and professionals build strong profiles, personal brands, and networking skills.",
      categories: [
        "Workshops",
        "LinkedIn Training",
        "Career Branding",
        "Networking",
        "Institutions",
        "Professional Growth",
      ],
      image: "assets/images/service-linkedin-workshops.jpg",
    },
    {
      num: "005",
      title: "LinkedIn Influencer Marketing",
      description:
        "Partner with the right LinkedIn creators and industry voices to amplify your brand, increase credibility, and reach decision-makers through authentic influencer collaborations.",
      categories: [
        "Influencer Marketing",
        "Brand Awareness",
        "Creator Partnerships",
        "Campaign Strategy",
        "Audience Reach",
        "Thought Leadership",
      ],
      image: "assets/images/service-linkedin-influencer-marketing.jpg",
    },
  ];
  var PROJECT_SUBTITLE =
    "Selected LinkedIn success stories across personal branding, company positioning, lead generation, workshops, and influencer campaigns.";
  var PROJECT_CARDS = [
    {
      href: "./projects/boltshift",
      title: "Personal Branding.",
      year: "2026",
      image: "assets/images/project-linkedin-personal-branding.jpg",
    },
    {
      href: "./projects/ephemeral",
      title: "Company Branding.",
      year: "2026",
      image: "assets/images/project-linkedin-company-branding.jpg",
    },
    {
      href: "./projects/powersurge",
      title: "Lead Generation.",
      year: "2026",
      image: "assets/images/project-linkedin-lead-generation.jpg",
    },
    {
      href: "./projects/mastermail",
      title: "Workshops & Seminars.",
      year: "2026",
      image: "assets/images/project-linkedin-workshops.jpg",
    },
    {
      href: "./projects/warpspeed",
      title: "Influencer Marketing.",
      year: "2026",
      image: "assets/images/project-linkedin-influencer-marketing.jpg",
    },
    {
      href: "./projects/cloudwatch",
      title: "Integrated LinkedIn Growth.",
      year: "2026",
      image: "assets/images/project-linkedin-growth-campaign.jpg",
    },
  ];
  var WHY_CHOOSE = {
    headingLead: "Proven LinkedIn results for every engagement,",
    headingMuted: "with a focus on authority and qualified leads.",
    cta: "Your LinkedIn growth starts with a conversation. Let's talk today.",
    bodyStrong: "No fluff, just LinkedIn results.",
    bodyRest:
      " Strategy, content, and outreach that make your brand work harder. We deliver personal branding, company pages, lead gen, workshops, and influencer campaigns—project after project.",
    card1Title: "LinkedIn programs delivered",
    card1Desc:
      "We've delivered 50+ LinkedIn branding, lead-gen, workshop, and influencer programs that create real business conversations.",
    card2Title: "Client satisfaction rate",
    image: "assets/images/service-linkedin-personal-branding.jpg",
  };

  function normalizeCopyright(value) {
    if (!value) return value;
    var next = String(value).trim();

    if (next === FOOTER_COPYRIGHT) return FOOTER_COPYRIGHT;
    if (
      /^©\s*2026\s*BrandHive Socials\.?\s*All rights reserved\.?$/i.test(next)
    ) {
      return FOOTER_COPYRIGHT;
    }

    if (
      /^©\s*2026\s*BrandHive Socials\.?$/i.test(next) ||
      /^©\s*2026$/i.test(next) ||
      /^\(?\s*2016\s*[-–—]\s*25\s*©?\s*\)?$/i.test(next) ||
      /^\(2016-25©\)$/i.test(next)
    ) {
      return "";
    }

    return value;
  }

  function rebrandText(value) {
    if (!value) return value;
    var copyright = normalizeCopyright(value);
    if (copyright !== value) return copyright;

    var next = String(value);

    next = next.replace(/fabrica\s*®?\s*studio/gi, BRAND);
    next = next.replace(/Fabrica\s*®?\s*Studio/g, BRAND);
    next = next.replace(/fabrica®/gi, BRAND);
    next = next.replace(/Fabrica®/g, BRAND);
    next = next.replace(/\bfabrica\b/gi, "BrandHive");
    next = next.replace(/\bFabrica\b/g, "BrandHive");
    next = next.replace(/\bStudio\b/g, "Socials");
    next = next.replace(/\bstudio\b/g, "socials");

    if (next.indexOf("®") !== -1) next = next.replace(/®/g, "");

    next = next.replace(/\bBrandhive\b/g, "BrandHive");
    next = next.replace(/\bbrandhive\b/g, "BrandHive");
    // Keep company line without leading "at"
    next = next.replace(/\bat\s+BrandHive Socials\b/g, BRAND);
    next = next.replace(/BrandHive Socials(?:\s+Socials)+/g, BRAND);
    next = next.replace(/BrandHive Socials(?:\s+BrandHive Socials)+/g, BRAND);
    next = next.replace(/\bLauren Thompson\b/g, "Saakshi Jadhav");
    next = next.replace(/\bTeam Lead\b/g, "Founder");

    return next;
  }

  function fixFounderCard() {
    // Only the Let's talk / contact founder cards use this image slot.
    document
      .querySelectorAll('[data-framer-name="Team Member Image"] img')
      .forEach(function (img) {
        var desired = "assets/images/saakshi-jadhav.png";
        if (img.getAttribute("src") !== desired) {
          img.setAttribute("src", desired);
        }
        if (img.getAttribute("srcset")) img.removeAttribute("srcset");
        img.alt = "Saakshi Jadhav";
      });

    document
      .querySelectorAll(
        '[data-framer-name="Team Member Role"] .framer-text, [data-framer-name="Team Member Role"] p',
      )
      .forEach(function (el) {
        if (/Team Lead/i.test(el.textContent || "")) {
          el.textContent = "Founder";
        }
      });

    document
      .querySelectorAll(
        '[data-framer-name="Team Member Company"] .framer-text, [data-framer-name="Team Member Company"] p',
      )
      .forEach(function (el) {
        if (/^at\s+/i.test((el.textContent || "").trim())) {
          el.textContent = (el.textContent || "").replace(/^at\s+/i, "").trim();
        }
      });

    document
      .querySelectorAll(
        '[data-framer-name="Team Member Name"] .framer-text, [data-framer-name="Team Member Name"] p',
      )
      .forEach(function (el) {
        if (/Lauren Thompson/i.test(el.textContent || "")) {
          el.textContent = "Saakshi Jadhav";
        }
      });
  }

  function fixFooterCopyright() {
    document
      .querySelectorAll(
        '.framer-1cgv8u3 .framer-text, [data-framer-name="Bottom"] .framer-1cgv8u3 p',
      )
      .forEach(function (el) {
        if (
          el.textContent &&
          /©|2026|BrandHive|rights/i.test(el.textContent) &&
          el.textContent.trim() !== FOOTER_COPYRIGHT
        ) {
          el.textContent = FOOTER_COPYRIGHT;
        }
      });
  }

  function fixFooterLogo() {
    var logo = document.querySelector(
      'footer [data-framer-name="Logo"], footer .framer-pbcowa, .framer-8QVl3 .framer-pbcowa',
    );
    if (!logo) return;
    var svg = logo.querySelector("svg.framer-1w026i8, svg");
    if (!svg) return;
    var brandP = svg.querySelector("p");
    if (!brandP) return;

    // Ensure word is complete after hydration.
    if (
      /BrandHiv/i.test(brandP.textContent) &&
      brandP.textContent.replace(/\s+/g, "") !== "BrandHive"
    ) {
      brandP.textContent = "BrandHive";
    }

    svg.style.overflow = "visible";
    var fo = svg.querySelector("foreignObject");
    if (fo) fo.style.overflow = "visible";

    // Pin "Socials" so its right edge lines up with the end of "BrandHive".
    logo.style.position = "relative";
    var socialWraps = logo.querySelectorAll(".ssr-variant");
    var brandRange = document.createRange();
    brandRange.selectNodeContents(brandP);
    var brandRect = brandRange.getBoundingClientRect();
    var logoRect = logo.getBoundingClientRect();
    if (!brandRect.width) return;

    var rightEdge = Math.max(0, brandRect.right - logoRect.left);
    var fontSize =
      window.innerWidth >= 1200 ? "72px" : window.innerWidth >= 810 ? "54px" : "40px";

    socialWraps.forEach(function (wrap) {
      if (!wrap.querySelector(".framer-x47oxk")) return;
      wrap.style.setProperty("position", "absolute", "important");
      wrap.style.setProperty("left", rightEdge + "px", "important");
      wrap.style.setProperty("right", "auto", "important");
      wrap.style.setProperty("top", svg.offsetHeight + "px", "important");
      wrap.style.setProperty("bottom", "auto", "important");
      wrap.style.setProperty("width", "max-content", "important");
      wrap.style.setProperty("transform", "translateX(-100%)", "important");
      wrap.style.setProperty("margin", "0", "important");

      var text = wrap.querySelector(".framer-x47oxk p, p.framer-text");
      if (text) {
        text.style.setProperty("font-size", fontSize, "important");
        text.style.setProperty("--framer-font-size", fontSize, "important");
        text.style.setProperty("text-align", "right", "important");
        text.style.setProperty("white-space", "nowrap", "important");
      }
    });

    // Keep layout height for the absolutely positioned Socials line.
    var socialSample = logo.querySelector(".framer-x47oxk p");
    var socialH = socialSample
      ? Math.ceil(socialSample.getBoundingClientRect().height || 48)
      : 48;
    logo.style.paddingBottom = socialH + 8 + "px";
  }

  function setStackedEmailText(textEl, heading, email) {
    if (!textEl) return;
    var current = textEl.textContent.replace(/\s+/g, " ").trim();
    var desired = heading + " " + email;
    if (
      current === desired &&
      textEl.querySelector &&
      textEl.querySelector(".bh-email-heading")
    ) {
      return;
    }
    textEl.textContent = "";
    var headingEl = document.createElement("span");
    headingEl.className = "bh-email-heading";
    headingEl.textContent = heading;
    var emailEl = document.createElement("span");
    emailEl.className = "bh-email-address";
    emailEl.textContent = email;
    textEl.appendChild(headingEl);
    textEl.appendChild(emailEl);
  }

  function applyEmailBlock(container, heading, email) {
    if (!container) return;
    container.setAttribute("data-bh-email", heading.replace(/:$/, "").toLowerCase());
    container.querySelectorAll("a[href]").forEach(function (a) {
      a.setAttribute("href", "mailto:" + email);
      var textEl =
        a.querySelector('[data-framer-name="Email Address"] .framer-text') ||
        a.querySelector('[data-framer-name="Email Address"] p') ||
        a.querySelector("p.framer-text");
      setStackedEmailText(textEl, heading, email);
    });
  }

  function fixFooterContactAndSocial() {
    var roots = document.querySelectorAll(
      'footer [data-framer-name="Contact"], [data-framer-name="Bottom"] [data-framer-name="Contact"]',
    );

    roots.forEach(function (root) {
      // Hide original phone / plain-text row
      Array.prototype.forEach.call(root.children, function (child) {
        if (
          child.classList.contains("framer-14rnmud") ||
          child.classList.contains("framer-zypsr7")
        ) {
          child.style.setProperty("display", "none", "important");
        }
      });
      root.querySelectorAll('a[href^="tel:"], a[href^="Tel:"]').forEach(
        function (a) {
          a.style.setProperty("display", "none", "important");
        },
      );

      var emailContainers = root.querySelectorAll(
        ":scope > .framer-1qul2xg-container, :scope > .framer-1cprrbp-container",
      );
      if (!emailContainers.length) return;

      var hireContainer = null;
      Array.prototype.forEach.call(emailContainers, function (container) {
        if (
          !hireContainer &&
          container.getAttribute("data-bh-email") !== "join us"
        ) {
          hireContainer = container;
        }
      });
      if (!hireContainer) return;

      applyEmailBlock(hireContainer, FOOTER_HIRE_HEADING, FOOTER_HIRE_EMAIL);

      var join = root.querySelector('[data-bh-email="join us"]');
      if (!join) {
        join = hireContainer.cloneNode(true);
        join.setAttribute("data-bh-email-clone", "true");
        hireContainer.parentNode.insertBefore(
          join,
          hireContainer.nextSibling,
        );
      }
      applyEmailBlock(join, FOOTER_JOIN_HEADING, FOOTER_JOIN_EMAIL);
    });

    document
      .querySelectorAll('footer [data-framer-name="Social"] a')
      .forEach(function (a) {
        var text = (a.textContent || "").replace(/\s+/g, " ").trim();
        if (/Twitter|LinkedIn/i.test(text)) {
          a.setAttribute("href", FOOTER_LINKEDIN_URL);
          a.querySelectorAll("p.framer-text, .framer-text").forEach(
            function (el) {
              var t = (el.textContent || "").trim();
              if (/^(Twitter|LinkedIn)$/i.test(t)) el.textContent = "LinkedIn";
            },
          );
        }
        if (/Instagram/i.test(text)) {
          a.setAttribute("href", FOOTER_INSTAGRAM_URL);
        }
        if (
          /Dribbble/i.test(text) ||
          /dribbble\.com/i.test(a.getAttribute("href") || "")
        ) {
          var wrap = a.closest(".framer-1tsabm-container") || a;
          wrap.style.display = "none";
        }
      });
  }

  function fixHeroCopy() {
    document.querySelectorAll(".framer-1h9hge5 h1").forEach(function (heading) {
      var desired = HERO_LEAD + " " + HERO_DETAIL;
      if (heading.textContent.replace(/\s+/g, " ").trim() === desired) return;

      heading.textContent = HERO_LEAD + " ";
      var detail = document.createElement("span");
      detail.className = "framer-text";
      detail.style.setProperty(
        "--framer-text-color",
        "rgba(255, 255, 255, 0.7)",
      );
      detail.textContent = HERO_DETAIL;
      heading.appendChild(detail);
    });
  }

  function fixHeroServices() {
    document
      .querySelectorAll('.framer-o59pbo[data-framer-name="Services"]')
      .forEach(function (list) {
        var items = list.querySelectorAll(
          ':scope > [data-framer-name="1"], :scope > [data-framer-name="2"], :scope > [data-framer-name="3"], :scope > [data-framer-name="4"], :scope > [data-framer-name="5"]',
        );
        // Ensure a 5th row exists after hydration.
        if (items.length < 5) {
          var template = list.querySelector(
            ':scope > [data-framer-name="4"]',
          );
          if (template) {
            var fifth = template.cloneNode(true);
            fifth.setAttribute("data-framer-name", "5");
            fifth.classList.add("framer-bh-svc5");
            list.appendChild(fifth);
          }
        }
        items = list.querySelectorAll(":scope > [data-framer-name]");
        HERO_SERVICES.forEach(function (label, index) {
          var row = items[index];
          if (!row) return;
          var textEl = row.querySelector(".framer-text, p");
          if (!textEl) return;
          if (textEl.textContent.trim() !== label) textEl.textContent = label;
          textEl.style.setProperty("--framer-text-alignment", "left");
          textEl.style.textAlign = "left";
        });
      });
  }

  function fixFaq() {
    var section = document.querySelector('section[data-framer-name="FAQ"]');
    if (!section) return;

    var processed = [];
    section.querySelectorAll('[class*=":-item-0"]').forEach(function (first) {
      var parent = first.parentElement;
      if (!parent || processed.indexOf(parent) !== -1) return;
      processed.push(parent);

      FAQ_ITEMS.forEach(function (faq, index) {
        var item = parent.querySelector('[class*=":-item-' + index + '"]');
        if (!item && index > 0) {
          var prev = parent.querySelector(
            '[class*=":-item-' + (index - 1) + '"]',
          );
          if (!prev) return;
          item = prev.cloneNode(true);
          item.className = item.className.replace(
            /:-item-\d+/,
            ":-item-" + index,
          );
          parent.appendChild(item);
        }
        if (!item) return;
        var qEl = item.querySelector("span");
        var aEl = item.querySelector("p");
        if (qEl && qEl.textContent.trim() !== faq.q) qEl.textContent = faq.q;
        if (aEl && aEl.textContent.trim() !== faq.a) aEl.textContent = faq.a;
      });
    });
  }

  function findServiceCardRoot(el) {
    var node = el;
    while (node && node !== document.body) {
      if (
        node.getAttribute &&
        (node.getAttribute("data-framer-name") || "").match(
          /^(Desktop|Tablet|Phone) (open|closed)$/,
        )
      ) {
        return node;
      }
      node = node.parentElement;
    }
    return el.closest ? el.closest("[data-framer-name]") : null;
  }

  function tagServiceCards(section) {
    section.querySelectorAll("p, span").forEach(function (el) {
      var m = el.textContent.trim().match(/^\((\d{3})\)$/);
      if (!m) return;
      var root = findServiceCardRoot(el);
      if (root) root.setAttribute("data-bh-service", m[1]);
    });
  }

  function cleanupServiceDuplicates(section) {
    section.querySelectorAll('[data-bh-service="004"]').forEach(function (card004) {
      var parent = card004.parentElement;
      if (!parent) return;
      parent.querySelectorAll('[data-bh-service="005"]').forEach(function (dup) {
        dup.remove();
      });
    });
  }

  function fixServiceCards() {
    var section = document.querySelector('section[data-framer-name="Services"]');
    if (!section) return;

    tagServiceCards(section);
    cleanupServiceDuplicates(section);
    tagServiceCards(section);

    SERVICE_CARDS.forEach(function (service) {
      var cards = section.querySelectorAll(
        '[data-bh-service="' + service.num + '"]',
      );

      Array.prototype.forEach.call(cards, function (card) {
        card.querySelectorAll("p, span").forEach(function (el) {
          if (/^\(\d{3}\)$/.test(el.textContent.trim())) {
            el.textContent = "(" + service.num + ")";
          }
        });

        var info = card.querySelector('[data-framer-name="Service Info"]');
        if (info) {
          var paragraphs = info.querySelectorAll("p");
          if (paragraphs[0]) paragraphs[0].textContent = service.title;
          if (paragraphs[1]) paragraphs[1].textContent = service.description;
        }

        var bigTitle = card.querySelector('[data-framer-name="Service Title"] p');
        if (bigTitle) bigTitle.textContent = service.title;

        var chipTexts = card.querySelectorAll(
          '[data-framer-name="Join Us Button Text"] p',
        );
        var items = card.querySelector('[data-framer-name="Items"]');
        // Clone chips at most once per card to avoid runaway DOM growth.
        if (
          items &&
          chipTexts.length &&
          chipTexts.length < service.categories.length &&
          card.dataset.bhChipsExpanded !== "1"
        ) {
          var template =
            chipTexts[0].closest('[class*="-container"]') ||
            chipTexts[0].parentElement;
          var guard = 0;
          while (
            items.querySelectorAll('[data-framer-name="Join Us Button Text"]')
              .length < service.categories.length &&
            guard++ < 8
          ) {
            if (!template) break;
            items.appendChild(template.cloneNode(true));
          }
          card.dataset.bhChipsExpanded = "1";
          chipTexts = card.querySelectorAll(
            '[data-framer-name="Join Us Button Text"] p',
          );
        }
        service.categories.forEach(function (label, i) {
          if (chipTexts[i]) chipTexts[i].textContent = label;
        });

        card
          .querySelectorAll('[data-framer-name="Images"] img')
          .forEach(function (img) {
            img.setAttribute("src", service.image);
            img.removeAttribute("srcset");
            img.alt = service.title;
          });

        card.dataset.bhServicePatched = service.num;
      });
    });

    // Remove legacy injected Enquire CTAs from service cards.
    section.querySelectorAll(".bh-enquire-btn").forEach(function (el) {
      el.remove();
    });

    // Services bottom CTA: Get started → Enquire
    section.querySelectorAll("p, span, a").forEach(function (el) {
      if (el.childElementCount) return;
      if (el.textContent.trim() === "Get started") el.textContent = "Enquire";
    });
  }

  function fixProjects() {
    var section = document.querySelector('section[data-framer-name="Projects"]');
    if (!section) return;

    var desc = section.querySelector('[data-framer-name="Description"] p');
    if (desc) desc.textContent = PROJECT_SUBTITLE;

    PROJECT_CARDS.forEach(function (project) {
      var links = section.querySelectorAll('a[href="' + project.href + '"]');
      Array.prototype.forEach.call(links, function (link) {
        var name = link.querySelector('[data-framer-name="Project name"] p');
        if (name) name.textContent = project.title;

        var yearEl = link.querySelector(".framer-9ocb8t");
        if (!yearEl) {
          var yearWrap = link.querySelector('[data-framer-name="Year"]');
          if (yearWrap) {
            var ps = yearWrap.querySelectorAll("p");
            if (ps.length) yearEl = ps[ps.length - 1];
          }
        }
        if (yearEl && /^\d{4}$/.test(yearEl.textContent.trim())) {
          yearEl.textContent = project.year;
        }

        link
          .querySelectorAll('[data-framer-name="Image"] img')
          .forEach(function (img) {
            img.setAttribute("src", project.image);
            img.removeAttribute("srcset");
            img.alt = project.title.replace(/\.$/, "");
          });
      });
    });
  }

  function fixAdvantages() {
    var section = document.querySelector(
      'section[data-framer-name="Advantages"]',
    );
    if (!section) return;

    // Heading: lead + muted span
    var heading = section.querySelector(
      '[data-framer-name="Section Description"] h2',
    );
    if (heading) {
      var muted = heading.querySelector("span");
      // Replace only the lead text node(s)
      var leadParts = [];
      heading.childNodes.forEach(function (n) {
        if (n.nodeType === 3) leadParts.push(n);
      });
      if (leadParts.length) {
        leadParts[0].nodeValue = WHY_CHOOSE.headingLead + " ";
        for (var i = 1; i < leadParts.length; i++) leadParts[i].nodeValue = "";
      } else {
        heading.insertBefore(
          document.createTextNode(WHY_CHOOSE.headingLead + " "),
          heading.firstChild,
        );
      }
      if (muted) muted.textContent = WHY_CHOOSE.headingMuted;
    }

    // CTA blurb on the image card
    section.querySelectorAll(".framer-j3uvcp p").forEach(function (p) {
      if (/digital journey|LinkedIn growth starts/i.test(p.textContent)) {
        p.textContent = WHY_CHOOSE.cta;
      }
    });

    // Supporting paragraph under Items
    section.querySelectorAll(".framer-1xbqwt4 p, .framer-k82g9i p").forEach(
      function (p) {
        if (!/No fluff|LinkedIn results/i.test(p.textContent)) return;
        var strong = p.querySelector("span");
        if (strong) {
          strong.textContent = WHY_CHOOSE.bodyStrong;
          // Clear and rebuild rest as text after the span
          var after = "";
          p.childNodes.forEach(function (n) {
            if (n === strong) return;
            if (n.nodeType === 3) after += n.nodeValue;
          });
          // Remove trailing text nodes then append new rest
          Array.prototype.slice.call(p.childNodes).forEach(function (n) {
            if (n !== strong) p.removeChild(n);
          });
          p.appendChild(document.createTextNode(WHY_CHOOSE.bodyRest));
        } else {
          p.textContent = WHY_CHOOSE.bodyStrong + WHY_CHOOSE.bodyRest;
        }
      },
    );

    // Stat cards
    section.querySelectorAll(".framer-14rc0hg p").forEach(function (p) {
      var t = p.textContent.trim();
      if (/Successful projects|LinkedIn programs/i.test(t)) {
        p.textContent = WHY_CHOOSE.card1Title;
      } else if (/Customer satisfaction|Client satisfaction/i.test(t)) {
        p.textContent = WHY_CHOOSE.card2Title;
      }
    });

    section.querySelectorAll(".framer-1fnepwh p").forEach(function (p) {
      if (/50\+|LinkedIn branding|projects that help/i.test(p.textContent)) {
        p.textContent = WHY_CHOOSE.card1Desc;
      }
    });

    // CTA card image
    section
      .querySelectorAll('.framer-1lfeovs[data-framer-name="Image"] img')
      .forEach(function (img) {
        img.setAttribute("src", WHY_CHOOSE.image);
        img.removeAttribute("srcset");
        img.alt = "LinkedIn personal branding consultation";
      });
  }

  function isInsidePreloader(node) {
    var el = node.nodeType === 3 ? node.parentElement : node;
    return !!(
      el &&
      el.closest &&
      (el.closest('[data-framer-appear-id="1b4e3p4"]') ||
        el.closest(".framer-dMWho") ||
        el.closest(".framer-1lgjvo2-container"))
    );
  }

  function rebrandTextNode(node) {
    if (isInsidePreloader(node)) return;
    var text = node.nodeValue;
    if (!text) return;
    var next = rebrandText(text);
    if (next !== text) node.nodeValue = next;
  }

  function walk(root) {
    if (!root) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      rebrandTextNode(node);
    }
  }

  function fixTitle() {
    if (document.title !== DESIRED_TITLE) document.title = DESIRED_TITLE;
  }

  function fixMailtoLinks() {
    document.querySelectorAll('a[href*="mailto:"]').forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (!/fabrica\.com/i.test(href)) return;
      a.setAttribute("href", href.replace(/fabrica\.com/gi, "brandhive.com"));
    });
  }

  function fixMetaTags() {
    document
      .querySelectorAll(
        'meta[property="og:title"], meta[name="twitter:title"], meta[name="description"], meta[property="og:description"], meta[name="twitter:description"], meta[property="og:site_name"]',
      )
      .forEach(function (meta) {
        var content = meta.getAttribute("content");
        if (!content) return;
        var next = rebrandText(content);
        if (next !== content) meta.setAttribute("content", next);
      });

    document
      .querySelectorAll('link[rel="canonical"], meta[property="og:url"]')
      .forEach(function (el) {
        var attr = el.tagName === "LINK" ? "href" : "content";
        var value = el.getAttribute(attr);
        if (!value || !/fabrica/i.test(value)) return;
        el.setAttribute(
          attr,
          value.replace(/fabrica\.framer\.media/gi, "brandhivesocials.com"),
        );
      });
  }

  function fixAttributes(root) {
    if (!root || !root.querySelectorAll) return;
    root
      .querySelectorAll("[alt], [title], [placeholder], [aria-label]")
      .forEach(function (el) {
        if (isInsidePreloader(el)) return;
        ["alt", "title", "placeholder", "aria-label"].forEach(function (attr) {
          if (!el.hasAttribute(attr)) return;
          var value = el.getAttribute(attr);
          var next = rebrandText(value);
          if (next !== value) el.setAttribute(attr, next);
        });
      });
  }

  function dismissStuckPreloader() {
    var overlay =
      document.querySelector(".framer-1lgjvo2-container") ||
      document.querySelector('[data-framer-appear-id="1b4e3p4"]');
    if (!overlay) return;

    var shell = overlay.closest
      ? overlay.closest('[style*="z-index"], .framer-1lgjvo2-container')
      : null;
    // Walk up a few parents to find the fixed full-screen shell.
    var node = overlay;
    for (var i = 0; i < 6 && node; i++) {
      try {
        var style = window.getComputedStyle(node);
        if (
          style.position === "fixed" &&
          (parseInt(style.zIndex, 10) >= 1000 || style.zIndex === "9999")
        ) {
          shell = node;
          break;
        }
      } catch (e) {}
      node = node.parentElement;
    }
    if (!shell) shell = overlay.parentElement && overlay.parentElement.parentElement;
    if (!shell) return;

    shell.style.opacity = "0";
    shell.style.pointerEvents = "none";
    shell.style.visibility = "hidden";
    setTimeout(function () {
      if (shell && shell.parentNode) shell.parentNode.removeChild(shell);
    }, 400);
  }

  function applyAll() {
    if (!document.body) return;
    walk(document.body);
    fixAttributes(document.body);
    fixMailtoLinks();
    fixMetaTags();
    fixTitle();
    fixFooterCopyright();
    fixFooterLogo();
    fixFooterContactAndSocial();
    fixHeroCopy();
    fixHeroServices();
    fixFounderCard();
    fixFaq();
    fixServiceCards();
    fixProjects();
    fixAdvantages();
  }

  var scheduled = null;
  var observer = new MutationObserver(function (mutations) {
    var relevant = false;
    for (var i = 0; i < mutations.length; i++) {
      var m = mutations[i];
      var target = m.target;
      if (target && isInsidePreloader(target)) continue;
      if (m.type === "attributes") {
        // Framer Motion constantly mutates style/class — ignore to avoid layout thrash.
        continue;
      }
      if (m.type === "characterData") {
        // Ignore animation-driven text/style churn; only act on real text swaps.
        if (m.target && m.target.nodeValue && /fabrica|©|2016-25/i.test(m.target.nodeValue)) {
          relevant = true;
          break;
        }
        continue;
      }
      if (m.type === "childList") {
        if (m.addedNodes && m.addedNodes.length) {
          relevant = true;
          break;
        }
        continue;
      }
      relevant = true;
      break;
    }
    if (!relevant) return;
    if (scheduled) return;
    scheduled = setTimeout(function () {
      scheduled = null;
      observer.disconnect();
      try {
        applyAll();
      } finally {
        observe();
      }
    }, 700);
  });

  function observe() {
    if (!document.body) return;
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: false,
    });
  }

  function start() {
    applyAll();
    observe();
    var titleEl = document.querySelector("title");
    if (titleEl) {
      new MutationObserver(fixTitle).observe(titleEl, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    }
    // Light follow-ups after hydration — avoid hammering during preloader.
    [2000, 5000].forEach(function (delay) {
      setTimeout(applyAll, delay);
    });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        fixFooterLogo();
      });
    }
    window.addEventListener("resize", function () {
      fixFooterLogo();
    });
    // Failsafe if Framer preloader never dismisses.
    setTimeout(dismissStuckPreloader, 3500);
    setTimeout(dismissStuckPreloader, 6500);
  }

  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
})();
