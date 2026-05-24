const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const waveform = document.querySelector("[data-waveform]");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    }
  });
}

if (waveform) {
  const levels = [
    12, 18, 26, 34, 20, 44, 52, 30, 22, 42, 58, 48, 24,
    20, 36, 50, 60, 46, 28, 16, 22, 34, 56, 64, 38, 20,
    14, 28, 40, 54, 68, 44, 24, 18, 30, 42, 58, 50, 36,
    20, 14, 24, 38, 54, 46, 32, 18, 26, 42, 58, 34, 16
  ];

  waveform.innerHTML = levels
    .map((level, index) => `<span style="--level:${level}; --i:${index}"></span>`)
    .join("");
}
