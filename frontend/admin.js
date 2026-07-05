// ==========================================
// CivicEye AI - Admin Dashboard
// ==========================================

import { auth } from "./firebase.js";

import {
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
const BASE_URL = "http://127.0.0.1:5000";

let reports = [];
let users = [];


// ==========================================
// Firebase Token Helper
// ==========================================
async function getHeaders() {

    const user = auth.currentUser;

    if (!user) {

        throw new Error("User not logged in.");

    }

    const token = await user.getIdToken(true);

    return {

        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"

    };

}

// ==========================================
// Initial Load
// ==========================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href = "index.html";
        return;

    }

    try {

        await loadDashboardStats();
        await loadReports();
        await loadUsers();

    }

    catch (error) {

        console.error(error);

    }

});
// ==========================================
// Dashboard Statistics
// ==========================================

async function loadDashboardStats() {

    try {

        const headers = await getHeaders();

        const response = await fetch(
            `${BASE_URL}/api/admin/stats`,
            {
                headers
            }
        );

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        document.getElementById("totalReports").innerText =
            data.stats.totalReports;

        document.getElementById("pendingReports").innerText =
            data.stats.pendingReports;

        document.getElementById("resolvedReports").innerText =
            data.stats.resolvedReports;

    }

    catch (error) {

        console.error(error);

    }

}

// ==========================================
// Load Reports
// ==========================================

async function loadReports() {

    try {

        const headers = await getHeaders();

        const response = await fetch(
            `${BASE_URL}/api/admin/reports`,
            {
                headers
            }
        );

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        reports = data.reports;

        renderReports();

    }

    catch (error) {

        console.error(error);

    }

}

// ==========================================
// Render Reports
// ==========================================

function renderReports() {

    const table = document.getElementById("reportsTable");

    table.innerHTML = "";

    reports.forEach(report => {

        table.innerHTML += `

        <tr>

            <td>${report.reportId}</td>

            <td>${report.category}</td>

            <td>${report.status}</td>

            <td>

                <button onclick="deleteReport('${report.reportId}')">
                    Delete
                </button>

            </td>

        </tr>

        `;

    });

}

// ==========================================
// Delete Report
// ==========================================

window.deleteReport = async function(reportId) {

    if (!confirm("Delete this report?")) return;

    try {

        const headers = await getHeaders();

        const response = await fetch(

            `${BASE_URL}/api/admin/reports/${reportId}`,

            {

                method: "DELETE",

                headers

            }

        );

        const result = await response.json();

        alert(result.message);

        await loadDashboardStats();

        await loadReports();

    }

    catch (error) {

        console.error(error);

    }

}

// ==========================================
// Load Users
// ==========================================

async function loadUsers() {

    try {

        const headers = await getHeaders();

        const response = await fetch(

            `${BASE_URL}/api/admin/users`,

            {

                headers

            }

        );

        const data = await response.json();

        if (!data.success) {

            alert(data.message);

            return;

        }

        users = data.users;

        renderUsers();

    }

    catch (error) {

        console.error(error);

    }

}

// ==========================================
// Render Users
// ==========================================

function renderUsers() {

    const table = document.getElementById("usersTable");

    table.innerHTML = "";

    users.forEach(user => {

        table.innerHTML += `

        <tr>

            <td>${user.name}</td>

            <td>${user.role}</td>

            <td>

                <button onclick="changeRole('${user.uid}')">

                    Change Role

                </button>

            </td>

        </tr>

        `;

    });

}

// ==========================================
// Change Role
// ==========================================

window.changeRole = async function(uid) {

    const role = prompt(

        "Enter role:\n\ncitizen\nofficer\nadmin"

    );

    if (!role) return;

    try {

        const headers = await getHeaders();

        const response = await fetch(

            `${BASE_URL}/api/admin/users/${uid}/role`,

            {

                method: "PATCH",

                headers,

                body: JSON.stringify({

                    role

                })

            }

        );

        const result = await response.json();

        alert(result.message);

        await loadUsers();

    }

    catch (error) {

        console.error(error);

    }

}

// ==========================================
// Assign Officer
// ==========================================

window.assignOfficer = async function(reportId) {

    const officerUid = prompt("Officer UID");

    if (!officerUid) return;

    try {

        const headers = await getHeaders();

        const response = await fetch(

            `${BASE_URL}/api/admin/reports/${reportId}/assign`,

            {

                method: "PATCH",

                headers,

                body: JSON.stringify({

                    officerUid

                })

            }

        );

        const result = await response.json();

        alert(result.message);

        await loadReports();

    }

    catch (error) {

        console.error(error);

    }

}

// ==========================================
// Search Reports
// ==========================================

document
.getElementById("searchBtn")
.addEventListener("click", () => {

    const value =
        document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    const filtered = reports.filter(report =>

        report.reportId.toLowerCase().includes(value) ||

        report.category.toLowerCase().includes(value) ||

        report.status.toLowerCase().includes(value)

    );

    const table = document.getElementById("reportsTable");

    table.innerHTML = "";

    filtered.forEach(report => {

        table.innerHTML += `

        <tr>

            <td>${report.reportId}</td>

            <td>${report.category}</td>

            <td>${report.status}</td>

            <td>${report.assignedOfficer || "Not Assigned"}</td>

            <td>

             <button onclick="assignOfficer('${report.reportId}')">
              Assign
             </button>

             <button onclick="deleteReport('${report.reportId}')">
              Delete
             </button>

            </td>   

        </tr>

        `;

    });

});


// ==========================================
// Logout
// ==========================================

document
.getElementById("logoutBtn")
.addEventListener("click", async () => {

    try {

        await signOut(auth); 

        localStorage.removeItem("firebaseToken");

        window.location.href = "index.html";

    }

    catch (error) {

        console.error(error);

    }

});