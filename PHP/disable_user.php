<?php
include 'db.php';
$data = json_decode(file_get_contents("php://input"), true);
$userId = $data['userId'];
$role = $data['role'];

// Example for disabling a user
$stmt = $conn->prepare("UPDATE user_account SET role = 'disabled' WHERE user_id = ? AND role = ?");
$stmt->execute([$userId, $role]);

echo json_encode(['success' => true, 'message' => 'Account disabled successfully.']);
?>
