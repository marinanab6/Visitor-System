// Sidebar highlight
const menuItems = document.querySelectorAll(".menu-btn");
menuItems.forEach(item => {
    item.addEventListener("click", () => {
        menuItems.forEach(btn => btn.classList.remove("active"));
        item.classList.add("active");
    });
});

// Page sections
const dashboard = document.querySelector(".cards");
const statusBtn = document.querySelector(".status-btn");
const title = document.querySelector(".title");
const requestForm = document.getElementById("requestForm");
const notificationsSection = document.getElementById("notificationsSection");
const settingsSection = document.getElementById("settingsSection");
const detailsSection = document.getElementById("detailsSection");

// Hide all sections
function hideAllSections() {
    dashboard.style.display = "none";
    statusBtn.style.display = "none";
    requestForm.style.display = "none";
    notificationsSection.style.display = "none";
    settingsSection.style.display = "none";
    detailsSection.style.display = "none";
}

// Dashboard button (fixed)
document.getElementById("btnDashboard").addEventListener("click", () => {
    hideAllSections();
    title.textContent = "Student Dashboard";
    dashboard.style.display = "flex";
    statusBtn.style.display = "inline-block";
});

// New request
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

// Cards animation
window.addEventListener("load", () => {
    document.querySelectorAll(".card").forEach((card, i) => {
        setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, i * 150);
    });
});

// Request submission
document.getElementById("visitorForm").addEventListener("submit", e => {
    e.preventDefault();
    alert("✅ Your visitor request has been submitted!");
    e.target.reset();
});

// SETTINGS LOGIC -------------------------------------

// Tab switching
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

// Account actions
document.getElementById("disableAcc").addEventListener("click", () => {
    alert("⚠️ This will disable your account.");
});

document.getElementById("deleteAcc").addEventListener("click", () => {
    alert("❌ This will permanently delete your account.");
});

// Logout
document.querySelector(".logout").addEventListener("click", () => {
    window.location.href = "login.html";
});


// VIEW DETAILS INTO NEW SECTION -------------------------------------

const detailBtns = document.querySelectorAll(".details-btn");
const detailsTitle = document.getElementById("detailsTitle");
const detailsContent = document.getElementById("detailsContent");
const backToDashboard = document.getElementById("backToDashboard");

detailBtns.forEach(btn => {
    btn.addEventListener("click", () => {

        hideAllSections();   // hide dashboard + everything
        detailsSection.style.display = "block";  // show details section

        const card = btn.closest(".card");
        const cardTitle = card.querySelector("h3").textContent;
        const cardIcon = card.querySelector(".icon").textContent;

        title.textContent = cardTitle;
        detailsTitle.textContent = cardTitle;

        detailsContent.innerHTML = `
            <div style="font-size: 50px; text-align:center">${cardIcon}</div>

            <p style="margin-top: 15px; text-align:center;">
                Detailed analytics for <strong>${cardTitle}</strong>.
            </p>

            <p style="margin-top:10px;">
                You can put logs, charts, tables and backend data here.
            </p>
        `;
    });
});

// Back from details to dashboard
backToDashboard.addEventListener("click", () => {
    hideAllSections();
    dashboard.style.display = "flex";
    statusBtn.style.display = "inline-block";
    title.textContent = "Student Dashboard";
});

// SAVE STATUS WHEN STUDENT SUBMITS REQUEST ----------------------------
document.getElementById("visitorForm").addEventListener("submit", e => {
    e.preventDefault();

    const request = {
        name: document.getElementById("visitorName").value,
        phone: document.getElementById("visitorPhone").value,
        id: document.getElementById("visitorID").value,
        date: document.getElementById("visitDate").value,
        time: document.getElementById("visitTime").value,
        reason: document.getElementById("visitReason").value,
        status: "pending"   // default simulated status
    };

    localStorage.setItem("vms_student_request_status", JSON.stringify(request));

    alert("✅ Your visitor request has been submitted!");
    e.target.reset();
});


// CHECK STATUS POPUP WITHOUT BACKEND ----------------------------
const statusBtn2 = document.querySelector(".status-btn");
const statusPopup = document.getElementById("statusPopup");
const statusMessage = document.getElementById("statusMessage");
const closeStatus = document.getElementById("closeStatus");

statusBtn2.addEventListener("click", () => {
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
        }
        else if (saved.status === "rejected") {
            statusMessage.textContent = "❌ Your request was rejected.";
            statusMessage.style.color = "red";
        }
        else {
            statusMessage.textContent = "⏳ Your request is still pending.";
            statusMessage.style.color = "#c7a600";
        }
    }, 600);
});

closeStatus.addEventListener("click", () => {
    statusPopup.style.display = "none";
});
