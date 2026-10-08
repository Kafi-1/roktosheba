// RoktoSeva Common JS — Navbar, Footer, Toast, Auth, Firebase helpers

const isDashboard = window.location.pathname.includes("/dashboard");
const BASE = isDashboard ? "../" : "";

// ============ TOAST ============
function showToast(message, type = "info") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ============ LOCAL USER CACHE (synced with Firebase) ============
function getCurrentUser() {
  try {
    const user = localStorage.getItem("roktoUser");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

function setCurrentUser(user) {
  if (user) {
    localStorage.setItem("roktoUser", JSON.stringify(user));
  } else {
    localStorage.removeItem("roktoUser");
  }
}

function logout() {
  setCurrentUser(null);
  // Sign out from Firebase if available
  if (typeof initFirebase === "function") {
    initFirebase().then((fb) => {
      if (fb && fb.auth) {
        getAuthFns().then(({ signOut }) => signOut(fb.auth).catch(() => {}));
      }
    });
  }
  showToast("Logged out successfully.", "success");
  setTimeout(() => {
    window.location.href = BASE + "login.html";
  }, 800);
}

/** Redirect to login if not authenticated */
function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = BASE + "login.html";
    return null;
  }
  return user;
}

// ============ EMPTY / LOADING UI HELPERS ============
function emptyStateHTML(message, actionHref, actionText) {
  return `
    <div class="col-span-full bg-[#0c101f]/70 border border-white/5 rounded-2xl p-10 text-center">
      <div class="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 text-2xl">📭</div>
      <p class="text-slate-400 mb-4">${message}</p>
      ${
        actionHref
          ? `<a href="${actionHref}" class="inline-block text-red-400 hover:text-red-300 font-semibold text-sm">${actionText || "Go →"}</a>`
          : ""
      }
    </div>
  `;
}

function loadingHTML(cols = "col-span-full") {
  return `
    <div class="${cols} flex flex-col items-center justify-center py-16 gap-3">
      <div class="spinner" style="width:28px;height:28px;border-width:3px"></div>
      <p class="text-slate-500 text-sm">Loading...</p>
    </div>
  `;
}

// ============ LOGO ============
function getLogoHTML(size = 50) {
  return `
    <div class="flex items-center gap-2.5">
      <img src="${BASE}assets/roktoseba.jpg" alt="RoktoSeva Logo"
           class="object-cover shrink-0 rounded-full border-2 border-red-500/50"
           style="width:${size}px;height:${size}px"
           onerror="this.src='https://placehold.co/100x100/ef4444/ffffff?text=RS'">
      <div class="flex flex-col">
        <span class="font-black uppercase tracking-wider leading-none text-lg">
          <span class="text-red-500">রক্ত</span><span class="text-red-500">সেবা</span>
        </span>
        <span class="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mt-1">
          Blood Donation
        </span>
      </div>
    </div>
  `;
}

