<?php
include "db.php";
header("Content-Type: application/json");

if (!isset($_GET['phone_number']) || $_GET['phone_number'] === "") {
    echo json_encode(["status" => "error", "message" => "Phone number missing"]);
    exit;
}

$phone = $_GET['phone_number'];

try {
    // Step 1: Get visitor info
    $sqlVisitor = "SELECT * FROM visitor WHERE phone_number = ?";
    $stmtVisitor = $conn->prepare($sqlVisitor);
    $stmtVisitor->execute([$phone]);

    if ($stmtVisitor->rowCount() === 0) {
        echo json_encode(["status" => "not_found"]);
        exit;
    }

    $visitor = $stmtVisitor->fetch(PDO::FETCH_ASSOC);

    // Step 2: Get latest visit request for this visitor (if any)
    $sqlVisit = "SELECT * FROM visit_table WHERE visitor_id = ? ORDER BY request_time DESC LIMIT 1";
    $stmtVisit = $conn->prepare($sqlVisit);
    $stmtVisit->execute([$visitor['id_number']]); // assuming visitor.id_number = visit_table.visitor_id

    $visit = $stmtVisit->fetch(PDO::FETCH_ASSOC);

    // Return combined info
    echo json_encode([
        "status" => "found",
        "id_number" => $visitor["id_number"],
        "full_name" => $visitor["full_name"],
        "phone_number" => $visitor["phone_number"],
        "email" => $visitor["email"],
        "student_resident_id" => $visitor["student_resident_id"],
        "visitor_photo" => $visitor["visitor_photo"] ?? null,
        "visit_id" => $visit['visit_id'] ?? null,
        "visit_status" => $visit['status'] ?? null,
        "visit_time" => $visit['request_time'] ?? null
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
