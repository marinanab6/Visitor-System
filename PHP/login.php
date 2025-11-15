<?php
session_start();
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    // Prepare SQL: select user by username only
    $query = "SELECT * FROM user_account WHERE username = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $username);  // "s" = string
    $stmt->execute();

    // Get the result
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc(); // fetch the user record as associative array

        // Verify password
        if (password_verify($password, $user['password'])) {
            // Set session variables
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];
            // Redirect based on role
            if ($user['role'] === 'admin') {
                header("Location: ../admin.html");
                exit();
            } elseif ($user['role'] === 'manager') {
                header("Location: ../manager.html");
                exit();
            } else {
                header("Location: ../index.html");
                exit();
            }

        } else {
            echo "Invalid password.";
        }

    } else {
        echo "No user found with that username.";
    }
}
?>
