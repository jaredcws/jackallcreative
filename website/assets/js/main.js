const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const scrollProgress = document.querySelector("[data-scroll-progress]");
const contactForm = document.querySelector("[data-contact-form]");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.toggleAttribute("data-open", !isOpen);
  });
}

if (scrollProgress) {
  const updateProgress = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const percent = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    scrollProgress.style.setProperty("--scroll-progress", `${Math.min(percent, 100)}%`);
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}

const revealItems = document.querySelectorAll(
  "[data-reveal], .service-card, .process-step, .proof-card, .resource-card, .feature-image, .image-stack",
);

if (revealItems.length) {
  if ("IntersectionObserver" in window) {
    revealItems.forEach((item) => item.classList.add("reveal-ready"));
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("reveal-in");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.14 },
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("reveal-in"));
  }
}

const countUpItems = document.querySelectorAll("[data-countup]");

if (countUpItems.length) {
  const animateCount = (item) => {
    const target = Number(item.dataset.countTarget || 0);
    const duration = 1000;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      item.textContent = Math.round(target * progress).toString();
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.5 },
    );
    countUpItems.forEach((item) => countObserver.observe(item));
  } else {
    countUpItems.forEach(animateCount);
  }
}

const consoleModes = {
  audit: {
    label: "AI readiness audit",
    title: "Find the highest-value AI opportunities before buying tools.",
    copy: "We map the work your team repeats, flag risk areas, and rank the first AI workflows by value, effort, and confidence.",
  },
  workflow: {
    label: "Workflow architecture",
    title: "Turn repeatable work into documented AI-assisted systems.",
    copy: "We design prompts, templates, review rules, and handoffs for proposals, content, documents, and internal knowledge.",
  },
  content: {
    label: "Creative intelligence",
    title: "Build a content engine that knows your brand and proof.",
    copy: "We organize voice, offers, portfolio assets, FAQs, and campaign ideas so AI helps produce useful drafts without flattening the brand.",
  },
  launch: {
    label: "Implementation sprint",
    title: "Ship the site, assets, and workflows that make AI useful.",
    copy: "We pair the strategy with hands-on creative production: Cloudflare websites, content systems, photo, video, and marketing collateral.",
  },
};

const aiConsole = document.querySelector("[data-ai-console]");

if (aiConsole) {
  const tabs = aiConsole.querySelectorAll("[data-console-tab]");
  const label = aiConsole.querySelector("[data-console-label]");
  const title = aiConsole.querySelector("[data-console-title]");
  const copy = aiConsole.querySelector("[data-console-copy]");
  const steps = aiConsole.querySelectorAll("[data-console-step]");

  const setMode = (mode) => {
    const content = consoleModes[mode];
    if (!content) return;
    label.textContent = content.label;
    title.textContent = content.title;
    copy.textContent = content.copy;

    tabs.forEach((tab) => {
      const active = tab.dataset.consoleTab === mode;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    steps.forEach((step) => {
      step.classList.toggle("is-active", step.dataset.consoleStep === mode);
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setMode(tab.dataset.consoleTab));
  });
}

const routerContent = {
  content: {
    title: "AI-assisted content engine",
    copy: "Turn brand voice, offers, proof, FAQs, and campaign ideas into a repeatable workflow for posts, email, pages, and sales material.",
    items: ["Voice and prompt library", "Editorial calendar workflow", "Approval and quality checks"],
  },
  sales: {
    title: "Proposal and sales document system",
    copy: "Build reusable language, project proof, qualification prompts, and document structures so sales materials start sharper.",
    items: ["Reusable proposal blocks", "AI draft prompts", "Review and accuracy checklist"],
  },
  knowledge: {
    title: "Internal knowledge base",
    copy: "Organize policies, FAQs, service notes, process docs, and training material so the team can retrieve answers faster.",
    items: ["Knowledge inventory", "Search-ready structure", "Team usage guardrails"],
  },
  site: {
    title: "AI-ready Cloudflare website",
    copy: "Rebuild the site with clearer content, stronger proof, faster hosting, AI-search-friendly resources, and lower recurring cost.",
    items: ["Static Cloudflare build", "Structured page content", "Image database and metadata"],
  },
};

const aiRouter = document.querySelector("[data-ai-router]");

if (aiRouter) {
  const options = aiRouter.querySelectorAll("[data-router-option]");
  const title = aiRouter.querySelector("[data-router-title]");
  const copy = aiRouter.querySelector("[data-router-copy]");
  const list = aiRouter.querySelector("[data-router-list]");

  const setRoute = (route) => {
    const content = routerContent[route];
    if (!content) return;
    title.textContent = content.title;
    copy.textContent = content.copy;
    list.replaceChildren(
      ...content.items.map((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        return li;
      }),
    );

    options.forEach((option) => {
      const active = option.dataset.routerOption === route;
      option.classList.toggle("is-active", active);
      option.setAttribute("aria-selected", String(active));
    });
  };

  options.forEach((option) => {
    option.addEventListener("click", () => setRoute(option.dataset.routerOption));
  });
}

const contactSummaries = {
  "AI consulting or training":
    "Good fit for teams that need an AI opportunity map, training, prompt systems, and practical workflow guidance.",
  "Website or Cloudflare build":
    "Good fit when the website needs a sharper AI-era message, stronger proof, faster hosting, and lower platform cost.",
  "Brand, marketing, or documents":
    "Good fit when the team needs an AI-assisted content, proposal, campaign, or document production system.",
  "Extended creative department support":
    "Good fit when the backlog spans AI workflows, web, content, brand, photo, video, and recurring marketing execution.",
};

const contactRouter = document.querySelector("[data-contact-router]");

if (contactRouter && contactForm) {
  const options = contactRouter.querySelectorAll("[data-contact-choice]");
  const summary = contactRouter.querySelector("[data-contact-summary]");
  const needSelect = contactForm.querySelector("select[name='need']");
  const message = contactForm.querySelector("textarea[name='message']");

  options.forEach((option) => {
    option.addEventListener("click", () => {
      const value = option.dataset.contactChoice;
      options.forEach((item) => {
        const active = item === option;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });
      if (needSelect) needSelect.value = value;
      if (summary) summary.textContent = contactSummaries[value] || "";
      if (message) message.placeholder = `Tell us what is happening, what you have tried, and what a good ${value.toLowerCase()} outcome looks like.`;
    });
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const subject = encodeURIComponent(`Jackall Creative inquiry from ${data.get("name") || "website"}`);
    const body = encodeURIComponent(
      [
        `Name: ${data.get("name") || ""}`,
        `Email: ${data.get("email") || ""}`,
        `Company: ${data.get("company") || ""}`,
        `Website: ${data.get("website") || ""}`,
        `Need: ${data.get("need") || ""}`,
        `Timeline: ${data.get("timeline") || ""}`,
        `Budget: ${data.get("budget") || ""}`,
        "",
        data.get("message") || "",
      ].join("\n"),
    );
    window.location.href = `mailto:jackallcreative@gmail.com?subject=${subject}&body=${body}`;
  });
}
