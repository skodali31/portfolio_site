// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Theme toggle (remembers choice)
const root = document.documentElement;
document.querySelector(".theme-toggle").addEventListener("click", () => {
  const isDark =
    root.dataset.theme === "dark" ||
    (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
  const next = isDark ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// Mobile menu
const menuBtn = document.querySelector(".menu-toggle");
const links = document.querySelector(".nav-links");
menuBtn.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
links.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    links.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  }
});

// Reveal sections on scroll
const observer = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      observer.unobserve(e.target);
    }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Highlight the nav link for the section currently on screen
const navLinks = [...document.querySelectorAll(".nav-links a")];
const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href")));
const spy = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
  }),
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => s && spy.observe(s));

// Runner bar: the page is a 5K cross-country course. Draws a rolling
// elevation profile, fills the covered part as you scroll, and moves the
// runner along the terrain. The runner strides while you move, turns
// around when you scroll up, and shows the distance covered.
const race = document.querySelector(".race");
const H = 14;                                        // course height in px
const terrain = (t) =>                               // gentle rolling hills, y in px
  H - 4 - 2.6 * (0.5 + 0.5 * Math.sin(2 * Math.PI * (1.6 * t - 0.15)))
        - 1.6 * (0.5 + 0.5 * Math.sin(2 * Math.PI * (4.3 * t + 0.4)));
const pts = [];
for (let i = 0; i <= 200; i++) pts.push(`${(i / 200) * 1000},${terrain(i / 200).toFixed(2)}`);
const d = "M" + pts.join(" L");
race.querySelector(".trail").setAttribute("d", d);
race.querySelector(".trail-done").setAttribute("d", d);
const coveredRect = race.querySelector(".covered-rect");
const runnerPos = race.querySelector(".runner-pos");
const pace = race.querySelector(".pace");

// course flags at 1K, 2K, 3K, 4K
const flags = [1, 2, 3, 4].map((k) => {
  const f = document.createElement("span");
  f.className = "km";
  f.style.left = k * 20 + "%";
  f.style.top = terrain(k / 5) + "px";
  race.appendChild(f);
  return f;
});

let lastY = scrollY, idle, wasStart = true, goUntil = 0, goTimer;
const updateRace = (moving) => {
  const max = document.documentElement.scrollHeight - innerHeight;
  const pct = max > 0 ? Math.min(1, scrollY / max) : 0;
  const w = race.clientWidth;
  const x = Math.min(w - 10, Math.max(10, pct * w));
  runnerPos.style.transform = `translate(${x}px, ${terrain(x / w)}px)`;
  coveredRect.setAttribute("width", (x / w) * 1000);
  flags.forEach((f, i) => f.classList.toggle("passed", pct >= (i + 1) / 5));
  const done = pct >= 0.995;
  const atStart = pct <= 0.002;
  if (wasStart && !atStart) {            // just left the start line: flash "Go!"
    goUntil = performance.now() + 900;
    clearTimeout(goTimer);
    goTimer = setTimeout(() => updateRace(false), 950);
  }
  wasStart = atStart;
  const going = !done && !atStart && performance.now() < goUntil;
  pace.textContent = done ? "5K done 🎉" : atStart ? "On your marks" : going ? "Go!" : (pct * 5).toFixed(1) + " km";
  race.classList.toggle("done", done);
  race.classList.toggle("start", atStart);
  race.classList.toggle("go", going);
  race.classList.toggle("early", x < 140);
  if (scrollY !== lastY) race.classList.toggle("back", scrollY < lastY);
  lastY = scrollY;
  if (moving) {
    race.classList.add("moving");
    clearTimeout(idle);
    idle = setTimeout(() => race.classList.remove("moving"), 300);
  }
};
addEventListener("scroll", () => updateRace(true), { passive: true });
addEventListener("resize", () => updateRace(false));
updateRace(false);
