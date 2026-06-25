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

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function initNetworkCanvas(canvas, options = {}) {
  if (!canvas || reducedMotion) return;
  const context = canvas.getContext("2d");
  if (!context) return;

  const colors = options.colors || ["33, 169, 232", "111, 255, 210", "232, 239, 47"];
  const nodeCount = options.nodeCount || 70;
  const speed = options.speed || 0.22;
  const nodes = [];
  let width = 0;
  let height = 0;
  let frameId = 0;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width * window.devicePixelRatio));
    height = Math.max(1, Math.floor(rect.height * window.devicePixelRatio));
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    nodes.length = 0;

    for (let index = 0; index < nodeCount; index += 1) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * speed * window.devicePixelRatio,
        vy: (Math.random() - 0.5) * speed * window.devicePixelRatio,
        color: colors[index % colors.length],
      });
    }
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);

    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;
    });

    for (let a = 0; a < nodes.length; a += 1) {
      for (let b = a + 1; b < nodes.length; b += 1) {
        const first = nodes[a];
        const second = nodes[b];
        const dx = first.x - second.x;
        const dy = first.y - second.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 190 * window.devicePixelRatio;

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.22;
          context.strokeStyle = `rgba(${first.color}, ${opacity})`;
          context.lineWidth = window.devicePixelRatio;
          context.beginPath();
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
          context.stroke();
        }
      }
    }

    nodes.forEach((node) => {
      context.fillStyle = `rgba(${node.color}, 0.7)`;
      context.beginPath();
      context.arc(node.x, node.y, 1.55 * window.devicePixelRatio, 0, Math.PI * 2);
      context.fill();
    });

    frameId = requestAnimationFrame(draw);
  };

  resize();
  draw();
  window.addEventListener("resize", resize);
  canvas.addEventListener("disconnect", () => cancelAnimationFrame(frameId));
}

document.querySelectorAll("[data-neural-canvas]").forEach((canvas) => {
  initNetworkCanvas(canvas, { nodeCount: 78, speed: 0.25 });
});

document.querySelectorAll("[data-cta-canvas]").forEach((canvas) => {
  initNetworkCanvas(canvas, { nodeCount: 44, speed: 0.16 });
});

const liveClock = document.querySelector("[data-live-clock]");

