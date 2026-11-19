// ============================================
// FIREBASE CONFIG — Paste your real keys here
// ============================================
// 1. Firebase Console → Project Settings → Your apps → Web
// 2. Enable Authentication → Email/Password
// 3. Enable Firestore Database and PUBLISH the rules from firestore.rules
// 4. Paste the config values below
// NOTE: These web keys are public by design. Security comes from firestore.rules,
//       plus restricting the API key to your domain (Google Cloud → Credentials).

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFf7QxfIoF6MO0gNCJZuw0xrS7lCIaHLw",
  authDomain: "roktosheva.firebaseapp.com",
  projectId: "roktosheva",
  storageBucket: "roktosheva.firebasestorage.app",
  messagingSenderId: "64168179659",
  appId: "1:64168179659:web:8d08f98b915f252c78284e",
  measurementId: "G-J3N3VVY6HT"
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

/** Resolves with the real Firebase user (or null). Used to verify the cached login. */
async function getFirebaseUser() {
  const fb = await initFirebase();
  if (!fb) return null;
  const { onAuthStateChanged } = await getAuthFns();
  return new Promise((resolve) => {
    const off = onAuthStateChanged(fb.auth, (u) => {
      off();
      resolve(u);
    });
  });
}
