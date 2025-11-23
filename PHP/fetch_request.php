<?php
include 'db.php';

$response = [];

$sql = "
    SELECT 
        vl.log_id,
        v.full_name AS visitor_name,
        v.phone_number AS visitor_phone,
        v.visitor_id,
        v.email,
        v.id_number,
        v.visit_date,
        v.purpose AS visit_reason,
        sr.full_name AS student_name,
        vl.check_in,
        vl.check_out,
        vl.status
    FROM visit_log vl
    LEFT JOIN visitor v ON vl.visitor_id = v.visitor_id
    LEFT JOIN student_resident sr ON v.resident_id = sr.resident_id
    ORDER BY v.visit_date DESC
";

$result = $conn->query($sql);

if ($result) {
    while($row = $result->fetch_assoc()) {
        if (empty($row['student_name'])) {
            $row['student_name'] = "Unknown";
        }
        $row['status'] = strtolower($row['status']);
        $response[] = $row;  // ✅ This must be inside the loop
    }
} else {
    $response = ["error" => $conn->error];
}

header("Content-Type: application/json");
echo json_encode($response);
?>
