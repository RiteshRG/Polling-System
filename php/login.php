<?php
include "dbConfig.php"; 

session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $emailOrUsername = $_POST['email'] ?? $_POST['username'];
    $password = $_POST['password'];

    if(filter_var($emailOrUsername, FILTER_VALIDATE_EMAIL)){
        $sql = "SELECT id, username, email, password FROM users WHERE email = ?";
    } else {
        $sql = "SELECT id, username, email, password FROM users WHERE username = ?";
    }
    $params = array($emailOrUsername);
    $stmt = sqlsrv_query($conn, $sql, $params);

    if ($stmt === false) {
        echo "Error: Unable to process request.";
        die(print_r(sqlsrv_errors(), true));
    }

    $params = array($emailOrUsername);
    $stmt = sqlsrv_query($conn, $sql, $params);

    if ($stmt === false) {
        echo "Error: Unable to process request.";
        die(print_r(sqlsrv_errors(), true));
    }

    if ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
        if ($password === $row['password']) { 
            echo "user login successfully.";
            session_start();
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['username'] = $row['username'];
            $_SESSION['email'] = $row['email'];

            setcookie("user_id", $row['id'], time() + (3 * 24 * 60 * 60), "/"); 
            setcookie("username", $row['username'], time() + (3 * 24 * 60 * 60), "/");
            setcookie("email", $row['email'], time() + (3 * 24 * 60 * 60), "/");
        } else {
            echo "Error: Incorrect password.";
            session_unset();  
            session_destroy();
        }
    } else {
        echo "Error: No user found with that email or username.";
        session_unset();  
        session_destroy();
    }

    sqlsrv_close($conn); // Close database connection
}

?>