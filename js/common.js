// ============================================================
// RoktoSeva — Common JS
// Navbar, footer, toast, auth, SEO, site settings, animations
// ============================================================

const isDashboard = /\/(dashboard|admin)(\/|$)/.test(window.location.pathname);
const BASE = isDashboard ? "../" : "";
const CFG = window.SITE_CONFIG;
const _ = (s) => (window.t ? window.t(s) : s); // translate helper
const L = (o) => (window.i18n ? window.i18n.localized(o) : o && o.en);

// ============ SECURITY HELPERS ============
function escapeHTML(v) {
  return String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
/** User-supplied text: escaped and excluded from translation. */
function u(v) {
  return `<span translate="no">${escapeHTML(v)}</span>`;
}
function safeUrl(url) {
  try {
    const x = new URL(url, window.location.href);
    return ["http:", "https:"].includes(x.protocol) ? x.href : "";
  } catch {
    return "";
  }
}
function safeImg(url, fallbackLetter) {
  const ok = safeUrl(url);
  return ok || `https://placehold.co/100x100/1e293b/ef4444?text=${encodeURIComponent(fallbackLetter || "R")}`;
}

// ============ LOGIN "NEXT" (come back to the page you were on) ============
function currentPath() { return location.pathname + location.search + location.hash; }
function authUrl(page) { return BASE + page + "?next=" + encodeURIComponent(currentPath()); }
function loginUrl() { return authUrl("login.html"); }
function safeNext(n) {
  n = String(n || "");
  if (!/^\/(?!\/)[^\s:\\]*$/.test(n)) return "";
  if (/\/(login|register)\.html/.test(n)) return "";
  return n;
}
function getNext() { return safeNext(new URLSearchParams(location.search).get("next")); }
function goAfterLogin(delay = 600) {
  const n = getNext();
  setTimeout(() => (window.location.href = n || BASE + "dashboard/index.html"), delay);
}

// ============ TOAST ============
function showToast(message, type = "info") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    container.setAttribute("role", "status");
    container.setAttribute("aria-live", "polite");
    document.body.appendChild(container);
  }
  const icons = { success: "✓", error: "!", info: "i" };
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || "i"}</span><span class="toast-text"></span>`;
  toast.querySelector(".toast-text").textContent = _(message);
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("toast-out");
    setTimeout(() => toast.remove(), 350);
  }, 3800);
}

// ============ AUTH (cache + real Firebase verification) ============
function getCurrentUser() {
  try {
    const user = localStorage.getItem("roktoUser");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}
function setCurrentUser(user) {
  try {
    if (user) localStorage.setItem("roktoUser", JSON.stringify(user));
    else { localStorage.removeItem("roktoUser"); localStorage.removeItem("rs_admin"); sessionStorage.removeItem("rs_admin_checked"); }
  } catch {}
}

async function logout() {
  setCurrentUser(null);
  showToast("Logged out successfully.", "success");
  try {
    const fb = await initFirebase();
    if (fb) {
      const { signOut } = await getAuthFns();
      await signOut(fb.auth);
    }
  } catch {}
  setTimeout(() => (window.location.href = BASE + "index.html"), 600);
}

/** Returns cached user instantly; verifies the real Firebase session in the background. */
function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.replace(loginUrl());
    return null;
  }
  getFirebaseUser()
    .then((fu) => {
      if (!fu || fu.uid !== user.uid) {
        setCurrentUser(null);
        window.location.replace(loginUrl());
      }
    })
    .catch(() => {});
  return user;
}

// ============ PUBLIC PROFILE SYNC ============
// users/{uid}          → private (owner only): phone, email, guardianPhone ...
// publicDonors/{uid}   → safe public fields shown in search & home
// donorContacts/{uid}  → phone, readable by logged-in users only (not for female donors)
async function syncPublicProfile(p) {
  try {
    if (!p || !p.uid || !p.bloodGroup || p.suspended) return; // only donors with a blood group are listed publicly
    const fb = await initFirebase();
    if (!fb) return;
    const { doc, setDoc, deleteDoc, serverTimestamp } = await getFirestoreFns();
    const hidePhone = String(p.gender || "").toLowerCase() === "female";
    await setDoc(
      doc(fb.db, "publicDonors", p.uid),
      {
        uid: p.uid,
        name: p.name || "",
        gender: p.gender || "",
        age: Number.isInteger(Number(p.age)) && Number(p.age) > 0 ? Number(p.age) : null,
        bloodGroup: p.bloodGroup || "",
        district: p.district || "",
        upazila: p.upazila || "",
        image: p.image || "",
        lastDonationDate: p.lastDonationDate || null,
        donationCount: Number(p.donationCount) || 0,
        available: isDonorAvailable(p.lastDonationDate),
        hidePhone,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
    const contactRef = doc(fb.db, "donorContacts", p.uid);
    if (hidePhone) await deleteDoc(contactRef).catch(() => {});
    else await setDoc(contactRef, { uid: p.uid, phone: p.phone || "" });
  } catch (e) {
    console.warn("[RoktoSeva] public profile sync failed", e);
  }
}

// ============ UI HELPERS ============
function emptyStateHTML(message, actionHref, actionText) {
  return `
    <div class="col-span-full glass-card rounded-2xl p-10 text-center reveal">
      <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-2xl float-soft">🩸</div>
      <p class="text-slate-400 mb-4">${escapeHTML(_(message))}</p>
      ${actionHref ? `<a href="${actionHref}" class="inline-block text-red-400 hover:text-red-300 font-semibold text-sm">${escapeHTML(_(actionText || "Go →"))}</a>` : ""}
    </div>`;
}
function loadingHTML(count = 6) {
  return Array.from({ length: count })
    .map(
      () => `
    <div class="glass-card rounded-3xl p-6 skeleton-card">
      <div class="flex justify-between mb-5"><div class="skeleton w-12 h-12 rounded-2xl"></div><div class="skeleton w-16 h-6 rounded-lg"></div></div>
      <div class="skeleton h-5 w-2/3 rounded mb-4"></div>
      <div class="skeleton h-3 w-full rounded mb-2"></div>
      <div class="skeleton h-3 w-4/5 rounded mb-2"></div>
      <div class="skeleton h-3 w-3/5 rounded mb-6"></div>
      <div class="skeleton h-10 w-full rounded-xl"></div>
    </div>`
    )
    .join("");
}

// ============ SCROLL REVEAL + COUNTERS ============
const _io =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              _io.unobserve(e.target);
            }
          }),
        { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
      )
    : null;
function revealAll(root = document) {
  root.querySelectorAll(".reveal:not(.in)").forEach((el) => (_io ? _io.observe(el) : el.classList.add("in")));
}
function animateCount(el, to, dur = 1300) {
  if (!el) return;
  to = Number(to) || 0;
  el.dataset.n = String(to);
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || to === 0) {
    el.textContent = window.i18n.fmtNum(to);
    return;
  }
  const start = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = window.i18n.fmtNum(Math.round(to * eased));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ============ SITE SETTINGS (defaults → cache → Firestore) ============
const _DEFAULTS = JSON.parse(JSON.stringify(CFG));
function _merge(target, src) {
  if (!src || typeof src !== "object") return;
  Object.keys(src).forEach((k) => {
    const v = src[k];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      if (!target[k] || typeof target[k] !== "object") target[k] = {};
      _merge(target[k], v);
    } else if (v !== "" && v !== null && v !== undefined) {
      target[k] = v;
    }
  });
}
function _rebuildConfig(remote) {
  Object.keys(CFG).forEach((k) => delete CFG[k]);
  Object.assign(CFG, JSON.parse(JSON.stringify(_DEFAULTS)));
  _merge(CFG, remote);
}
async function loadSiteSettings() {
  try {
    const cached = JSON.parse(localStorage.getItem("rs_settings") || "null");
    if (cached) {
      _rebuildConfig(cached);
      refreshChrome();
    }
  } catch {}
  try {
    const fb = await initFirebase();
    if (!fb) return;
    const { doc, getDoc } = await getFirestoreFns();
    const snap = await getDoc(doc(fb.db, "settings", "site"));
    if (snap.exists()) {
      const data = snap.data();
      try { localStorage.setItem("rs_settings", JSON.stringify(data)); } catch {}
      _rebuildConfig(data);
      refreshChrome();
    }
  } catch (e) {
    console.warn("[RoktoSeva] settings not loaded (using defaults)", e.code || e.message);
  }
}

// ============ SEO / META TAGS ============
function _abs(p) {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  return CFG.siteUrl.replace(/\/$/, "") + "/" + p.replace(/^(\.\.\/)+/, "").replace(/^\//, "");
}
function _setMeta(attr, key, value) {
  if (value === undefined || value === null) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}
function _pageKey() {
  const f = window.location.pathname.split("/").pop().replace(".html", "");
  if (!f || f === "index") return isDashboard ? "dashboard" : "index";
  return f;
}
function applySEO() {
  const lang = window.i18n.getLang();
  const key = document.documentElement.dataset.page || _pageKey();
  const page = (CFG.pages && CFG.pages[key]) || {};
  const siteName = L(CFG.siteName);
  const pageTitle = L(page.title) || siteName;
  const title = key === "index" ? pageTitle : `${pageTitle} | ${siteName}`;
  const desc = L(page.desc) || L(CFG.description);
  const keywords = L(CFG.keywords);
  const path = window.location.pathname.replace(/index\.html$/, "");
  const canonical = CFG.siteUrl.replace(/\/$/, "") + path;
  const image = _abs(CFG.ogImage);

  document.title = title;
  _setMeta("name", "description", desc);
  _setMeta("name", "keywords", keywords);
  _setMeta("name", "author", L(CFG.developer && CFG.developer.name));
  _setMeta("name", "robots", page.noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
  _setMeta("property", "og:type", "website");
  _setMeta("property", "og:site_name", siteName);
  _setMeta("property", "og:title", title);
  _setMeta("property", "og:description", desc);
  _setMeta("property", "og:url", canonical);
  _setMeta("property", "og:image", image);
  _setMeta("property", "og:locale", lang === "bn" ? "bn_BD" : "en_US");
  _setMeta("name", "twitter:card", "summary_large_image");
  _setMeta("name", "twitter:title", title);
  _setMeta("name", "twitter:description", desc);
  _setMeta("name", "twitter:image", image);

  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = canonical;

  if (key === "index") {
    const dev = CFG.developer || {};
    const sameAs = Object.values(CFG.social || {}).filter(Boolean);
    const devLinks = Object.values(dev.links || {}).filter((x) => x && /^https?:/i.test(x));
    const graph = [
      { "@type": "Organization", name: siteName, url: CFG.siteUrl, logo: _abs("assets/icon-512.png"), email: CFG.contact && CFG.contact.email, sameAs },
      { "@type": "WebSite", name: siteName, url: CFG.siteUrl, inLanguage: lang, description: desc },
      { "@type": "Person", name: L(dev.name), jobTitle: L(dev.title), description: L(dev.bio), sameAs: devLinks }
    ];
    let ld = document.getElementById("ld-json");
    if (!ld) {
      ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.id = "ld-json";
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
  }
}

// ============ ICONS ============
const ICONS = {
  github: '<path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.16-1.18 3.16-1.18.64 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/>',
  linkedin: '<path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/>',
  facebook: '<path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.02 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.88v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.09 24 12.07Z"/>',
  twitter: '<path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.49l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41Z"/>',
  instagram: '<path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.4-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z"/>',
  youtube: '<path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z"/>',
  website: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM2 12h20M12 2c2.8 2.9 4 6.2 4 10s-1.2 7.1-4 10c-2.8-2.9-4-6.2-4-10s1.2-7.1 4-10Z"/>',
  email: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 5h18v14H3zM3 7l9 6 9-6"/>'
};
function iconLinks(map, extraClass = "") {
  return Object.entries(map || {})
    .filter(([, v]) => v)
    .map(([k, v]) => {
      const href = k === "email" ? (v.startsWith("mailto:") ? v : "mailto:" + v) : safeUrl(v);
      if (!href) return "";
      return `<a href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHTML(k)}" class="social-btn ${extraClass}">
        <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">${ICONS[k] || ICONS.website}</svg></a>`;
    })
    .join("");
}

