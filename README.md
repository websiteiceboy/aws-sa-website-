# AWS SA Website
masego leeuw st10530142


### Part 3 — new work

- **Added `js/main.js`** and linked it (with `defer`) on all 5 pages.
- **Navigation:** enhanced the mobile menu with ARIA attributes, keyboard
  support (Enter/Space/Escape) and auto-close after choosing a link.
- **Animations:** added scroll-reveal animations using `IntersectionObserver`
  plus CSS transitions; disabled automatically when the user prefers reduced motion.
- **Accordion (services.html):** FAQ accordion with `aria-expanded`, one panel open at a time.
- **Dynamic content + search (services.html):** services are stored as data and
  rendered into the DOM with JavaScript, with live search, category filter and A–Z / Z–A sorting.
- **Gallery with lightbox (about.html):** four-image gallery opening in an accessible
  dialog with previous/next buttons, arrow-key navigation, Escape to close and focus return.
- **Google Maps (contact.html):** replaced the Part 2 placeholder with two embedded
  maps (Philippi main centre and Khayelitsha outreach stop).
- **Enquiry form (enquiry.html):** rebuilt with a service select, name, phone, email,
  preferred date and message. JavaScript validation (name format, email format,
  South African phone format, future date, 10–500 character message) with inline error
  messages. Valid submissions are sent via AJAX (`fetch`) and the user receives a
  response showing cost and availability for the chosen service.
- **Contact form (contact.html):** rebuilt with name, phone, email, message type and a
  full message. After validation the details are compiled into an email addressed to
  `admin@awscape.org.za`, which the user reviews and sends via a `mailto:` link.
- **SEO:** unique titles and meta descriptions per page, keywords, canonical URLs,
  Open Graph/Twitter tags, a single H1 per page with H2/H3 hierarchy, descriptive image
  file names and alt text, internal links between pages, and schema.org `AnimalShelter`
  JSON-LD for local SEO on the home page.
- **Added `robots.txt` and `sitemap.xml`.**
- **Performance:** `defer` on scripts, `loading="lazy"` on gallery images and map
  iframes, font `preconnect`, and lightweight SVG images.
- **Security:** `_headers` file (nosniff, frame protection, referrer policy,
  permissions policy), referrer meta tag, and `novalidate` forms backed by JavaScript
  validation with input length limits.
- **Accessibility:** skip-to-content link, `aria-live` error regions, visible focus states.

## Notes and assumptions

- **Sample data:** The prices, clinic hours and availability shown in the enquiry
  form responses (`ENQUIRY_RESPONSES` in `js/main.js`) are illustrative sample
  figures created for this assignment. They are not taken from AWS SA.
- **AJAX submission:** `FORM_ENDPOINT` in `js/main.js` is empty, so the enquiry form
  simulates a server response. Setting it to a real endpoint (e.g. Formspree) enables
  live submission without any other code changes.
- **Second map location:** The Khayelitsha outreach location is a sample location
  used to meet the "more than one location" requirement.
- **Website budget:** The estimated development and setup budget of R5000 to R8000
  (excluding optional professional photography or advanced donation systems) comes
  from the Part 1 project proposal.

## Off-page SEO (documentation)

- **Backlinks:** plan to request links from local veterinary practices, Cape Town
  community pages and animal welfare directories.
- **Social media:** Open Graph tags let the site preview correctly when shared on
  Facebook, X and WhatsApp.
- **Local SEO:** Philippi / Cape Town keywords, local business structured data, and a
  Google Business Profile listing are recommended.

## Deployment
Deployed at: https://chimerical-paprenjak-44c82b.netlify.app/


**GitHub Pages:** repo Settings > Pages > Source: *Deploy from a branch* > `main` / `(root)` > Save.
**Netlify:** drag the project folder onto app.netlify.com/drop, or connect the GitHub repo.



## References

- MDN Web Docs. (2026) *IntersectionObserver*. Available at: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver .
- MDN Web Docs. (2026) *Using the Fetch API*. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch .
- MDN Web Docs. (2026) *Client-side form validation*. Available at: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation .
- W3C. (2026) *ARIA Authoring Practices Guide: Accordion Pattern*. Available at: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/ .
- Schema.org. (2026) *AnimalShelter*. Available at: https://schema.org/AnimalShelter .
- Google. (2026) *Google Maps Embed*. Available at: https://developers.google.com/maps/documentation/embed.
- Google Search Central. (2026) *SEO Starter Guide*. Available at: https://developers.google.com/search/docs/fundamentals/seo-starter-guide.
