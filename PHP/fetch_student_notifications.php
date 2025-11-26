<?php
session_start();
include "db.php";

header("Content-Type: application/json");

// Check if logged-in user is a student
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'student') {
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

$userID = $_SESSION['user_id']; // student ID in user_account table

// Find the student_resident.student_id linked with this user
$studentQuery = $conn->prepare(
    "SELECT student_id FROM student_resident WHERE user_id = ?"
);
$studentQuery->bind_param("i", $userID);
$studentQuery->execute();
$studentResult = $studentQuery->get_result();

if ($studentResult->num_rows === 0) {
    echo json_encode([]);
    exit();
}

$studentID = $studentResult->fetch_assoc()['student_id'];

// Now fetch all visit requests for this student
$sql = $conn->prepare(
    "SELECT 
        vt.visit_id,
        v.full_name AS visitor_name,
        vt.status,
        vt.visit_date
    FROM visit_table vt
    JOIN visitor v ON vt.visitor_id = v.visitor_id
    WHERE vt.student_id = ?
    ORDER BY vt.visit_date DESC"
);

$sql->bind_param("i", $studentID);
$sql->execute();
$result = $sql->get_result();

$notifications = [];

while ($row = $result->fetch_assoc()) {
    $row['status'] = strtolower($row['status']);
    $notifications[] = $row;
}

echo json_encode($notifications);
?>
