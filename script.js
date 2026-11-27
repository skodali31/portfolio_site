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

// Runner bar: the page is a 5K. Fills as you scroll; the runner strides
// while you move, turns around when you scroll up, and shows the distance.
const race = document.querySelector(".race");
const raceFill = race.querySelector(".race-fill");
const pace = race.querySelector(".pace");
let lastY = scrollY, idle;
const updateRace = (moving) => {
  const max = document.documentElement.scrollHeight - innerHeight;
  const pct = max > 0 ? Math.min(1, scrollY / max) : 0;
  raceFill.style.width = pct * 100 + "%";
  const done = pct >= 0.995;
  pace.textContent = done ? "5K done 🎉" : (pct * 5).toFixed(1) + " km";
  race.classList.toggle("done", done);
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
