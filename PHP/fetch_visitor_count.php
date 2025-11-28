<?php
// fetch_visitor_count.php

include 'db.php'; // your database connection file

try {
    $stmt = $conn->prepare("SELECT COUNT(*) AS totalVisitors FROM visitor");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'visitors' => $result['totalVisitors'] ?? 0
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
