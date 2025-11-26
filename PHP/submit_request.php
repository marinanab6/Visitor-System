<?php
session_start();
include "db.php";

// Make sure user is logged in as a student
if (!isset($_SESSION['username']) || $_SESSION['role'] !== 'student') {
    die("Error: Student not logged in.");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 1. Collect form data
    $visitorName   = trim($_POST['visitorName']);
    $visitorPhone  = trim($_POST['visitorPhone']);
    $visitorID     = trim($_POST['visitorID']);
    $visitDate     = $_POST['visitDate'];
    $visitTime     = $_POST['visitTime'];
    $visitReason   = trim($_POST['visitReason']);

    $username = $_SESSION['username']; // Logged in student's username

    /* ------------------------------------------------------
       STEP 1: Get user_id from user_account table
       ------------------------------------------------------ */
    $stmtUser = $conn->prepare("SELECT user_id FROM user_account WHERE username = ?");
    $stmtUser->bind_param("s", $username);
    $stmtUser->execute();
    $stmtUser->bind_result($userID);
    $stmtUser->fetch();
    $stmtUser->close();

    if (!$userID) {
        die("Error: User ID not found.");
    }

    /* ------------------------------------------------------
       STEP 2: Get student_resident_id from student_resident
       ------------------------------------------------------ */
    $stmtStudent = $conn->prepare("SELECT student_id FROM student_resident WHERE user_id = ?");
    $stmtStudent->bind_param("i", $userID);
    $stmtStudent->execute();
    $stmtStudent->bind_result($studentResidentID);
    $stmtStudent->fetch();
    $stmtStudent->close();

    if (!$studentResidentID) {
        die("Error: Student Resident ID not found.");
    }

    /* ------------------------------------------------------
       STEP 3: Handle visitor photo upload
       ------------------------------------------------------ */
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

    /* ------------------------------------------------------
       STEP 4: Insert visitor into visitor table
       ------------------------------------------------------ */
    $stmtVisitor = $conn->prepare("
        INSERT INTO visitor (full_name, phone_number, email, id_number, visitor_photo, student_resident_id)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    // Email is optional for visitors → Use NULL or empty string
    $visitorEmail = "";  

    $stmtVisitor->bind_param(
        "sssssi",
        $visitorName,
        $visitorPhone,
        $visitorEmail,
        $visitorID,
        $newPhotoName,
        $studentResidentID
    );

    if (!$stmtVisitor->execute()) {
        die("Error inserting visitor: " . $stmtVisitor->error);
    }

    // Get visitor's auto-generated visitor_id
    $newVisitorID = $stmtVisitor->insert_id;
    $stmtVisitor->close();

    /* ------------------------------------------------------
       STEP 5: Insert visit request into visit_table
       ------------------------------------------------------ */
    $stmt = $conn->prepare("
        INSERT INTO visit_table (visitor_id, visit_date, visit_time, visit_reason, student_id)
        VALUES (?, ?, ?, ?, ?)
    ");

    $stmt->bind_param(
        "isssi",
        $newVisitorID,
        $visitDate,
        $visitTime,
        $visitReason,
        $studentResidentID
    );

    if ($stmt->execute()) {
        echo "<h2>Request Submitted Successfully 🎉</h2>";
        echo "<a href='../student.html'>Go back to Dashboard</a>";
    } else {
        echo "Error submitting request: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
