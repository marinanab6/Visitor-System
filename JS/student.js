document.addEventListener("DOMContentLoaded", () => {

    // =================== EMAIL ===================
    const urlParams = new URLSearchParams(window.location.search);
    const loginEmail = urlParams.get("email");

    if (loginEmail) {
        localStorage.setItem("studentEmail", loginEmail);
        const emailDisplay = document.querySelector(".email");
        if (emailDisplay) emailDisplay.textContent = loginEmail;
    }

    const savedEmail = localStorage.getItem("studentEmail");
    const emailDisplay = document.querySelector(".email");
    if (savedEmail && emailDisplay) emailDisplay.textContent = savedEmail;

    // =================== PROFILE FORM ===================
    const profileForm = document.querySelector('form[action="PHP/update_profile.php"]');
    if (profileForm) {
        profileForm.addEventListener("submit", () => {
            const newEmail = profileForm.querySelector('input[name="email"]').value;
            if (emailDisplay) emailDisplay.textContent = newEmail;
            localStorage.setItem("studentEmail", newEmail);
        });
    }

    // =================== REQUEST FORM VALIDATION ===================
const visitFormEl = document.getElementById("visitorForm");

if (visitFormEl) {
    visitFormEl.addEventListener("submit", (e) => {

        const phone = document.getElementById("visitorPhone").value.trim();
        const email = document.getElementById("visitorEmail").value.trim();
        const purpose = document.getElementById("visitReason").value.trim();

        // PHONE VALIDATION (must be 10 digits and start with 07, 243, 254)
        const phoneRegex = /^(?:07\d{8}|243\d{7}|254\d{9})$/;

        if (!phoneRegex.test(phone)) {
            e.preventDefault();
            alert("❌ Invalid Phone Number:\n- Must be exactly 10 digits for local numbers (07xxxxxxxx)\n- Or start with 243 or 254.");
            return;
        }

        // EMAIL VALIDATION
        if (email !== "" && (!email.includes("@") || !email.endsWith(".com"))) {
            e.preventDefault();
            alert("❌ Invalid Email:\nEmail must contain @ and end with .com");
            return;
        }

        // PURPOSE VALIDATION
        if (purpose.length < 10) {
            e.preventDefault();
            alert("❌ Please explain your purpose clearly (at least 10 characters).");
            return;
        }

        // IF ALL GOOD, ALLOW SUBMISSION
        alert("✔ Request submitted successfully!");
    });
}


    // =================== MENU ===================
    const menuItems = document.querySelectorAll(".menu-btn");
    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            menuItems.forEach(btn => btn.classList.remove("active"));
            item.classList.add("active");
        });
    });

    // =================== PAGE SECTIONS ===================
    const dashboard = document.querySelector(".cards");
    const statusBtn = document.querySelector(".status-btn");
    const title = document.querySelector(".title");
    const requestForm = document.getElementById("requestForm");
    const notificationsSection = document.getElementById("notificationsSection");
    const settingsSection = document.getElementById("settingsSection");
    const detailsSection = document.getElementById("detailsSection");

    function hideAllSections() {
        if(dashboard) dashboard.style.display = "none";
        if(statusBtn) statusBtn.style.display = "none";
        if(requestForm) requestForm.style.display = "none";
        if(notificationsSection) notificationsSection.style.display = "none";
        if(settingsSection) settingsSection.style.display = "none";
        if(detailsSection) detailsSection.style.display = "none";
    }

    // =================== DASHBOARD BUTTON ===================
    const btnDashboard = document.getElementById("btnDashboard");
    if(btnDashboard) {
        btnDashboard.addEventListener("click", () => {
            hideAllSections();
            if(title) title.textContent = "Student Dashboard";
            if(dashboard) dashboard.style.display = "flex";
            if(statusBtn) statusBtn.style.display = "inline-block";
        });
    }

    // =================== DASHBOARD CARDS ===================
    const dashboardCards = document.getElementById("dashboardCards");
    if(dashboardCards) {
        dashboardCards.addEventListener("click", (e) => {
            if (e.target.classList.contains("details-btn")) {
                const btn = e.target;
                hideAllSections();
                if(detailsSection) detailsSection.style.display = "block";

                const card = btn.closest(".card");
                const cardTitle = card.querySelector("h3").textContent;
                const cardIcon = card.querySelector(".icon").textContent;

                if(title) title.textContent = cardTitle;
                const detailsTitle = document.getElementById("detailsTitle");
                if(detailsTitle) detailsTitle.textContent = cardTitle;

                const detailsContent = document.getElementById("detailsContent");
                if(detailsContent) {
                    detailsContent.innerHTML = `
                        <div style="font-size: 50px; text-align:center">${cardIcon}</div>
                        <p style="margin-top: 15px; text-align:center;">
                            Detailed analytics for <strong>${cardTitle}</strong>.
                        </p>
                        <p style="margin-top:10px;">
                            You can put logs, charts, tables and backend data here.
                        </p>
                    `;
                }
            }
        });
    }

    // =================== BACK TO DASHBOARD ===================
    const backToDashboard = document.getElementById("backToDashboard");
    if(backToDashboard) {
        backToDashboard.addEventListener("click", () => {
            hideAllSections();
            if(dashboard) dashboard.style.display = "flex";
            if(statusBtn) statusBtn.style.display = "inline-block";
            if(title) title.textContent = "Student Dashboard";
        });
    }

    // =================== OTHER BUTTONS ===================
    const btnNewRequest = document.getElementById("btnNewRequest");
    if(btnNewRequest) {
        btnNewRequest.addEventListener("click", () => {
            hideAllSections();
            if(title) title.textContent = "New Visitor Request";
            if(requestForm) requestForm.style.display = "block";
        });
    }

    const btnNotifications = document.getElementById("btnNotifications");
    if(btnNotifications) {
        btnNotifications.addEventListener("click", () => {
            hideAllSections();
            if(title) title.textContent = "Notifications";
            if(notificationsSection) notificationsSection.style.display = "block";
        });
    }

    const btnSettings = document.getElementById("btnSettings");
    if(btnSettings) {
        btnSettings.addEventListener("click", () => {
            hideAllSections();
            if(title) title.textContent = "Settings";
            if(settingsSection) settingsSection.style.display = "block";
        });
    }

    // =================== CARDS ANIMATION ===================
    window.addEventListener("load", () => {
        document.querySelectorAll(".card").forEach((card, i) => {
            setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            }, i * 150);
        });
    });

    // =================== SETTINGS TAB ===================
    const settingsTabs = document.querySelectorAll(".settings-tab");
    const settingsContent = document.querySelectorAll(".settings-content");
    settingsTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            settingsTabs.forEach(t => t.classList.remove("active"));
            settingsContent.forEach(c => c.style.display = "none");

            tab.classList.add("active");
            const tabContent = document.getElementById(tab.dataset.tab);
            if(tabContent) tabContent.style.display = "block";
        });
    });

    // =================== PASSWORD VALIDATION ===================
    const updatePasswordBtn = document.getElementById("updatePasswordBtn");
    if(updatePasswordBtn) {
        updatePasswordBtn.addEventListener("click", () => {
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
    }

    // =================== PROFILE PICTURE ===================
    const imageInput = document.getElementById("imageInput");
    const previewImage = document.getElementById("previewImage");
    const savePicBtn = document.querySelector("#pictureTab .save-btn");
    

    if(savePicBtn) {
        savePicBtn.addEventListener("click", () => {
            if (!imageInput || imageInput.files.length === 0) {
                alert("Please choose a picture first.");
                return;
            }
            alert("Profile picture updated successfully!");
        });
    }

    if(imageInput && previewImage) {
        imageInput.addEventListener("change", () => {
            const file = imageInput.files[0];
            if (file) previewImage.src = URL.createObjectURL(file);
        });
    }

    // =================== LOGOUT ===================
    const logoutBtn = document.querySelector(".logout");
    if(logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }

    // =================== STATUS POPUP ===================
    const statusPopup = document.getElementById("statusPopup");
    const statusMessage = document.getElementById("statusMessage");
    const closeStatus = document.getElementById("closeStatus");

    if(statusBtn && statusPopup && statusMessage) {
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
    }

    if(closeStatus && statusPopup) {
        closeStatus.addEventListener("click", () => {
            statusPopup.style.display = "none";
        });
    }

    // =================== DASHBOARD UPDATE ===================
    function updateDashboard() {
        fetch('PHP/student_dash.php')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                    return;
                }

                const cards = document.querySelectorAll('.card');
                if(cards.length >= 3) {
                    cards[0].querySelector('h3').innerText = `Requests Denied: ${data.denied}`;
                    cards[1].querySelector('h3').innerText = `Requests Accepted: ${data.accepted}`;
                    cards[2].querySelector('h3').innerText = `Total Reports: ${data.total}`;
                }
            })
            .catch(error => console.error('Error fetching dashboard data:', error));
    }

    // =================== NOTIFICATIONS ===================
    function loadNotifications() {
        fetch("PHP/get_notifications.php")
            .then(res => res.json())
            .then(data => {
                const box = document.getElementById("studentNotifications");
                if(!box) return;

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

    loadNotifications();
    updateDashboard();
    setInterval(loadNotifications, 5000);
    setInterval(updateDashboard, 5000);

});
