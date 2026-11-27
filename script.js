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

// Football "drive" bar: fills as you scroll, and the ball spins as it moves
const driveFill = document.querySelector(".drive-fill");
const updateDrive = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  const pct = max > 0 ? scrollY / max : 0;
  driveFill.style.width = pct * 100 + "%";
  driveFill.style.setProperty("--spin", pct * 1080 + "deg");
};
addEventListener("scroll", updateDrive, { passive: true });
addEventListener("resize", updateDrive);
updateDrive();
