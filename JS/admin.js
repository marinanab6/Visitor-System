// --- SIDEBAR NAVIGATION ---
const menuButtons = document.querySelectorAll(".menu-btn");
const sections = document.querySelectorAll(".section");
const title = document.querySelector(".title");

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
    });
});


// --- VIEW DETAILS ON DASHBOARD CARDS ---
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
    });
});


// --- SETTINGS TABS ---
const tabs = document.querySelectorAll(".settings-tab");
const contents = document.querySelectorAll(".settings-content");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        const target = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        contents.forEach(c => c.style.display = "none");
        document.getElementById(target).style.display = "block";
    });
});


// --- LOGOUT ---
document.querySelector(".logout").addEventListener("click", () => {
    window.location.href = "login.html";
});
