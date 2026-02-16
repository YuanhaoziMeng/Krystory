const toast = document.getElementById("toast");
const panelDesc = document.getElementById("panelDesc");
const chips = document.getElementById("chips");
const recommendText = document.getElementById("recommendText");

const RECS = {
  love: {
    chips: ["Rose Quartz", "Strawberry Quartz", "Moonstone"],
    line: "Soft love energy: focus on self-acceptance and gentle connection."
  },
  calm: {
    chips: ["Amethyst", "Aquamarine", "Smoky Quartz"],
    line: "Calm & grounded: slow down, breathe deeper, and clear mental noise."
  },
  focus: {
    chips: ["Citrine", "Fluorite", "Clear Quartz"],
    line: "Focus mode: clarify your intention and keep momentum steady."
  },
  tarot: "Tarot path: Try Amethyst + Clear Quartz for clarity and calm guidance.",
  astro: "Astrology path: Try Moonstone + Citrine to balance intuition and action.",
  emotion: "Emotions path: Try Rose Quartz + Aquamarine to soften the heart and ease expression."
};

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  setTimeout(() => (toast.textContent = ""), 2200);
}

function setChips(list) {
  if (!chips) return;
  chips.innerHTML = "";
  list.forEach((t) => {
    const s = document.createElement("span");
    s.className = "chip";
    s.textContent = t;
    chips.appendChild(s);
  });
}

const startBtn = document.getElementById("startBtn");
const watchBtn = document.getElementById("watchBtn");

const journeyModal = document.getElementById("journeyModal");
const journeyClose = document.getElementById("journeyClose");
const journeyX = document.getElementById("journeyX");

function openJourney() {
  if (!journeyModal) return;
  journeyModal.classList.add("open");
  journeyModal.setAttribute("aria-hidden", "false");
}

function closeJourney() {
  if (!journeyModal) return;
  journeyModal.classList.remove("open");
  journeyModal.setAttribute("aria-hidden", "true");
}

const videoModal = document.getElementById("videoModal");
const videoClose = document.getElementById("videoClose");
const videoX = document.getElementById("videoX");
const heroVideo = document.getElementById("heroVideo");

function openVideo() {
  if (!videoModal) return;
  videoModal.classList.add("open");
  if (heroVideo) {
    heroVideo.currentTime = 0;
    heroVideo.play().catch(() => {});
  }
}

function closeVideo() {
  if (!videoModal) return;
  videoModal.classList.remove("open");
  if (heroVideo) heroVideo.pause();
}

const crystalModal = document.getElementById("cModal");
const cCloseBg = document.getElementById("cClose");
const cCloseX = document.getElementById("cX");
const cCloseBtn = document.getElementById("cDone");

const cTitle = document.getElementById("cTitle");
const cSub = document.getElementById("cSub");
const cImg = document.getElementById("cImg");
const cText = document.getElementById("cText");