// ============ LOGO / NAVBAR / FOOTER ============
function getLogoHTML(size = 50) {
  return `
    <div class="flex items-center gap-2.5">
      <img src="${BASE}assets/roktoseba.jpg" alt="${escapeHTML(L(CFG.siteName))}" width="${size}" height="${size}"
           class="object-cover shrink-0 rounded-full border-2 border-red-500/50 logo-pulse"
           style="width:${size}px;height:${size}px"
           onerror="this.onerror=null;this.src='${BASE}assets/icon-192.png'">
      <div class="flex flex-col">
        <span class="font-black leading-none text-lg brand-name text-red-500" translate="no">${escapeHTML(L(CFG.siteName))}</span>
        <span class="hidden min-[400px]:block text-[10px] font-semibold uppercase tracking-widest text-slate-400 mt-1">Blood Donation</span>
      </div>
    </div>`;
}

function renderNavbar() {
  const user = getCurrentUser();
  const isAdminUser = !!user && localStorage.getItem("rs_admin") === "1";
  const lang = window.i18n.getLang();
  const path = window.location.pathname;
  const isActive = (p) => path.endsWith(p) || (p === "index.html" && (path.endsWith("/") || path.endsWith("index.html")) && !isDashboard);

  const linkClass = (p) =>
    "nav-link relative px-4 py-2 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-300 border border-transparent " +
    (isActive(p)
      ? "text-white bg-gradient-to-r from-red-600/20 to-rose-600/10 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
      : "text-slate-400 hover:text-white hover:bg-white/5");
  const mobileLinkClass = (p) =>
    "flex items-center justify-between p-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-300 border " +
    (isActive(p)
      ? "bg-gradient-to-r from-red-600/20 to-rose-600/10 text-white border-red-500/40"
      : "text-slate-400 bg-white/[0.02] border-white/5 hover:text-white hover:bg-white/5");

  const links = [
    ["index.html", "Home", BASE + "index.html"],
    ["#requests", "Requests", BASE + "index.html#requests"],
    ["search.html", "Search", BASE + "search.html"],
    ["guidelines.html", "Guidelines", BASE + "guidelines.html"],
    ["faq.html", "FAQ", BASE + "faq.html"],
    ["contact.html", "Contact", BASE + "contact.html"]
  ];

  const langToggle = `
    <div class="lang-toggle" role="group" aria-label="Toggle language">
      <button type="button" data-lang="bn" class="${lang === "bn" ? "active" : ""}" translate="no">বাং</button>
      <button type="button" data-lang="en" class="${lang === "en" ? "active" : ""}" translate="no">EN</button>
      <span class="lang-thumb" style="transform:translateX(${lang === "bn" ? 0 : 100}%)"></span>
    </div>`;

  const navbarHTML = `
  <a href="#main" class="skip-link">Skip to content</a>
  <nav id="topNav" class="backdrop-blur-xl bg-[#070a13]/70 border-b border-red-500/10 px-4 sm:px-8 py-3 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
    <div class="absolute top-0 left-1/4 -z-10 h-[1px] w-1/2 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_20px_#ef4444]"></div>
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <button id="mobileMenuBtn" class="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 text-red-500 hover:bg-red-500/10 transition-all duration-300 focus:outline-none" aria-label="Toggle Mobile Menu">
          <svg id="menuIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
        </button>
        <a href="${BASE}index.html" class="flex items-center gap-3 group">${getLogoHTML(40)}</a>
      </div>

      <div class="hidden md:flex items-center gap-1.5 bg-white/[0.02] border border-white/5 p-1.5 rounded-2xl backdrop-blur-md">
        ${links.map(([k, label, href]) => `<a href="${href}" class="${linkClass(k)}">${label}</a>`).join("")}
      </div>

      <div class="flex items-center gap-2 sm:gap-3 relative">
        ${langToggle}
        ${
          user
            ? `<div class="relative">
            <button id="profileBtn" class="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full ring-2 ring-red-500/40 p-0.5 transition-all duration-300 hover:ring-red-500 hover:scale-105 focus:outline-none" aria-label="Profile menu">
              <div class="w-full h-full rounded-full bg-slate-800 overflow-hidden">
                <img alt="" src="${escapeHTML(safeImg(user.image, (user.name || "U").charAt(0).toUpperCase()))}" class="w-full h-full object-cover">
              </div>
            </button>
            <div id="profileDropdown" class="hidden dropdown-pop absolute right-0 mt-3 p-2 shadow-[0_10px_40px_rgba(0,0,0,0.7)] bg-[#0c101f]/95 border border-white/10 rounded-2xl w-56 text-slate-300 space-y-1 backdrop-blur-2xl z-50">
              <div class="px-4 py-2.5 border-b border-white/5 flex flex-col gap-0.5">
                <span class="text-sm font-bold text-white truncate" translate="no">${escapeHTML(user.name || "User")}</span>
                <span class="text-[10px] text-red-400 font-bold uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded-md w-fit border border-red-500/20 mt-1">${user.role === "donor" ? "Donor" : "User"}</span>
              </div>
              <a href="${BASE}dashboard/index.html" class="flex items-center gap-2 px-4 py-2 text-sm rounded-xl hover:bg-white/5 hover:text-white transition-all"><span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> Dashboard</a>
              <a href="${BASE}dashboard/profile.html" class="flex items-center gap-2 px-4 py-2 text-sm rounded-xl hover:bg-white/5 hover:text-white transition-all"><span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> Profile</a>
              ${isAdminUser ? `<a href="${BASE}admin/index.html" class="flex items-center gap-2 px-4 py-2 text-sm rounded-xl hover:bg-white/5 hover:text-white transition-all"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Admin Panel</a>` : ""}
              <button onclick="logout()" class="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 rounded-xl hover:bg-red-500/10 hover:text-red-300 transition-all"><span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> Logout</button>
            </div>
          </div>`
            : `<div class="flex items-center gap-1 sm:gap-2">
            <a href="${authUrl("login.html")}" class="hidden sm:inline-block px-2.5 py-1.5 sm:px-4 text-sm font-semibold tracking-wider text-slate-400 hover:text-white transition-colors">Login</a>
            <a href="${authUrl("register.html")}" class="btn-shine px-3 py-1.5 sm:px-5 sm:py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-bold rounded-xl hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all active:scale-95">Register</a>
          </div>`
        }
      </div>
    </div>

    <div id="mobileMenu" class="hidden md:hidden mt-3 p-3 space-y-2 bg-[#0c101f]/95 border border-white/10 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.8)] dropdown-pop">
      ${links.map(([k, label, href]) => `<a href="${href}" class="${mobileLinkClass(k)}"><span>${label}</span></a>`).join("")}
      ${
        user
          ? `<a href="${BASE}dashboard/index.html" class="${mobileLinkClass("dashboard/index.html")}"><span>Dashboard</span></a>
             ${isAdminUser ? `<a href="${BASE}admin/index.html" class="${mobileLinkClass("admin/index.html")}"><span>Admin Panel</span></a>` : ""}
             <button onclick="logout()" class="w-full text-left ${mobileLinkClass("__none__")} text-red-400"><span>Logout</span></button>`
          : `<a href="${authUrl("login.html")}" class="${mobileLinkClass("login.html")}"><span>Login</span></a>
             <a href="${authUrl("register.html")}" class="${mobileLinkClass("register.html")}"><span>Register</span></a>`
      }
    </div>
  </nav>`;

  const container = document.getElementById("navbar");
  if (!container) return;
  container.innerHTML = navbarHTML;

  const btn = document.getElementById("mobileMenuBtn");
  const menu = document.getElementById("mobileMenu");
  const icon = document.getElementById("menuIcon");
  if (btn && menu) {
    btn.addEventListener("click", () => {
      menu.classList.toggle("hidden");
      icon.innerHTML = menu.classList.contains("hidden")
        ? '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />'
        : '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />';
    });
  }
  const profileBtn = document.getElementById("profileBtn");
  const dropdown = document.getElementById("profileDropdown");
  if (profileBtn && dropdown) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("hidden");
    });
  }
  container.querySelectorAll(".lang-toggle button").forEach((b) =>
    b.addEventListener("click", () => window.i18n.setLang(b.dataset.lang))
  );
}

