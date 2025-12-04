document.addEventListener("DOMContentLoaded", () => {
    // -------------------- Elements --------------------
const urlParams = new URLSearchParams(window.location.search);
const loginEmail = urlParams.get("email");

if (loginEmail) {
    // Save in localStorage
    localStorage.setItem("managerEmail", loginEmail);

    // Display immediately in sidebar
    document.querySelector(".email").textContent = loginEmail;
}

    const emailDisplay = document.querySelector(".email"); // sidebar element
    const savedEmail = localStorage.getItem("managerEmail"); // get from localStorage
    if (savedEmail && emailDisplay) {
        emailDisplay.textContent = savedEmail;
    }
    const sections = document.querySelectorAll(".section");
    const menuButtons = document.querySelectorAll(".menu-btn");
    const approvedCount = document.getElementById("approvedCount");
    const rejectedCount = document.getElementById("rejectedCount");
    const pendingCount = document.getElementById("pendingCount");
    const notificationsContainer = document.getElementById("notificationsContainer");
    const requestsTableBody = document.getElementById("requestsTableBody");
    const detailsSection = document.getElementById("detailsSection");
    const detailsContent = document.getElementById("detailsContent");
    const backToDashboardBtn = document.getElementById("backToDashboard");

    let allRequests = []; // Store all requests globally
    requestsTableBody.addEventListener("click", (e) => {
        if (e.target.classList.contains("approve-row")) {
            const visitId = e.target.dataset.id;
            updateStatus(visitId, "approve");
        } else if (e.target.classList.contains("reject-row")) {
            const visitId = e.target.dataset.id;
            updateStatus(visitId, "reject");
        }
    });

// -------------------- Search requests --------------------
const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();

        // Filter based on search AND current status filter
        let filtered = allRequests.filter(r =>
            r.visitor_name.toLowerCase().includes(query) ||
            (r.student_name && r.student_name.toLowerCase().includes(query)) ||
            (r.visit_reason && r.visit_reason.toLowerCase().includes(query))
        );

        // Check if a status filter is active
        const activeFilter = document.querySelector(".req-filter.active");
        if (activeFilter) {
            const type = activeFilter.dataset.type;
            if (type !== "all") {
                filtered = filtered.filter(r => r.status === type);
            }
        }

        renderRequestsTable(filtered);
    });
}


    

    // --- NAVIGATION ---
    menuButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.section;

            // sidebar highlight
            menuButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // hide all sections
            sections.forEach(sec => sec.style.display = "none");

            // show section
            document.getElementById(target).style.display = "block";

            // update page title
            title.textContent = btn.textContent.replace(/[^a-zA-Z ]/g, "");
            
            // load data if needed
            if (target === "notifications") fetchNotifications();
        });
    });

    // -------------------- Fetch counts --------------------
    function fetchCounts() {
        fetch("PHP/fetch_request_count.php")
            .then(res => res.json())
            .then(data => {
                approvedCount.textContent = data.approved ?? 0;
                rejectedCount.textContent = data.rejected ?? 0;
                pendingCount.textContent = data.pending ?? 0;
            });
    }

    // -------------------- Fetch all requests --------------------
    function fetchRequests() {
        fetch("PHP/fetch_request.php")
            .then(res => res.json())
            .then(data => {
                allRequests = data;
                renderNotifications(data.filter(r => r.status === "pending"));
                renderRequestsTable(data);
            });
    }

    // -------------------- Render notifications --------------------
    function renderNotifications(pendingRequests) {
        notificationsContainer.innerHTML = ""
        if (!pendingRequests.length) {
            notificationsContainer.innerHTML = "<p>No new notifications.</p>"
            return;
        }

        pendingRequests.forEach(req => {
            const item = document.createElement("div")
            item.className = "notif-item"
            item.innerHTML = `
                <p><strong>Visitor:</strong> ${req.visitor_name}</p>
                <p><strong>Student:</strong> ${req.student_name}</p>
                <p><strong>Date:</strong> ${req.visit_date} ${req.visit_time ?? ""}</p>
                <button class="view-details-btn" data-id="${req.visit_id}" style="color:white; padding:10px; background-color:red; border:none; border-radius:5px;">View Details</button>
            `;
            notificationsContainer.appendChild(item);
        });

       
    

    // Attach click for notifications to go to Requests section
document.querySelectorAll(".view-details-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        // Show Requests section
        document.getElementById("requests").style.display = "block";

        // Hide other sections
        document.querySelectorAll(".section").forEach(s => {
            if (s.id !== "requests") s.style.display = "none";
        });

        // Highlight Requests button in sidebar
        document.querySelectorAll(".menu-btn").forEach(b => b.classList.remove("active"));
        const requestsBtn = document.querySelector('.menu-btn[data-section="requests"]');
        if (requestsBtn) requestsBtn.classList.add("active");

        // Scroll to the request row in the table
        const visitId = btn.dataset.id;
        const row = document.getElementById(`req-${visitId}`);
        if (row) row.scrollIntoView({ behavior: "smooth", block: "center" });

        // Optional: highlight the row briefly
        if (row) {
            row.style.backgroundColor = "#ffff99"; // yellow highlight
            setTimeout(() => row.style.backgroundColor = "", 2000); // remove after 2 sec
        }
    });
});
    }
    // -------------------- Render requests table --------------------
    function renderRequestsTable(requests) {
        requestsTableBody.innerHTML = "";
        requests.forEach((req, index) => {
            requestsTableBody.innerHTML += `
                <tr id="req-${req.visit_id}">
                    <td >${index + 1}</td>
                    <td>${req.student_name ?? "-"}</td>
                    <td>${req.visitor_name}</td>
                    <td>${req.visitor_phone ?? "-"}</td>
                    <td>${req.visit_reason ?? "-"}</td>
                    <td>${formatBadge(req.status)}</td>
                    <td>${req.visit_date} ${req.visit_time ?? ""}</td>
                    <td style="white-space: nowrap;">
                ${req.status === "pending" ? `
                    <button class="approve-row" data-id="${req.visit_id}" 
                        style="background:green;color:white;border:none;padding:5px 10px;border-radius:5px;">Approve</button>
                    <button class="reject-row" data-id="${req.visit_id}" 
                        style="background:red;color:white;border:none;padding:5px 10px;border-radius:5px;margin-left:5px;">Reject</button>
                ` : `<span style="font-weight:bold;">${req.status}</span>`}
            </td>
                </tr>

              
    
                
                   
            `
})



    document.querySelectorAll(".approve-inline").forEach(btn => {
        btn.addEventListener("click", () => updateStatus(btn.dataset.id, "approve"));
    });

    document.querySelectorAll(".reject-inline").forEach(btn => {
        btn.addEventListener("click", () => updateStatus(btn.dataset.id, "reject"));
    });



    }



   const profileForm = document.querySelector('form[action="PHP/update_profile.php"]');

