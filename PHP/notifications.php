<?php
session_start();
include 'db.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode([]); // not logged in, return empty
    exit();
}

$userId = $_SESSION['user_id'];
$role = $_SESSION['role'];

$notifications = [];

if ($role === 'student') {
    // For students: get their requests and current status
    $stmt = $conn->prepare("
        SELECT visit_id, visitor_name, status, visit_date, visit_time 
        FROM visit_table 
        WHERE student_id = ? 
        ORDER BY visit_id DESC
    ");
    $stmt->bind_param("i", $userId);

} elseif ($role === 'manager') {
    // For managers: get pending requests to approve
    $stmt = $conn->prepare("
        SELECT visit_id, visitor_name, student_id, status, visit_date, visit_time 
        FROM visit_table 
        WHERE status = 'pending'
        ORDER BY visit_id DESC
    ");
} else {
    // For other roles (e.g., admin) you can customize
    $stmt = $conn->prepare("
        SELECT visit_id, visitor_name, student_id, status, visit_date, visit_time 
        FROM visit_table
        ORDER BY visit_id DESC
    ");
}

$stmt->execute();
$result = $stmt->get_result();

// Fetch results into notifications array
while ($row = $result->fetch_assoc()) {
    $notifications[] = $row;
}

// Return notifications as JSON
header('Content-Type: application/json');
echo json_encode($notifications);

$stmt->close();
$conn->close();
?>
