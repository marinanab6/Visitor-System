<?php
session_start();
include 'db.php';
header("Content-Type: application/json");

// (Optional) check manager role - keep if you have session roles
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'manager') {
    // If you prefer to allow API calls without session, remove this block
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit();
}

if (!isset($_POST['visit_id']) || !isset($_POST['action'])) {
    echo json_encode(["status" => "error", "message" => "Invalid request"]);
    exit();
}

$visitId = intval($_POST['visit_id']);
$action = $_POST['action']; // "approve" or "reject"

if ($action === "approve") {
    $newStatus = "approved";
} else {
    $newStatus = "rejected";
}

$stmt = $conn->prepare("UPDATE visit_table SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE visit_id = ?");
$stmt->bind_param("si", $newStatus, $visitId);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Request updated"]);
} else {
    echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
}

$stmt->close();
$conn->close();
?>
