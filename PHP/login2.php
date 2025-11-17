<?php
session_start();
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    // 1. Get user from user_account
    $stmt = $conn->prepare("SELECT * FROM user_account WHERE username = ? AND password = ?");
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();

        // Set session data
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];

        // 2. If this is a student, fetch their resident info
        if ($user['role'] === "Student_Resident") {

            // Look for student in student_resident table
            $stmt2 = $conn->prepare("SELECT resident_id, full_name FROM student_resident WHERE email = ?");
            $stmt2->bind_param("s", $username);
            $stmt2->execute();
            $stmt2->bind_result($resident_id, $full_name);
            $stmt2->fetch();
            $stmt2->close();

            if ($resident_id) {
                // Save student details in session
                $_SESSION['student_id'] = $resident_id;
                $_SESSION['student_name'] = $full_name;

                // Redirect to student dashboard
                header("Location: ../STUDENT/student_dashboard.php");
                exit();
            } else {
                die("Error: Student record not found in student_resident table.");
            }
        }

        // 3. Manager redirect
        if ($user['role'] === "Manager") {
            header("Location: ../MANAGER/manager_dashboard.php");
            exit();
        }

        // 4. Security redirect
        if ($user['role'] === "Security_Officer") {
            header("Location: ../SECURITY/security_dashboard.php");
            exit();
        }

        // 5. Admin redirect
        if ($user['role'] === "Admin") {
            header("Location: ../ADMIN/admin_dashboard.php");
            exit();
        }

    } else {
        echo "Invalid username or password";
    }

    $stmt->close();
}
?>