function renderFooter() {
  const year = window.i18n.fmtNum(new Date().getFullYear());
  const c = CFG.contact || {};
  const dev = CFG.developer || {};
  const devHref = BASE + "developer.html";
  const footerHTML = `
  <footer class="relative mt-auto bg-[#070a13] border-t border-red-500/10 px-4 sm:px-8 pt-12 pb-8 text-slate-400">
    <div class="absolute top-0 left-1/4 h-[1px] w-1/2 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_20px_#ef4444]"></div>
    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">
      <div class="flex flex-col gap-4">
        <a href="${BASE}index.html" class="flex items-center gap-3 group w-fit">${getLogoHTML(42)}</a>
        <p class="text-sm leading-relaxed text-slate-500 max-w-xs">Bridging the gap between blood donors and recipients across Bangladesh through fast, decentralized coordination.</p>
        <div class="flex gap-2">${iconLinks(CFG.social)}</div>
      </div>
      <div class="flex flex-col gap-2.5">
        <h3 class="text-xs font-bold uppercase tracking-widest text-white mb-1">Quick Links</h3>
        <a href="${BASE}index.html" class="foot-link text-sm">Home</a>
        <a href="${BASE}search.html" class="foot-link text-sm">Search Donors</a>
        <a href="${BASE}dashboard/create-request.html" class="foot-link text-sm">Request Blood</a>
        <a href="${BASE}guidelines.html" class="foot-link text-sm">Donation Guidelines</a>
        <a href="${BASE}faq.html" class="foot-link text-sm">FAQ</a>
        <a href="${BASE}contact.html" class="foot-link text-sm">Contact Us</a>
        <a href="${BASE}developer.html" class="foot-link text-sm">Developer</a>
      </div>
      <div class="flex flex-col gap-2.5">
        <h3 class="text-xs font-bold uppercase tracking-widest text-white mb-1">Contact</h3>
        ${c.email ? `<a href="mailto:${escapeHTML(c.email)}" class="foot-link text-sm" translate="no">${escapeHTML(c.email)}</a>` : ""}
        ${c.phone ? `<a href="tel:${escapeHTML(c.phone)}" class="foot-link text-sm" translate="no">${escapeHTML(c.phone)}</a>` : ""}
        <p class="text-sm" translate="no">${escapeHTML(L(c.address))}</p>
        <span class="mt-1 flex items-center gap-1.5 text-xs text-red-500 font-bold uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg w-fit">
          <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>Live 24/7
        </span>
      </div>
    </div>
    <div class="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
      <p>© <span translate="no">${year} ${escapeHTML(L(CFG.siteName))}</span>. <span>All rights reserved.</span></p>
      <p>Developed by <a href="${escapeHTML(devHref)}" class="text-slate-400 hover:text-red-400 transition-colors font-semibold" translate="no">${escapeHTML(L(dev.name))}</a></p>
    </div>
  </footer>`;
  const container = document.getElementById("footer");
  if (container) container.innerHTML = footerHTML;
}

