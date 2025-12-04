<?php
session_start();
include 'db.php'; // PDO connection

// Check if the student is logged in
if (!isset($_SESSION['student_id']) || !$_SESSION['student_id']) {
    echo json_encode(['error' => 'Invalid session']);
    exit;
}

$student_id = $_SESSION['student_id'];

// Function to get request counts
function getRequestCount($conn, $student_id, $status = null) {
    if ($status) {
        $stmt = $conn->prepare(
            "SELECT COUNT(*) as count FROM visit_table WHERE student_id = :student_id AND status = :status"
        );
        $stmt->execute([':student_id' => $student_id, ':status' => $status]);
    } else {
        $stmt = $conn->prepare(
            "SELECT COUNT(*) as count FROM visit_table WHERE student_id = :student_id"
        );
        $stmt->execute([':student_id' => $student_id]);
    }

    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result ? (int)$result['count'] : 0;
}

// Get dashboard data
$data = [
    'denied' => getRequestCount($conn, $student_id, 'rejected'),
    'accepted' => getRequestCount($conn, $student_id, 'approved'),
    'total' => getRequestCount($conn, $student_id)
];

// Return JSON for student.js
header('Content-Type: application/json');
echo json_encode($data);
