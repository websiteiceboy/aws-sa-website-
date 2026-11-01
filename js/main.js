/* =========================================================================
   AWS SA — main.js  (Part 3: Enhancing Functionality and SEO)

   Contents:
   1.  Helpers
   2.  Mobile navigation enhancement
   3.  Scroll-reveal animations (IntersectionObserver)
   4.  Accordion (FAQ)
   5.  Dynamic services list with search, filter and sort
   6.  Gallery lightbox
   7.  Form validation helpers
   8.  Enquiry form (validate -> AJAX -> cost/availability response)
   9.  Contact form (validate -> compile email)
   10. Initialise everything
   ========================================================================= */

"use strict";

/* ------------------------------------------------------------------------
   1. HELPERS
   ------------------------------------------------------------------------ */
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

// Recipient for the contact form email (stated in code as required by the brief)
const CONTACT_RECIPIENT = "admin@awscape.org.za";

// AJAX endpoint. Leave empty to use the built-in simulated server response.
// To use a real service (e.g. Formspree), paste its endpoint URL here.
const FORM_ENDPOINT = "";

/* ------------------------------------------------------------------------
   2. MOBILE NAVIGATION ENHANCEMENT
   The CSS checkbox already toggles the menu; JS adds keyboard/ARIA support
   and closes the menu when a link is chosen or Escape is pressed.
   ------------------------------------------------------------------------ */
function initNav() {
  const toggle = $("#nav-toggle");
  const label = $(".nav-toggle-label");
  if (!toggle || !label) return;

  label.setAttribute("role", "button");
  label.setAttribute("tabindex", "0");
  label.setAttribute("aria-controls", "primary-nav");
  label.setAttribute("aria-expanded", "false");

  const sync = () => label.setAttribute("aria-expanded", String(toggle.checked));
  toggle.addEventListener("change", sync);

  // Allow Enter / Space on the label for keyboard users
  label.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle.checked = !toggle.checked;
      sync();
    }
  });

  // Close menu after choosing a link, or on Escape
  $$(".main-nav a").forEach((a) =>
    a.addEventListener("click", () => {
      toggle.checked = false;
      sync();
    })
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && toggle.checked) {
      toggle.checked = false;
      sync();
      label.focus();
    }
  });
}

/* ------------------------------------------------------------------------
   3. SCROLL-REVEAL ANIMATIONS
   Elements with .reveal fade/slide in when they enter the viewport.
   Respects the user's "reduce motion" setting.
   ------------------------------------------------------------------------ */
function initReveal() {
  const items = $$(".card, .reveal");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || reduce) return;

  items.forEach((el) => el.classList.add("will-reveal"));
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => observer.observe(el));
}

/* ------------------------------------------------------------------------
   4. ACCORDION (FAQ)
   Each button toggles the panel it controls; one panel open at a time.
   ------------------------------------------------------------------------ */
function initAccordion() {
  const buttons = $$(".accordion__button");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      buttons.forEach((b) => {
        b.setAttribute("aria-expanded", "false");
        $("#" + b.getAttribute("aria-controls")).hidden = true;
      });
      if (!open) {
        btn.setAttribute("aria-expanded", "true");
        $("#" + btn.getAttribute("aria-controls")).hidden = false;
      }
    });
  });
}

/* ------------------------------------------------------------------------
   5. DYNAMIC SERVICES LIST (search, filter, sort)
   Content is stored as data and rendered into the DOM with JavaScript.
   ------------------------------------------------------------------------ */
