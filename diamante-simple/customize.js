const ring = document.getElementById("braceletRing");
const toast = document.getElementById("finalToast");

const MAX_BEADS = 14;

const CRYSTALS = {
  rose: { label: "Rose Quartz", tone: "soft" },
  amethyst: { label: "Amethyst", tone: "warm" },
  clear: { label: "Clear Quartz", tone: "clear" },
  aquamarine: { label: "Aquamarine", tone: "clear" },
  aventurine: { label: "Green Aventurine", tone: "green" },
  citrine: { label: "Citrine", tone: "warm" }
};

let beads = ["amethyst", "rose", "clear", "aventurine", "rose", "amethyst", "clear", "rose"];
let activeTone = null;

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => (toast.textContent = ""), 2200);
}

function beadClass(key) {
  const tone = CRYSTALS[key]?.tone || "soft";
  return `bead bead-${tone}`;
}

function render() {
  if (!ring) return;
  ring.innerHTML = "";

  const count = beads.length;
  const radius = 98;

  beads.forEach((key, i) => {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * radius;
    const y = Math.sin(a) * radius;

    const el = document.createElement("button");
    el.type = "button";
    el.className = beadClass(key);
    el.style.transform = `translate(${x}px, ${y}px)`;
    el.title = `${CRYSTALS[key]?.label || key} (click to remove)`;
    el.dataset.index = String(i);

    el.addEventListener("click", () => {
      const idx = Number(el.dataset.index);
      if (Number.isFinite(idx)) {
        beads.splice(idx, 1);
        if (beads.length === 0) beads = ["clear"];
        render();
      }
    });

    ring.appendChild(el);
  });

  updateStripDisabledState();
}

function updateStripDisabledState() {
  const chips = document.querySelectorAll(".crystal-chip");
  chips.forEach((btn) => {
    const key = btn.dataset.key;
    const tone = CRYSTALS[key]?.tone;
    const blocked = activeTone && tone !== activeTone;
    btn.classList.toggle("is-dim", Boolean(blocked));
    btn.disabled = Boolean(blocked);
  });
}

function addBead(key) {
  if (!CRYSTALS[key]) return;
  if (beads.length >= MAX_BEADS) {
    showToast(`Max ${MAX_BEADS} beads (demo). Remove one to add more.`);
    return;
  }
  beads.push(key);
  render();
}

document.querySelectorAll(".crystal-chip").forEach((btn) => {
  btn.addEventListener("click", () => addBead(btn.dataset.key));
});

document.getElementById("resetBtn")?.addEventListener("click", () => {
  beads = ["amethyst", "rose", "clear", "aventurine", "rose", "amethyst", "clear", "rose"];
  activeTone = null;
  document.querySelectorAll(".swatch").forEach((s) => s.classList.remove("active"));
  render();
  showToast("Reset done.");
});

document.getElementById("finalizeBtn")?.addEventListener("click", () => {
  const summary = beads
    .map((k) => CRYSTALS[k]?.label || k)
    .reduce((acc, v) => {
      acc[v] = (acc[v] || 0) + 1;
      return acc;
    }, {});
  const lines = Object.entries(summary).map(([k, v]) => `${k} × ${v}`);
  showToast(`Saved (demo): ${lines.join(" · ")}`);
});

document.getElementById("prevLook")?.addEventListener("click", () => {
  beads = beads.slice(1).concat(beads[0]);
  render();
});

document.getElementById("nextLook")?.addEventListener("click", () => {
  beads = [beads[beads.length - 1]].concat(beads.slice(0, beads.length - 1));
  render();
});

document.querySelectorAll(".swatch").forEach((s) => {
  s.addEventListener("click", () => {
    const tone = s.dataset.tone || null;

    if (activeTone === tone) {
      activeTone = null;
      s.classList.remove("active");
      document.querySelectorAll(".swatch").forEach((x) => x.classList.remove("active"));
      render();
      showToast("Color filter cleared.");
      return;
    }

    activeTone = tone;
    document.querySelectorAll(".swatch").forEach((x) => x.classList.remove("active"));
    s.classList.add("active");
    updateStripDisabledState();
    showToast(`Filtered: ${tone}`);
  });
});

render();
