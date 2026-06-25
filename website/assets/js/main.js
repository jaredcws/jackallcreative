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
  "[data-reveal], .service-card, .process-step, .resource-card, .proof-card, .feature-image, .image-stack, .service-node, .matrix-card, .offer-card, .case-card, .case-study-panel, .work-tile, .brand-object, .interface-panel, .image-wall figure",
);

if (revealItems.length && "IntersectionObserver" in window) {
  revealItems.forEach((item) => item.classList.add("reveal-ready"));
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("reveal-in");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );
  revealItems.forEach((item) => revealObserver.observe(item));
}

const systemContent = {
  audit: {
    label: "Step 01 / Audit",
    title: "Find the AI use cases worth doing first.",
    copy: "Review your team, tools, content, documents, approvals, and recurring work. Leave with a ranked opportunity map instead of a pile of AI ideas.",
    input: "Current workflows, site content, team needs",
    output: "AI opportunity map and first implementation sprint",
  },
  train: {
    label: "Step 02 / Train",
    title: "Give the team shared language and useful guardrails.",
    copy: "Teach practical prompting, review habits, privacy basics, and role-specific workflows so AI becomes a normal part of the work.",
    input: "Team roles, risk areas, common tasks",
    output: "Workshop, usage policy, prompt library, review rules",
  },
  build: {
    label: "Step 03 / Build",
    title: "Turn repeated work into a system people can reuse.",
    copy: "Design the content engine, proposal workflow, website process, knowledge base, or document system that makes recurring work easier.",
    input: "Templates, proof, knowledge, approvals",
    output: "Documented workflow with prompts, assets, and handoffs",
  },
  ship: {
    label: "Step 04 / Ship",
    title: "Make the AI strategy visible through finished creative.",
    copy: "Build the Cloudflare website, campaign assets, photography, video, documents, and content needed to make the system real.",
    input: "Roadmap, brand assets, image archive",
    output: "Published site, assets, content, and production rhythm",
  },
};

const homeSystem = document.querySelector("[data-home-system]");

if (homeSystem) {
  const tabs = homeSystem.querySelectorAll("[data-system-tab]");
  const label = homeSystem.querySelector("[data-system-label]");
  const title = homeSystem.querySelector("[data-system-title]");
  const copy = homeSystem.querySelector("[data-system-copy]");
  const input = homeSystem.querySelector("[data-system-input]");
  const output = homeSystem.querySelector("[data-system-output]");

  const setSystem = (key) => {
    const content = systemContent[key];
    if (!content) return;
    label.textContent = content.label;
    title.textContent = content.title;
    copy.textContent = content.copy;
    input.textContent = content.input;
    output.textContent = content.output;

    tabs.forEach((tab) => {
      const active = tab.dataset.systemTab === key;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => setSystem(tab.dataset.systemTab));
  });
}

const contactSummaries = {
  "AI consulting or training":
    "Good fit for teams that need an AI opportunity map, training, prompt systems, and practical workflow guidance.",
  "Website or Cloudflare build":
    "Good fit when the website needs a clearer AI-era message, stronger proof, faster hosting, and lower platform cost.",
  "Brand, marketing, or documents":
    "Good fit when the team needs a repeatable content, proposal, campaign, or document production system.",
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

const neuralCanvases = document.querySelectorAll("[data-neural-canvas]");

if (neuralCanvases.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  neuralCanvases.forEach((canvas, canvasIndex) => {
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let nodes = [];
    let pointer = { x: -9999, y: -9999 };
    const density = Number(canvas.dataset.neuralDensity || 48);

    const makeNodes = () => {
      nodes = Array.from({ length: density }, (_, index) => {
        const seed = index + canvasIndex * 31;
        return {
          x: ((seed * 83) % Math.max(width, 1)) / Math.max(width, 1),
          y: ((seed * 47) % Math.max(height, 1)) / Math.max(height, 1),
          vx: (((seed * 17) % 100) - 50) / 18000,
          vy: (((seed * 29) % 100) - 50) / 18000,
          r: 1.2 + ((seed * 13) % 18) / 10,
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width * dpr));
      height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.width = width;
      canvas.height = height;
      makeNodes();
    };

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const maxDistance = Math.min(width, height) * 0.26;

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > 1) node.vx *= -1;
        if (node.y < 0 || node.y > 1) node.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i += 1) {
        const first = nodes[i];
        const ax = first.x * width;
        const ay = first.y * height;

        for (let j = i + 1; j < nodes.length; j += 1) {
          const second = nodes[j];
          const bx = second.x * width;
          const by = second.y * height;
          const dx = ax - bx;
          const dy = ay - by;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance > maxDistance) continue;
          const alpha = (1 - distance / maxDistance) * 0.28;
          ctx.strokeStyle = `rgba(33, 169, 232, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();
        }

        const pdx = ax - pointer.x;
        const pdy = ay - pointer.y;
        const pointerDistance = Math.sqrt(pdx * pdx + pdy * pdy);
        if (pointerDistance < maxDistance * 0.9) {
          ctx.strokeStyle = `rgba(232, 239, 47, ${1 - pointerDistance / (maxDistance * 0.9)})`;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }

        ctx.fillStyle = "rgba(255, 255, 255, 0.74)";
        ctx.beginPath();
        ctx.arc(ax, ay, first.r, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(draw);
    };

    canvas.closest("section")?.addEventListener("pointermove", (event) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      pointer = {
        x: (event.clientX - rect.left) * dpr,
        y: (event.clientY - rect.top) * dpr,
      };
    });

    canvas.closest("section")?.addEventListener("pointerleave", () => {
      pointer = { x: -9999, y: -9999 };
    });

    resize();
    draw();
    window.addEventListener("resize", resize);
  });
}

const workFilters = document.querySelectorAll("[data-work-filter]");
const workItems = document.querySelectorAll("[data-work-item]");

if (workFilters.length && workItems.length) {
  workFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const category = filter.dataset.workFilter || "all";
      workFilters.forEach((item) => {
        const active = item === filter;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });
      workItems.forEach((item) => {
        const categories = (item.dataset.category || "").split(" ");
        item.toggleAttribute("data-hidden", category !== "all" && !categories.includes(category));
      });
    });
  });
}

const tiltItems = document.querySelectorAll("[data-tilt]");

tiltItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    item.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 4}deg) translateY(-4px)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
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
    obstacles.push(
      high
        ? { x: width + 24, y: ground - 98, width: 58, height: 30, label: "FEE", kind: "high" }
        : { x: width + 24, y: ground - 52, width: 52, height: 52, label: "BAD", kind: "low" },
    );
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
    ctx.fillStyle = obstacle.kind === "high" ? "#e85d3f" : "#e8ef2f";
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    ctx.fillStyle = "#05070d";
    ctx.fillRect(obstacle.x + 5, obstacle.y + 5, obstacle.width - 10, obstacle.height - 10);
    drawPixelText(obstacle.label, obstacle.x + 8, obstacle.y + obstacle.height - 12, 12, obstacle.kind === "high" ? "#e85d3f" : "#e8ef2f");
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
      if (obstacles.some((obstacle) => intersects(rect, obstacle))) endGame();
      updateHud();
    } else {
      obstacles.forEach(drawObstacle);
    }

    drawJackall();

    if (!playing && !gameOver) drawOverlay("Jackall Runner", "Press Enter or Start. Up jumps. Down ducks.");
    if (gameOver) drawOverlay("Signal Lost", "Press Enter or Restart to run it back.");

    requestAnimationFrame(update);
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
}