const SERVICES = [
  { name: "General Veterinary Consultation", category: "Veterinary", icon: "icon-vet.svg",
    text: "Health checks and treatment for common illness and injury." },
  { name: "Vaccinations", category: "Veterinary", icon: "icon-vet.svg",
    text: "Core vaccinations to protect dogs and cats from preventable disease." },
  { name: "Dog Adoption", category: "Adoption", icon: "icon-adopt.svg",
    text: "Meet adoptable dogs and be matched with a suitable companion." },
  { name: "Cat Adoption", category: "Adoption", icon: "icon-adopt.svg",
    text: "Find a cat that fits your home, with post-adoption support." },
  { name: "Dog and Cat Sterilisation", category: "Sterilisation", icon: "icon-sterilisation.svg",
    text: "Safe, affordable sterilisation procedures for owned and community animals." },
  { name: "Mobile Sterilisation Outreach", category: "Sterilisation", icon: "icon-sterilisation.svg",
    text: "Our outreach unit brings sterilisation closer to surrounding communities." },
  { name: "School and Community Workshops", category: "Education", icon: "icon-education.svg",
    text: "Interactive sessions on responsible pet ownership and animal welfare." },
  { name: "Responsible Pet Ownership Guides", category: "Education", icon: "icon-education.svg",
    text: "Practical, printable guidance on feeding, health and behaviour." },
];

function initServices() {
  const list = $("#service-list");
  if (!list) return;

  const search = $("#service-search");
  const category = $("#service-category");
  const sort = $("#service-sort");
  const count = $("#service-count");

  function render() {
    const q = search.value.trim().toLowerCase();
    const cat = category.value;

    let results = SERVICES.filter(
      (s) =>
        (cat === "all" || s.category === cat) &&
        (s.name + " " + s.text + " " + s.category).toLowerCase().includes(q)
    );

    results.sort((a, b) =>
      sort.value === "za" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
    );

    // DOM manipulation: rebuild the list from the filtered data
    list.innerHTML = "";
    results.forEach((s) => {
      const card = document.createElement("article");
      card.className = "card is-visible";

      const img = document.createElement("img");
      img.className = "card__icon";
      img.src = "images/" + s.icon;
      img.alt = "";

      const h3 = document.createElement("h3");
      h3.textContent = s.name;

      const tag = document.createElement("p");
      tag.className = "section-eyebrow";
      tag.textContent = s.category;

      const p = document.createElement("p");
      p.textContent = s.text;

      card.append(img, tag, h3, p);
      list.appendChild(card);
    });

    count.textContent =
      results.length === 0
        ? "No services match your search. Try a different word or category."
        : `Showing ${results.length} of ${SERVICES.length} services`;
  }

  [search, category, sort].forEach((el) => el.addEventListener("input", render));
  render();
}

/* ------------------------------------------------------------------------
   6. GALLERY LIGHTBOX
   Clicking a thumbnail opens a larger view in an accessible dialog.
   Arrow keys move between images; Escape closes.
   ------------------------------------------------------------------------ */
