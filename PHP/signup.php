<?php
include 'db.php'; // Must contain: $conn = new PDO(...)

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $full_name = $_POST['full_name'];
    $username  = $_POST['username'];
    $email     = $_POST['email'];
    $password  = $_POST['password'];
    $role      = $_POST['role'];
    $student_id = $_POST['student_id'];

    // Hash the password
    $hashed_pass = password_hash($password, PASSWORD_DEFAULT);

    try {
        // Insert into user_account
        $stmt = $conn->prepare("
            INSERT INTO user_account (full_name, username, email, password, role)
            VALUES (:full_name, :username, :email, :password, :role)
        ");

        $stmt->execute([
            ':full_name' => $full_name,
            ':username'  => $username,
            ':email'     => $email,
            ':password'  => $hashed_pass,
            ':role'      => $role
        ]);

        // Get last inserted ID
        $user_id = $conn->lastInsertId();

        // If role is student, insert into student_resident
        if ($role === 'student') {

            $student_id  = $_POST['student_id'];
            $room_number = $_POST['room_number'];

            $stmt2 = $conn->prepare("
                INSERT INTO student_resident (student_id, user_id, room_number)
                VALUES (:student_id, :user_id, :room_number)
            ");

            $stmt2->execute([
                ':student_id'  => $student_id,
                ':user_id'     => $user_id,
                ':room_number' => $room_number
            ]);
        }

        echo "Signup successful! You can now log in.<br>";
        echo "<a href='../login.html'>Go to Login</a>";

    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}
?>
