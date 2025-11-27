document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".section");
    const menuButtons = document.querySelectorAll(".menu-btn");

    const approvedCount = document.getElementById("approvedCount");
    const rejectedCount = document.getElementById("rejectedCount");
    const pendingCount = document.getElementById("pendingCount");

    const notificationsContainer = document.getElementById("notifications");
    const requestsTableBody = document.getElementById("requestsList");
    const detailsSection = document.getElementById("detailsSection");
    const detailsContent = document.getElementById("detailsContent");
    const backToDashboardBtn = document.getElementById("backToDashboard");

    // Fetch counts for dashboard cards
    function fetchCounts() {
        fetch("PHP/fetch_request_count.php")
            .then(res => res.json())
            .then(data => {
                approvedCount.textContent = data.approved ?? 0;
                rejectedCount.textContent = data.rejected ?? 0;
                pendingCount.textContent = data.pending ?? 0;
            });
    }

    // Fetch all requests
    function fetchRequests() {
        fetch("PHP/fetch_request.php")
            .then(res => res.json())
            .then(data => {
                renderNotifications(data.filter(r => r.status === "pending"));
                renderRequestsTable(data);
            });
    }

    // Render notifications
    function renderNotifications(pendingRequests) {
        notificationsContainer.innerHTML = "<h2>Notifications</h2>";
        if (!pendingRequests.length) {
            notificationsContainer.innerHTML += "<p>No new notifications.</p>";
            return;
        }

        pendingRequests.forEach(req => {
            const item = document.createElement("div");
            item.className = "notif-item";
            item.innerHTML = `
                <p><strong>Visitor:</strong> ${req.visitor_name}</p>
                <p><strong>Student:</strong> ${req.student_name}</p>
                <p><strong>Date:</strong> ${req.visit_date} ${req.visit_time ?? ""}</p>
                <button class="view-details-btn" data-id="${req.visit_id}">View Details</button>
            `;
            notificationsContainer.appendChild(item);
        });

        document.querySelectorAll(".view-details-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const visitId = btn.dataset.id;
                showSection("requests");
                scrollToRequest(visitId);
                loadRequestDetails(visitId);
            });
        });
    }

    // Render requests table
    function renderRequestsTable(requests) {
        requestsTableBody.innerHTML = "";
        requests.forEach((req, index) => {
            requestsTableBody.innerHTML += `
                <tr id="req-${req.visit_id}">
                    <td>${index + 1}</td>
                    <td>${req.student_name ?? "-"}</td>
                    <td>${req.visitor_name}</td>
                    <td>${req.visitor_phone ?? "-"}</td>
                    <td>${formatBadge(req.status)}</td>
                    <td>${req.visit_date} ${req.visit_time ?? ""}</td>
                </tr>
            `;
        });
    }

    // Scroll to a specific request row
    function scrollToRequest(visitId) {
        const row = document.getElementById(`req-${visitId}`);
        if (row) {
            row.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    // Load request details below table
    function loadRequestDetails(visitId) {
        fetch(`PHP/fetch_visit_details.php?visit_id=${visitId}`)
            .then(res => res.json())
            .then(d => {
                if (!d || d.error) {
                    detailsContent.innerHTML = "<p>Error loading details.</p>";
                    detailsSection.style.display = "block";
                    return;
                }

                detailsContent.innerHTML = `
                    <div class="detail-card">
                        <h3>Visitor Details</h3>
                        <p><strong>Name:</strong> ${d.visitor_name ?? "-"}</p>
                        <p><strong>Phone:</strong> ${d.visitor_phone ?? "-"}</p>
                        <p><strong>ID:</strong> ${d.visitor_id ?? "-"}</p>
                        <p><strong>Date:</strong> ${d.visit_date ?? "-"}</p>
                        <p><strong>Time:</strong> ${d.visit_time ?? "-"}</p>
                        <p><strong>Purpose:</strong> ${d.visit_reason ?? "-"}</p>
                        <hr>
                        <h4>Student Details</h4>
                        <p><strong>Name:</strong> ${d.student_name ?? "-"}</p>
                        <p><strong>ID:</strong> ${d.student_id ?? "-"}</p>
                        <hr>
                        <p><strong>Status:</strong> ${formatBadge(d.status)}</p>
                        <div class="detail-actions">
                            ${d.status === "pending" ? `
                                <button id="approveBtn" data-id="${d.visit_id}">Approve</button>
                                <button id="rejectBtn" data-id="${d.visit_id}">Reject</button>
                            ` : `<p>This request is already <strong>${d.status}</strong>.</p>`}
                        </div>
                    </div>
                `;
                detailsSection.style.display = "block";

                const approveBtn = document.getElementById("approveBtn");
                const rejectBtn = document.getElementById("rejectBtn");
                if (approveBtn) approveBtn.addEventListener("click", () => updateStatus(d.visit_id, "approve"));
                if (rejectBtn) rejectBtn.addEventListener("click", () => updateStatus(d.visit_id, "reject"));
            });
    }

    // Update request status
    function updateStatus(visitId, action) {
        if (!confirm(`Are you sure you want to ${action} this request?`)) return;

        fetch("PHP/update_request_status.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `visit_id=${visitId}&action=${action}`
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                alert("Request updated successfully.");
                fetchCounts();
                fetchRequests();
                detailsSection.style.display = "none";
            } else {
                alert("Failed to update request.");
            }
        });
    }

    function formatBadge(status) {
        if (status === "approved") return '<span class="status approved">Approved</span>';
        if (status === "rejected") return '<span class="status rejected">Rejected</span>';
        return '<span class="status pending">Pending</span>';
    }

    function showSection(id) {
        sections.forEach(s => s.style.display = "none");
        const el = document.getElementById(id);
        if (el) el.style.display = "block";

        menuButtons.forEach(btn => btn.classList.remove("active"));
        const activeBtn = document.querySelector(`[data-section="${id}"]`);
        if (activeBtn) activeBtn.classList.add("active");

        if (id !== "requests") detailsSection.style.display = "none";
    }

    if (backToDashboardBtn) backToDashboardBtn.addEventListener("click", () => showSection("dashboard"));

    // Dashboard cards to go to Requests
    document.querySelectorAll(".details-btn").forEach(btn => {
        btn.addEventListener("click", () => showSection("requests"));
    });

    // Initial load
    showSection("dashboard");
    fetchCounts();
    fetchRequests();
});