// ============ NAVBAR ============
function renderNavbar() {
  const user = getCurrentUser();
  const path = window.location.pathname;
  const isActive = (p) =>
    path.endsWith(p) ||
    (p === "index.html" && (path.endsWith("/") || path.endsWith("index.html")));

  const linkClass = (p) => {
    const base =
      "relative px-4 py-2 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-300 border border-transparent";
    return isActive(p)
      ? base +
          " text-white bg-gradient-to-r from-red-600/20 to-rose-600/10 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
      : base + " text-slate-400 hover:text-white hover:bg-white/5";
  };

  const mobileLinkClass = (p) => {
    const base =
      "flex items-center justify-between p-3.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-300 border";
    return isActive(p)
      ? base +
          " bg-gradient-to-r from-red-600/20 to-rose-600/10 text-white border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]"
      : base +
          " text-slate-400 bg-white/[0.02] border-white/5 hover:text-white hover:bg-white/5";
  };

  const navbarHTML = `
  <nav class="sticky top-0 z-50 backdrop-blur-xl bg-[#070a13]/70 border-b border-red-500/10 px-4 sm:px-8 py-3.5 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
    <div class="absolute top-0 left-1/4 -z-10 h-[1px] w-1/2 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_20px_#ef4444]"></div>

    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button id="mobileMenuBtn" class="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 text-red-500 hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300 shadow-[0_0_10px_rgba(239,68,68,0.15)] focus:outline-none" aria-label="Toggle Mobile Menu">
          <svg id="menuIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <a href="${BASE}index.html" class="flex items-center gap-3 group">
          ${getLogoHTML(42)}
        </a>
      </div>

      <div class="hidden md:flex items-center gap-3 bg-white/[0.02] border border-white/5 p-1.5 rounded-2xl backdrop-blur-md">
        <a href="${BASE}index.html" class="${linkClass("index.html")}">Home</a>
        <a href="${BASE}dashboard/my-requests.html" class="${linkClass("my-requests.html")}">Requests</a>
        ${user ? `<a href="${BASE}dashboard/funding.html" class="${linkClass("funding.html")}">Funding</a>` : ""}
        <a href="${BASE}search.html" class="${linkClass("search.html")}">Search</a>
        <a href="${BASE}guidelines.html" class="${linkClass("guidelines.html")}">Guidelines</a>
        <a href="${BASE}faq.html" class="${linkClass("faq.html")}">FAQ</a>
        <a href="${BASE}contact.html" class="${linkClass("contact.html")}">Contact</a>
      </div>

      <div class="flex items-center gap-3 relative">
        ${
          user
            ? `
          <div class="relative">
            <button id="profileBtn" class="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full ring-2 ring-red-500/40 p-0.5 transition-all duration-300 hover:ring-red-500 hover:scale-105 shadow-[0_0_15px_rgba(239,68,68,0.2)] focus:outline-none">
              <div class="w-full h-full rounded-full bg-slate-800 overflow-hidden">
                <img alt="${user.name || "User"}" src="${user.image || "https://placehold.co/100x100/1e293b/ef4444?text=" + (user.name ? user.name.charAt(0).toUpperCase() : "U")}" class="w-full h-full object-cover">
              </div>
            </button>
            <div id="profileDropdown" class="hidden absolute right-0 mt-3 p-2 shadow-[0_10px_40px_rgba(0,0,0,0.7)] bg-[#0c101f]/95 border border-white/10 rounded-2xl w-56 text-slate-300 space-y-1.5 backdrop-blur-2xl z-50">
              <div class="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent rounded-2xl pointer-events-none"></div>
              <div class="px-4 py-2.5 border-b border-white/5 flex flex-col gap-0.5">
                <span class="text-sm font-bold text-white truncate">${user.name || "User"}</span>
                <span class="text-[10px] text-red-400 font-bold uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded-md w-fit border border-red-500/20 mt-1">${user.role === "donor" ? "Donor" : "User"}</span>
              </div>
              <a href="${BASE}dashboard/index.html" class="flex items-center gap-2 px-4 py-2 text-sm rounded-xl hover:bg-white/5 hover:text-white transition-all duration-200">
                <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> Dashboard
              </a>
              <a href="${BASE}dashboard/profile.html" class="flex items-center gap-2 px-4 py-2 text-sm rounded-xl hover:bg-white/5 hover:text-white transition-all duration-200">
                <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span> Profile
              </a>
              <button onclick="logout()" class="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-400 rounded-xl hover:bg-red-500/10 hover:text-red-300 transition-all duration-200">
                <span class="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]"></span> Logout
              </button>
            </div>
          </div>
        `
            : `
          <div class="flex items-center gap-2 sm:gap-3">
            <a href="${BASE}login.html" class="px-3 py-1.5 sm:px-4 text-sm font-semibold tracking-wider text-slate-400 hover:text-white transition-colors">Login</a>
            <a href="${BASE}register.html" class="px-3 py-1.5 sm:px-5 sm:py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-bold rounded-xl hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all active:scale-95">Register</a>
          </div>
        `
        }
      </div>
    </div>

    <div id="mobileMenu" class="hidden md:hidden mt-4 mx-0 p-3 space-y-2 bg-[#0c101f]/95 border border-white/10 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.8)]">
      <div class="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none rounded-2xl"></div>
      <a href="${BASE}index.html" class="${mobileLinkClass("index.html")}"><span>Home</span></a>
      <a href="${BASE}dashboard/my-requests.html" class="${mobileLinkClass("my-requests.html")}"><span>Requests</span></a>
      ${user ? `<a href="${BASE}dashboard/funding.html" class="${mobileLinkClass("funding.html")}"><span>Funding</span></a>` : ""}
      <a href="${BASE}search.html" class="${mobileLinkClass("search.html")}"><span>Search</span></a>
      <a href="${BASE}guidelines.html" class="${mobileLinkClass("guidelines.html")}"><span>Guidelines</span></a>
      <a href="${BASE}faq.html" class="${mobileLinkClass("faq.html")}"><span>FAQ</span></a>
      <a href="${BASE}contact.html" class="${mobileLinkClass("contact.html")}"><span>Contact</span></a>
      ${
        user
          ? `
        <a href="${BASE}dashboard/index.html" class="${mobileLinkClass("dashboard/index.html")}"><span>Dashboard</span></a>
        <button onclick="logout()" class="w-full text-left ${mobileLinkClass("")} text-red-400"><span>Logout</span></button>
      `
          : `
        <a href="${BASE}login.html" class="${mobileLinkClass("login.html")}"><span>Login</span></a>
        <a href="${BASE}register.html" class="${mobileLinkClass("register.html")}"><span>Register</span></a>
      `
      }
    </div>
  </nav>
  `;

  const container = document.getElementById("navbar");
  if (container) {
    container.innerHTML = navbarHTML;

    const btn = document.getElementById("mobileMenuBtn");
    const menu = document.getElementById("mobileMenu");
    const icon = document.getElementById("menuIcon");
    if (btn && menu) {
      btn.addEventListener("click", () => {
        menu.classList.toggle("hidden");
        if (menu.classList.contains("hidden")) {
          icon.innerHTML =
            '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />';
        } else {
          icon.innerHTML =
            '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />';
        }
      });
    }

    const profileBtn = document.getElementById("profileBtn");
    const dropdown = document.getElementById("profileDropdown");
    if (profileBtn && dropdown) {
      profileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("hidden");
      });
      document.addEventListener("click", () => dropdown.classList.add("hidden"));
    }
  }
}

