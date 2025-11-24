<?php
session_start();
include 'db.php';

// Check login
if (!isset($_SESSION['student_id'])) {
    echo json_encode(["success" => false, "error" => "Not logged in"]);
    exit();
}

$studentID = $_SESSION['student_id'];

// Get submitted data
$currentPassword = trim($_POST['current_password']);
$newPassword = trim($_POST['new_password']);
$confirmPassword = trim($_POST['confirm_password']);

// Validate new password match
if ($newPassword !== $confirmPassword) {
    echo json_encode(["success" => false, "error" => "New password and confirm password do not match."]);
    exit();
}

// Get current password hash from database
$stmt = $conn->prepare("SELECT password FROM user_account WHERE resident_id = ?");
$stmt->bind_param("i", $studentID);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows !== 1) {
    echo json_encode(["success" => false, "error" => "User not found."]);
    exit();
}

$user = $result->fetch_assoc();

// Verify current password
if (!password_verify($currentPassword, $user['password'])) {
    echo json_encode(["success" => false, "error" => "Current password is incorrect."]);
    exit();
}

// Hash new password
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

// Update password
$updateStmt = $conn->prepare("UPDATE user_account SET password = ? WHERE resident_id = ?");
$updateStmt->bind_param("si", $hashedPassword, $studentID);

if ($updateStmt->execute()) {
    echo json_encode(["success" => true, "message" => "Password updated successfully!"]);
} else {
    echo json_encode(["success" => false, "error" => $updateStmt->error]);
}

$updateStmt->close();
$stmt->close();
$conn->close();
?>
