<?php
include 'db.php';

if (!isset($_GET['visit_id'])) {
    echo json_encode(['error' => 'Visit ID missing']);
    exit();
}

$visit_id = intval($_GET['visit_id']);

$stmt = $conn->prepare("
    SELECT v.visit_id, v.visitor_name, v.visitor_phone, v.visitor_id, v.visit_date, v.visit_time, v.visit_reason,
           s.student_name, s.student_id, v.status
    FROM visit_table v
    LEFT JOIN students s ON v.student_id = s.student_id
    WHERE v.visit_id = ?
    LIMIT 1
");
$stmt->bind_param("i", $visit_id);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    echo json_encode(['error' => 'Visit not found']);
}

$stmt->close();
$conn->close();
?>
