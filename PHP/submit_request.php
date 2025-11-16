<<?php
session_start();
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 1. Get form data
    $visitorName = trim($_POST['visitorName']);
    $visitorPhone = trim($_POST['visitorPhone']);
    $visitorID = trim($_POST['visitorID']);
    $visitDate = $_POST['visitDate'];
    $visitTime = $_POST['visitTime'];
    $visitReason = trim($_POST['visitReason']);

    // 2. Get student/resident ID from session
    $studentID = $_SESSION['student_id']; 

    // 3. Insert into visit table
    $stmt = $conn->prepare("
        INSERT INTO visit (visitor_name, visitor_phone, visitor_id, visit_date, visit_time, visit_reason, student_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->bind_param("ssisssi", $visitorName, $visitorPhone, $visitorID, $visitDate, $visitTime, $visitReason, $studentID);

    if ($stmt->execute()) {
        $visitID = $stmt->insert_id; 

        
        echo "Request submitted successfully!";
    } else {
        echo "Error submitting request: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
}
?>