if (liveClock) {
  const updateClock = () => {
    liveClock.textContent = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  updateClock();
  window.setInterval(updateClock, 1000);
}

const typewriter = document.querySelector("[data-typewriter]");

if (typewriter && !reducedMotion) {
  const fullText = typewriter.textContent.trim();
  typewriter.textContent = "";
  let index = 0;
  const writeNext = () => {
    typewriter.textContent = fullText.slice(0, index);
    index += 1;
    if (index <= fullText.length) window.setTimeout(writeNext, 22);
  };
  writeNext();
}

const commandLines = document.querySelectorAll("[data-command-lines] p");

if (commandLines.length && !reducedMotion) {
  let activeLine = 0;
  window.setInterval(() => {
    commandLines.forEach((line, index) => line.classList.toggle("is-hot", index === activeLine));
    activeLine = (activeLine + 1) % commandLines.length;
  }, 1400);
}

const orbitLabels = {
  audit: "Scan",
  train: "Train",
  build: "Build",
  ship: "Ship",
};

document.querySelectorAll("[data-orbit-node]").forEach((button) => {
  button.addEventListener("click", () => {
    const core = document.querySelector("[data-orbit-core]");
    document
      .querySelectorAll("[data-orbit-node]")
      .forEach((node) => node.classList.toggle("is-active", node === button));
    if (core) core.textContent = orbitLabels[button.dataset.orbitNode] || "AI OS";
  });
});

const demoContent = {
  audit: {
    kicker: "Readiness scan",
    status: "Running",
    label: "Highest leverage workflow",
    title: "Find where AI can save time without damaging the brand.",
    copy: "Jackall reviews your tools, repeated tasks, content needs, proof library, and risk areas, then ranks the first practical AI moves.",
    input: "Current site, team workflows, content backlog",
    output: "Prioritized AI roadmap and first workflow sprint",
    bars: ["86%", "74%", "91%"],
  },
  agents: {
    kicker: "Agent workflow",
    status: "Designing",
    label: "Workflow automation",
    title: "Build agents around the work your team repeats every week.",
    copy: "Prompt libraries, document flows, approval rules, and knowledge inputs become controlled AI workflows instead of random one-off experiments.",
    input: "SOPs, recurring docs, sales questions, internal knowledge",
    output: "Agent-style workflows with prompts, templates, and guardrails",
    bars: ["78%", "88%", "83%"],
  },
  content: {
    kicker: "Creative engine",
    status: "Generating",
    label: "Brand-aware production",
    title: "Turn proof, voice, and offers into a content operating system.",
    copy: "Jackall organizes the raw material AI needs so newsletters, landing pages, posts, proposals, and campaigns start with better context.",
    input: "Brand voice, services, FAQs, image archive, case-study proof",
    output: "Content calendar, reusable prompts, draft system, review loop",
    bars: ["91%", "81%", "86%"],
  },
  search: {
    kicker: "AI visibility",
    status: "Monitoring",
    label: "Answer engine presence",
    title: "Prepare the website for how people now discover companies through AI.",
    copy: "Resources, FAQs, service pages, structured proof, and clear positioning help the brand become easier for people and answer engines to understand.",
    input: "Search questions, competitor gaps, current content, service proof",
    output: "AI-search-ready content architecture and Cloudflare website",
    bars: ["84%", "79%", "88%"],
  },
};

const productDemo = document.querySelector("[data-product-demo]");

if (productDemo) {
  const tabs = productDemo.querySelectorAll("[data-demo-tab]");
  const fields = {
    kicker: productDemo.querySelector("[data-demo-kicker]"),
    status: productDemo.querySelector("[data-demo-status]"),
    label: productDemo.querySelector("[data-demo-label]"),
    title: productDemo.querySelector("[data-demo-title]"),
    copy: productDemo.querySelector("[data-demo-copy]"),
    input: productDemo.querySelector("[data-demo-input]"),
    output: productDemo.querySelector("[data-demo-output]"),
  };
  const bars = productDemo.querySelectorAll(".screen-bars i");

  const setDemo = (key) => {
    const content = demoContent[key];
    if (!content) return;
    Object.entries(fields).forEach(([name, element]) => {
      if (element) element.textContent = content[name];
    });
    bars.forEach((bar, index) => {
      bar.style.setProperty("--bar", content.bars[index] || "50%");
    });
    tabs.forEach((tab) => {
      const active = tab.dataset.demoTab === key;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setDemo(tab.dataset.demoTab));
  });
}

const flywheelContent = {
  train: {
    label: "01 / Train",
    title: "Teach AI the business before asking it to create.",
    copy: "Brand voice, offers, customers, proof, FAQs, approvals, risk rules, and source material become the operating context.",
  },
  test: {
    label: "02 / Test",
    title: "Simulate real work before changing the workflow.",
    copy: "Prompts, agents, drafts, and outputs are tested against actual examples so the system improves before it reaches customers.",
  },
  deploy: {
    label: "03 / Deploy",
    title: "Put AI into the channels where work already happens.",
    copy: "The system connects to content planning, website updates, proposals, documents, and the creative backlog your team already manages.",
  },
  improve: {
    label: "04 / Improve",
    title: "Use feedback to make the system sharper every cycle.",
    copy: "Each shipped asset, question, draft, approval, and result becomes fuel for a better operating rhythm.",
  },
};

const flywheel = document.querySelector("[data-flywheel]");

if (flywheel) {
  const buttons = flywheel.querySelectorAll("[data-flywheel-step]");
  const label = document.querySelector("[data-flywheel-label]");
  const title = document.querySelector("[data-flywheel-title]");
  const copy = document.querySelector("[data-flywheel-copy]");

  const setFlywheel = (key) => {
    const content = flywheelContent[key];
    if (!content) return;
    if (label) label.textContent = content.label;
    if (title) title.textContent = content.title;
    if (copy) copy.textContent = content.copy;
    buttons.forEach((button) => button.classList.toggle("is-active", button.dataset.flywheelStep === key));
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => setFlywheel(button.dataset.flywheelStep));
  });
}

