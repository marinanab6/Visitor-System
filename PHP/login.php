<?php
session_start();
include 'db.php';  

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    // Fetch user by username
    $query = "SELECT * FROM user_account WHERE username = :username";
    $stmt = $conn->prepare($query);
    $stmt->execute([':username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Check password
        if (password_verify($password, $user['password'])) {

            // Set common session variables
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];

            // If student, fetch student_id from student_resident table
            if ($user['role'] === 'student') {
                $_SESSION['student_full_name'] = $user['full_name'];
                $_SESSION['student_email'] = $user['email'];

                $stmt = $conn->prepare("SELECT student_id FROM student_resident WHERE user_id = :uid");
                $stmt->execute([':uid' => $user['user_id']]);
                $res = $stmt->fetch(PDO::FETCH_ASSOC);

                $_SESSION['student_id'] = $res ? $res['student_id'] : null;
            }

            // Redirect based on role
            switch ($user['role']) {
                case 'admin':
                    header("Location: ../admin.html?email=" . urlencode($user['email']));
                    break;

                case 'manager':
                    header("Location: ../manager.php?email=" . urlencode($user['email']));
                    break;

                case 'student':
                    header("Location: ../student.php?email=" . urlencode($user['email']));
                    break;

                case 'security':
                    header("Location: ../securityofficer.html?email=" . urlencode($user['email']));
                    break;
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
