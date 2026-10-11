
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const surpriseButton = document.getElementById("surpriseButton");
const surpriseMessage = document.getElementById("surpriseMessage");
const yearElement = document.getElementById("year");

// Mostrar el año actual.
yearElement.textContent = new Date().getFullYear();

// Abrir y cerrar el menú en móviles.
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Cerrar menú" : "Abrir menú"
  );

  menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Cerrar el menú después de seleccionar una sección.
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
    menuToggle.textContent = "☰";
  });
});

// Revelar el mensaje sorpresa.
surpriseButton.addEventListener("click", () => {
  surpriseMessage.hidden = false;
  surpriseButton.textContent = "Un abrazo para ti ♡";
  surpriseButton.setAttribute("aria-expanded", "true");
  surpriseMessage.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
});
