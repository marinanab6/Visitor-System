<?php
include "db.php"; 
header("Content-Type: application/json");

// Count by status from visit_table
$sqlApproved = "SELECT COUNT(*) AS total FROM visit_table WHERE status = 'approved'";
$sqlRejected = "SELECT COUNT(*) AS total FROM visit_table WHERE status = 'rejected'";
$sqlPending  = "SELECT COUNT(*) AS total FROM visit_table WHERE status = 'pending'";

$resultApproved = mysqli_query($conn, $sqlApproved);
$resultRejected = mysqli_query($conn, $sqlRejected);
$resultPending  = mysqli_query($conn, $sqlPending);

echo json_encode([
    "approved" => intval(mysqli_fetch_assoc($resultApproved)["total"]),
    "rejected" => intval(mysqli_fetch_assoc($resultRejected)["total"]),
    "pending"  => intval(mysqli_fetch_assoc($resultPending)["total"])
]);
?>
