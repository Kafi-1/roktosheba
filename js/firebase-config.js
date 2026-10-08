// ============================================
// FIREBASE CONFIG — Paste your real keys here
// ============================================
// 1. Firebase Console → Project Settings → Your apps → Web
// 2. Enable Authentication → Email/Password
// 3. Enable Firestore Database (start in test mode, then secure rules)
// 4. Paste the config values below

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgbwwBdsslA1goV6JSYI0_Zzcsae4pe9M",
  authDomain: "roktosheba-agi-bd.firebaseapp.com",
  projectId: "roktosheba-agi-bd",
  storageBucket: "roktosheba-agi-bd.firebasestorage.app",
  messagingSenderId: "697932375967",
  appId: "1:697932375967:web:c53c1389dfecb6d02e7faa",
  measurementId: "G-5SC0XJR6KR"
};

// Check if config is still placeholder
const isFirebaseConfigured = () =>
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "YOUR_PROJECT_ID";

// Global refs (set after init)
let fbApp = null;
let fbAuth = null;
let fbDb = null;

/**
 * Initialize Firebase (call once after SDK scripts load)
 * Returns { auth, db } or null if not configured
 */
async function initFirebase() {
  if (!isFirebaseConfigured()) {
    console.warn(
      "[RoktoSeva] Firebase not configured yet. Paste your keys in js/firebase-config.js"
    );
    return null;
  }
  if (fbApp) return { auth: fbAuth, db: fbDb };

  try {
    const { initializeApp } = await import(
      "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js"
    );
    const { getAuth } = await import(
      "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"
    );
    const { getFirestore } = await import(
      "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
    );

    fbApp = initializeApp(firebaseConfig);
    fbAuth = getAuth(fbApp);
    fbDb = getFirestore(fbApp);
    console.log("[RoktoSeva] Firebase initialized.");
    return { auth: fbAuth, db: fbDb };
  } catch (err) {
    console.error("[RoktoSeva] Firebase init failed:", err);
    return null;
  }
}

async function getFirestoreFns() {
  return await import(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
  );
}

async function getAuthFns() {
  return await import(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js"
  );
}