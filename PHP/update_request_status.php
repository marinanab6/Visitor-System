<?php
include 'db.php';

if(isset($_POST['visit_id'], $_POST['action'])) {
    $visit_id = $_POST['visit_id'];
    $action = $_POST['action'];

    // Determine status value
    if($action === 'approve') {
        $status = 'approved';
    } elseif($action === 'reject') {
        $status = 'rejected';
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
        exit;
    }

    // Update database
    $stmt = $pdo->prepare("UPDATE requests SET status = :status WHERE visit_id = :visit_id");
    if($stmt->execute([':status' => $status, ':visit_id' => $visit_id])) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Database update failed']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Missing parameters']);
}
?>
