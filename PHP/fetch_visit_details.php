<?php
include 'db.php';
header("Content-Type: application/json");

if (!isset($_GET['visit_id'])) {
    echo json_encode(["error" => "Missing visit_id"]);
    exit();
}

$visitId = intval($_GET['visit_id']);

$sql = "SELECT 
            vt.visit_id,
            vt.visitor_id,
            COALESCE(v.full_name, vt.visitor_name) AS visitor_name,
            COALESCE(v.phone_number, vt.visitor_phone) AS visitor_phone,
            v.id_number AS visitor_id_number,
            vt.visit_date,
            vt.visit_time,
            vt.visit_reason,
            vt.status,
            sr.student_id,
            ua.full_name AS student_name
        FROM visit_table vt
        LEFT JOIN visitor v ON vt.visitor_id = v.visitor_id
        LEFT JOIN student_resident sr ON vt.student_id = sr.student_id
        LEFT JOIN user_account ua ON sr.user_id = ua.user_id
        WHERE vt.visit_id = ?
        LIMIT 1";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $visitId);
$stmt->execute();
$result = $stmt->get_result();

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $row['status'] = strtolower($row['status']);
    echo json_encode($row);
} else {
    echo json_encode(["error" => "Not found"]);
}
?>
