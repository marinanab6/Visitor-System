   const loginForm = document.getElementById("loginForm");
   const loginEmail = document.getElementById("email");
   const loginstudentid = document.getElementById("studentId");
   
   const loginContainer    = document.getElementById("loginContainer");
    const signupContainer   = document.getElementById("signupContainer");
    const forgotContainer   = document.getElementById("forgotContainer");

    // Links
    const showSignup = document.getElementById("showSignup");
    const showLogin  = document.getElementById("showLogin");
    const showForgot = document.getElementById("showForgot");
    const backToLogin = document.getElementById("backToLogin");

    // Password inputs + errors
    const loginPassword = document.getElementById("password");
    const loginPassError = document.getElementById("loginPassError");

    const signupPassword = document.getElementById("signupPassword");
    const signupPassError = document.getElementById("signupPassError");

    const signupForm     = document.getElementById("signupForm");
    const signupMessage  = document.getElementById("signupMessage");


    // Switch to Sign-Up
    showSignup.addEventListener("click", (e) => {
        e.preventDefault();
        loginContainer.style.display = "none";
        signupContainer.style.display = "block";
    });

    // Back to Login
    showLogin?.addEventListener("click", (e) => {
        e.preventDefault();
        signupContainer.style.display = "none";
        forgotContainer.style.display = "none";
        loginContainer.style.display = "block";
    });

    // Show Forgot Password
    showForgot.addEventListener("click", (e) => {
        e.preventDefault();
        loginContainer.style.display = "none";
        signupContainer.style.display = "none";
        forgotContainer.style.display = "block";
    });

    // Back From Forgot Page
    backToLogin.addEventListener("click", (e) => {
        e.preventDefault();
        forgotContainer.style.display = "none";
        loginContainer.style.display = "block";
    });

    // Login password validation
    loginPassword.addEventListener("input", () => {
        loginPassError.textContent =
            loginPassword.value.length === 6 ? "" : "Password must be exactly 6 characters";
    });

    // Signup password validation
    signupPassword.addEventListener("input", () => {
        signupPassError.textContent =
            signupPassword.value.length === 6 ? "" : "Password must be exactly 6 characters";
    });

    // Signup submit
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
    
        if (signupPassword.value.length !== 6) {
            signupPassError.textContent = "Password must be exactly 6 characters";
            return;
        }

        signupMessage.style.color = "green";
        signupMessage.textContent = "Account created successfully!";

        setTimeout(() => {
            signupContainer.style.display = "none";
            loginContainer.style.display = "block";
        }, 1500);
    });

    loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (loginPassword.value.length !== 6) {
        loginPassError.textContent = "Password must be exactly 6 characters";
        return;
    }

    try {
        const response = await fetch("PHP/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                username: loginEmail.value,   // or loginUsername if you have username field
                password: loginPassword.value
            })
        });

        const data = await response.json();

        if (data.success) {
            // Save email to localStorage for sidebar
            localStorage.setItem("studentEmail", loginEmail.value);

            // Redirect based on role
            window.location.href = data.redirect; // PHP should return redirect URL
        } else {
            loginPassError.textContent = data.error;
        }

    } catch (err) {
        console.error(err);
        loginPassError.textContent = "Login failed. Try again.";
    }
});
