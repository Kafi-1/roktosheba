# রক্তসেবা — RoktoSeva

Blood donation platform for Bangladesh. Static site (HTML + Tailwind CDN + Firebase), hosted on GitHub Pages at `roktosheba.agi.bd`.

## Features
- Bangla / English toggle (Bangla default — change `defaultLang` in `js/site-config.js`)
- Animated, responsive UI (scroll reveal, counters, skeleton loaders, reduced-motion safe)
- Donor profile page (`donor.html?id=UID`): photo, name, age, location, donation history, phone (login required), admin support
- Donor registration, donor search (blood group, district, upazila, compatible groups)
- Emergency requests with requester contact (login required), mark fulfilled / delete
- SEO: meta, Open Graph, Twitter, canonical, JSON-LD, sitemap.xml, robots.txt, 404 page
- Site settings (SEO, contact) loaded from Firebase (no redeploy)
- Separate Developer page (`developer.html`, linked from the footer); data in `js/site-config.js` or Firestore `settings/site`
- No payment, no email verification, no FCM

## Go-live checklist
1. **Firebase Console** (project `roktosheva`): enable *Authentication → Email/Password* and create *Firestore*.
2. **Rules:** paste `firestore.rules` into Firestore → Rules → **Publish** (required for security).
3. **Restrict API key:** Google Cloud Console → Credentials → HTTP referrers: `roktosheba.agi.bd/*`, `localhost/*`.
4. **Authorized domain:** Authentication → Settings → add `roktosheba.agi.bd`.
5. **Settings doc** (optional): Firestore → collection `settings` → document `site`. Same shape as `js/site-config.js`, e.g.
   - `description.en`, `description.bn`, `keywords.en`, `keywords.bn`, `ogImage` (full URL)
   - `contact.email`, `contact.phone`, `contact.address.en/bn`
   - `social.facebook` …
   - `developer.name.en/bn`, `developer.title.en/bn`, `developer.bio.en/bn`, `developer.photo`, `developer.links.github/linkedin/facebook/website/email`
6. **Admin panel** (`/admin/`): log in, open `/admin/` — it shows your UID. In Firestore create document `admins/<your-uid>` (any field). After that an "Admin Panel" link appears in your profile menu. Manage requests, donors (suspend/restore), messages, support requests and site settings (SEO/contact/developer).
7. Old data: delete the old `donations` collection; old `requests` may contain a public `phone` field — delete those docs or remove the field.
8. Replace ImgBB key in `js/common.js` (rotate it) or move uploads to Firebase Storage.

## Data model
`users` (private) · `publicDonors` (public, no phone) · `donorContacts` (phone, login only, no listing) · `requests` (public) · `requestContacts` (phone, login only) · `contactRequests` · `messages` · `settings/site` · `admins`

Existing donors are migrated automatically to `publicDonors` the next time they log in.

## Admin panel (`/admin/`)
Overview stats · Requests (search/filter/status/delete, load more) · Donors (active / all users / suspended; details, suspend, restore — restore re-lists the donor instantly) · Messages (read/unread, reply, delete) · Support (contact-via-admin requests) · Settings (SEO/contact/social/developer; empty or default value = fall back to `site-config.js`; URLs and emails are validated).
**After updating, re-publish `firestore.rules`** — the admin restore flow and the suspended-user blocking depend on the new rules.

## Known limitations (need a backend / build step)
- ImgBB key in `js/common.js` is public — rotate it, or move uploads to Firebase Storage / a Cloud Function.
- Tailwind runs from the CDN (console warning, slower first paint). Build a static CSS file with the Tailwind CLI for best production speed.
- Contact-form spam is only rate-limited client-side; add Firebase App Check for real protection.

## Notes
- Crawlers that do not run JavaScript see the English static meta; Google and users see the language-specific meta.
- Tailwind is loaded from the CDN. For best speed, build a static CSS file later.
- Bump `VERSION` in `sw.js` only if you need to force-clear caches (it is network-first).
