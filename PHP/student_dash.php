<?php
session_start();
include 'db.php'; // PDO connection

if (!isset($_SESSION['student_id'])) {
    echo json_encode(['error' => 'Invalid session']);
    exit;
}

$student_id = $_SESSION['student_id'];

// Function to get request count
function getRequestCount($conn, $student_id, $status = null) {
    if ($status) {
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM requests WHERE student_id = :student_id AND status = :status");
        $stmt->execute([':student_id' => $student_id, ':status' => $status]);
    } else {
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM requests WHERE student_id = :student_id");
        $stmt->execute([':student_id' => $student_id]);
    }

    return (int)$stmt->fetch(PDO::FETCH_ASSOC)['count'];
}

// Get counts
$data = [
    'denied' => getRequestCount($conn, $student_id, 'rejected'),
    'accepted' => getRequestCount($conn, $student_id, 'approved'),
    'total' => getRequestCount($conn, $student_id)
];

// Return JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
