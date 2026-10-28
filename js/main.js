
document.addEventListener("DOMContentLoaded", () => {
  // Menu mobile
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  function setMenuOpen(isOpen) {
    if (!menuToggle || !mobileMenu) return;

    mobileMenu.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);

    menuToggle.setAttribute("aria-expanded", String(isOpen));

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      setMenuOpen(!mobileMenu.classList.contains("is-open"));
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    });
  }

  // Evidenzia la pagina corrente nella navigazione.
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("[data-page]").forEach((link) => {
    const isCurrent = link.dataset.page === currentPage;

    if (isCurrent) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    }
  });

  // Anno corrente nel footer.
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // Validazione del modulo contatti.
  const contactForm = document.querySelector("[data-contact-form]");
  const formMessage = document.querySelector("[data-form-message]");

  if (contactForm && formMessage) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      formMessage.className = "form-message";
      formMessage.textContent = "";

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();

        formMessage.textContent =
          window.translations?.contact?.error || "";

        // Il testo viene tradotto tramite l'evento languageChanged
        // e gestito dalla funzione qui sotto.
        showFormMessage("contact.form.error", "error");
        return;
      }

      const submitButton = contactForm.querySelector(
        'button[type="submit"]'
      );

      if (submitButton) {
        submitButton.disabled = true;
      }

      showFormMessage("contact.form.success", "success");

      if (submitButton) {
        submitButton.disabled = false;
      }
    });
  }

  function showFormMessage(key, type) {
    if (!formMessage) return;

    const language = document.documentElement.lang || "en";

    formMessage.dataset.messageKey = key;
    formMessage.dataset.messageType = type;

    formMessage.className = `form-message is-visible is-${type}`;
    formMessage.setAttribute("role", type === "error" ? "alert" : "status");

    // Il messaggio sarà tradotto dall'evento globale.
    document.dispatchEvent(
      new CustomEvent("formMessageRequested", {
        detail: { key, type, language }
      })
    );
  }
});
