<?php
include "db.php";

header("Content-Type: application/json");

if (!isset($_GET['phone']) || $_GET['phone'] === "") {
    echo json_encode(["status" => "error", "message" => "Phone number missing"]);
    exit;
}

$phone = $_GET['phone'];

try {
    $sql = "SELECT * FROM visits WHERE visitor_phone = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$phone]);

    if ($stmt->rowCount() == 0) {
        echo json_encode(["status" => "not_found"]);
        exit;
    }

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "found",
        "visit_id" => $row["visit_id"],
        "visitor_name" => $row["visitor_name"],
        "phone" => $row["visitor_phone"],
        "purpose" => $row["purpose"],
        "student_name" => $row["student_name"],
        "room_number" => $row["room_number"]
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
