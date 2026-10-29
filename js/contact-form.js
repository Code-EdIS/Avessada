"use strict";

/* ========================================
   AVESSADA CONTACT FORM
======================================== */


/*
 * CONFIGURATION
 *
 * Replace the placeholder with the real
 * business email address before publishing.
 */

const AVESSADA_CONTACT_EMAIL = "REPLACE_WITH_REAL_EMAIL";


/* ========================================
   DOM ELEMENTS
======================================== */

const contactForm = document.getElementById("contact-form");

const contactFeedback = document.getElementById("contact-feedback");

const gmailFallback = document.getElementById("contact-gmail-fallback");

const directEmailLink = document.getElementById("contact-direct-email");


/* ========================================
   TRANSLATION HELPERS
======================================== */

/*
 * These messages are currently in English.
 * They can later be connected to the project's
 * existing EN/CZ translation system.
 */

const contactMessages = {
    invalidForm:
        "Please complete all required fields correctly before continuing.",

    emailNotConfigured:
        "The contact form is not configured yet. Please contact the website administrator.",

    emailReady:
        "Your message is ready. If your email application does not open, use the Gmail option below. Review your message before sending it.",

    gmailReady:
        "Your message is ready in Gmail. Review the recipient and message, then press Send.",

    genericError:
        "Something went wrong while preparing your message. Please try again."
};


/* ========================================
   CONFIGURATION HELPERS
======================================== */

/**
 * Checks whether a real recipient email
 * address has been configured.
 *
 * @returns {boolean}
 */
function isContactEmailConfigured() {
    return (
        typeof AVESSADA_CONTACT_EMAIL === "string" &&
        AVESSADA_CONTACT_EMAIL.trim() !== "" &&
        AVESSADA_CONTACT_EMAIL !== "REPLACE_WITH_REAL_EMAIL"
    );
}


/**
 * Updates the visible email contact link.
 */
function configureDirectEmailLink() {
    if (!directEmailLink || !isContactEmailConfigured()) {
        return;
    }

    directEmailLink.textContent = AVESSADA_CONTACT_EMAIL;

    directEmailLink.href = `mailto:${AVESSADA_CONTACT_EMAIL}`;
}


/* ========================================
   FEEDBACK
======================================== */

/**
 * Displays an accessible feedback message.
 *
 * @param {string} message
 * @param {"success" | "error"} type
 */
function showContactFeedback(message, type = "success") {
    if (!contactFeedback) {
        return;
    }

    contactFeedback.textContent = message;

    contactFeedback.classList.remove("is-error", "is-success");

    contactFeedback.classList.add(
        type === "error" ? "is-error" : "is-success"
    );

    contactFeedback.hidden = false;
}


/**
 * Hides the feedback message.
 */
function hideContactFeedback() {
    if (!contactFeedback) {
        return;
    }

    contactFeedback.hidden = true;

    contactFeedback.classList.remove("is-error", "is-success");

    contactFeedback.textContent = "";
}


/* ========================================
   FORM DATA
======================================== */

/**
 * Reads the form and prepares the email data.
 *
 * @returns {{to: string, subject: string, body: string}}
 */
function buildContactEmail() {
    const name = document
        .getElementById("contact-name")
        .value
        .trim();

    const senderEmail = document
        .getElementById("contact-email")
        .value
        .trim();

    const company = document
        .getElementById("contact-company")
        .value
        .trim();

    const subject = document
        .getElementById("contact-subject")
        .value
        .trim();

    const message = document
        .getElementById("contact-message")
        .value
        .trim();

    const emailSubject = `[Avessada Website] ${subject}`;

    const emailBody = [
        "Hello Avessada,",
        "",
        message,
        "",
        "--------------------------------",
        `Name: ${name}`,
        `Email: ${senderEmail}`,
        `Company: ${company || "Not provided"}`,
        "",
        "Sent from the Avessada contact form."
    ].join("\n");

    return {
        to: AVESSADA_CONTACT_EMAIL,
        subject: emailSubject,
        body: emailBody
    };
}


/* ========================================
   URL BUILDERS
======================================== */

/**
 * Builds a mailto URL for the default email app.
 *
 * @param {{to: string, subject: string, body: string}} emailData
 * @returns {string}
 */
function buildMailtoUrl(emailData) {
    const parameters = new URLSearchParams({
        subject: emailData.subject,
        body: emailData.body
    });

    return `mailto:${emailData.to}?${parameters.toString()}`;
}