const CRYSTAL_DB = {
  rose: {
    title: "Rose Quartz",
    sub: "Love • Compassion • Self-acceptance",
    img: "assets/crystals/rose.png",
    text:
      "Rose Quartz is often linked with heart-centered energy. People use it when they want to feel softer, supported, and more open to love.\n\nTips: wear it close to the heart, or pair it with Clear Quartz to amplify intention."
  },
  amethyst: {
    title: "Amethyst",
    sub: "Calm • Sleep • Clarity",
    img: "assets/crystals/amethyst.png",
    text:
      "Amethyst is commonly associated with calmness and a quieter mind. It’s a popular choice for stress, rest, and gentle emotional balance.\n\nTips: place near the bed or wear during busy days for a calmer pace."
  },
  citrine: {
    title: "Citrine",
    sub: "Confidence • Positivity • Momentum",
    img: "assets/crystals/citrine.png",
    text:
      "Citrine is often connected to optimism and personal power. Many choose it for new beginnings, motivation, and a brighter outlook.\n\nTips: pair with Tiger’s Eye for confidence + grounded action."
  },
  aquamarine: {
    title: "Aquamarine",
    sub: "Soothing • Communication • Ease",
    img: "assets/crystals/aquamarine.png",
    text:
      "Aquamarine is associated with calm expression and emotional flow. People use it when they want to speak with clarity and feel more at ease.\n\nTips: great for presentations, hard conversations, or emotional reset."
  },
  clear: {
    title: "Clear Quartz",
    sub: "Amplify • Cleanse • All-purpose",
    img: "assets/crystals/clear.png",
    text:
      "Clear Quartz is often described as an amplifier—supporting many intentions and pairing well with almost anything.\n\nTips: use it as a base stone and combine with one focus stone (Love/Calm/Focus)."
  },
  obsidian: {
    title: "Obsidian",
    sub: "Protection • Boundaries • Grounding",
    img: "assets/crystals/obsidian.png",
    text:
      "Obsidian is associated with protection and strong boundaries. People choose it when they feel overwhelmed by environments or energy.\n\nTips: wear it on busy days, and balance it with a gentle stone like Rose Quartz."
  }
};

function openCrystalModal(data) {
  if (!crystalModal) return;
  if (cTitle) cTitle.textContent = data.title;
  if (cSub) cSub.textContent = data.sub;
  if (cImg) cImg.style.backgroundImage = `url('${data.img}')`;
  if (cText) cText.textContent = data.text;

  crystalModal.classList.add("open");
  crystalModal.setAttribute("aria-hidden", "false");
}

function closeCrystalModal() {
  if (!crystalModal) return;
  crystalModal.classList.remove("open");
  crystalModal.setAttribute("aria-hidden", "true");
}

if (startBtn) {
  startBtn.addEventListener("click", () => {
    if (journeyModal) {
      openJourney();
      return;
    }
    showToast("✨ Journey started (demo). Choose a card below for a recommendation.");
  });
}

if (watchBtn) {
  watchBtn.addEventListener("click", () => {
    if (videoModal && videoClose && videoX && heroVideo) {
      openVideo();
    } else {
      showToast("▶ Video is not set up yet (missing modal HTML).");
    }
  });
}

document.querySelectorAll(".pill").forEach((btn) => {
  btn.addEventListener("click", () => {
    const mode = btn.dataset.mode;
    const data = RECS[mode];
    if (!data || !data.chips || !data.line) return;
    setChips(data.chips);
    if (panelDesc) panelDesc.textContent = data.line;
    showToast(`Updated: ${mode.toUpperCase()} picks.`);
  });
});

document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.closest("a, button")) return;
    const pick = card.dataset.pick;
    const text = RECS[pick];
    if (!pick || typeof text !== "string") return;
    if (recommendText) recommendText.textContent = text;
    showToast("✅ Recommendation updated.");
  });
});

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    showToast(`Switched to: ${tab.textContent}`);
  });
});

document.querySelectorAll(".crystal-card").forEach((card) => {
  card.addEventListener("click", () => {
    const key = card.dataset.key;
    const data = CRYSTAL_DB[key];
    if (!data) return;
    openCrystalModal(data);
  });
});

if (journeyClose) journeyClose.addEventListener("click", closeJourney);
if (journeyX) journeyX.addEventListener("click", closeJourney);

if (videoClose) videoClose.addEventListener("click", closeVideo);
if (videoX) videoX.addEventListener("click", closeVideo);

if (cCloseBg) cCloseBg.addEventListener("click", closeCrystalModal);
if (cCloseX) cCloseX.addEventListener("click", closeCrystalModal);
if (cCloseBtn) cCloseBtn.addEventListener("click", closeCrystalModal);

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;

  if (journeyModal && journeyModal.classList.contains("open")) {
    closeJourney();
    return;
  }

  if (videoModal && videoModal.classList.contains("open")) {
    closeVideo();
    return;
  }

  if (crystalModal && crystalModal.classList.contains("open")) {
    closeCrystalModal();
  }
});
