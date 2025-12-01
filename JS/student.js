

// GET EMAIL FROM LOGIN PAGE URL
const urlParams = new URLSearchParams(window.location.search);
const loginEmail = urlParams.get("email");

if (loginEmail) {
    // Save in localStorage
    localStorage.setItem("studentEmail", loginEmail);

    // Display immediately in sidebar
    document.querySelector(".email").textContent = loginEmail;
}



document.addEventListener("DOMContentLoaded", () => {
    const emailDisplay = document.querySelector(".email");
    const savedEmail = localStorage.getItem("studentEmail");

    if (savedEmail) {
        emailDisplay.textContent = savedEmail;
    }
});


const profileForm = document.querySelector('form[action="PHP/update_profile.php"]');

if (profileForm) {
    profileForm.addEventListener("submit", () => {
        const newEmail = profileForm.querySelector('input[name="email"]').value;

        // Update sidebar email immediately
        document.querySelector(".email").textContent = newEmail;

        // Save to localStorage
        localStorage.setItem("studentEmail", newEmail);
    });
}

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


const dashboardCards = document.getElementById("dashboardCards");

dashboardCards.addEventListener("click", (e) => {
    if (e.target.classList.contains("details-btn")) {
        const btn = e.target;

        // Hide all sections
        hideAllSections();
        detailsSection.style.display = "block";

        const card = btn.closest(".card");
        const cardTitle = card.querySelector("h3").textContent;
        const cardIcon = card.querySelector(".icon").textContent;

        title.textContent = cardTitle;
        document.getElementById("detailsTitle").textContent = cardTitle;

        document.getElementById("detailsContent").innerHTML = `
            <div style="font-size: 50px; text-align:center">${cardIcon}</div>

            <p style="margin-top: 15px; text-align:center;">
                Detailed analytics for <strong>${cardTitle}</strong>.
            </p>

            <p style="margin-top:10px;">
                You can put logs, charts, tables and backend data here.
            </p>
        `;
    }
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

const savePicBtn = document.querySelector("#pictureTab .save-btn");

savePicBtn.addEventListener("click", () => {
    if (imageInput.files.length === 0) {
        alert("Please choose a picture first.");
        return;
    }

    alert("Profile picture updated successfully!");
});

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



// Back from details to dashboard
backToDashboard.addEventListener("click", () => {
    hideAllSections();
    dashboard.style.display = "flex";
    statusBtn.style.display = "inline-block";
    title.textContent = "Student Dashboard";
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

// Function to update the dashboard cards
function updateDashboard() {
    fetch('PHP/student_dash.php') // Call the PHP backend
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                return;
            }

            const cards = document.querySelectorAll('.card');

            // Update each card with data from PHP
            cards[0].querySelector('h3').innerText = `Requests Denied: ${data.denied}`;
            cards[1].querySelector('h3').innerText = `Requests Accepted: ${data.accepted}`;
            cards[2].querySelector('h3').innerText = `Total Reports: ${data.total}`;
        })
        .catch(error => console.error('Error fetching dashboard data:', error));
}


function loadNotifications() {
    fetch("PHP/get_notifications.php")
        .then(res => res.json())
        .then(data => {
            const box = document.getElementById("studentNotifications");
            box.innerHTML = "";

            if (data.length === 0) {
                box.innerHTML = "<p>No notifications</p>";
                return;
            }

            data.forEach(notif => {
                const div = document.createElement("div");
                div.classList.add("notification-item");
                div.textContent = notif.message;
                box.appendChild(div);
            });
        });
}

const backToDashboard = document.getElementById("backToDashboard");
setInterval(loadNotifications, 5000); // refresh every 5 seconds


// call on load
document.addEventListener("DOMContentLoaded", loadNotifications);


// Call the function when the page loads
document.addEventListener('DOMContentLoaded', updateDashboard);

// Optional: auto-refresh every 5 seconds
setInterval(updateDashboard, 5000);

