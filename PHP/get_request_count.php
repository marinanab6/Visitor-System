<?php
include 'db.php';

// Count approved
$approved = $conn->query("SELECT COUNT(*) AS total FROM visit WHERE status='approved'")->fetch_assoc()['total'];

// Count rejected
$rejected = $conn->query("SELECT COUNT(*) AS total FROM visit WHERE status='rejected'")->fetch_assoc()['total'];

// Count pending
$pending = $conn->query("SELECT COUNT(*) AS total FROM visit WHERE status='pending'")->fetch_assoc()['total'];

echo json_encode([
    'approved' => $approved,
    'rejected' => $rejected,
    'pending'  => $pending
]);
?>
