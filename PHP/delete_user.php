<?php
include 'db.php';
$data = json_decode(file_get_contents("php://input"), true);
$userId = $data['userId'];
$role = $data['role'];

// Delete user
$stmt = $conn->prepare("DELETE FROM user_account WHERE user_id = ? AND role = ?");
$stmt->execute([$userId, $role]);

echo json_encode(['success' => true, 'message' => 'Account deleted successfully.']);
?>
