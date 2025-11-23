<?php
include "db.php"; 
header("Content-Type: application/json");

// Count by status from the correct table
$sqlApproved = "SELECT COUNT(*) AS total FROM visit_log WHERE status = 'approved'";
$sqlRejected = "SELECT COUNT(*) AS total FROM visit_log WHERE status = 'rejected'";
$sqlPending  = "SELECT COUNT(*) AS total FROM visit_log WHERE status = 'pending'";

$resultApproved = mysqli_query($conn, $sqlApproved);
$resultRejected = mysqli_query($conn, $sqlRejected);
$resultPending  = mysqli_query($conn, $sqlPending);

echo json_encode([
    "approved" => mysqli_fetch_assoc($resultApproved)["total"],
    "rejected" => mysqli_fetch_assoc($resultRejected)["total"],
    "pending"  => mysqli_fetch_assoc($resultPending)["total"]
]);
?>
