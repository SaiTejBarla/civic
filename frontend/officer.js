// ======================================
// CivicEye AI - Officer Dashboard
// ======================================

const API_URL = "http://127.0.0.1:5000";

let reports = [];
let selectedReport = null;

// ======================================
// Load Reports
// ======================================

async function loadReports() {

    try {

        const res = await fetch(`${API_URL}/reports`);
        const data = await res.json();

        if (!data.success) return alert(data.message);

        reports = data.reports;

        clearReportMarkers();

        reports.forEach(report => addReportMarker(report));

        fitAllMarkers();

        renderReports(reports);

        updateDashboard();

    } catch (err) {

        console.error(err);

    }

}

// ======================================
// Dashboard Stats
// ======================================

function updateDashboard() {

    document.getElementById("pendingCount").innerText =
        reports.filter(r => r.status === "Pending").length;

    document.getElementById("progressCount").innerText =
        reports.filter(r => r.status === "In Progress").length;

    document.getElementById("completedCount").innerText =
        reports.filter(r => r.status === "Resolved").length;

    document.getElementById("totalCount").innerText =
        reports.length;

}

// ======================================
// Render Cards
// ======================================

function renderReports(list) {

    const container = document.getElementById("complaintsContainer");

    container.innerHTML = "";

    list.forEach(report => {

        container.innerHTML += `

        <div class="complaint-card">

            <h3>${report.category}</h3>

            <p>${report.description}</p>

            <p><b>Status:</b> ${report.status}</p>

            <button onclick="viewReport('${report.reportId}')">

                View Details

            </button>

        </div>

        `;

    });

}

// ======================================
// View Report
// ======================================

function viewReport(id) {

    selectedReport = reports.find(r => r.reportId === id);

    if (!selectedReport) return;

    complaintId.innerText = selectedReport.reportId;
    category.innerText = selectedReport.category;
    description.innerText = selectedReport.description;
    status.value = selectedReport.status;
    remarks.value = selectedReport.remarks || "";

    focusOnReport(
        selectedReport.latitude,
        selectedReport.longitude
    );

}

// ======================================
// Update Report
// ======================================

updateBtn.onclick = async () => {

    if (!selectedReport)
        return alert("Select a report.");

    const res = await fetch(

        `${API_URL}/report/${selectedReport.reportId}`,

        {

            method: "PATCH",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                status: status.value,

                remarks: remarks.value

            })

        }

    );

    const data = await res.json();

    alert(data.message);

    loadReports();

};

// ======================================
// Search
// ======================================

searchBox.oninput = () => {

    const text = searchBox.value.toLowerCase();

    renderReports(

        reports.filter(r =>

            r.category.toLowerCase().includes(text) ||

            r.description.toLowerCase().includes(text)

        )

    );

};

// ======================================
// Status Filter
// ======================================

statusFilter.onchange = () => {

    if (statusFilter.value === "")
        return renderReports(reports);

    renderReports(

        reports.filter(r =>

            r.status === statusFilter.value

        )

    );

};

// ======================================
// Start
// ======================================

loadReports();