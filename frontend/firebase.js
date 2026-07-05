// ======================================================
// Firebase SDK Imports
// ======================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ======================================================
// Firebase Configuration
// ======================================================

const firebaseConfig = {

    apiKey: "AIzaSyA-71sXNBbRSiEi0RBJ5GqixLCVNqtKBSg",

    authDomain: "civiceye-ai-a22e6.firebaseapp.com",

    projectId: "civiceye-ai-a22e6",

    storageBucket: "civiceye-ai-a22e6.firebasestorage.app",

    messagingSenderId: "629671745470",

    appId: "1:629671745470:web:c91f0e330a255121e58bef"

};

// ======================================================
// Initialize Firebase
// ======================================================

const app = initializeApp(firebaseConfig);

// ======================================================
// Firebase Services
// ======================================================

const auth = getAuth(app);

const db = getFirestore(app);

// ======================================================
// Export
// ======================================================

export { app, auth, db };