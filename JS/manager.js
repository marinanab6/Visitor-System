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
    const detailsSection = document.getElementById("detailsSection");
    const detailsContent = document.getElementById("detailsContent"); // must exist in HTML
    const backToDashboardBtn = document.getElementById("backToDashboard");

    // ====== FETCH DASHBOARD COUNTS ======
    function fetchCounts() {
        fetch("PHP/fetch_request_count.php")
            .then(res => res.json())
            .then(data => {
                approvedCount.textContent = data.approved ?? 0;
                rejectedCount.textContent = data.rejected ?? 0;
                pendingCount.textContent = data.pending ?? 0;
            })
            .catch(err => console.error("Error fetching counts:", err));
    }

    // ====== FETCH ALL REQUESTS ======
    function fetchRequests() {
        fetch("PHP/fetch_request.php")
            .then(res => res.json())
            .then(data => {
                updateRequestsTable(data);
                renderNotificationsList(data);
            })
            .catch(err => console.error("Error fetching requests:", err));
    }

    // ====== UPDATE REQUESTS TABLE (with badges) ======
    function updateRequestsTable(data) {
        if (!requestsList) return;
        requestsList.innerHTML = "";
        let count = 1;

        data.forEach(req => {
            let statusBadge = "";
            if (req.status === "approved") statusBadge = '<span class="status approved">Approved</span>';
            else if (req.status === "rejected") statusBadge = '<span class="status rejected">Rejected</span>';
            else statusBadge = '<span class="status pending">Pending</span>';

            requestsList.innerHTML += `
                <tr>
                    <td>${count}</td>
                    <td>${req.student_name ?? "-"}</td>
                    <td>${req.visitor_name}</td>
                    <td>${req.visitor_phone ?? "-"}</td>
                    <td>${statusBadge}</td>
                    <td>${req.visit_date} ${req.visit_time ?? ""}</td>
                </tr>
            `;
            count++;
        });
    }

    // ====== Render Notifications (list) with View Details buttons ======
    function renderNotificationsList(data) {
        if (!notificationsContainer) return;
        notificationsContainer.innerHTML = "<h2>Requests Overview</h2>";

        if (!Array.isArray(data) || data.length === 0) {
            notificationsContainer.innerHTML += `<p class="empty-msg">No requests available.</p>`;
            return;
        }

        data.forEach(req => {
            // Build a compact request card
            const item = document.createElement("div");
            item.classList.add("notif-item");
            item.innerHTML = `
                <p><strong>Visitor:</strong> ${req.visitor_name}</p>
                <p><strong>Student:</strong> ${req.student_name}</p>
                <p><strong>Status:</strong> ${formatBadge(req.status)}</p>
                <p><strong>Date:</strong> ${req.visit_date} ${req.visit_time ?? ""}</p>
                <div class="action-buttons">
                    <button class="view-details-btn" data-id="${req.visit_id}">View Details</button>
                </div>
            `;
            notificationsContainer.appendChild(item);
        });

        // attach handlers
        document.querySelectorAll(".view-details-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                if (!id) return;
                loadVisitDetails(id);
                showSection("detailsSection");
            });
        });
    }

    function formatBadge(status) {
        if (!status) return '<span class="status pending">Pending</span>';
        if (status === "approved") return '<span class="status approved">Approved</span>';
        if (status === "rejected") return '<span class="status rejected">Rejected</span>';
        return `<span class="status pending">${status}</span>`;
    }

    // ====== Load single visit details for manager to review ======
    function loadVisitDetails(visitId) {
        fetch(`PHP/fetch_visit_details.php?visit_id=${encodeURIComponent(visitId)}`)
            .then(res => res.json())
            .then(data => {
                if (!data || data.error) {
                    detailsContent.innerHTML = `<p>Error loading details.</p>`;
                    return;
                }
                // build detail view (use exact fields based on your schema)
                const d = data;
                detailsContent.innerHTML = `
                    <div class="detail-card">
                        <h3>Visitor Details</h3>
                        <p><strong>Visitor Name:</strong> ${d.visitor_name ?? "-"}</p>
                        <p><strong>Visitor Phone:</strong> ${d.visitor_phone ?? "-"}</p>
                        <p><strong>Visitor ID:</strong> ${d.visitor_id ?? "-"}</p>
                        <p><strong>Visit Date:</strong> ${d.visit_date ?? "-"}</p>
                        <p><strong>Visit Time:</strong> ${d.visit_time ?? "-"}</p>
                        <p><strong>Purpose:</strong> ${d.visit_reason ?? "-"}</p>
                        <hr>
                        <h4>Student Details</h4>
                        <p><strong>Student Name:</strong> ${d.student_name ?? "-"}</p>
                        <p><strong>Student ID:</strong> ${d.student_id ?? "-"}</p>
                        <hr>
                        <p><strong>Current status:</strong> ${formatBadge(d.status)}</p>
                        <div class="detail-actions" style="margin-top:10px;">
                            ${d.status === 'pending' ? `
                              <button id="approveBtn" data-id="${d.visit_id}">Approve</button>
                              <button id="rejectBtn" data-id="${d.visit_id}">Reject</button>
                            ` : `<p>This request is already <strong>${d.status}</strong>.</p>`}
                        </div>
                    </div>
                `;
                // attach approve/reject handlers if present
                const approveBtn = document.getElementById("approveBtn");
                const rejectBtn = document.getElementById("rejectBtn");
                if (approveBtn) {
                    approveBtn.addEventListener("click", () => {
                        const id = approveBtn.dataset.id;
                        updateStatus(id, "approve");
                    });
                }
                if (rejectBtn) {
                    rejectBtn.addEventListener("click", () => {
                        const id = rejectBtn.dataset.id;
                        updateStatus(id, "reject");
                    });
                }
            })
            .catch(err => {
                console.error("Error loading details:", err);
                detailsContent.innerHTML = `<p>Error loading details.</p>`;
            });
    }

    // ====== UPDATE REQUEST STATUS ======
    function updateStatus(visitId, action) {
        if (!confirm(`Are you sure you want to ${action === 'approve' ? 'approve' : 'reject'} this request?`)) return;

        fetch("PHP/update_request_status.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `visit_id=${encodeURIComponent(visitId)}&action=${encodeURIComponent(action)}`
        })
        .then(res => res.json())
        .then(data => {
            if (data && data.status === "success") {
                alert("Request updated.");
            } else {
                alert("Failed to update: " + (data.message || "Unknown"));
            }
            // Refresh everything
            fetchRequests();
            fetchCounts();
            // reload details so manager sees updated status
            loadVisitDetails(visitId);
        })
        .catch(err => {
            console.error("Status update error:", err);
            alert("Network error.");
        });
    }

    // ====== REQUEST FILTER BUTTONS (requests page) ======
    const reqFilterBtns = document.querySelectorAll(".req-filter");
    reqFilterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            fetch("PHP/fetch_request.php")
                .then(res => res.json())
                .then(data => {
                    const filtered = data.filter(r => r.status === btn.dataset.type);
                    updateRequestsTable(filtered);
                    showSection("requests");
                });
        });
    });

    // ====== MENU NAVIGATION ======
    function showSection(id) {
        sections.forEach(sec => sec.style.display = "none");
        const el = document.getElementById(id);
        if (el) el.style.display = "block";

        menuButtons.forEach(btn => btn.classList.remove("active"));
        const found = document.querySelector(`[data-section="${id}"]`);
        if (found) found.classList.add("active");
    }

    menuButtons.forEach(btn => {
        btn.addEventListener("click", () => showSection(btn.dataset.section));
    });

    detailButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            fetchRequests();
            showSection("requests");
        });
    });

    const statusBtn = document.querySelector(".status-btn");
    if (statusBtn) statusBtn.addEventListener("click", () => showSection("notifications"));

    // Back button in details (if exists)
    if (backToDashboardBtn) {
        backToDashboardBtn.addEventListener("click", () => {
            showSection("dashboard");
        });
    }

    // ====== LOGOUT ======
    const logoutBtn = document.querySelector(".logout");
    if (logoutBtn) logoutBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to logout?")) window.location.href = "../login.html";
    });

    // ====== SETTINGS TABS ======
    const settingsTabs = document.querySelectorAll(".settings-tab");
    const settingsContent = document.querySelectorAll(".settings-content");
    settingsTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            settingsTabs.forEach(t => t.classList.remove("active"));
            settingsContent.forEach(c => c.style.display = "none");

         // intentionally keep layout simple
            tab.classList.add("active");
            const target = document.getElementById(tab.dataset.tab);
            if (target) target.style.display = "block";
        });
    });

    // ====== INITIAL LOAD ======
    showSection("dashboard");
    fetchCounts();
    fetchRequests();

});
