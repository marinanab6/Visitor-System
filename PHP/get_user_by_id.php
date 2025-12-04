<?php
include 'db.php'; // PDO connection $conn

$role = $_GET['role'] ?? '';
$id = $_GET['id'] ?? '';

if (!$role || !$id) {
    echo json_encode(null);
    exit;
}

try {
    if ($role === 'student') {
        $stmt = $conn->prepare("
            SELECT sr.student_id AS id, ua.full_name AS name, ua.email
            FROM student_resident sr
            JOIN user_account ua ON sr.user_id = ua.user_id
            WHERE sr.student_id = :id
        ");
    } elseif ($role === 'manager') {
        $stmt = $conn->prepare("
            SELECT s.staff_id AS id, s.name, ua.email
            FROM staff s
            JOIN user_account ua ON s.staff_id = ua.user_id
            WHERE s.staff_id = :id
        ");
    } elseif ($role === 'security') {
        $stmt = $conn->prepare("
            SELECT so.officer_id AS id, ua.full_name AS name, ua.email
            FROM security_officer so
            JOIN user_account ua ON so.user_id = ua.user_id
            WHERE so.officer_id = :id
        ");
    } else {
        echo json_encode(null);
        exit;
    }

    $stmt->execute([':id' => $id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    echo json_encode($user ?: null);

} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
