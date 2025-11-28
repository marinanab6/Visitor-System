<?php
// db.php  (PostgreSQL connection using PDO)

$host = "localhost";
$port = "5432";
$dbname = "visitor-hostel-system";
$user = "postgres";
$pass = "1234";

try {
    // Create a PDO connection
    $conn = new PDO("pgsql:host=$host;port=$port;dbname=$dbname;", $user, $pass);

    // Set error mode
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // echo "Connected successfully"; // for testing
} 
catch (PDOException $e) {
    die("PostgreSQL Connection failed: " . $e->getMessage());
}
?>
