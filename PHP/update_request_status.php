<?php
header('Content-Type: application/json'); 
include 'db.php'; // PDO connection ($conn)

if(isset($_POST['visit_id'], $_POST['action'])) {

    $visit_id = $_POST['visit_id'];
    $action = $_POST['action'];

    if($action === 'approve') {
        $status = 'approved';
    } elseif($action === 'reject') {
        $status = 'rejected';
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid action']);
        exit();
    }

    try {
        // 1. Get student_id for this visit
        $stmtStudent = $conn->prepare("SELECT student_id FROM visit_table WHERE visit_id = ?");
        $stmtStudent->execute([$visit_id]);
        $row = $stmtStudent->fetch(PDO::FETCH_ASSOC);

        if(!$row) {
            echo json_encode(['status' => 'error', 'message' => 'Visit not found']);
            exit();
        }

        $studentID = $row['student_id'];

        // 2. Update visit_table status
        $stmt = $conn->prepare("UPDATE visit_table SET status = :status WHERE visit_id = :visit_id");
        $stmt->execute([':status' => $status, ':visit_id' => $visit_id]);

        // 3. Insert notification
        $notificationMsg = ($status === 'approved') 
            ? "✅ Your request has been approved!" 
            : "❌ Your request was rejected.";

        $stmtNotif = $conn->prepare("INSERT INTO notifications (student_id, message) VALUES (?, ?)");
        $stmtNotif->execute([$studentID, $notificationMsg]);

        echo json_encode(['status' => 'success']);

    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }

} else {
    echo json_encode(['status' => 'error', 'message' => 'Missing parameters']);
}
?>
