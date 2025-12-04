<?php
header('Content-Type: application/json');
session_start();
include 'db.php'; // PDO connection

if (!isset($_SESSION['username']) || $_SESSION['role'] !== 'student') {
    echo json_encode(["success" => false, "error" => "Not logged in"]);
    exit();
}

$studentID = $_SESSION['student_id'] ?? null;
if (!$studentID) {
    echo json_encode(["success" => false, "error" => "Invalid session"]);
    exit();
}

$imagePath = null;
if(isset($_FILES['profileImage'])){
    $uploadDir = __DIR__ . "/uploads/"; 
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    $fileName = time() . "_" . basename($_FILES['profileImage']['name']);
    $targetFile = $uploadDir . $fileName;

    if(move_uploaded_file($_FILES['profileImage']['tmp_name'], $targetFile)){
        $imagePath = "PHP/uploads/" . $fileName; // relative path for browser
        $stmt = $conn->prepare("UPDATE user_account SET profile_picture = :image WHERE student_id = :id");
        $stmt->execute([':image' => $imagePath, ':id' => $studentID]);
    } else {
        echo json_encode(["success" => false, "error" => "Failed to upload image"]);
        exit();
    }
}

// Update other profile info if provided
$fullName = trim($_POST['full_name'] ?? '');
$email    = trim($_POST['email'] ?? '');
$phone    = trim($_POST['phone'] ?? '');

if ($fullName && $email && $phone) {
    $stmt = $conn->prepare("UPDATE user_account SET full_name=:full_name,email=:email,phone_number=:phone WHERE student_id=:id");
    $stmt->execute([
        ':full_name'=>$fullName,
        ':email'=>$email,
        ':phone'=>$phone,
        ':id'=>$studentID
    ]);
    $_SESSION['student_full_name']=$fullName;
    $_SESSION['email']=$email;
    $_SESSION['student_phone']=$phone;
}

$response = ["success" => true, "message" => "Profile updated successfully!"];
if($imagePath) $response['imagePath'] = $imagePath;

echo json_encode($response);
?>
