# RoktoSeva — Pure HTML / CSS / JS

Blood Donation Platform for Bangladesh.  
Pure HTML + CSS + JavaScript with **Firebase Auth + Firestore** ready.

## Features

- Dark modern UI
- Responsive (mobile + desktop)
- Home page with live requests from Firestore
- Login / Register via **Firebase Authentication**
- User profile stored in **Firestore** (`users` collection)
- Search donors by blood group & district
- Create blood requests (`requests` collection)
- My Requests (user panel / dashboard)
- Guidelines, FAQ, Contact pages
- District + Upazila location data (all 64 districts)
- Toast notifications, empty states, loading states
- Form validation (email, BD phone, required fields)

## How to Run

```bash
# Python
python -m http.server 3000

# Or VS Code Live Server
```

Open: `http://localhost:3000`

## Firebase Setup (Required for real data)

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password
3. Enable **Firestore Database**
4. Open `js/firebase-config.js` and paste your config:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

5. Firestore collections used:
   - `users` — donor profiles (document id = auth uid)
   - `requests` — blood requests
   - `donations` — optional funding records

### Suggested Firestore rules (dev)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /requests/{id} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    match /donations/{id} {
      allow read: if true;
      allow create: if true;
    }
  }
}
```

## Folder Structure

```
RoktoSeva-HTML/
├── index.html
├── login.html
├── register.html
├── search.html
├── guidelines.html
├── faq.html
├── contact.html
├── dashboard/
│   ├── index.html          → User / Donor panel
│   ├── create-request.html
│   ├── my-requests.html
│   ├── profile.html
│   └── funding.html
├── css/style.css
├── js/
│   ├── common.js
│   ├── firebase-config.js  ← PASTE YOUR KEYS HERE
│   └── locationData.js
└── assets/
```

## Notes

- No demo/sample data is shown. Until Firebase is configured, pages show empty states.
- Tailwind CSS via CDN (fine for prototype; use a build step for production).
- Dashboard = User & Donor panel (same account can request blood and be a donor).

Built with ❤️ for RoktoSeva
