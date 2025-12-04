<?php
session_start();
include "db.php"; // PDO connection ($conn)

// Ensure user is logged in
if (!isset($_SESSION['username']) || $_SESSION['role'] !== 'student') {
    die("Error: Student not logged in.");
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Collect form data
    $visitorName   = trim($_POST['visitorName']);
    $visitorPhone  = trim($_POST['visitorPhone']);
    $visitorID     = trim($_POST['visitorID']);
    $visitDate     = $_POST['visitDate'];
    $visitTime     = $_POST['visitTime'];
    $visitReason   = trim($_POST['visitReason']);

    $username = $_SESSION['username'];

    /* ------------------------------------------------------
       STEP 1: Get user_id from user_account table
       ------------------------------------------------------ */
    $stmtUser = $conn->prepare("SELECT user_id FROM user_account WHERE username = ?");
    $stmtUser->execute([$username]);
    $user = $stmtUser->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        die("Error: User ID not found.");
    }

    $userID = $user['user_id'];

    /* ------------------------------------------------------
       STEP 2: Get student_resident_id
       ------------------------------------------------------ */
    $stmtStudent = $conn->prepare("SELECT student_id FROM student_resident WHERE user_id = ?");
    $stmtStudent->execute([$userID]);
    $student = $stmtStudent->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        die("Error: Student Resident ID not found.");
    }

    $studentResidentID = $student['student_id'];

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

    $visitorEmail = trim($_POST['visitorEmail']);

    $stmtVisitor->execute([
        $visitorName,
        $visitorPhone,
        $visitorEmail,
        $visitorID,
        $newPhotoName,
        $studentResidentID
    ]);

    $newVisitorID = $conn->lastInsertId();

    /* ------------------------------------------------------
       STEP 5: Insert visit request
       ------------------------------------------------------ */
    $stmt = $conn->prepare("
        INSERT INTO visit_table (visitor_id, visit_date, visit_time, visit_reason, student_id)
        VALUES (?, ?, ?, ?, ?)
    ");

    $success = $stmt->execute([
        $newVisitorID,
        $visitDate,
        $visitTime,
        $visitReason,
        $studentResidentID,
        
    ]);

    if ($success) {
        echo "<h2>Request Submitted Successfully 🎉</h2>";
        echo "<a href='../student.php'>Go back to Dashboard</a>";
    } else {
        echo "Error submitting request.";
    }
}
?>
