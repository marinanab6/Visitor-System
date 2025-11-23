<?php
include "db.php"; 
header("Content-Type: application/json");

$sqlApproved = "SELECT COUNT(*) AS total FROM visit_requests WHERE status = 'approved'";
$sqlRejected = "SELECT COUNT(*) AS total FROM visit_requests WHERE status = 'rejected'";
$sqlPending  = "SELECT COUNT(*) AS total FROM visit_requests WHERE status = 'pending'";

$resultApproved = mysqli_query($conn, $sqlApproved);
$resultRejected = mysqli_query($conn, $sqlRejected);
$resultPending  = mysqli_query($conn, $sqlPending);

echo json_encode([
    "approved" => mysqli_fetch_assoc($resultApproved)["total"],
    "rejected" => mysqli_fetch_assoc($resultRejected)["total"],
    "pending"  => mysqli_fetch_assoc($resultPending)["total"]
]);
?>

