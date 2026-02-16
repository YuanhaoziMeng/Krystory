// emotions.js — demo recommender (fast + conversion-friendly)

const toast = document.getElementById("toast");
const grid = document.getElementById("emoGrid");
const analyzeBtn = document.getElementById("analyzeBtn");

const resultBox = document.getElementById("resultBox");
const emptyHint = document.getElementById("emptyHint");

const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");
const pillRow = document.getElementById("pillRow");
const crystalRow = document.getElementById("crystalRow");

const freeText = document.getElementById("freeText");
const goCustomizeBtn = document.getElementById("goCustomizeBtn");
const goCheckoutBtn = document.getElementById("goCheckoutBtn");

let activeKey = null;

// Simple mapping (you can refine later)
const MAP = {
  anxious: {
    title: "You may be carrying mental pressure.",
    text:
      "This is not weakness — it’s accumulation. Let your nervous system exhale a little. Choose softness + clarity, not force.",
    keywords: ["slow down", "breathe", "gentle boundaries"],
    crystals: ["Aquamarine", "Amethyst", "Clear Quartz"],
    img: "assets/Aquamarine.png"
  },
  overwhelmed: {
    title: "You’re holding too many tasks at once.",
    text:
      "Your system is asking for simplification. One priority at a time. You’ll feel lighter when you reduce input.",
    keywords: ["reduce noise", "one thing", "rest"],
    crystals: ["Clear Quartz", "Selenite", "Amethyst"],
    img: "assets/Clear Quartz.png"
  },
  clarity: {
    title: "Your mind wants clarity and direction.",
    text:
      "When you’re foggy, don’t rush decisions. Bring your thoughts into a clean line: what matters, what can wait.",
    keywords: ["clean line", "focus", "signal over noise"],
    crystals: ["Clear Quartz", "Citrine", "Amethyst"],
    img: "assets/Clear Quartz.png"
  },
  starting: {
    title: "A new chapter is opening.",
    text:
      "Starting over is brave. Keep your energy stable while you build new routines. Small consistent steps are powerful.",
    keywords: ["new chapter", "stable growth", "small steps"],
    crystals: ["Citrine", "Green Aventurine", "Clear Quartz"],
    img: "assets/Amazonite.png"
  },
  heart: {
    title: "Your heart wants softness and healing.",
    text:
      "Let yourself feel — gently. You don’t have to fix everything today. Warmth returns when you give yourself patience.",
    keywords: ["softness", "self-compassion", "warmth"],
    crystals: ["Rose Quartz", "Moonstone", "Amethyst"],
    img: "assets/rose.png"
  },
  lowmotivation: {
    title: "Your energy is low — not your worth.",
    text:
      "Low motivation often means your body needs recovery. Rebuild with sunlight, movement, and one small win.",
    keywords: ["recover", "spark", "one small win"],
    crystals: ["Citrine", "Tiger Eye", "Clear Quartz"],
    img: "assets/Amazonite.png"
  },
  creative: {
    title: "Your creative channel is active.",
    text:
      "Protect your flow. Reduce distractions and give your ideas a container. Your best work comes from calm focus.",
    keywords: ["flow", "container", "quiet focus"],
    crystals: ["Amethyst", "Aquamarine", "Clear Quartz"],
    img: "assets/Amethyst.png"
  },
  protection: {
    title: "You need boundaries and energetic protection.",
    text:
      "It’s okay to say no. Your field becomes stronger when you stop over-giving and choose what’s aligned.",
    keywords: ["boundaries", "no guilt", "protect energy"],
    crystals: ["Black Obsidian", "Smoky Quartz", "Clear Quartz"],
    img: "assets/Black Obsidian.png"
  },
  stuck: {
    title: "You feel blocked — likely from pressure or uncertainty.",
    text:
      "When you’re stuck, change the input: walk, reset your space, reduce decisions. Motion returns from small shifts.",
    keywords: ["reset space", "small shift", "motion"],
    crystals: ["Green Aventurine", "Clear Quartz", "Amethyst"],
    img: "assets/Selenite.png"
  }
};

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => (toast.textContent = ""), 2000);
}

function setActiveButton(btn) {
  document.querySelectorAll(".emo-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  activeKey = btn.dataset.key;
}

grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".emo-btn");
  if (!btn) return;
  setActiveButton(btn);
  showToast(`Selected: ${btn.textContent.trim()}`);
});

function renderResult(key) {
  const data = MAP[key];
  if (!data) return;

  emptyHint.style.display = "none";
  resultBox.style.display = "block";

  resultTitle.textContent = data.title;
  resultText.textContent = data.text;

  pillRow.innerHTML = "";
  data.keywords.forEach((k) => {
    const el = document.createElement("span");
    el.className = "pill";
    el.textContent = k;
    pillRow.appendChild(el);
  });

  crystalRow.innerHTML = "";
  data.crystals.forEach((c) => {
    const el = document.createElement("span");
    el.className = "pill";
    el.textContent = c;
    crystalRow.appendChild(el);
  });

  // store last recommendation (optional)
  localStorage.setItem("krystory_emotion_key", key);
  localStorage.setItem("krystory_emotion_primary_img", data.img || "assets/rose.png");
  localStorage.setItem("krystory_emotion_primary_name", (data.crystals?.[0] || "Crystal") + " Bracelet");
}

analyzeBtn.addEventListener("click", () => {
  if (!activeKey) {
    showToast("Pick a state first.");
    return;
  }

  // optional: free text influences tone (simple)
  const t = (freeText.value || "").toLowerCase();
  if (t.includes("panic") || t.includes("scared")) {
    showToast("Detected: high intensity (demo).");
  }

  renderResult(activeKey);
});

goCustomizeBtn.addEventListener("click", () => {
  // Send to customize page (you can optionally pass params later)
  window.location.assign("./customize.html");
});

goCheckoutBtn.addEventListener("click", () => {
  // Direct checkout demo: pick first crystal from the mapping
  if (!activeKey) {
    showToast("Generate a recommendation first.");
    return;
  }
  const data = MAP[activeKey];
  const name = (data.crystals?.[0] || "Crystal") + " Bracelet";
  const img = data.img || "assets/rose.png";
  const price = "24.88";

  const url =
    "./checkout.html" +
    `?name=${encodeURIComponent(name)}` +
    `&img=${encodeURIComponent(img)}` +
    `&price=${encodeURIComponent(price)}`;

  window.location.assign(url);
});

// Restore last selected state (nice UX)
(() => {
  const saved = localStorage.getItem("krystory_emotion_key");
  if (!saved || !MAP[saved]) return;

  const btn = document.querySelector(`.emo-btn[data-key="${saved}"]`);
  if (btn) setActiveButton(btn);
})();