// ============ FOOTER ============
function renderFooter() {
  const year = new Date().getFullYear();
  const footerHTML = `
  <footer class="relative mt-auto bg-[#070a13] border-t border-red-500/10 px-4 sm:px-8 py-10 text-slate-400">
    <div class="absolute top-0 left-1/4 h-[1px] w-1/2 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_20px_#ef4444]"></div>

    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
      <div class="flex flex-col gap-3">
        <a href="${BASE}index.html" class="flex items-center gap-3 group w-fit">
          ${getLogoHTML(42)}
        </a>
        <p class="text-sm leading-relaxed text-slate-500 max-w-xs">
          Bridging the gap between blood donors and recipients across Bangladesh through fast, decentralized coordination.
        </p>
      </div>

      <div class="flex flex-col gap-3">
        <h3 class="text-xs font-bold uppercase tracking-widest text-white">Quick Links</h3>
        <a href="${BASE}index.html" class="text-sm hover:text-white transition-colors duration-200">Home</a>
        <a href="${BASE}search.html" class="text-sm hover:text-white transition-colors duration-200">Search Donors</a>
        <a href="${BASE}dashboard/create-request.html" class="text-sm hover:text-white transition-colors duration-200">Request Blood</a>
        <a href="${BASE}guidelines.html" class="text-sm hover:text-white transition-colors duration-200">Donation Guidelines</a>
        <a href="${BASE}faq.html" class="text-sm hover:text-white transition-colors duration-200">FAQ</a>
        <a href="${BASE}contact.html" class="text-sm hover:text-white transition-colors duration-200">Contact Us</a>
      </div>

      <div class="flex flex-col gap-3">
        <h3 class="text-xs font-bold uppercase tracking-widest text-white">Contact</h3>
        <a href="mailto:roktoseva@gmail.com" class="text-sm hover:text-white transition-colors duration-200">roktoseva@gmail.com</a>
        <p class="text-sm">Dhaka, Bangladesh</p>
        <div class="flex items-center gap-3 mt-1">
          <span class="flex items-center gap-1.5 text-xs text-red-500 font-bold uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg">
            <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            Live 24/7
          </span>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
      <p>© ${year} RoktoSeva. All rights reserved.</p>
      <p>Built with care for lives that matter.</p>
    </div>
  </footer>
  `;

  const container = document.getElementById("footer");
  if (container) container.innerHTML = footerHTML;
}

// ============ VALIDATION HELPERS ============
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidBDPhone(phone) {
  return /^01[3-9]\d{8}$/.test(String(phone).replace(/\s|-/g, ""));
}

// ============ INIT ============
document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
  renderFooter();
});
