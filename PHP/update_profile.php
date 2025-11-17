<?php
session_start();
include 'db.php';

// Check login
if (!isset($_SESSION['student_full_name'])) {
    die("Not logged in");
}

// Student ID
$studentID = $_SESSION['student_id'];

// Get submitted data
$fullName = trim($_POST['full_name']);
$email = trim($_POST['email']);
$phone = trim($_POST['phone']);

// Update query
$stmt = $conn->prepare("
    UPDATE student_resident 
    SET full_name = ?, email = ?, phone_number = ?
    WHERE resident_id = ?
");
$stmt->bind_param("sssi", $fullName, $email, $phone, $studentID);

if ($stmt->execute()) {

    // Update session so sidebar shows new info
    $_SESSION['student_name'] = $fullName;
    $_SESSION['student_email'] = $email;
    $_SESSION['student_phone'] = $phone;

    echo "
        <script>
            alert('Profile updated successfully!');
            window.location.href='../student_dashboard.php';
        </script>
    ";
} else {
    echo "Error updating profile: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