document.querySelectorAll("[data-tilt-card]").forEach((card) => {
  if (reducedMotion) return;
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateY(-4px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

const runnerCanvas = document.querySelector("[data-jackall-runner]");

if (runnerCanvas) {
  const ctx = runnerCanvas.getContext("2d");
  const scoreEl = document.querySelector("[data-game-score]");
  const bestEl = document.querySelector("[data-game-best]");
  const startButton = document.querySelector("[data-game-start]");
  const jumpButton = document.querySelector("[data-game-jump]");
  const duckButton = document.querySelector("[data-game-duck]");
  const width = runnerCanvas.width;
  const height = runnerCanvas.height;
  const ground = 284;
  const gravity = 0.82;
  const jumpForce = -16.4;
  let bestScore = Number(localStorage.getItem("jackallRunnerBest") || 0);
  let playing = false;
  let gameOver = false;
  let score = 0;
  let speed = 6.4;
  let spawnTimer = 0;
  let animationId = 0;
  let ducking = false;
  let frame = 0;
  let obstacles = [];
  const player = {
    x: 86,
    y: ground - 62,
    width: 58,
    height: 62,
    duckHeight: 34,
    vy: 0,
    grounded: true,
  };

  const formatScore = (value) => String(Math.max(0, Math.floor(value))).padStart(5, "0");
  const updateHud = () => {
    if (scoreEl) scoreEl.textContent = formatScore(score);
    if (bestEl) bestEl.textContent = formatScore(bestScore);
  };

  const resetGame = () => {
    score = 0;
    speed = 6.4;
    spawnTimer = 42;
    obstacles = [];
    ducking = false;
    gameOver = false;
    playing = true;
    player.y = ground - player.height;
    player.vy = 0;
    player.grounded = true;
    updateHud();
    if (startButton) startButton.textContent = "Restart";
  };

  const jump = () => {
    if (!playing || gameOver) {
      resetGame();
      return;
    }
    if (player.grounded && !ducking) {
      player.vy = jumpForce;
      player.grounded = false;
    }
  };

  const setDuck = (value) => {
    ducking = value && playing && !gameOver && player.grounded;
  };

  const spawnObstacle = () => {
    const high = Math.random() > 0.58 && score > 120;
    if (high) {
      obstacles.push({
        x: width + 24,
        y: ground - 98,
        width: 58,
        height: 30,
        label: "FEE",
        kind: "high",
      });
    } else {
      const tall = Math.random() > 0.5;
      obstacles.push({
        x: width + 24,
        y: ground - (tall ? 54 : 42),
        width: tall ? 44 : 62,
        height: tall ? 54 : 42,
        label: tall ? "BAD" : "TODO",
        kind: "low",
      });
    }
    spawnTimer = 58 + Math.random() * 58 - Math.min(score / 34, 26);
  };

  const playerRect = () => {
    const activeHeight = ducking ? player.duckHeight : player.height;
    return {
      x: player.x + 8,
      y: (ducking ? ground - activeHeight : player.y) + 4,
      width: ducking ? 66 : 44,
      height: activeHeight - 8,
    };
  };

  const intersects = (first, second) =>
    first.x < second.x + second.width &&
    first.x + first.width > second.x &&
    first.y < second.y + second.height &&
    first.y + first.height > second.y;

  const drawPixelText = (text, x, y, size = 16, color = "#f7fbff") => {
    ctx.fillStyle = color;
    ctx.font = `${size}px "Geist Mono", monospace`;
    ctx.fillText(text, x, y);
  };

  const drawBackground = () => {
    ctx.fillStyle = "#070c16";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(33, 169, 232, 0.12)";
    ctx.lineWidth = 1;
    for (let x = -((frame * 0.7) % 32); x < width; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(33, 169, 232, 0.15)";
    for (let x = -((frame * 1.1) % 180); x < width; x += 180) {
      ctx.fillRect(x + 40, 210, 84, 10);
      ctx.fillRect(x + 70, 190, 36, 20);
    }

    ctx.fillStyle = "#e8ef2f";
    ctx.fillRect(0, ground, width, 5);
    ctx.fillStyle = "rgba(232, 239, 47, 0.24)";
    for (let x = -((frame * speed) % 28); x < width; x += 28) {
      ctx.fillRect(x, ground + 18, 14, 4);
    }
  };

  const drawJackall = () => {
    const runOffset = frame % 18 < 9 ? 0 : 4;
    const x = player.x;
    const h = ducking ? player.duckHeight : player.height;
    const y = ducking ? ground - h : player.y;

    ctx.fillStyle = "#21a9e8";
    if (ducking) {
      ctx.fillRect(x + 6, y + 12, 54, 18);
      ctx.fillRect(x + 50, y + 4, 26, 18);
      ctx.fillRect(x + 70, y + 10, 12, 8);
      ctx.fillRect(x - 8, y + 10, 18, 8);
      ctx.fillRect(x + 12, y + 30, 12, 8);
      ctx.fillRect(x + 44, y + 30, 12, 8);
    } else {
      ctx.fillRect(x + 12, y + 24, 36, 24);
      ctx.fillRect(x + 40, y + 8, 28, 24);
      ctx.fillRect(x + 64, y + 18, 14, 8);
      ctx.fillRect(x + 46, y, 8, 12);
      ctx.fillRect(x + 58, y, 8, 12);
      ctx.fillRect(x - 2, y + 26, 18, 8);
      ctx.fillRect(x + 16, y + 48, 10, 14 + runOffset);
      ctx.fillRect(x + 40, y + 48, 10, 18 - runOffset);
    }

    ctx.fillStyle = "#e8ef2f";
    ctx.fillRect(x + 59, y + (ducking ? 10 : 16), 5, 5);
    ctx.fillStyle = "#05070d";
    ctx.fillRect(x + 66, y + (ducking ? 14 : 21), 5, 4);
  };

  const drawObstacle = (obstacle) => {
    ctx.fillStyle = obstacle.kind === "high" ? "#ff6bd6" : "#e8ef2f";
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    ctx.fillStyle = "#05070d";
    ctx.fillRect(obstacle.x + 5, obstacle.y + 5, obstacle.width - 10, obstacle.height - 10);
    drawPixelText(obstacle.label, obstacle.x + 8, obstacle.y + obstacle.height - 12, 12, obstacle.kind === "high" ? "#ff6bd6" : "#e8ef2f");
  };

  const drawOverlay = (title, subtitle) => {
    ctx.fillStyle = "rgba(5, 7, 13, 0.78)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "#e8ef2f";
    ctx.font = '34px "Geist Pixel", monospace';
    ctx.textAlign = "center";
    ctx.fillText(title, width / 2, 145);
    ctx.fillStyle = "#f7fbff";
    ctx.font = '16px "Geist Mono", monospace';
    ctx.fillText(subtitle, width / 2, 182);
    ctx.textAlign = "left";
  };

  const endGame = () => {
    gameOver = true;
    playing = false;
    bestScore = Math.max(bestScore, score);
    localStorage.setItem("jackallRunnerBest", String(Math.floor(bestScore)));
    updateHud();
    if (startButton) startButton.textContent = "Restart";
  };

  const update = () => {
    frame += 1;
    drawBackground();

    if (playing && !gameOver) {
      score += 0.28;
      speed += 0.0018;
      spawnTimer -= 1;
      if (spawnTimer <= 0) spawnObstacle();

      player.vy += gravity;
      player.y += player.vy;
      if (player.y >= ground - player.height) {
        player.y = ground - player.height;
        player.vy = 0;
        player.grounded = true;
      }

      obstacles.forEach((obstacle) => {
        obstacle.x -= speed;
        drawObstacle(obstacle);
      });
      obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > -20);

      const rect = playerRect();
      if (obstacles.some((obstacle) => intersects(rect, obstacle))) {
        endGame();
      }
      updateHud();
    } else {
      obstacles.forEach(drawObstacle);
    }

    drawJackall();

    if (!playing && !gameOver) {
      drawOverlay("Jackall Runner", "Press Enter or Start. Up jumps. Down ducks.");
    }

    if (gameOver) {
      drawOverlay("Signal Lost", "Press Enter or Restart to run it back.");
    }

    animationId = requestAnimationFrame(update);
  };

  startButton?.addEventListener("click", resetGame);
  jumpButton?.addEventListener("click", jump);
  duckButton?.addEventListener("pointerdown", () => setDuck(true));
  duckButton?.addEventListener("pointerup", () => setDuck(false));
  duckButton?.addEventListener("pointerleave", () => setDuck(false));

  window.addEventListener("keydown", (event) => {
    if (event.target && ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) return;
    if (["ArrowUp", "KeyW", "Space"].includes(event.code)) {
      event.preventDefault();
      jump();
    }
    if (["ArrowDown", "KeyS"].includes(event.code)) {
      event.preventDefault();
      setDuck(true);
    }
    if (event.code === "Enter") {
      event.preventDefault();
      resetGame();
    }
  });

  window.addEventListener("keyup", (event) => {
    if (["ArrowDown", "KeyS"].includes(event.code)) setDuck(false);
  });

  updateHud();
  update();
  window.addEventListener("beforeunload", () => cancelAnimationFrame(animationId));
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
