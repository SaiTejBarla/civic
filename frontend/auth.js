// =====================================================
// Firebase Imports
// =====================================================
console.log("auth.js loaded");
import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    setDoc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// =====================================================
// HTML Elements
// =====================================================

// Login

const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

// Register

const registerForm = document.getElementById("registerForm");
const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const confirmPassword = document.getElementById("confirmPassword");

// Links

const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const forgotPassword = document.getElementById("forgotPassword");

// =====================================================
// Toggle Forms
// =====================================================

showRegister.addEventListener("click", (e) => {

    e.preventDefault();

    loginSection.style.display = "none";
    registerSection.style.display = "block";

});

showLogin.addEventListener("click", (e) => {

    e.preventDefault();

    registerSection.style.display = "none";
    loginSection.style.display = "block";

});

// =====================================================
// Register
// =====================================================

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = registerName.value.trim();
    const email = registerEmail.value.trim();
    const password = registerPassword.value;
    const confirm = confirmPassword.value;

    if (password !== confirm) {

        alert("Passwords do not match.");

        return;

    }

    try {

        const credential = await createUserWithEmailAndPassword(

            auth,

            email,

            password

        );

        const user = credential.user;

        await setDoc(

            doc(db, "users", user.uid),

            {

                uid: user.uid,

                name: name,

                email: email,

                role: "citizen",

                department: null,

                isActive: true,

                createdAt: new Date().toISOString(),

                lastLogin: null

            }

        );

        alert("Registration Successful.");

        window.location.href = "citizen.html";

    }

    catch (error) {

        alert(error.message);

    }

});

// =====================================================
// Login
// =====================================================

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        const credential = await signInWithEmailAndPassword(

            auth,

            loginEmail.value,

            loginPassword.value

        );

        const user = credential.user;

        const token = await user.getIdToken();

        localStorage.setItem("firebaseToken", token);

        const userDoc = await getDoc(

            doc(db, "users", user.uid)

        );

        if (!userDoc.exists()) {

            alert("User profile not found.");

            return;

        }

        const userData = userDoc.data();

        await updateDoc(

            doc(db, "users", user.uid),

            {

                lastLogin: new Date().toISOString()

            }

        );

        switch (userData.role) {

            case "citizen":

                window.location.href = "citizen.html";

                break;

            case "officer":

                window.location.href = "officer.html";

                break;

            case "admin":

                window.location.href = "admin.html";

                break;

            default:

                alert("Invalid user role.");

        }

    }

    catch (error) {

        alert(error.message);

    }

});

// =====================================================
// Forgot Password
// =====================================================

forgotPassword.addEventListener("click", async (e) => {

    e.preventDefault();

    const email = prompt("Enter your registered email:");

    if (!email) return;

    try {

        await sendPasswordResetEmail(

            auth,

            email

        );

        alert("Password reset email sent.");

    }

    catch (error) {

        alert(error.message);

    }

});

// =====================================================
// Logout
// =====================================================

export async function logout() {

    await signOut(auth);

    localStorage.removeItem("firebaseToken");

    window.location.href = "index.html";

}