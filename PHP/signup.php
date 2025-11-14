<?php
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $full_name = $_POST['full_name'];
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $role = $_POST['role'];

    // Hash the password
    $hashed_pass = password_hash($password, PASSWORD_DEFAULT);

    // Prepare statement
    $stmt = $conn->prepare("INSERT INTO user_account (full_name, username, email, password, role)
                            VALUES (?, ?, ?, ?, ?)");

    $stmt->bind_param("sssss", $full_name, $username, $email, $hashed_pass, $role);

    if ($stmt->execute()) {
        echo "Signup successful! You can now log in.";
        echo "<br><a href='login.html'>Go to Login</a>";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}
?>