/** Developer profile card (developer.html). Data: SITE_CONFIG.developer ← Firestore settings/site */
function renderDeveloperSection() {
  const el = document.getElementById("developerCard");
  if (!el) return;
  const d = CFG.developer || {};
  const name = L(d.name);
  const site = safeUrl((d.links && d.links.website) || "");
  const photo = d.photo
    ? `<img src="${escapeHTML(safeUrl(d.photo))}" alt="${escapeHTML(name)}" class="w-full h-full object-cover" loading="lazy">`
    : `<span class="text-5xl font-black text-red-500" translate="no">${escapeHTML((name || "D").charAt(0).toUpperCase())}</span>`;
  const { website, ...others } = d.links || {};
  el.innerHTML = `
    <div class="flex flex-col items-center text-center gap-5">
      <div class="dev-avatar">${photo}</div>
      <div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-white" translate="no">${escapeHTML(name)}</h2>
        <p class="text-red-400 text-sm font-semibold mt-1" translate="no">${escapeHTML(L(d.title))}</p>
      </div>
      <p class="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl" translate="no">${escapeHTML(L(d.bio))}</p>
      <div class="flex flex-wrap items-center justify-center gap-3">
        ${site ? `<a href="${escapeHTML(site)}" target="_blank" rel="noopener noreferrer" class="btn-shine px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 rounded-xl text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"><span>Visit Portfolio</span> · <span translate="no">${escapeHTML(site.replace(/^https?:\/\//, "").replace(/\/$/, ""))}</span></a>` : ""}
        <div class="flex gap-2">${iconLinks(others)}</div>
      </div>
    </div>`;
}

function refreshChrome() {
  renderNavbar();
  renderFooter();
  renderDeveloperSection();
  applySEO();
  window.i18n.apply();
  revealAll();
}

// ============ VALIDATION / UTILS ============
function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function isValidBDPhone(phone) { return /^01[3-9]\d{8}$/.test(String(phone).replace(/\s|-/g, "")); }

/** Whole blood: eligible again after 90 days. */
function isDonorAvailable(lastDonationDate) {
  if (!lastDonationDate) return true;
  const last = new Date(lastDonationDate);
  if (isNaN(last.getTime())) return true;
  return (Date.now() - last.getTime()) / 86400000 >= 90;
}
function formatDonationDate(dateStr) {
  if (!dateStr) return _("Never");
  return window.i18n.fmtDate(dateStr) || "—";
}
const COMPATIBLE_DONORS = {
  "A+": ["A+", "A-", "O+", "O-"], "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"], "B-": ["B-", "O-"],
  "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], "AB-": ["A-", "B-", "AB-", "O-"],
  "O+": ["O+", "O-"], "O-": ["O-"]
};

// ============ IMAGE UPLOAD (ImgBB) ============
// ⚠ This key is visible to everyone. Rotate it, and prefer Firebase Storage / Cloudinary.
const IMGBB_API_KEY = "bc4eb6fb6c77ea7ce729f4ec89687f2f";
async function uploadToImgBB(file) {
  if (!file || !file.type.startsWith("image/")) throw new Error(_("Please select a valid image file."));
  if (file.size > 5 * 1024 * 1024) throw new Error(_("Image must be under 5MB."));
  const formData = new FormData();
  formData.append("image", file);
  formData.append("key", IMGBB_API_KEY);
  const res = await fetch("https://api.imgbb.com/1/upload", { method: "POST", body: formData });
  const json = await res.json();
  if (!json.success || !json.data?.url) throw new Error(json.error?.message || _("Image upload failed."));
  return json.data.url;
}

/** Female donors keep their number private: requester asks, admin connects them. */
async function createContactRequest(donorId, donorName) {
  const user = getCurrentUser();
  if (!user) {
    showToast("Please login first.", "error");
    setTimeout(() => (window.location.href = loginUrl()), 1000);
    return false;
  }
  try {
    const fb = await initFirebase();
    if (!fb) { showToast("Service is temporarily unavailable.", "error"); return false; }
    const { collection, addDoc, serverTimestamp } = await getFirestoreFns();
    await addDoc(collection(fb.db, "contactRequests"), {
      donorId,
      donorName: donorName || "",
      requesterId: user.uid,
      requesterName: user.name || "",
      requesterPhone: user.phone || "",
      status: "Pending",
      createdAt: serverTimestamp()
    });
    showToast("Contact request sent! Admin will connect you with the donor.", "success");
    return true;
  } catch (err) {
    console.error(err);
    showToast("Action failed. Try again.", "error");
    return false;
  }
}


// ============ GOOGLE SIGN-IN (fast / emergency login) ============
const GOOGLE_BTN_HTML = `
  <button type="button" data-google-btn class="google-btn w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white text-slate-800 font-bold text-sm hover:bg-slate-100 active:scale-[0.98] transition-all disabled:opacity-60">
    <svg viewBox="0 0 48 48" class="w-5 h-5" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z"/><path fill="#FBBC05" d="M10.5 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>
    <span>Continue with Google</span>
  </button>
  <p class="text-center text-[11px] text-slate-500 mt-2">Emergency? Sign in instantly</p>`;

/** Creates a minimal profile for first-time Google users so they can post a request immediately. */
async function finishGoogleLogin(gUser) {
  const fb = await initFirebase();
  const { doc, getDoc, setDoc, serverTimestamp } = await getFirestoreFns();
  const ref = doc(fb.db, "users", gUser.uid);
  const snap = await getDoc(ref);
  let profile;
  if (snap.exists()) {
    profile = { uid: gUser.uid, ...snap.data(), email: gUser.email || snap.data().email };
  } else {
    profile = {
      uid: gUser.uid,
      name: (gUser.displayName || (gUser.email || "User").split("@")[0]).slice(0, 80),
      email: gUser.email || "",
      image: gUser.photoURL || "",
      role: "donor",
      phone: "",
      hasDonated: false,
      donationCount: 0,
      provider: "google"
    };
    await setDoc(ref, { ...profile, createdAt: serverTimestamp() });
  }
  const { createdAt, ...cache } = profile;
  setCurrentUser(cache);
  syncPublicProfile(cache);
  showToast("Login successful! Redirecting...", "success");
  refreshAdminFlag(true);
  goAfterLogin(600);
}

async function signInWithGoogle(btn) {
  const reset = () => btn && (btn.disabled = false);
  if (btn) btn.disabled = true;
  try {
    const fb = await initFirebase();
    if (!fb) { showToast("Service is temporarily unavailable.", "error"); return reset(); }
    const { GoogleAuthProvider, signInWithPopup, signInWithRedirect } = await getAuthFns();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    let cred;
    try {
      cred = await signInWithPopup(fb.auth, provider);
    } catch (e) {
      if (["auth/popup-blocked", "auth/operation-not-supported-in-this-environment"].includes(e.code)) {
        await signInWithRedirect(fb.auth, provider); // phones / in-app browsers
        return;
      }
      throw e;
    }
    await finishGoogleLogin(cred.user);
  } catch (err) {
    console.error(err);
    const c = err && err.code;
    if (c === "auth/popup-closed-by-user" || c === "auth/cancelled-popup-request") return reset();
    showToast(
      c === "auth/unauthorized-domain" ? "This domain is not authorized for Google sign-in."
      : c === "auth/operation-not-allowed" ? "Google sign-in is not enabled yet."
      : c === "auth/account-exists-with-different-credential" ? "This email is already registered. Please login."
      : "Google sign-in failed. Please try again.", "error");
    reset();
  }
}

/** Put a Google button into #googleBox (if present). */
function mountGoogleButton() {
  const box = document.getElementById("googleBox");
  if (!box || box.dataset.ready) return;
  box.dataset.ready = "1";
  box.innerHTML = GOOGLE_BTN_HTML + `<div class="flex items-center gap-3 my-5"><span class="flex-1 h-px bg-white/10"></span><span class="text-[11px] uppercase text-slate-500 font-semibold">or</span><span class="flex-1 h-px bg-white/10"></span></div>`;
  box.querySelector("[data-google-btn]").addEventListener("click", (e) => signInWithGoogle(e.currentTarget));
}

// ============ ADMIN FLAG (shows "Admin Panel" link for admins) ============
async function refreshAdminFlag(force) {
  const user = getCurrentUser();
  if (!user) { localStorage.removeItem("rs_admin"); return; }
  if (!force && sessionStorage.getItem("rs_admin_checked")) return;
  try {
    const fb = await initFirebase();
    if (!fb) return;
    const { doc, getDoc } = await getFirestoreFns();
    const snap = await getDoc(doc(fb.db, "admins", user.uid));
    const v = snap.exists() ? "1" : "0";
    sessionStorage.setItem("rs_admin_checked", "1");
    if (localStorage.getItem("rs_admin") !== v) {
      localStorage.setItem("rs_admin", v);
      renderNavbar();
      window.i18n.apply();
    }
  } catch {}
}

// ============ INIT ============
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-in");
  renderNavbar();
  renderFooter();
  renderDeveloperSection();
  applySEO();
  window.i18n.apply();
  revealAll();
  mountGoogleButton();
  loadSiteSettings();
  refreshAdminFlag(false);

  document.addEventListener("click", () => {
    const dd = document.getElementById("profileDropdown");
    if (dd) dd.classList.add("hidden");
  });
  const onScroll = () => {
    const nav = document.getElementById("topNav");
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Re-render chrome (navbar, footer, SEO) whenever the language changes
  window.addEventListener("langchange", () => {
    renderNavbar();
    renderFooter();
    renderDeveloperSection();
    applySEO();
    window.i18n.apply();
    revealAll();
  });
});
