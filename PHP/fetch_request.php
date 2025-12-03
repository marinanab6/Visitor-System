<?php
// PHP/fetch_request.php
include 'db.php';  // your PDO connection
header("Content-Type: application/json");

try {
    $sql = "
        SELECT 
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
        ORDER BY vt.visit_date ASC, vt.visit_time ASC
    ";

    $stmt = $conn->query($sql);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Clean up missing student names and normalize status
    foreach ($rows as &$row) {
        if (empty($row['student_name'])) {
            $row['student_name'] = "Unknown";
        }
        $row['status'] = strtolower($row['status']);
    }

    echo json_encode($rows);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
