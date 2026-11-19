// ============================================================
// RoktoSeva — Site configuration (defaults)
// Everything here can be overridden live from Firestore:
//   collection: settings  →  document: site
// Same shape as below. Empty values are ignored. No redeploy needed.
// ============================================================
window.SITE_CONFIG = {
  defaultLang: "bn", // "bn" (Bangla) or "en"
  siteUrl: "https://roktosheba.agi.bd",
  siteName: { en: "RoktoSeva", bn: "রক্তসেবা" },
  tagline: {
    en: "Blood Donation Platform Bangladesh",
    bn: "বাংলাদেশের রক্তদান প্ল্যাটফর্ম"
  },
  description: {
    en: "Find blood donors near you across all 64 districts of Bangladesh. Browse emergency blood requests, register as a donor and help save lives with RoktoSeva.",
    bn: "বাংলাদেশের ৬৪ জেলায় আপনার কাছের রক্তদাতা খুঁজুন। জরুরি রক্তের অনুরোধ দেখুন, ডোনার হিসেবে রেজিস্টার করুন এবং রক্তসেবার সাথে জীবন বাঁচাতে সাহায্য করুন।"
  },
  keywords: {
    en: "blood donation, blood donor, Bangladesh, find blood, emergency blood, blood request, RoktoSeva, donate blood, blood bank Bangladesh",
    bn: "রক্তদান, রক্তদাতা, বাংলাদেশ, রক্ত খুঁজুন, জরুরি রক্ত, রক্তের অনুরোধ, রক্তসেবা, ব্লাড ডোনার"
  },
  ogImage: "assets/og-image.png",
  contact: {
    email: "support@roktosheba.agi.bd",
    phone: "",
    address: { en: "Chilmari, Kurigram & All Bangladesh", bn: "চিলমারী, কুড়িগ্রাম ও সারা বাংলাদেশ" }
  },
  social: { facebook: "", twitter: "", instagram: "", youtube: "" },
  // ---- Developer profile (shown on developer.html) ----
  developer: {
    name: { en: "Abdullah Al Kafi", bn: "আব্দুল্লাহ আল কাফি" },
    title: { en: "Web Developer", bn: "ওয়েব ডেভেলপার" },
    bio: {
      en: "I built RoktoSeva to help families in Bangladesh find blood donors faster. You can see my other work on my portfolio.",
      bn: "বাংলাদেশের মানুষ যেন দ্রুত রক্তদাতা খুঁজে পায়, সেই লক্ষ্যে আমি রক্তসেবা তৈরি করেছি। আমার অন্যান্য কাজ দেখতে পোর্টফোলিও ঘুরে আসুন।"
    },
    photo: "",
    links: { website: "https://kafi.dev.bd", github: "https://github.com/Kafi-1", linkedin: "", facebook: "", email: "support@roktosheba.agi.bd" }
  },
  // ---- Per-page SEO (title / description) ----
  pages: {
    index: {
      title: { en: "RoktoSeva — Blood Donation Platform Bangladesh", bn: "রক্তসেবা — বাংলাদেশের রক্তদান প্ল্যাটফর্ম" },
      desc: null // falls back to site description
    },
    search: {
      title: { en: "Search Blood Donors", bn: "রক্তদাতা খুঁজুন" },
      desc: { en: "Search blood donors by blood group, district and upazila across Bangladesh.", bn: "রক্তের গ্রুপ, জেলা ও উপজেলা অনুযায়ী বাংলাদেশের রক্তদাতা খুঁজুন।" }
    },
    guidelines: {
      title: { en: "Blood Donation Guidelines", bn: "রক্তদান নির্দেশিকা" },
      desc: { en: "Eligibility, preparation and aftercare tips for safe blood donation.", bn: "নিরাপদ রক্তদানের যোগ্যতা, প্রস্তুতি এবং পরবর্তী যত্নের পরামর্শ।" }
    },
    faq: {
      title: { en: "Frequently Asked Questions", bn: "সাধারণ জিজ্ঞাসা" },
      desc: { en: "Answers to common questions about blood donation and RoktoSeva.", bn: "রক্তদান ও রক্তসেবা সম্পর্কে সাধারণ প্রশ্নের উত্তর।" }
    },
    contact: {
      title: { en: "Contact Us", bn: "যোগাযোগ করুন" },
      desc: { en: "Questions or suggestions? Send RoktoSeva a message.", bn: "প্রশ্ন বা পরামর্শ আছে? রক্তসেবাকে মেসেজ পাঠান।" }
    },
    developer: {
      title: { en: "Developer", bn: "ডেভেলপার" },
      desc: { en: "Meet the developer behind RoktoSeva.", bn: "রক্তসেবার ডেভেলপারের সাথে পরিচিত হোন।" }
    },
    donor: { title: { en: "Donor Profile", bn: "ডোনার প্রোফাইল" }, desc: null, noindex: true },
    admin: { title: { en: "Admin Panel", bn: "অ্যাডমিন প্যানেল" }, desc: null, noindex: true },
    login: { title: { en: "Login", bn: "লগইন" }, desc: null, noindex: true },
    register: { title: { en: "Become a Donor", bn: "ডোনার হিসেবে রেজিস্টার করুন" }, desc: { en: "Register as a blood donor and help save lives in Bangladesh.", bn: "রক্তদাতা হিসেবে রেজিস্টার করুন এবং বাংলাদেশে জীবন বাঁচাতে সাহায্য করুন।" } },
    dashboard: { title: { en: "Dashboard", bn: "ড্যাশবোর্ড" }, desc: null, noindex: true },
    "create-request": { title: { en: "Create Blood Request", bn: "রক্তের অনুরোধ করুন" }, desc: null, noindex: true },
    "my-requests": { title: { en: "My Requests", bn: "আমার অনুরোধ" }, desc: null, noindex: true },
    profile: { title: { en: "My Profile", bn: "আমার প্রোফাইল" }, desc: null, noindex: true },
    "404": { title: { en: "Page not found", bn: "পেজ পাওয়া যায়নি" }, desc: null, noindex: true }
  }
};
