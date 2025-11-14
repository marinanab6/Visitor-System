document.addEventListener("DOMContentLoaded", () => {

    const sections = document.querySelectorAll(".section");
    const menuButtons = document.querySelectorAll(".menu-btn");
    const detailButtons = document.querySelectorAll(".details-btn");

    const approvedCount = document.getElementById("approvedCount");
    const rejectedCount = document.getElementById("rejectedCount");
    const pendingCount = document.getElementById("pendingCount");

    const STORAGE_REQUESTS = "vms_manager_requests_v1";

    function load(key) {
        try {
            return JSON.parse(localStorage.getItem(key) || "[]");
        } catch {
            return [];
        }
    }

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
            const target = btn.dataset.target;
            showSection(target);
        });
    });

    const statusBtn = document.querySelector(".status-btn");
    if (statusBtn) {
        statusBtn.addEventListener("click", () => {
            showSection("notifications");
        });
    }

    document.querySelector(".logout").addEventListener("click", () => {
        if (confirm("Are you sure you want to logout?")) {
            window.location.href = "../login.html";
        }
    });

    function updateCounters() {
        const requests = load(STORAGE_REQUESTS);

        approvedCount.textContent = requests.filter(r => r.status === "approved").length;
        rejectedCount.textContent = requests.filter(r => r.status === "rejected").length;
        pendingCount.textContent = requests.filter(r => r.status === "pending").length;
    }

    showSection("dashboard");
    updateCounters();
});
/* Settings Tabs */
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
detailButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const type = btn.parentElement.querySelector("p").textContent.toLowerCase().split(" ")[0];  
        showSection("requests");
        renderRequests(type);
    });
});
