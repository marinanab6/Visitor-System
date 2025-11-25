<?php
session_start();
include 'db.php'; 

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    // 1️⃣ Select user by username only
    $query = "SELECT * FROM user_account WHERE username = ? ";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result(); 

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc(); // fetch the user record

        $_SESSION['student_full_name'] = $user['full_name'];

        // 2️⃣ Verify password
        if (password_verify($password, $user['password'])) {
            // 3️⃣ Password is correct, set session
        
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];

            // 4️⃣ Redirect based on role
            if ($user['role'] === 'admin') {
                header("Location: ../admin.html"); 
            } elseif ($user['role'] === 'manager') {
                header("Location: ../manager.html");
            } elseif ($user['role'] === 'student') {
                header("Location: ../student.html");
            }elseif ($user['role'] === 'security') {
                header("Location: ../securityofficer.html");
            }
            exit();

        } else {
            echo "Invalid password.";
        }

    } else {
        echo "No user found with that username.";
    }
}
?>
