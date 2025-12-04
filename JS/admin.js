document.addEventListener("DOMContentLoaded", () => {
    // -------------------- ELEMENTS --------------------
    // 
    
      const urlParams = new URLSearchParams(window.location.search);
      const loginEmail = urlParams.get("email");

if (loginEmail) {
    // Save in localStorage
    localStorage.setItem("adminEmail", loginEmail);

    // Display immediately in sidebar
    document.querySelector(".email").textContent = loginEmail;
}

const emailDisplay = document.querySelector(".email"); // sidebar element
    const savedEmail = localStorage.getItem("managerEmail"); // get from localStorage
    if (savedEmail && emailDisplay) {
        emailDisplay.textContent = savedEmail;
    }
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

        // -------------------- FETCH USER BY ID --------------------
const fetchUserBtn = document.getElementById("fetchUserBtn");
if (fetchUserBtn) {
    fetchUserBtn.addEventListener("click", () => {
        const role = document.getElementById("selectRole").value;
        const userId = document.getElementById("userIdInput").value.trim();

        if (!role) { alert("Please select a role first."); return; }
        if (!userId) { alert("Please enter a user ID."); return; }

        // make sure path matches where your PHP file is
        fetch(`PHP/get_user_by_id.php?role=${encodeURIComponent(role)}&id=${encodeURIComponent(userId)}`)
            .then(res => {
                if (!res.ok) throw new Error("Network response not ok");
                return res.json();
            })
            .then(user => {
                if (!user) {
                    alert("User not found.");
                    document.getElementById("userDetails").style.display = "none";
                    document.getElementById("accountActions").style.display = "none";
                    return;
                }

                document.getElementById("userDetails").style.display = "block";
                document.getElementById("userName").textContent = `Name: ${user.name}`;
                document.getElementById("userEmail").textContent = `Email: ${user.email}`;
                document.getElementById("accountActions").style.display = "block";
            })
            .catch(err => {
                console.error("Fetch user error:", err);
                alert("Error fetching user — check console/Network tab.");
            });
    });
}

const disableBtn = document.getElementById("disableAccountBtn");
const deleteBtn = document.getElementById("deleteAccountBtn");

if (disableBtn) {
    disableBtn.addEventListener("click", () => {
        const userId = document.getElementById("userIdInput").value.trim();
        const role = document.getElementById("selectRole").value;

        if (!userId || !role) {
            alert("Select role and enter user ID first.");
            return;
        }

        fetch("PHP/disable_user.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, role })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if(data.success) {
                document.getElementById("userDetails").style.display = "none";
                document.getElementById("accountActions").style.display = "none";
            }
        })
        .catch(err => console.error(err));
    });
}

if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
        const userId = document.getElementById("userIdInput").value.trim();
        const role = document.getElementById("selectRole").value;

        if (!userId || !role) {
            alert("Select role and enter user ID first.");
            return;
        }

        fetch("PHP/delete_user.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, role })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if(data.success) {
                document.getElementById("userDetails").style.display = "none";
                document.getElementById("accountActions").style.display = "none";
            }
        })
        .catch(err => console.error(err));
    });
}




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


function formatBadge(status) {
    if (status === "approved") return '<span class="status approved">Approved</span>';
    if (status === "rejected") return '<span class="status rejected">Rejected</span>';
    return '<span class="status pending">Pending</span>';
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
                            <td style="border-bottom:1px solid black;padding:12px;">${index + 1}</td>
                            <td style="border-bottom:0.5px solid black;padding:12px;">${req.student_name ?? "-"}</td>
                            <td style="border-bottom:0.5px solid black;padding:12px;">${req.visitor_name ?? "-"}</td>
                            <td style="border-bottom:0.5px solid black;padding:12px;">${req.visitor_phone ?? "-"}</td>
                            <td style="border-bottom:0.5px solid black;padding:12px;">${req.visit_reason ?? "-"}</td>
                            <td style="border-bottom:0.5px solid black;padding:12px; color:white;background-color:orange; flex:1;padding:4px 8px;">${formatBadge(req.status.charAt(0).toUpperCase() + req.status.slice(1))}</td>
                            <td style="border-bottom:0.5px solid black;padding:12px;">${req.visit_date ?? "-"} ${req.visit_time ?? ""}</td>
                            <td style=" border-bottom:0.5px solid black;padding:14px;display:flex ;justify-content:center; white-space: nowrap;">
            ${req.status === "pending" ? `
                <button style=border-bottom:1px solid black;class="approve-row" data-id= " ${req.visit_id}" 
                   style="flex:1;background:green; color:white; border:none; 
               padding:14px ; border-radius:7px; ">Approve
                </button>

                <button class="reject-row" data-id="${req.visit_id}" 
                    style=" flex:1;background:red;color:white;border:none;padding:14px ;margin-left:10px;border-radius:7px;b">
                    Reject
                </button>
            ` : `
                <span style="font-weight:bold;">${req.status}</span>
            `}
        </td>
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
                        <button class="view-details-btn" data-id="${req.visit_id}"${req.visit_id} style="color:white; padding:10px; background-color:red; border:none; border-radius:5px;">View Details</button>
                    `;
                    notifContainer.appendChild(div);

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


// SETTINGS TAB SWITCHING
const settingsTabs = document.querySelectorAll(".settings-tab");
const settingsContents = document.querySelectorAll(".settings-content");

settingsTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        // remove active class
        settingsTabs.forEach(t => t.classList.remove("active"));
        settingsContents.forEach(c => c.style.display = "none");

        // activate selected tab
        tab.classList.add("active");
        const targetId = tab.dataset.tab;
        const targetContent = document.getElementById(targetId);
        if(targetContent) targetContent.style.display = "block";
    });
});


const updatePasswordBtn = document.getElementById("updatePasswordBtn");

if(updatePasswordBtn){
    updatePasswordBtn.addEventListener("click", () => {
        const passwordInputs = document.querySelectorAll("#passwordTab input[type='password']");
        const current = passwordInputs[0].value;
        const newPass = passwordInputs[1].value;
        const confirmPass = passwordInputs[2].value;

        if(newPass.length < 6){
            alert("Password must be at least 6 characters.");
            return;
        }
        if(newPass !== confirmPass){
            alert("Passwords do not match.");
            return;
        }

        // Call backend PHP
        fetch("PHP/change_password.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: localStorage.getItem("adminEmail"),
                current,
                newPass
            })
        })
        .then(res => res.json())
        .then(data => alert(data.message))
        .catch(err => console.error(err));
    });
}




const pictureInput = document.querySelector("#pictureTab input[type='file']");
const previewImg = document.querySelector("#pictureTab .preview-img");
const uploadBtn = document.querySelector("#pictureTab .save-btn");

if(pictureInput && previewImg){
    pictureInput.addEventListener("change", () => {
        const file = pictureInput.files[0];
        if(file) previewImg.src = URL.createObjectURL(file);
    });
}

if(uploadBtn){
    uploadBtn.addEventListener("click", () => {
        const file = pictureInput.files[0];
        if(!file){
            alert("Please select a picture.");
            return;
        }

        const formData = new FormData();
        formData.append("email", localStorage.getItem("adminEmail"));
        formData.append("profile_picture", file);

        fetch("PHP/upload_picture.php", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if(data.success && data.imagePath){
                previewImg.src = data.imagePath + "?t=" + new Date().getTime();
            }
        })
        .catch(err => console.error(err));
    });
}