if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
        e.preventDefault(); // prevent default form submission

        const newEmail = profileForm.querySelector('input[name="email"]').value;

        // Update sidebar email immediately
        const emailDisplay = document.querySelector(".email");
        if (emailDisplay) emailDisplay.textContent = newEmail;

        // Save to localStorage for manager
        localStorage.setItem("managerEmail", newEmail);

        // Optionally submit form via fetch/AJAX or allow default form submission
        profileForm.submit();
    });
}
  
const profileEmailInput = document.querySelector('form[action="PHP/update_profile.php"] input[name="email"]');
if (profileEmailInput) {
    const savedEmail = localStorage.getItem("managerEmail");
    if (savedEmail) profileEmailInput.value = savedEmail;
}

// Settings Tabs
const settingsTabs = document.querySelectorAll(".settings-tab");
const settingsContents = document.querySelectorAll(".settings-content");

settingsTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        // Remove active from all tabs
        settingsTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        // Hide all content
        settingsContents.forEach(c => c.style.display = "none");

        // Show selected content
        const targetId = tab.dataset.tab;
        const targetContent = document.getElementById(targetId);
        if (targetContent) targetContent.style.display = "block";
    });
});
const defaultTab = settingsTabs[0]; // first tab
if (defaultTab) {
    defaultTab.classList.add("active");
    const defaultContentId = defaultTab.dataset.tab;
    const defaultContent = document.getElementById(defaultContentId);
    if (defaultContent) defaultContent.style.display = "block";
}

  

      
    // -------------------- Load request details --------------------
    function loadRequestDetails(visitId) {
        fetch(`PHP/fetch_visit_details.php?visit_id=${visitId}`)
            .then(res => res.json())
            .then(d => {
                if (!d || d.error) {
                    detailsContent.innerHTML = "<p>Error loading details.</p>";
                    showSection("detailsSection");
                    return;
                }

                detailsContent.innerHTML = `
                    <div class="detail-card">
                        <h3>Visitor Details</h3>
                        <p><strong>Name:</strong> ${d.visitor_name ?? "-"}</p>
                        <p><strong>Phone:</strong> ${d.visitor_phone ?? "-"}</p>
                        <p><strong>ID:</strong> ${d.visitor_id_number ?? "-"}</p>
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
                                <button id="approveBtn">Approve</button>
                                <button id="rejectBtn">Decline</button>
                            ` : `<p>This request is already <strong>${d.status}</strong>.</p>`}
                        </div>
                    </div>
                `;
                showSection("detailsSection");

                const approveBtn = document.getElementById("approveBtn");
                const rejectBtn = document.getElementById("rejectBtn");
                if (approveBtn) approveBtn.addEventListener("click", () => updateStatus(visitId, "approve"));
                if (rejectBtn) rejectBtn.addEventListener("click", () => updateStatus(visitId, "reject"));
            });
    }

    // -------------------- Update request status --------------------
    function updateStatus(visitId, action) {
        if (!confirm(`Are you sure you want to ${action} this request?`)) return;

        fetch("PHP/update_request_status.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `visit_id=${visitId}&action=${action}`,
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                fetchCounts();
                fetchRequests();
                showSection("dashboard");
            } else {
                alert("Failed to update request."   + (data.message || "Unknown error"))
            }

            
        });

        
    }

    // -------------------- Helper: Format status badge --------------------
    function formatBadge(status) {
        if (status === "approved") return '<span class="status approved">Approved</span>';
        if (status === "rejected") return '<span class="status rejected">Rejected</span>';
        return '<span class="status pending">Pending</span>';
    }

    // -------------------- Show / hide sections --------------------
    function showSection(id) {
        sections.forEach(s => s.style.display = "none");
        const section = document.getElementById(id);
        if (section) section.style.display = "block";

        menuButtons.forEach(btn => btn.classList.remove("active"));
        const activeBtn = document.querySelector(`.menu-btn[data-section="${id}"]`);
        if (activeBtn) activeBtn.classList.add("active");

        // Always hide details section if not viewing details
        if (id !== "detailsSection") detailsSection.style.display = "none";

        // Refresh notifications if Notifications tab
        if (id === "notifications") renderNotifications(allRequests.filter(r => r.status === "pending"));
    }

    // -------------------- Menu buttons --------------------
    menuButtons.forEach(btn => {
        btn.addEventListener("click", () => showSection(btn.dataset.section));
    });

    if (backToDashboardBtn) backToDashboardBtn.addEventListener("click", () => showSection("dashboard"));

    // -------------------- Dashboard View Details buttons --------------------
    document.querySelectorAll(".details-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            showSection("requests");
        });
    });

    // -------------------- Requests filter buttons --------------------
    document.querySelectorAll(".req-filter").forEach(btn => {
        btn.addEventListener("click", () => {
            const type = btn.dataset.type;
            const filtered = allRequests.filter(r => r.status === type);
            renderRequestsTable(filtered);

            // Highlight active filter
            document.querySelectorAll(".req-filter").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });

    // -------------------- Initial load --------------------
    showSection("dashboard");
    fetchCounts();
    fetchRequests();
});
