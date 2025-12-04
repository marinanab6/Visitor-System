<?php
session_start();
include 'db.php';

if (!isset($_SESSION['student_id'])) {
    echo json_encode(['error' => 'Invalid session']);
    exit;
}

$student_id = $_SESSION['student_id'];
$status = isset($_GET['status']) ? $_GET['status'] : null;

try {
    if ($status) {
        $stmt = $conn->prepare("SELECT visit_id, visitor_id, visit_date, visit_time, visit_reason, status 
                                FROM visit_table 
                                WHERE student_id = :student_id AND status = :status
                                ORDER BY created_at DESC");
        $stmt->execute([':student_id' => $student_id, ':status' => $status]);
    } else {
        $stmt = $conn->prepare("SELECT visit_id, visitor_id, visit_date, visit_time, visit_reason, status 
                                FROM visit_table 
                                WHERE student_id = :student_id
                                ORDER BY created_at DESC");
        $stmt->execute([':student_id' => $student_id]);
    }

    $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($requests);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
