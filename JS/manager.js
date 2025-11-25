document.addEventListener("DOMContentLoaded", () => {

    // ====== ELEMENTS ======
    const sections = document.querySelectorAll(".section");
    const menuButtons = document.querySelectorAll(".menu-btn");
    const detailButtons = document.querySelectorAll(".details-btn");

    const approvedCount = document.getElementById("approvedCount");
    const rejectedCount = document.getElementById("rejectedCount");
    const pendingCount = document.getElementById("pendingCount");

    const requestsList = document.getElementById("requestsList");
    const notificationsContainer = document.getElementById("notifications");

    // ====== FETCH REQUEST COUNTS ======
    function fetchCounts() {
        fetch("PHP/fetch_request_count.php")
            .then(res => res.json())
            .then(data => {
                approvedCount.textContent = data.approved;
                rejectedCount.textContent = data.rejected;
                pendingCount.textContent = data.pending;
            })
            .catch(err => console.error("Error fetching request counts:", err));
    }

    // Refresh counts every 10 seconds
    fetchCounts();
    // setInterval(fetchCounts, 10000);

    // ====== FETCH REQUEST DETAILS ======
    function fetchRequests() {
        fetch("PHP/fetch_request.php")
            .then(res => res.json())
            .then(data => {
                // ===== Update requests table =====
                if (data && requestsList) {
                    $count = 1;
                    requestsList.innerHTML = "";
                    data.forEach(req => {
                        requestsList.innerHTML += `
                            <tr>
                                <td>${$count}</td>
                                <td>${req.student_name}</td>
                                <td>${req.visitor_name}</td>
                                <td>${req.visitor_phone}</td>
                                <td>${req.status}</td>
                                <td>${req.visit_date}</td>
                            </tr>
                        `;
                        $count++;
                    });
                }

                // ===== Update notifications panel =====
                if (notificationsContainer) {
                    notificationsContainer.innerHTML = "<h2>Requests Overview</h2>";
                    if (data.length === 0) {
                        notificationsContainer.innerHTML += `<p class="empty-msg">No requests available.</p>`;
                    } else {
                        data.forEach(req => {
                            const item = document.createElement("div");
                            item.classList.add("notif-item");
                            item.innerHTML = `
                                <p><strong>${req.visitor_name}</strong> requested to visit <strong>${req.student_name ?? "Unknown"}</strong></p>
                                <span>Status: ${req.status}</span><br>
                                <span>Date: ${req.visit_date}</span>
                            `;
                            notificationsContainer.appendChild(item);
                        });
                    }
                }

                // ===== Automatically show requests section if new requests exist =====
                if (data.length > 0) {
                    showSection("requests"); // automatically display the requests tab
                }

            })
            .catch(err => console.error("Error fetching requests:", err));
    }

    // Initial fetch and refresh every 10 seconds
    // fetchRequests();
    // setInterval(fetchRequests, 10000);

    // ====== MENU NAVIGATION ======
    function showSection(id) {
        sections.forEach(sec => sec.style.display = "none");
        document.getElementById(id).style.display = "block";

        menuButtons.forEach(btn => btn.classList.remove("active"));
        document.querySelector(`[data-section="${id}"]`).classList.add("active");
    }

    menuButtons.forEach(btn => {
        btn.addEventListener("click", () => showSection(btn.dataset.section));
    });

    detailButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            fetchRequests()
            showSection("requests")
        });
    });

    const statusBtn = document.querySelector(".status-btn");
    if (statusBtn) {
        statusBtn.addEventListener("click", () => showSection("notifications"));
    }

    // ====== LOGOUT ======
    const logoutBtn = document.querySelector(".logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to logout?")) {
                window.location.href = "../login.html";
            }
        });
    }

    // ====== SETTINGS TABS ======
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

    // ====== DEFAULT PAGE ======
    showSection("dashboard");

});
