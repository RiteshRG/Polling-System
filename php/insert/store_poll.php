<?php
include "../dbConfig.php"; 
session_start();

// Ensure user is logged in
if (!isset($_SESSION["user_id"])) {
    if (isset($_COOKIE["user_id"])) {
        $_SESSION["user_id"] = $_COOKIE["user_id"];
        $_SESSION["username"] = $_COOKIE["username"] ?? "";
        $_SESSION["email"] = $_COOKIE["email"] ?? "";
    } else {
        echo json_encode(["status" => "error", "message" => "User not logged in"]);
        exit();
    }
}

$user_id = $_SESSION["user_id"];
$title = trim($_POST["title"] ?? "");
$description = trim($_POST["description"] ?? "");
$options = json_decode($_POST["options"] ?? "[]", true);

// Validate input
if (empty($title)) {
    echo json_encode(["status" => "error", "message" => "Title is required"]);
    exit();
}

if (count($options) < 2 || count($options) > 10) {
    echo json_encode(["status" => "error", "message" => "Options must be between 2 and 10"]);
    exit();
}

// Begin SQL Server Transaction
sqlsrv_begin_transaction($conn);

try {
    // Insert poll
    $sql = "INSERT INTO polls (title, description, user_id) OUTPUT INSERTED.id VALUES (?, ?, ?)";
    $params = [$title, $description, $user_id];
    $stmt = sqlsrv_query($conn, $sql, $params);

    if ($stmt === false) {
        throw new Exception("Poll creation failed: " . print_r(sqlsrv_errors(), true));
    }

    // Get inserted poll ID
    sqlsrv_fetch($stmt);
    $poll_id = sqlsrv_get_field($stmt, 0);

    // Insert poll options
    $sql = "INSERT INTO poll_options (poll_id, option_text) VALUES (?, ?)";
    foreach ($options as $option) {
        $params = [$poll_id, trim($option)];
        $stmt = sqlsrv_query($conn, $sql, $params);
        if ($stmt === false) {
            throw new Exception("Option insert failed: " . print_r(sqlsrv_errors(), true));
        }
    }

    // Commit transaction
    sqlsrv_commit($conn);
    echo json_encode(["status" => "success", "message" => "Poll created successfully"]);

} catch (Exception $e) {
    // Rollback transaction in case of error
    sqlsrv_rollback($conn);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
