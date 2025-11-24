const updateProfileForm = document.getElementById("updateProfileForm");
const updateMessage = document.getElementById("updateMessage");

updateProfileForm.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent page reload

    const formData = new FormData(updateProfileForm);

    fetch("PHP/update_profile.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if(data.success){
            updateMessage.style.color = "green";
            updateMessage.textContent = "Profile updated successfully!";
        } else {
            updateMessage.style.color = "red";
            updateMessage.textContent = "Error: " + data.error;
        }
    })
    .catch(err => {
        updateMessage.style.color = "red";
        updateMessage.textContent = "Error: " + err;
    });
});
