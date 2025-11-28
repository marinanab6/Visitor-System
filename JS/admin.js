document.addEventListener("DOMContentLoaded", () => {
    // -------------------- ELEMENTS --------------------
    const menuButtons = document.querySelectorAll(".menu-btn");
    const sections = document.querySelectorAll(".section");
    const title = document.querySelector(".title");

    const totalRequestsEl = document.getElementById("totalRequests");
    const approvedRequestsEl = document.getElementById("approvedRequests");
    const visitorCountEl = document.getElementById("visitorCount");

    const requestsTableBody = document.getElementById("requestsTableBody");
    const notifContainer = document.getElementById("notifContainer");

    // -------------------- NAVIGATION --------------------
    menuButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.section;

            menuButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            sections.forEach(sec => sec.style.display = "none");
            document.getElementById(target).style.display = "block";

            title.textContent = btn.textContent.replace(/[^a-zA-Z ]/g, "");

            if (target === "notifications") fetchNotifications();
        });
    });

    // -------------------- DASHBOARD CARD DETAILS --------------------
    const detailButtons = document.querySelectorAll(".details-btn");
    detailButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.target;

            sections.forEach(sec => sec.style.display = "none");
            document.getElementById(target).style.display = "block";

            menuButtons.forEach(b => {
                b.classList.remove("active");
                if (b.dataset.section === target) b.classList.add("active");
            });

            title.textContent = target.charAt(0).toUpperCase() + target.slice(1);

            if (target === "requests") {
                fetchRequestsTable(); // All requests
            } else if (target === "approvedRequests") {
                fetchRequestsTable("approved"); // Only approved requests
            } else if (target === "visitorCount") {
                fetchVisitorsTable(); // Total visitors
            }
        });
    });

    // -------------------- FETCH DASHBOARD COUNTS --------------------
    function fetchDashboardCounts() {
        // Requests count
        fetch("PHP/fetch_request_count_admin.php")
            .then(res => res.json())
            .then(data => {
                totalRequestsEl.textContent = data.pending + data.approved;
                approvedRequestsEl.textContent = data.approved;
            });

        // Total visitors (from security officer)
        fetch("PHP/fetch_visitor_count.php")
            .then(res => res.json())
            .then(data => {
                visitorCountEl.textContent = data.visitors;
            });
    }

    // -------------------- FETCH REQUESTS TABLE --------------------
    function fetchRequestsTable(status = null) {
        fetch("PHP/fetch_request.php") // returns all requests
            .then(res => res.json())
            .then(data => {
                requestsTableBody.innerHTML = "";

                let filteredData = data;
                if (status) {
                    filteredData = data.filter(r => r.status === status);
                }

                filteredData.forEach((req, index) => {
                    requestsTableBody.innerHTML += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${req.student_name ?? "-"}</td>
                            <td>${req.visitor_name ?? "-"}</td>
                            <td>${req.status.charAt(0).toUpperCase() + req.status.slice(1)}</td>
                            <td>${req.visit_date ?? "-"} ${req.visit_time ?? ""}</td>
                        </tr>
                    `;
                });
            });
    }

    // -------------------- FETCH VISITORS TABLE --------------------
    function fetchVisitorsTable() {
        fetch("PHP/fetch_visitors.php") // returns all visitors registered by security
            .then(res => res.json())
            .then(data => {
                requestsTableBody.innerHTML = "";

                data.forEach((visitor, index) => {
                    requestsTableBody.innerHTML += `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${visitor.student_name ?? "-"}</td>
                            <td>${visitor.visitor_name ?? "-"}</td>
                            <td>-</td>
                            <td>${visitor.visit_date ?? "-"} ${visitor.visit_time ?? ""}</td>
                        </tr>
                    `;
                });
            });
    }

    // -------------------- FETCH NOTIFICATIONS --------------------
    function fetchNotifications() {
        fetch("PHP/fetch_request.php")
            .then(res => res.json())
            .then(data => {
                const pendingRequests = data.filter(r => r.status === "pending");
                notifContainer.innerHTML = "";

                if (!pendingRequests.length) {
                    notifContainer.innerHTML = "<p>No new notifications.</p>";
                    return;
                }

                pendingRequests.forEach(req => {
                    const div = document.createElement("div");
                    div.className = "notif-item";
                    div.innerHTML = `
                        <p><strong>Visitor:</strong> ${req.visitor_name}</p>
                        <p><strong>Student:</strong> ${req.student_name}</p>
                        <p><strong>Date:</strong> ${req.visit_date} ${req.visit_time ?? ""}</p>
                        <button class="view-details-btn" data-id="${req.visit_id}">View Details</button>
                    `;
                    notifContainer.appendChild(div);
                });

                // Attach click events
                document.querySelectorAll(".view-details-btn").forEach(btn => {
                    btn.addEventListener("click", () => {
                        sections.forEach(sec => sec.style.display = "none");
                        document.getElementById("requests").style.display = "block";
                        menuButtons.forEach(b => {
                            b.classList.remove("active");
                            if (b.dataset.section === "requests") b.classList.add("active");
                        });
                        fetchRequestsTable();
                    });
                });
            });
    }

    // -------------------- INITIAL LOAD --------------------
    fetchDashboardCounts();
});
