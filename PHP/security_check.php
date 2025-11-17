<?php
session_start();
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    $visitorPhone = $_POST['visitorPhone']; // The id sent to the student

    // Query: check if visitor exists with accepted request
    $stmt = $conn->prepare("
        SELECT v.visitor_name, v.visitor_phone, v.visit_date, v.visit_time, s.full_name AS student_name, s.room_number
        FROM visit v
        JOIN student_resident s ON v.student_id = s.resident_id
        WHERE v.visitor_phone = ? AND v.status = 'Accepted'
    ");
    $stmt->bind_param("s", $visitorPhone);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $visitor = $result->fetch_assoc();
        echo "<h3>Visitor Details:</h3>";
        echo "Name: " . $visitor['visitor_name'] . "<br>";
        echo "Phone: " . $visitor['visitor_phone'] . "<br>";
        echo "Visit Date: " . $visitor['visit_date'] . "<br>";
        echo "Visit Time: " . $visitor['visit_time'] . "<br>";
        echo "Student Host: " . $visitor['student_name'] . "<br>";
        echo "Room: " . $visitor['room_number'] . "<br>";
    } else {
        echo "<p>No approved visit request found for this ID.</p>";
    }

    $stmt->close();
    $conn->close();
}
?>
