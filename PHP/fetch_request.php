<?php
include 'db.php';
header("Content-Type: application/json");

$response = [];

$sql = "SELECT 
            vt.visit_id,
            sr.student_id,
            ua.full_name AS student_name,
            v.full_name AS visitor_name,
            v.phone_number AS visitor_phone,
            vt.visit_time,
            vt.visit_date,
            vt.visit_reason,
            vt.status,
            vt.created_at
        FROM visit_table vt
        LEFT JOIN visitor v ON vt.visitor_id = v.visitor_id
        LEFT JOIN student_resident sr ON vt.student_id = sr.student_id
        LEFT JOIN user_account ua ON sr.user_id = ua.user_id
        ORDER BY vt.visit_date DESC, vt.visit_time DESC";

$result = $conn->query($sql);

if ($result) {
    while($row = $result->fetch_assoc()) {
        if (empty($row['student_name'])) {
            $row['student_name'] = "Unknown";
        }
        $row['status'] = strtolower($row['status']);
        $response[] = $row;
    }
} else {
    $response = ["error" => $conn->error];
}

echo json_encode($response);
?>
