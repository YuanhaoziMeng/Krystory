// tarot.js — Full stable version (modal booking demo)

document.addEventListener("DOMContentLoaded", () => {
  const bookBtn = document.getElementById("bookBtn");
  const toast = document.getElementById("pageToast");

  const modal = document.getElementById("modal");
  const backdrop = document.getElementById("modalClose");
  const xBtn = document.getElementById("xBtn");

  const form = document.getElementById("bookingForm");
  const successBox = document.getElementById("successBox");
  const doneBtn = document.getElementById("doneBtn");

  const phone = document.getElementById("phone");
  const email = document.getElementById("email");
  const ptime = document.getElementById("ptime");

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => (toast.textContent = ""), 1800);
  }

  function openModal() {
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    // focus for usability
    setTimeout(() => phone?.focus(), 0);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    // reset UI state
    if (successBox) successBox.style.display = "none";
    form?.reset();
  }

  // Safety: if modal not found, at least show toast
  if (!modal) {
    console.error("Modal element (#modal) not found.");
  }

  // Open
  bookBtn?.addEventListener("click", () => {
    openModal();
  });

  // Close (backdrop + X + Done + ESC)
  backdrop?.addEventListener("click", closeModal);
  xBtn?.addEventListener("click", closeModal);
  doneBtn?.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Submit (demo)
  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    // simple validation
    const ph = phone?.value?.trim() || "";
    const em = email?.value?.trim() || "";
    const tm = ptime?.value?.trim() || "";

    if (!ph || !em || !tm) {
      showToast("Please fill in all fields.");
      return;
    }

    // show success panel
    if (successBox) successBox.style.display = "block";

    // optionally store demo booking (localStorage)
    try {
      const payload = {
        phone: ph,
        email: em,
        time: tm,
        createdAt: new Date().toISOString()
      };
      localStorage.setItem("krystory_last_booking_v1", JSON.stringify(payload));
    } catch {
      // ignore
    }

    showToast("Booking submitted (demo).");
  });

  console.log("tarot.js loaded ✅");
});
