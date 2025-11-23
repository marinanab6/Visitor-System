document.addEventListener("DOMContentLoaded", () => {

    const sections = document.querySelectorAll(".section");
    const menuButtons = document.querySelectorAll(".menu-btn");
    const detailButtons = document.querySelectorAll(".details-btn");

    const approvedCount = document.getElementById("approvedCount");
    const rejectedCount = document.getElementById("rejectedCount");
    const pendingCount = document.getElementById("pendingCount");


    
    fetch("PHP/fetch_request_count.php")
        .then(res => res.json())
        .then(data => {
            approvedCount.textContent = data.approved;
            rejectedCount.textContent = data.rejected;
            pendingCount.textContent = data.pending;
        })
        .catch(err => console.error("Error fetching request counts:", err));



    
    function fetchRequests() {
        fetch("PHP/fetch_request.php")
            .then(res => res.json())
            .then(data => {

                
                const tableBody = document.getElementById("requestsList");
                tableBody.innerHTML = "";

                data.forEach(req => {
                    tableBody.innerHTML += `
                        <tr>
                            <td>${req.visit_id}</td>
                            <td>${req.student_name ?? "Unknown"}</td>
                            <td>${req.visitor_name}</td>
                            <td>${req.status}</td>
                            <td>${req.visit_date}</td>
                        </tr>
                    `;
                });



                
                const notifyContainer = document.getElementById("notifications");
                notifyContainer.innerHTML = "<h2>Requests Overview</h2>";

                if (data.length === 0) {
                    notifyContainer.innerHTML += `<p class="empty-msg">No requests available.</p>`;
                } else {
                    data.forEach(req => {
                        const item = document.createElement("div");
                        item.classList.add("notif-item");

                        item.innerHTML = `
                            <p><strong>${req.visitor_name}</strong> requested to visit <strong>${req.student_name ?? "Unknown"}</strong></p>
                            <span>Status: ${req.status}</span><br>
                            <span>Date: ${req.visit_date}</span>
                        `;

                        notifyContainer.appendChild(item);
                    });
                }

            })
            .catch(err => console.error("Error fetching requests:", err));
    }

    // Call function on load
    fetchRequests();




    
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
            showSection("requests");
        });
    });


    
    const statusBtn = document.querySelector(".status-btn");
    if (statusBtn) {
        statusBtn.addEventListener("click", () => showSection("notifications"));
    }


    
    document.querySelector(".logout").addEventListener("click", () => {
        if (confirm("Are you sure you want to logout?")) {
            window.location.href = "../login.html";
        }
    });




    const settingsTabs = document.querySelectorAll(".settings-tab");
    const settingsContent = document.querySelectorAll(".settings-content");

    settingsTabs.forEach(tab => {
        tab.addEventListener("click", () => {

            // remove active from all
            settingsTabs.forEach(t => t.classList.remove("active"));
            settingsContent.forEach(c => c.style.display = "none");

            // activate selected
            tab.classList.add("active");
            document.getElementById(tab.dataset.tab).style.display = "block";
        });
    });

    

    
    showSection("dashboard");

});
