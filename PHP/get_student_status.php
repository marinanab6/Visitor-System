<?php
session_start();
include 'db.php'; // make sure $conn is a PDO instance

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["status" => "none"]);
    exit();
}

$userId = $_SESSION['user_id'];

try {
    // Prepare PDO query
    $stmt = $conn->prepare("
        SELECT status 
        FROM visit_table 
        WHERE student_id = :student_id 
        ORDER BY visit_id ASC
        LIMIT 1
    ");

    // Bind parameter
    $stmt->bindParam(':student_id', $userId, PDO::PARAM_INT);

    // Execute query
    $stmt->execute();

    // Fetch result
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
        echo json_encode(["status" => $data['status']]);
    } else {
        echo json_encode(["status" => "none"]);
    }

} catch (PDOException $e) {
    // Optional: Return error in JSON
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

// Close connection (optional for PDO)
$conn = null;
?>
