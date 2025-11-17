<?php
session_start();
include "db.php";  // adjust path if needed

// Make sure user is logged in
if (!isset($_SESSION['student_id'])) {
    die("Error: Student not logged in.");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 1. Get form data
    $visitorName   = trim($_POST['visitorName']);
    $visitorPhone  = trim($_POST['visitorPhone']);
    $visitorID     = trim($_POST['visitorID']);   // ID/Passport number
    $visitDate     = $_POST['visitDate'];
    $visitTime     = $_POST['visitTime'];
    $visitReason   = trim($_POST['visitReason']);

    // Student ID from session
    $email    = $_SESSION['email'];

    // 2. Handle Visitor Photo Upload
    $photoName = $_FILES['visitorPhoto']['name'];
    $photoTmp  = $_FILES['visitorPhoto']['tmp_name'];

    // Folder to save photos
    $uploadDir = "uploads/";  

    // Create folder if not exists
    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Give photo a unique name
    $newPhotoName = time() . "_" . $photoName;
    $photoPath = $uploadDir . $newPhotoName;

    // Upload the image
    if (!move_uploaded_file($photoTmp, $photoPath)) {
        die("Error uploading photo.");
    }

    // 3. Insert Request Into visit_table
    $stmt = $conn->prepare("
        INSERT INTO visit_table 
        (visitor_name, visitor_phone, visitor_id, visit_date, visit_time, visit_reason, student_id, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')
    ");

    $stmt->bind_param(
        "ssssssi",
        $visitorName,
        $visitorPhone,
        $visitorID,
        $visitDate,
        $visitTime,
        $visitReason,
        $studentID
    );

    if ($stmt->execute()) {
        echo "success";
    } else {
        echo "Error submitting request: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
