document.addEventListener("DOMContentLoaded", () => {
  // ------------------------
  // NAVIGATION
  // ------------------------
  const urlParams = new URLSearchParams(window.location.search);
  const loginEmail = urlParams.get("email");

  if (loginEmail) {
    localStorage.setItem("securityEmail", loginEmail);
    document.querySelector(".email").textContent = loginEmail;
  }

  const navButtons = document.querySelectorAll(".menu-btn");
  const sections = document.querySelectorAll("main .section, .register-form");
  const checkVisitor = document.getElementById("checkVisitor");

  function showSection(sectionId) {
    sections.forEach(sec => sec.style.display = "none");
    const active = document.getElementById(sectionId);
    if (active) active.style.display = "block";

    navButtons.forEach(btn => btn.classList.remove("active"));
    const activeBtn = Array.from(navButtons).find(btn => btn.dataset.section === sectionId);
    if (activeBtn) activeBtn.classList.add("active");
  }

  navButtons.forEach(btn => {
    if (btn.id !== "checkVisitorBtn") {
      btn.addEventListener("click", () => showSection(btn.dataset.section));
    }
  });

  showSection("dashboard");

  function checkVisitorPhone(visitor) {
    const phoneCheckTableBody = document.getElementById("phoneCheckTableBody");
    phoneCheckTableBody.innerHTML = "";


   console.log(visitor);
    phoneCheckTableBody.innerHTML = `
      <tr id="visitor-${visitor.id_number}">
        <td>${visitor.id_number ?? "-"}</td>
        <td>${visitor.full_name ?? "-"}</td>
        <td>${visitor.phone_number ?? "-"}</td>
        <td>${visitor.email ?? "-"}</td>
        <td>${visitor.student_resident_id ?? "-"}</td>
        <td>
          ${visitor.visitor_photo 
            ? `<img src="uploads/${visitor.visitor_photo}" width="50" height="50" style="border-radius: 5px;">`
            : "No Photo"
          }
        </td>
      </tr>
    `;
  }

  // ------------------------
  // VISITOR STORAGE
  // ------------------------
  let visitors = [];

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

  toggleRegister.addEventListener("click", () => {
    registerForm.style.display = "block";
  });

  cancelRegister.addEventListener("click", () => {
    registerForm.style.display = "none";
  });

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
    }, 1200);
  });

  function updateCounts() {
    totalCount.innerText = visitors.length;
    checkedInCount.innerText = visitors.filter(v => v.status === "checked-in").length;
    checkedOutCount.innerText = visitors.filter(v => v.status === "checked-out").length;
  }

  function updateTable() {
    const searchValue = searchInput.value.toLowerCase();
    const filter = filterSelect.value;

    const filtered = visitors.filter(v => {
      const matchSearch =
        v.name.toLowerCase().includes(searchValue) ||
        v.id.toLowerCase().includes(searchValue) ||
        v.phone.toLowerCase().includes(searchValue);

      const matchFilter = filter === "all" || filter === v.status;

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
            : `<button class="table-btn disabled">Checked-out</button>`}
        </td>
      `;
      visitorsTableBody.appendChild(tr);
    });

    activateCheckoutButtons();
  }

  function activateCheckoutButtons() {
    document.querySelectorAll(".checkout-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = btn.dataset.index;
        visitors[i].status = "checked-out";
        visitors[i].timeOut = new Date().toLocaleTimeString();
        updateCounts();
        updateTable();
      });
    });
  }

  searchInput.addEventListener("input", updateTable);
  filterSelect.addEventListener("change", updateTable);

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

  document.getElementById("checkVisitorBtn").addEventListener("click", () => {
    showSection("checkVisitorSection");
  });

  document.getElementById("checkVisitorBtn2").addEventListener("click", () => {
    const phone = document.getElementById("visitorPhoneInput").value.trim();

    if (phone === "") {
      alert("Please enter a phone number.");
      return;
    }

    fetch("PHP/check_visitor.php?phone_number=" + phone)
      .then(res => res.json())
      .then(data => {
        console.log("Fetched data:", data);
        const container = document.getElementById("visitorResult");

        if (data.status === "not_found") {
          container.innerHTML = "<p style='color:red;'>Visitor not found.</p>";
          return;
        }
         console.log("visitor photo:", data.visitor_photo);
        container.innerHTML = `
  <p><strong>Name:</strong> ${data.full_name}</p>
  <p><strong>Phone:</strong> ${data.phone_number}</p>
  <p><strong>Visitor ID:</strong> ${data.id_number}</p>
  <p><strong>Student:</strong> ${data.student_resident_id}</p>
  <p><strong>Email:</strong> ${data.email}</p>
  <img src="PHP/uploads/${data.visitor_photo}" 
       alt="Visitor Photo" 
       style="max-width:200px;max-height:200px;"/>
  <button id="getInBtn" 
          style="padding:10px;background:green;color:white;border:none;border-radius:5px;">
          Get In
  </button>
`;


function checkInVisitor(visitorData) {
  // Check if visitor is already in the visitors array
  const exists = visitors.find(v => v.id === visitorData.id_number);
  if(exists){
    alert("Visitor already checked in!");
    return;
  }

  const visitor = {
    name: visitorData.full_name,
    id: visitorData.id_number,
    phone: visitorData.phone_number,
    resident: visitorData.student_resident_id || "-",
    reason: visitorData.reason || "-",
    status: "checked-in",
    timeIn: new Date().toLocaleTimeString(),
    timeOut: ""
  };

  visitors.push(visitor);
  updateCounts();
  updateTable();

  alert(`${visitor.name} has been checked in successfully!`);
}


        document.getElementById("getInBtn").addEventListener("click", () => {
  checkInVisitor(data);
});
      });
  });

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

  document.querySelector(".logout").addEventListener("click", () => {
    window.location.href = "login.html";
  });

  const updatePasswordBtn = document.querySelector("#passwordTab .save-btn");
  if (updatePasswordBtn) {
    updatePasswordBtn.addEventListener("click", () => {
      const current = document.querySelector("#passwordTab input[placeholder='Enter current password']").value;
      const newPass = document.querySelector("#passwordTab input[placeholder='Enter new password']").value;
      const confirmPass = document.querySelector("#passwordTab input[placeholder='Confirm new password']").value;

      if(newPass.length < 6){
          alert("Password must be at least 6 characters.");
          return;
      }
      if(newPass !== confirmPass){
          alert("Passwords do not match.");
          return;
      }

      fetch("PHP/change_password.php", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({email: localStorage.getItem("securityEmail"), current, newPass})
      })
      .then(res => res.json())
      .then(data => {
          alert(data.message);
      });
    });
  }

  // ------------------------
  // PROFILE PICTURE UPLOAD
  // ------------------------
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
      formData.append("email", localStorage.getItem("securityEmail"));
      formData.append("profile_picture", file);

      fetch("PHP/upload_picture.php", {
        method: "POST",
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        if(data.success && data.filename){
          // Update preview immediately
          if(previewImg){
            previewImg.src = `uploads/${data.filename}?t=${Date.now()}`;
          }
        }
      })
      .catch(err => {
        console.error(err);
        alert("Upload failed.");
      });
    });
  }

  // Load profile picture on page load
  const securityEmail = localStorage.getItem("securityEmail");
  if(securityEmail){
    fetch(`PHP/get_profile.php?email=${securityEmail}`)
      .then(res => res.json())
      .then(data => {
        if(data.profile_picture){
          const img = document.querySelector(".preview-img");
          if(img) img.src = `uploads/${data.profile_picture}?t=${Date.now()}`;
        }
      });
  }
});
