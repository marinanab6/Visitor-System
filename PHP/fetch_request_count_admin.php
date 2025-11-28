<?php
include 'db.php';
header("Content-Type: application/json");

try {
    // Count pending and approved requests
    $sql = "SELECT 
                COUNT(*) FILTER (WHERE status = 'pending') AS pending,
                COUNT(*) FILTER (WHERE status = 'approved') AS approved
            FROM visit_table";

    $stmt = $conn->query($sql);
    $counts = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode($counts);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
