<?php
session_start();
include 'db.php'; // Make sure this is a PDO connection to PostgreSQL

// Check if email is provided (from JS)
if (!isset($_POST['email']) || empty($_POST['email'])) {
    echo json_encode(["success" => false, "message" => "Email is required."]);
    exit();
}

$email = $_POST['email'];

// Check if file is uploaded
if (!isset($_FILES['profile_picture']) || $_FILES['profile_picture']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(["success" => false, "message" => "Please select a picture to upload."]);
    exit();
}

$file = $_FILES['profile_picture'];

// Validate file type (allow only images)
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($file['type'], $allowedTypes)) {
    echo json_encode(["success" => false, "message" => "Only JPG, PNG, or GIF images are allowed."]);
    exit();
}

// Generate a unique filename to avoid overwriting
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$newFileName = 'profile_' . time() . '_' . rand(1000,9999) . '.' . $ext;

// Set upload folder
$uploadDir = '../uploads/'; // Adjust path if needed
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

$uploadPath = $uploadDir . $newFileName;

// Move uploaded file
if (!move_uploaded_file($file['tmp_name'], $uploadPath)) {
    echo json_encode(["success" => false, "message" => "Failed to upload picture."]);
    exit();
}

// Update database (PostgreSQL)
try {
    $stmt = $conn->prepare("UPDATE user_account SET profile_picture = :photo WHERE email = :email");
    $stmt->execute([
        ':photo' => $newFileName,
        ':email' => $email
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Profile picture uploaded successfully!",
        "filename" => $newFileName
    ]);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>
