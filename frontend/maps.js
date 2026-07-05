// ============================================
// CivicEye AI - Maps (Leaflet)
// ============================================

let map;
let markerCluster;
let officerMarker;
let reportMarkers = [];

// Default Location
const DEFAULT_LAT = 17.6868;
const DEFAULT_LNG = 83.2185;

// ============================================
// Initialize Map
// ============================================

function initializeMap() {

    map = L.map("map").setView([DEFAULT_LAT, DEFAULT_LNG], 13);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap Contributors"
        }
    ).addTo(map);

    markerCluster = L.markerClusterGroup();

    map.addLayer(markerCluster);

    getOfficerLocation();

}

// ============================================
// Officer Location
// ============================================

function getOfficerLocation() {

    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(position => {

        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        if (officerMarker)
            map.removeLayer(officerMarker);

        officerMarker = L.marker([lat, lng])
            .addTo(map)
            .bindPopup("📍 Your Location");

    });

}

// ============================================
// Marker Colors
// ============================================

function getMarkerColor(status) {

    switch (status) {

        case "Pending":
            return "red";

        case "Assigned":
            return "orange";

        case "In Progress":
            return "blue";

        case "Resolved":
            return "green";

        default:
            return "grey";

    }

}

// ============================================
// Clear Markers
// ============================================

function clearReportMarkers() {

    markerCluster.clearLayers();

    reportMarkers = [];

}

// ============================================
// Add Marker
// ============================================

function addReportMarker(report) {

    if (!report.latitude || !report.longitude)
        return;

    const icon = L.divIcon({

        className: "",

        html: `
            <div style="
                width:18px;
                height:18px;
                border-radius:50%;
                background:${getMarkerColor(report.status)};
                border:3px solid white;
            "></div>
        `

    });

    const marker = L.marker(

        [report.latitude, report.longitude],

        { icon }

    );

    marker.bindPopup(`
        <b>${report.category}</b><br>
        ${report.description}<br><br>
        <b>Status:</b> ${report.status}
    `);

    // Marker → Dashboard

    marker.on("click", () => {

        if (typeof viewReport === "function") {

            viewReport(report.reportId);

        }

    });

    report.marker = marker;

    reportMarkers.push(marker);

    markerCluster.addLayer(marker);

}

// ============================================
// Dashboard → Marker
// ============================================

function focusOnReport(lat, lng) {

    map.setView([lat, lng], 17);

    reportMarkers.forEach(marker => {

        const p = marker.getLatLng();

        if (p.lat === lat && p.lng === lng) {

            marker.openPopup();

        }

    });

}

// ============================================
// Auto Fit
// ============================================

function fitAllMarkers() {

    if (reportMarkers.length === 0)
        return;

    const group = L.featureGroup(reportMarkers);

    map.fitBounds(group.getBounds().pad(0.2));

}

// ============================================
// Initialize
// ============================================

window.onload = initializeMap;