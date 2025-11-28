<?php
include 'db.php'; // your PDO connection

try {
    $stmt = $conn->query("
        SELECT 
            SUM((status='approved')::int) AS approved, 
            SUM((status='rejected')::int) AS rejected, 
            SUM((status='pending')::int) AS pending 
        FROM visit_table
    ");
    $counts = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'approved' => $counts['approved'],
        'rejected' => $counts['rejected'],
        'pending' => $counts['pending']
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
