<?php
include 'db.php';

$sql = "SELECT visit.visit_id, visit.visitor_name, visit.status, visit.visit_date, student_resident.full_name 
        FROM visit 
        LEFT JOIN student_resident 
        ON visit.student_id = student_resident.resident_id
        ORDER BY visit.visit_id DESC";

$result = $conn->query($sql);

$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>