/**
 * Builds the Gmail compose URL.
 *
 * Gmail will open a draft. It will not send
 * the message automatically.
 *
 * @param {{to: string, subject: string, body: string}} emailData
 * @returns {string}
 */
function buildGmailUrl(emailData) {
    const gmailUrl = new URL("https://mail.google.com/mail/");

    gmailUrl.searchParams.set("view", "cm");
    gmailUrl.searchParams.set("fs", "1");
    gmailUrl.searchParams.set("to", emailData.to);
    gmailUrl.searchParams.set("su", emailData.subject);
    gmailUrl.searchParams.set("body", emailData.body);

    return gmailUrl.toString();
}


/**
 * Updates the Gmail fallback with the current form data.
 *
 * @returns {boolean}
 */
function updateGmailFallback() {
    if (!gmailFallback || !contactForm) {
        return false;
    }

    if (!isContactEmailConfigured()) {
        gmailFallback.href = "https://mail.google.com/mail/";
        return false;
    }

    if (!contactForm.checkValidity()) {
        return false;
    }

    const emailData = buildContactEmail();

    gmailFallback.href = buildGmailUrl(emailData);

    return true;
}


/* ========================================
   VALIDATION
======================================== */

/**
 * Validates the form using native browser validation.
 *
 * @returns {boolean}
 */
function validateContactForm() {
    if (!contactForm) {
        return false;
    }

    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();

        showContactFeedback(
            contactMessages.invalidForm,
            "error"
        );

        return false;
    }

    return true;
}


/* ========================================
   DEFAULT EMAIL APPLICATION
======================================== */

/**
 * Handles form submission and opens the default
 * email application through a mailto URL.
 */
function handleContactSubmit(event) {
    event.preventDefault();

    hideContactFeedback();

    if (!validateContactForm()) {
        return;
    }

    if (!isContactEmailConfigured()) {
        showContactFeedback(
            contactMessages.emailNotConfigured,
            "error"
        );

        return;
    }

    try {
        const emailData = buildContactEmail();

        /*
         * Update Gmail before navigating away from the page.
         */
        if (gmailFallback) {
            gmailFallback.href = buildGmailUrl(emailData);
        }

        const mailtoUrl = buildMailtoUrl(emailData);

        showContactFeedback(
            contactMessages.emailReady,
            "success"
        );

        /*
         * The browser asks the operating system to open
         * the default handler for mailto links.
         *
         * The website cannot reliably determine whether
         * the application actually opened.
         */
        window.location.href = mailtoUrl;

    } catch (error) {
        console.error("Contact form error:", error);

        showContactFeedback(
            contactMessages.genericError,
            "error"
        );
    }
}


/* ========================================
   GMAIL FALLBACK
======================================== */

/**
 * Validates the form and prepares Gmail's compose URL
 * before the browser follows the fallback link.
 */
function handleGmailClick(event) {
    hideContactFeedback();

    if (!isContactEmailConfigured()) {
        event.preventDefault();

        showContactFeedback(
            contactMessages.emailNotConfigured,
            "error"
        );

        return;
    }

    if (!validateContactForm()) {
        event.preventDefault();
        return;
    }

    const isUpdated = updateGmailFallback();

    if (!isUpdated) {
        event.preventDefault();

        showContactFeedback(
            contactMessages.genericError,
            "error"
        );

        return;
    }

    showContactFeedback(
        contactMessages.gmailReady,
        "success"
    );
}


/* ========================================
   EVENT LISTENERS
======================================== */

/**
 * Registers event listeners once the document
 * has been parsed.
 */
function initializeContactForm() {
    if (!contactForm) {
        return;
    }

    configureDirectEmailLink();

    contactForm.addEventListener(
        "submit",
        handleContactSubmit
    );

    if (gmailFallback) {
        gmailFallback.addEventListener(
            "click",
            handleGmailClick
        );
    }

    /*
     * Keep the Gmail URL synchronized with the form
     * whenever the visitor changes a field.
     */
    contactForm.addEventListener("input", function () {
        hideContactFeedback();
        updateGmailFallback();
    });

    contactForm.addEventListener("change", function () {
        hideContactFeedback();
        updateGmailFallback();
    });
}


/* ========================================
   INITIALIZATION
======================================== */

initializeContactForm();