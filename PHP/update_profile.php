<?php
session_start();
include 'db.php';

// Check login
if (!isset($_SESSION['student_id'])) {
    echo json_encode(["success" => false, "error" => "Not logged in"]);
    exit();
}

$studentID = $_SESSION['student_id'];

// Get submitted data (assuming POST via fetch or form)
$fullName = trim($_POST['full_name']);
$email = trim($_POST['email']);
$phone = trim($_POST['phone']);

// Update student profile
$stmt = $conn->prepare("
    UPDATE student_resident 
    SET full_name = ?, email = ?, phone_number = ?
    WHERE resident_id = ?
");
$stmt->bind_param("sssi", $fullName, $email, $phone, $studentID);

if ($stmt->execute()) {
    // Update session so dashboard reflects new info
    $_SESSION['student_full_name'] = $fullName;
    $_SESSION['student_email'] = $email;
    $_SESSION['student_phone'] = $phone;

    echo json_encode(["success" => true, "message" => "Profile updated successfully!"]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
