<?php
include "../dbConfig.php";  


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    $emailCheckSql = "SELECT * FROM users WHERE email = ?";
    $emailCheckStmt = sqlsrv_query($conn, $emailCheckSql, array($email));
    if (sqlsrv_fetch_array($emailCheckStmt)) {
        echo "Error: The email address is already registered.";
        sqlsrv_close($conn);
        exit;
    }

    $usernameCheckSql = "SELECT * FROM users WHERE username = ?";
    $usernameCheckStmt = sqlsrv_query($conn, $usernameCheckSql, array($username));
    if (sqlsrv_fetch_array($usernameCheckStmt)) {
        echo "Error: The username is already taken.";
        sqlsrv_close($conn);
        exit;
    }

    $sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

    $params = array($username, $email, $password);

    $stmt = sqlsrv_query($conn, $sql, $params);

    if ($stmt) {
        echo "Record inserted successfully.";  
    } else {
        $errors = sqlsrv_errors();
        echo "Error: Unable to insert record. Details: ";
        foreach ($errors as $error) {
            echo "Code: " . $error['code'] . " - Message: " . $error['message'] . "<br>";
        }
    }

    sqlsrv_close($conn);
}
?>
