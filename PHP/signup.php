<?php
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $full_name = $_POST['full_name'];
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $role = $_POST['role'];

    // Hash the password
    $hashed_pass = password_hash($password, PASSWORD_DEFAULT);

    // Insert into user_account
    $stmt = $conn->prepare("INSERT INTO user_account (full_name, username, email, password, role)
                            VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $full_name, $username, $email, $hashed_pass, $role);

    if ($stmt->execute()) {

        // If role is student, insert into student_resident
        if ($role === 'student') {
            $student_id = $_POST['student_id'];       // from the form
            $room_number = $_POST['room_number'];     // from the form

            $user_id = $conn->insert_id; // get last inserted user_account ID

            $stmt2 = $conn->prepare("INSERT INTO student_resident (student_id, user_id, room_number)
                                     VALUES (?, ?, ?)");
            $stmt2->bind_param("iis", $student_id, $user_id, $room_number);
            $stmt2->execute();
            $stmt2->close();
        }

        echo "Signup successful! You can now log in.";
        echo "<br><a href='../login.html'>Go to Login</a>";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
}
?>
