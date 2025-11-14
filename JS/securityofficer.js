
const navButtons = document.querySelectorAll(".menu-btn");
const sections = document.querySelectorAll("main .section, .request-form");

function showSection(sectionId) {
    sections.forEach(sec => sec.style.display = "none");
    const active = document.getElementById(sectionId);
    if (active) active.style.display = "block";

    // Highlight sidebar button
    navButtons.forEach(btn => btn.classList.remove("active"));
    const activeBtn = Array.from(navButtons).find(btn => btn.dataset.section === sectionId);
    if (activeBtn) activeBtn.classList.add("active");
}

// Sidebar event listener
navButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const target = btn.dataset.section;
        showSection(target);
    });
});

// Default page
showSection("dashboard");

// ================================
// VISITOR DATA STORAGE
// ================================
let visitors = [];

// ================================
// ELEMENT REFERENCES
// ================================
const totalCount = document.getElementById("totalCount");
const checkedInCount = document.getElementById("checkedInCount");
const checkedOutCount = document.getElementById("checkedOutCount");

const listArea = document.getElementById("listArea");
const visitorsTableBody = document.querySelector("#visitorsTable tbody");
const emptyMsg = document.getElementById("emptyMsg");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

const registerForm = document.getElementById("registerForm");
const toggleRegister = document.getElementById("toggleRegister");
const cancelRegister = document.getElementById("cancelRegister");
const registerMsg = document.getElementById("registerMsg");

const newVisitorForm = document.getElementById("newVisitorForm");

// ================================
// SHOW REGISTER FORM
// ================================
toggleRegister.addEventListener("click", () => {
    registerForm.style.display = "block";
    document.getElementById("dashboard").style.display = "none";
});

cancelRegister.addEventListener("click", () => {
    registerForm.style.display = "none";
    showSection("dashboard");
});

// ================================
// ADD NEW VISITOR
// ================================
newVisitorForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const visitor = {
        name: document.getElementById("vName").value,
        id: document.getElementById("vId").value,
        phone: document.getElementById("vPhone").value,
        resident: document.getElementById("vResident").value || "-",
        reason: document.getElementById("vReason").value || "-",
        status: "checked-in",
        timeIn: new Date().toLocaleTimeString(),
        timeOut: ""
    };

    visitors.push(visitor);
    updateCounts();
    updateTable();

    registerMsg.innerText = "Visitor registered and checked-in successfully.";
    registerMsg.style.color = "green";
    registerMsg.style.display = "block";

    setTimeout(() => {
        registerMsg.style.display = "none";
        newVisitorForm.reset();
        registerForm.style.display = "none";
        showSection("dashboard");
    }, 1200);
});

// ================================
// UPDATE COUNTS
// ================================
function updateCounts() {
    totalCount.innerText = visitors.length;
    checkedInCount.innerText = visitors.filter(v => v.status === "checked-in").length;
    checkedOutCount.innerText = visitors.filter(v => v.status === "checked-out").length;
}

// ================================
// UPDATE TABLE
// ================================
function updateTable() {
    const searchValue = searchInput.value.toLowerCase();
    const filter = filterSelect.value;

    const filtered = visitors.filter(v => {
        const matchSearch =
            v.name.toLowerCase().includes(searchValue) ||
            v.id.toLowerCase().includes(searchValue) ||
            v.phone.toLowerCase().includes(searchValue);

        const matchFilter =
            filter === "all" ||
            filter === v.status;

        return matchSearch && matchFilter;
    });

    visitorsTableBody.innerHTML = "";

    if (filtered.length === 0) {
        emptyMsg.style.display = "block";
        return;
    }

    emptyMsg.style.display = "none";

    filtered.forEach((v, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${v.name}</td>
            <td>${v.id}</td>
            <td>${v.phone}</td>
            <td>${v.resident}</td>
            <td class="${v.status === "checked-in" ? "status-in" : "status-out"}">${v.status}</td>
            <td>
                ${v.status === "checked-in"
                    ? `<button class="table-btn checkout-btn" data-index="${index}">Check-out</button>`
                    : `<button class="table-btn disabled">Checked-out</button>`
                }
            </td>
        `;

        visitorsTableBody.appendChild(tr);
    });

    activateCheckoutButtons();
}

// ================================
// CHECK OUT ACTION
// ================================
function activateCheckoutButtons() {
    const checkoutBtns = document.querySelectorAll(".checkout-btn");

    checkoutBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const i = btn.dataset.index;
            visitors[i].status = "checked-out";
            visitors[i].timeOut = new Date().toLocaleTimeString();

            updateCounts();
            updateTable();
        });
    });
}

// ================================
// SEARCH + FILTER EVENTS
// ================================
searchInput.addEventListener("input", updateTable);
filterSelect.addEventListener("change", updateTable);

// ================================
// “VIEW DETAILS” BUTTONS
// ================================
document.getElementById("openRequests").addEventListener("click", () => {
    showSection("listArea");
    filterSelect.value = "all";
    updateTable();
});

document.getElementById("openCheckedIn").addEventListener("click", () => {
    showSection("listArea");
    filterSelect.value = "checked-in";
    updateTable();
});

document.getElementById("openCheckedOut").addEventListener("click", () => {
    showSection("listArea");
    filterSelect.value = "checked-out";
    updateTable();
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
