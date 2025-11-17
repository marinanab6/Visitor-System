<?php
session_start();
include "db.php";

// Make sure user is logged in
if (!isset($_SESSION['username']) || $_SESSION['role'] !== 'Student_Resident') {
    die("Error: Student not logged in.");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 1. Get form data
    $visitorName   = trim($_POST['visitorName']);
    $visitorPhone  = trim($_POST['visitorPhone']);
    $visitorID     = trim($_POST['visitorID']);
    $visitDate     = $_POST['visitDate'];
    $visitTime     = $_POST['visitTime'];
    $visitReason   = trim($_POST['visitReason']);

    // Student email from session
    $email = $_SESSION['username'];

    // 🔹 Fetch the username
    $stmtID = $conn->prepare("SELECT username FROM user_account WHERE email = ?");
    $stmtID->bind_param("s", $email);
    $stmtID->execute();
    $stmtID->bind_result($userID);
    $stmtID->fetch();
    $stmtID->close();

    if (!$username) {
        die("Error: Username not found.");
    }

    // 2. Handle photo upload
    $photoName = $_FILES['visitorPhoto']['name'];
    $photoTmp  = $_FILES['visitorPhoto']['tmp_name'];

    $uploadDir = "uploads/";

    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $newPhotoName = time() . "_" . $photoName;
    $photoPath = $uploadDir . $newPhotoName;

    if (!move_uploaded_file($photoTmp, $photoPath)) {
        die("Error uploading photo.");
    }

    // 3. Insert the request
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
        $username
    );

    if ($stmt->execute()) {
        echo "success back to student_dashboard page";
        echo "<br><a href='../student.html'>Go back to Dashboard</a></br>";
    } else {
        echo "Error submitting request: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