function initLightbox() {
  const thumbs = $$(".gallery__item");
  const box = $("#lightbox");
  if (!thumbs.length || !box) return;

  const img = $("#lightbox-img");
  const caption = $("#lightbox-caption");
  let current = 0;
  let lastFocus = null;

  function show(index) {
    current = (index + thumbs.length) % thumbs.length;
    const t = thumbs[current];
    img.src = t.dataset.full;
    img.alt = t.dataset.alt;
    caption.textContent = t.dataset.alt;
  }

  function open(index) {
    lastFocus = document.activeElement;
    show(index);
    box.hidden = false;
    document.body.classList.add("no-scroll");
    $(".lightbox__close", box).focus();
  }

  function close() {
    box.hidden = true;
    document.body.classList.remove("no-scroll");
    if (lastFocus) lastFocus.focus();
  }

  thumbs.forEach((t, i) => t.addEventListener("click", () => open(i)));
  $(".lightbox__close", box).addEventListener("click", close);
  $(".lightbox__prev", box).addEventListener("click", () => show(current - 1));
  $(".lightbox__next", box).addEventListener("click", () => show(current + 1));
  box.addEventListener("click", (e) => { if (e.target === box) close(); });

  document.addEventListener("keydown", (e) => {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
}

/* ------------------------------------------------------------------------
   7. FORM VALIDATION HELPERS
   ------------------------------------------------------------------------ */
const patterns = {
  name: /^[A-Za-z][A-Za-z\s'’-]{1,49}$/,                 // letters, spaces, ' -
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  // South African numbers: 0XXXXXXXXX or +27XXXXXXXXX (spaces/dashes allowed)
  phone: /^(?:\+27|0)[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{4}$/,
};

function setError(field, message) {
  const wrapper = field.closest(".field");
  const err = $(".field__error", wrapper);
  field.setAttribute("aria-invalid", message ? "true" : "false");
  wrapper.classList.toggle("has-error", Boolean(message));
  if (err) err.textContent = message || "";
  return !message;
}

// Each rule returns an error message string, or "" when the value is valid
const rules = {
  name: (v) =>
    !v.trim() ? "Please enter your full name."
    : !patterns.name.test(v.trim()) ? "Use letters only (2–50 characters)."
    : "",
  email: (v) =>
    !v.trim() ? "Please enter your email address."
    : !patterns.email.test(v.trim()) ? "Enter a valid email, e.g. name@example.com."
    : "",
  phone: (v) =>
    v.trim() && !patterns.phone.test(v.trim())
      ? "Enter a valid South African number, e.g. 021 692 2626 or +27 21 692 2626."
      : "",
  required: (v) => (!v.trim() ? "Please choose an option." : ""),
  message: (v) =>
    !v.trim() ? "Please enter a message."
    : v.trim().length < 10 ? "Your message must be at least 10 characters."
    : v.trim().length > 500 ? "Your message must be 500 characters or fewer."
    : "",
  futureDate: (v) => {
    if (!v) return ""; // optional
    const chosen = new Date(v + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return chosen < today ? "Please choose today or a future date." : "";
  },
};

// Attach live validation (on blur / input) and return a validate-all function
function attachValidation(form, map) {
  const check = (name) => {
    const field = form.elements[name];
    return setError(field, rules[map[name]](field.value));
  };
  Object.keys(map).forEach((name) => {
    const field = form.elements[name];
    field.addEventListener("blur", () => check(name));
    field.addEventListener("input", () => {
      if (field.closest(".field").classList.contains("has-error")) check(name);
    });
  });
  return () => {
    let firstBad = null;
    let ok = true;
    Object.keys(map).forEach((name) => {
      if (!check(name)) {
        ok = false;
        if (!firstBad) firstBad = form.elements[name];
      }
    });
    if (firstBad) firstBad.focus();
    return ok;
  };
}

// Live character counter for textareas
function attachCounter(textarea, counter, max) {
  const update = () => (counter.textContent = `${textarea.value.length} / ${max}`);
  textarea.addEventListener("input", update);
  update();
}

/* ------------------------------------------------------------------------
   8. ENQUIRY FORM
   Validate -> submit with AJAX (fetch) -> show a cost/availability response.
   The figures below are illustrative sample data for this student project.
   ------------------------------------------------------------------------ */
const ENQUIRY_RESPONSES = {
  adoption: {
    title: "Adoption enquiry received",
    cost: "Adoption fees start from R500 and include vaccination and sterilisation.",
    availability: "Meet-and-greet visits: Monday to Saturday, 09:00–16:00, by appointment.",
  },
  veterinary: {
    title: "Veterinary care enquiry received",
    cost: "Consultations start from R150, with reduced rates for families in need.",
    availability: "Clinic hours: Monday to Friday, 08:00–16:00. Walk-ins welcome.",
  },
  sterilisation: {
    title: "Sterilisation enquiry received",
    cost: "Sterilisation starts from R250 depending on species and size.",
    availability: "Slots are booked weekly. Our team will confirm the next available date.",
  },
  volunteer: {
    title: "Volunteer enquiry received",
    cost: "Volunteering is free. Wear closed shoes and bring a water bottle.",
    availability: "Orientation sessions run on the first Saturday of every month.",
  },
  sponsorship: {
    title: "Sponsorship enquiry received",
    cost: "Sponsorship starts from R200 per month, or choose a once-off amount.",
    availability: "Sponsors can begin at any time. We will send payment details by email.",
  },
};

function initEnquiryForm() {
  const form = $("#enquiry-form");
  if (!form) return;

  const validateAll = attachValidation(form, {
    service: "required",
    fullName: "name",
    email: "email",
    phone: "phone",
    preferredDate: "futureDate",
    message: "message",
  });
  attachCounter(form.elements.message, $("#message-count"), 500);

  // Prevent past dates in the picker as well
  form.elements.preferredDate.min = new Date().toISOString().split("T")[0];

  const status = $("#form-status");
  const result = $("#enquiry-result");
  const button = $("button[type=submit]", form);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    result.hidden = true;
    if (!validateAll()) {
      status.textContent = "Please fix the highlighted fields and try again.";
      return;
    }

    status.textContent = "Sending your enquiry…";
    button.disabled = true;

    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      await submitAjax(payload);             // AJAX submission
      showEnquiryResult(payload);
      status.textContent = "";
      form.reset();
      $("#message-count").textContent = "0 / 500";
    } catch (err) {
      status.textContent = "Sorry, something went wrong. Please try again or call 021 692 2626.";
    } finally {
      button.disabled = false;
    }
  });

  function showEnquiryResult(data) {
    const info = ENQUIRY_RESPONSES[data.service];
    $("#result-title").textContent = info.title;
    $("#result-greeting").textContent =
      `Thank you, ${data.fullName.trim().split(" ")[0]}. Here is what you need to know:`;
    $("#result-cost").textContent = info.cost;
    $("#result-availability").textContent = info.availability;
    $("#result-email").textContent = data.email;
    result.hidden = false;
    result.focus();
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

// AJAX submission using fetch. Uses a real endpoint if FORM_ENDPOINT is set,
// otherwise simulates a short server delay so the full flow can be demonstrated.
async function submitAjax(payload) {
  if (!FORM_ENDPOINT) {
    return new Promise((resolve) => setTimeout(resolve, 900));
  }
  const response = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Request failed: " + response.status);
  return response.json();
}

/* ------------------------------------------------------------------------
   9. CONTACT FORM
   Validate -> compile into an email -> user sends it to the recipient above.
   ------------------------------------------------------------------------ */
function initContactForm() {
  const form = $("#contact-form");
  if (!form) return;

  const validateAll = attachValidation(form, {
    fullName: "name",
    email: "email",
    phone: "phone",
    topic: "required",
    message: "message",
  });
  attachCounter(form.elements.message, $("#c-message-count"), 500);

  const preview = $("#email-preview");
  const status = $("#contact-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    preview.hidden = true;
    if (!validateAll()) {
      status.textContent = "Please fix the highlighted fields and try again.";
      return;
    }
    status.textContent = "";

    const d = Object.fromEntries(new FormData(form).entries());
    const subject = `[${d.topic}] Message from ${d.fullName.trim()}`;
    const body =
      `Name: ${d.fullName.trim()}\n` +
      `Email: ${d.email.trim()}\n` +
      `Phone: ${d.phone.trim() || "Not provided"}\n` +
      `Message type: ${d.topic}\n\n` +
      `${d.message.trim()}`;

    // Show the compiled email so the user can review it before sending
    $("#email-to").textContent = CONTACT_RECIPIENT;
    $("#email-subject").textContent = subject;
    $("#email-body").textContent = body;
    $("#email-send").href =
      `mailto:${CONTACT_RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    preview.hidden = false;
    preview.focus();
    preview.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

/* ------------------------------------------------------------------------
   10. INITIALISE
   ------------------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initReveal();
  initAccordion();
  initServices();
  initLightbox();
  initEnquiryForm();
  initContactForm();
});
