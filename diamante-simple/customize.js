// customize.js — Final (NO beads) — Stable version
// Click chip -> update big preview
// Reset -> first chip
// Finalize -> redirect to checkout.html with params

document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "krystory_selected_crystal_v1";
  const DEMO_PRICE = "24.88";

  const previewImg = document.getElementById("previewImg");
  const previewName = document.getElementById("previewName");
  const toast = document.getElementById("finalToast");

  const strip = document.getElementById("crystalStrip");
  const resetBtn = document.getElementById("resetBtn");
  const finalizeBtn = document.getElementById("finalizeBtn");

  const chips = Array.from(document.querySelectorAll(".crystal-chip"));

  console.log("customize.js loaded ✅", {
    hasPreviewImg: !!previewImg,
    hasStrip: !!strip,
    hasResetBtn: !!resetBtn,
    hasFinalizeBtn: !!finalizeBtn,
    chips: chips.length
  });

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => (toast.textContent = ""), 1800);
  }

  function persist(key) {
    try {
      localStorage.setItem(STORAGE_KEY, key);
    } catch {}
  }
  function readPersisted() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }
  function clearPersisted() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  function getImg(btn) {
    const d = btn?.dataset?.img;
    if (d) return d;

    const imgEl = btn?.querySelector?.(".chip-img");
    if (!imgEl) return null;

    const bg = imgEl.style.backgroundImage || window.getComputedStyle(imgEl).backgroundImage;
    const match = bg && bg.match(/url\(["']?(.*?)["']?\)/);
    return match?.[1] || null;
  }

  function getName(btn) {
    return (
      btn?.dataset?.name ||
      btn?.querySelector?.(".chip-name")?.textContent?.trim() ||
      "Crystal"
    );
  }

  function setActive(btn) {
    chips.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
  }

  function updatePreview(imgSrc, name) {
    if (previewName) previewName.textContent = name;

    if (previewImg && imgSrc) {
      previewImg.classList.remove("is-pop");
      previewImg.src = imgSrc;
      previewImg.alt = `Preview: ${name}`;
      void previewImg.offsetWidth; // trigger reflow
      previewImg.classList.add("is-pop");
    }
  }

  function selectChip(btn, { silent = false, save = true } = {}) {
    if (!btn) return;

    const img = getImg(btn);
    const name = getName(btn);

    if (!img) {
      if (!silent) showToast("Image not found for this crystal.");
      return;
    }

    setActive(btn);
    updatePreview(img, name);

    if (save) persist(btn.dataset.key || name);
    if (!silent) showToast(`Selected: ${name}`);
  }

  // Preview image 404 fallback
  previewImg?.addEventListener("error", () => {
    const first = chips[0];
    if (!first) return;
    if (!first.classList.contains("active")) {
      selectChip(first, { silent: true, save: true });
      showToast("Preview image missing — fallback applied.");
    }
  });

  // Keyboard/accessibility
  chips.forEach((b) => {
    if (!b.hasAttribute("tabindex")) b.tabIndex = 0;
    if (!b.getAttribute("role")) b.setAttribute("role", "button");
    if (!b.hasAttribute("aria-pressed")) b.setAttribute("aria-pressed", "false");
  });

  // Click chips (delegation)
  strip?.addEventListener("click", (e) => {
    const btn = e.target.closest(".crystal-chip");
    if (!btn) return;
    selectChip(btn);
  });

  // Keyboard select
  strip?.addEventListener("keydown", (e) => {
    const btn = e.target.closest(".crystal-chip");
    if (!btn) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectChip(btn);
    }
  });

  // Reset
  resetBtn?.addEventListener("click", () => {
    const first = chips[0];
    if (!first) return;
    clearPersisted();
    selectChip(first, { silent: true, save: false });
    showToast("Reset done.");
  });

  // ✅ Finalize: redirect
  if (!finalizeBtn) {
    console.warn("❗ finalizeBtn not found. Check your HTML id='finalizeBtn'.");
  } else {
    finalizeBtn.addEventListener("click", () => {
      console.log("FINALIZE CLICKED ✅");

      const active = document.querySelector(".crystal-chip.active") || chips[0];
      if (!active) {
        showToast("No crystal selected.");
        return;
      }

      const name = getName(active);
      const img = getImg(active) || "assets/rose.png";

      const url =
        "./checkout.html" +
        `?name=${encodeURIComponent(name + " Bracelet")}` +
        `&img=${encodeURIComponent(img)}` +
        `&price=${encodeURIComponent(DEMO_PRICE)}`;

      console.log("Redirect to:", url);

      // more reliable than assigning href in some edge cases
      window.location.assign(url);
    });
  }

  // On load: restore selection
  const savedKey = readPersisted();
  const savedChip = savedKey ? chips.find((c) => c.dataset.key === savedKey) : null;
  const initial = savedChip || document.querySelector(".crystal-chip.active") || chips[0];
  if (initial) selectChip(initial, { silent: true, save: true });
});
