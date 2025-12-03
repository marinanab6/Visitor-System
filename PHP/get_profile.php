<?php
session_start();
include 'db.php'; // your PDO connection

$email = $_GET['email'] ?? '';
if (!$email) {
    echo json_encode(["success" => false, "message" => "Email not provided"]);
    exit();
}

try {
    $stmt = $conn->prepare("SELECT profile_picture FROM user_account WHERE email = :email");
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && $user['profile_picture']) {
        echo json_encode(["success" => true, "profile_picture" => $user['profile_picture']]);
    } else {
        echo json_encode(["success" => true, "profile_picture" => ""]); // no picture yet
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>
