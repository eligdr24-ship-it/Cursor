// Preview interactions: reveal sections on scroll, soft nav highlight
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".section, .report, .phases article").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(14px)";
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  observer.observe(el);
});

const style = document.createElement("style");
style.textContent = `
  .in-view { opacity: 1 !important; transform: none !important; }
`;
document.head.appendChild(style);

// Animate conviction ring from 0
const ring = document.querySelector(".ring");
if (ring) {
  const target = Number(ring.style.getPropertyValue("--p")) || 72;
  let current = 0;
  const tick = () => {
    current += Math.max(1, Math.round((target - current) / 8));
    ring.style.setProperty("--p", String(current));
    const label = ring.querySelector("span");
    if (label) label.textContent = String(current);
    if (current < target) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
