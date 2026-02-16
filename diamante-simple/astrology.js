document.getElementById("analyzeBtn").addEventListener("click", () => {
  const date = document.getElementById("birthDate").value;
  if (!date) {
    alert("Please select birth date");
    return;
  }

  const presets = [
    {
      core: "Core Energy: Sensitive · Intuitive · Reflective",
      pills: ["Sensitive", "Intuitive", "Reflective"],
      crystals: "Crystal Pairing: Moonstone + Rose Quartz + Amethyst"
    },
    {
      core: "Core Energy: Focused · Determined · Strategic",
      pills: ["Focused", "Strategic", "Grounded"],
      crystals: "Crystal Pairing: Tiger Eye + Citrine + Clear Quartz"
    },
    {
      core: "Core Energy: Creative · Emotional · Expressive",
      pills: ["Creative", "Expressive", "Flow"],
      crystals: "Crystal Pairing: Aquamarine + Amethyst + Clear Quartz"
    }
  ];

  const pick = presets[Math.floor(Math.random() * presets.length)];

  document.getElementById("resultBox").style.display = "block";

  document.getElementById("coreEnergy").innerText = pick.core;
  document.getElementById("crystalPair").innerText = pick.crystals;

  const kpiRow = document.getElementById("kpiRow");
  kpiRow.innerHTML = "";
  pick.pills.forEach((t) => {
    const el = document.createElement("span");
    el.className = "pill";
    el.textContent = t;
    kpiRow.appendChild(el);
  });
});
