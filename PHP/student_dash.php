<?php
// Include database connection
include 'db.php';
session_start();

// Make sure student is logged in and has an ID in session
if (!isset($_SESSION['student_id'])) {
    echo json_encode(['error' => 'Student not logged in']);
    exit;
}

$student_id = $_SESSION['student_id'];

// Prepare array to store counts
$data = [];

// Function to get count for a specific status
function getRequestCount($conn, $student_id, $status = null) {
    if ($status) {
        $query = "SELECT COUNT(*) as count FROM requests WHERE student_id=? AND status=?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("is", $student_id, $status);
    } else {
        $query = "SELECT COUNT(*) as count FROM requests WHERE student_id=?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $student_id);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $count = $result->fetch_assoc()['count'];
    $stmt->close();
    return $count;
}

// Get counts
$data['denied'] = getRequestCount($conn, $student_id, 'Denied');
$data['accepted'] = getRequestCount($conn, $student_id, 'Accepted');
$data['total'] = getRequestCount($conn, $student_id);

// Return data as JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
