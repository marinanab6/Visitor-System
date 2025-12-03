<?php
session_start();
include 'db.php'; // make sure this connects to PostgreSQL using PDO

// Check login
if (!isset($_SESSION['student_id'])) {
    echo json_encode(["success" => false, "error" => "Not logged in"]);
    exit();
}

$studentID = $_SESSION['student_id'];

// Get raw JSON input
$data = json_decode(file_get_contents('php://input'), true);

// Now extract
$email = $data['email'] ?? '';
$currentPassword = $data['current'] ?? '';
$newPassword = $data['newPass'] ?? '';

// Validate
if (empty($email) || empty($currentPassword) || empty($newPassword)) {
    echo json_encode(["success" => false, "message" => "Missing data."]);
    exit();
}

// Validate new password match
if ($newPassword !== $confirmPassword) {
    echo json_encode(["success" => false, "error" => "New password and confirm password do not match."]);
    exit();
}

// Get current password hash from database
$stmt = $conn->prepare("SELECT password FROM user_account WHERE resident_id = :id");
$stmt->execute([':id' => $studentID]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(["success" => false, "error" => "User not found."]);
    exit();
}

// Verify current password
if (!password_verify($currentPassword, $user['password'])) {
    echo json_encode(["success" => false, "error" => "Current password is incorrect."]);
    exit();
}

// Hash new password
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

// Update password
$updateStmt = $conn->prepare("UPDATE user_account SET password = :password WHERE resident_id = :id");
if ($updateStmt->execute([':password' => $hashedPassword, ':id' => $studentID])) {
    echo json_encode(["success" => true, "message" => "Password updated successfully!"]);
} else {
    echo json_encode(["success" => false, "error" => "Failed to update password."]);
}
?>
