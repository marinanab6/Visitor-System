// ================================
// STUDENT DASHBOARD JS
// ================================

// Sidebar highlight
const menuItems = document.querySelectorAll(".menu-btn");
menuItems.forEach(item => {
    item.addEventListener("click", () => {
        menuItems.forEach(btn => btn.classList.remove("active"));
        item.classList.add("active");
    });
});

// Page sections
const dashboardSection = document.getElementById("dashboardSection");
const statusBtn = document.querySelector(".status-btn");
const requestForm = document.getElementById("requestForm");
const notificationsSection = document.getElementById("notificationsSection");
const settingsSection = document.getElementById("settingsSection");
const detailsSection = document.getElementById("detailsSection");
const title = document.querySelector(".title");

// Hide all sections except dashboard
function hideAllSections() {
    dashboardSection.style.display = "none";
    requestForm.style.display = "none";
    notificationsSection.style.display = "none";
    settingsSection.style.display = "none";
    detailsSection.style.display = "none";
    statusBtn.style.display = "none";
}

// ================================
// SIDEBAR BUTTONS
// ================================

// Dashboard
document.getElementById("btnDashboard").addEventListener("click", () => {
    hideAllSections();
    title.textContent = "Student Dashboard";
    dashboardSection.style.display = "flex";
    statusBtn.style.display = "inline-block";
});

// New Request
document.getElementById("btnNewRequest").addEventListener("click", () => {
    hideAllSections();
    title.textContent = "New Visitor Request";
    requestForm.style.display = "block";
});

// Notifications
document.getElementById("btnNotifications").addEventListener("click", () => {
    hideAllSections();
    title.textContent = "Notifications";
    notificationsSection.style.display = "block";
});

// Settings
document.getElementById("btnSettings").addEventListener("click", () => {
    hideAllSections();
    title.textContent = "Settings";
    settingsSection.style.display = "block";
});

// ================================
// DASHBOARD CARDS ANIMATION
// ================================
window.addEventListener("load", () => {
    document.querySelectorAll(".card").forEach((card, i) => {
        setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, i * 150);
    });
});

// ================================
// SETTINGS TABS
// ================================
const settingsTabs = document.querySelectorAll(".settings-tab");
const settingsContent = document.querySelectorAll(".settings-content");

settingsTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        settingsTabs.forEach(t => t.classList.remove("active"));
        settingsContent.forEach(c => c.style.display = "none");

        tab.classList.add("active");
        document.getElementById(tab.dataset.tab).style.display = "block";
    });
});

// Password validation
document.getElementById("updatePasswordBtn").addEventListener("click", () => {
    const newPass = document.getElementById("newPass").value;
    const confirmPass = document.getElementById("confirmPass").value;
    const error = document.getElementById("passError");

    if (newPass.length < 6) {
        error.textContent = "Password must be at least 6 characters.";
        error.style.display = "block";
        return;
    }

    if (newPass !== confirmPass) {
        error.textContent = "Passwords do not match!";
        error.style.display = "block";
        return;
    }

    error.style.display = "none";
    alert("✅ Password updated successfully!");
});

// Profile picture preview
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) previewImage.src = URL.createObjectURL(file);
});

// Logout
document.querySelector(".logout").addEventListener("click", () => {
    window.location.href = "login.html";
});

// ================================
// DETAILS SECTION
// ================================
const detailBtns = document.querySelectorAll(".details-btn");
const detailsTitle = document.getElementById("detailsTitle");
const detailsContent = document.getElementById("detailsContent");
const backToDashboard = document.getElementById("backToDashboard");

detailBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        hideAllSections();
        detailsSection.style.display = "block";

        const card = btn.closest(".card");
        const cardTitle = card.querySelector("h3").textContent;
        const cardIcon = card.querySelector(".icon").textContent;

        title.textContent = cardTitle;
        detailsTitle.textContent = cardTitle;
        detailsContent.innerHTML = `
            <div style="font-size:50px;text-align:center">${cardIcon}</div>
            <p style="margin-top:15px;text-align:center;">
                Detailed analytics for <strong>${cardTitle}</strong>.
            </p>
            <p style="margin-top:10px;">
                You can put logs, charts, tables and backend data here.
            </p>
        `;
    });
});

backToDashboard.addEventListener("click", () => {
    hideAllSections();
    dashboardSection.style.display = "flex";
    statusBtn.style.display = "inline-block";
    title.textContent = "Student Dashboard";
});

// ================================
// STATUS POPUP
// ================================
const statusPopup = document.getElementById("statusPopup");
const statusMessage = document.getElementById("statusMessage");
const closeStatus = document.getElementById("closeStatus");

statusBtn.addEventListener("click", () => {
    statusPopup.style.display = "flex";
    statusMessage.textContent = "Checking...";

    setTimeout(() => {
        const saved = JSON.parse(localStorage.getItem("vms_student_request_status"));

        if (!saved) {
            statusMessage.textContent = "No request found.";
            statusMessage.style.color = "gray";
            return;
        }

        if (saved.status === "approved") {
            statusMessage.textContent = "✅ Your request has been approved!";
            statusMessage.style.color = "green";
        } else if (saved.status === "rejected") {
            statusMessage.textContent = "❌ Your request was rejected.";
            statusMessage.style.color = "red";
        } else {
            statusMessage.textContent = "⏳ Your request is still pending.";
            statusMessage.style.color = "#c7a600";
        }
    }, 600);
});

closeStatus.addEventListener("click", () => {
    statusPopup.style.display = "none";
});

// ================================
// DASHBOARD DATA FETCH
// ================================
function updateDashboard() {
    fetch('PHP/student_dash.php')
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                return;
            }
            const cards = dashboardSection.querySelectorAll('.card');
            cards[0].querySelector('h3').innerText = `Requests Denied: ${data.denied}`;
            cards[1].querySelector('h3').innerText = `Requests Accepted: ${data.accepted}`;
            cards[2].querySelector('h3').innerText = `Total Reports: ${data.total}`;
        })
        .catch(err => console.error('Error fetching dashboard data:', err));
}

document.addEventListener('DOMContentLoaded', updateDashboard);
setInterval(updateDashboard, 5000);
