<?php
header('Content-Type: application/json');
include 'db.php';
session_start();

// Make sure student is logged in
if (!isset($_SESSION['username']) || $_SESSION['role'] !== 'student') {
    echo json_encode(['error' => 'Student not logged in']);
    exit();
}

// Get student_id
$stmtUser = $conn->prepare("SELECT user_id FROM user_account WHERE username = ?");
$stmtUser->execute([$_SESSION['username']]);
$user = $stmtUser->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(['error' => 'User not found']);
    exit();
}

// Get student_resident_id
$stmtStudent = $conn->prepare("SELECT student_id FROM student_resident WHERE user_id = ?");
$stmtStudent->execute([$user['user_id']]);
$student = $stmtStudent->fetch(PDO::FETCH_ASSOC);

if (!$student) {
    echo json_encode(['error' => 'Student not found']);
    exit();
}

// Fetch notifications
$stmtNotif = $conn->prepare("SELECT id, message, is_read, created_at FROM notifications WHERE student_id = ? ORDER BY created_at DESC");
$stmtNotif->execute([$student['student_id']]);
$notifications = $stmtNotif->fetchAll(PDO::FETCH_ASSOC);

// Return JSON
echo json_encode($notifications);
?>
