<?php
session_start();
header('Content-Type: application/json');

$response = ["status" => "logged_out"];

if (!isset($_SESSION['user_id']) && isset($_COOKIE['user_id'])) {
    $_SESSION['user_id'] = $_COOKIE['user_id'];
    $_SESSION['username'] = $_COOKIE['username'];
    $_SESSION['email'] = $_COOKIE['email'];
}

if (isset($_SESSION['user_id'])) {
    $response = ["status" => "logged_in"];
}

echo json_encode($response);
?>
