<?php
session_start();
include 'db.php'; // Make sure $conn is a PDO connection

// Check login
if (!isset($_SESSION['username']) || $_SESSION['role'] !== 'student') {
    echo json_encode(["success" => false, "error" => "Not logged in"]);
    exit();
}else if (!isset($_SESSION['username']) || $_SESSION['role'] !== 'manager') {
    echo json_encode(["success" => false, "error" => "Not logged in"]);
    exit();
}else if (!isset($_SESSION['username']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(["success" => false, "error" => "Not logged in"]);
    exit();
}else if (!isset($_SESSION['username']) || $_SESSION['role'] !== 'security') {
    echo json_encode(["success" => false, "error" => "Not logged in"]);
    exit();
}

// Get resident ID from session (assuming you saved it during login)
$studentID = $_SESSION['student_id'] ?? null;
if (!$studentID) {
    echo json_encode(["success" => false, "error" => "Invalid session"]);
    exit();
}

$staff_id = $_SESSION['staff_id'] ?? null;
if (!$staff_id) {
    echo json_encode(["success" => false, "error" => "Invalid session"]);
    exit();
}

$officcer_id = $_SESSION['officer_id'] ?? null;
if (!$officcer_id) {
    echo json_encode(["success" => false, "error" => "Invalid session"]);
    exit();
}
// Get submitted data (support both JSON fetch and traditional POST)
$data = $_POST;
if (empty($data)) {
    $data = json_decode(file_get_contents('php://input'), true);
}

$fullName = trim($data['full_name'] ?? '');
$email    = trim($data['email'] ?? '');
$phone    = trim($data['phone'] ?? '');

// Validate required fields
if (!$fullName || !$email || !$phone) {
    echo json_encode(["success" => false, "error" => "All fields are required"]);
    exit();
}

// Update student profile using PDO
try {
    $stmt = $conn->prepare("
        UPDATE student_resident 
        SET full_name = :full_name, email = :email, phone_number = :phone
        WHERE student_id = :id
    ");

    $stmt->execute([
        ':full_name' => $fullName,
        ':email'     => $email,
        ':phone'     => $phone,
        ':id'        => $studentID
    ]);

    // Update session so dashboard reflects new info
    $_SESSION['student_full_name'] = $fullName;
    $_SESSION['email'] = $email;
    $_SESSION['student_phone'] = $phone;

    echo json_encode(["success" => true, "message" => "Profile updated successfully!"]);

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

?>
