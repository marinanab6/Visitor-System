<?php
include 'db.php';

// Fetch visit requests and student names (using username from user_account)
$sql = "SELECT v.visit_id, v.visitor_name, v.status, v.visit_date, u.username AS student_name
        FROM visit_table v
        LEFT JOIN user_account u 
        ON v.student_id = u.user_id
        ORDER BY v.visit_id DESC";



$result = $conn->query($sql);

$data = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// Return JSON
header('Content-Type: application/json');
echo json_encode($data);
?>
