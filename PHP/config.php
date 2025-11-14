<?php
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "visitor-hostel-system"; // use your real database name

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
