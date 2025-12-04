<?php
include 'db.php'; // Your PDO connection

$role = $_GET['role'] ?? '';
$table = '';

switch($role) {
    case 'student': $table = 'students'; break;
    case 'manager': $table = 'managers'; break;
    case 'security': $table = 'security_officers'; break;
    default: exit(json_encode([]));
}

$stmt = $conn->query("SELECT id, name FROM $table ORDER BY name");
$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($users);
?>
