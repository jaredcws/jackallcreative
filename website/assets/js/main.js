const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.toggleAttribute("data-open", !isOpen);
  });
}

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const subject = encodeURIComponent(`Jackall Creative inquiry from ${data.get("name") || "website"}`);
    const body = encodeURIComponent(
      [
        `Name: ${data.get("name") || ""}`,
        `Email: ${data.get("email") || ""}`,
        `Company: ${data.get("company") || ""}`,
        `Website: ${data.get("website") || ""}`,
        `Need: ${data.get("need") || ""}`,
        `Timeline: ${data.get("timeline") || ""}`,
        `Budget: ${data.get("budget") || ""}`,
        "",
        data.get("message") || "",
      ].join("\n"),
    );
    window.location.href = `mailto:jackallcreative@gmail.com?subject=${subject}&body=${body}`;
  });
}
