// customize.js (simple: click crystal -> preview big image)

const previewImg = document.getElementById("previewImg");
const previewName = document.getElementById("previewName");
const toast = document.getElementById("finalToast");

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => (toast.textContent = ""), 1800);
}

function setActiveChip(btn) {
  document.querySelectorAll(".crystal-chip").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
}

function updatePreview(imgSrc, name) {
  if (previewImg) {
    previewImg.src = imgSrc;
    previewImg.alt = `Preview: ${name}`;
  }
  if (previewName) {
    previewName.textContent = name;
  }
}

document.querySelectorAll(".crystal-chip").forEach((btn) => {
  btn.addEventListener("click", () => {
    const img = btn.dataset.img;
    const name = btn.dataset.name || btn.querySelector(".chip-name")?.textContent || "Crystal";

    if (!img) return;

    setActiveChip(btn);
    updatePreview(img, name);
  });
});

// Reset -> back to first crystal
document.getElementById("resetBtn")?.addEventListener("click", () => {
  const first = document.querySelector(".crystal-chip");
  if (!first) return;

  const img = first.dataset.img;
  const name = first.dataset.name || first.querySelector(".chip-name")?.textContent || "Crystal";

  setActiveChip(first);
  updatePreview(img, name);
  showToast("Reset done.");
});

// Finalize -> just a tiny toast (no other interaction)
document.getElementById("finalizeBtn")?.addEventListener("click", () => {
  const active = document.querySelector(".crystal-chip.active") || document.querySelector(".crystal-chip");
  const name =
    active?.dataset.name || active?.querySelector(".chip-name")?.textContent || "Crystal";

  showToast(`Saved (demo): ${name}`);
});

// On load: auto-select first
(() => {
  const first = document.querySelector(".crystal-chip");
  if (!first) return;

  const img = first.dataset.img;
  const name = first.dataset.name || first.querySelector(".chip-name")?.textContent || "Crystal";

  setActiveChip(first);
  updatePreview(img, name);
})();
