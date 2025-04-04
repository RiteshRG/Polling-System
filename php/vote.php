<?php
session_start();
header("Content-Type: application/json");
include "dbConfig.php";

// Ensure user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

$userId = $_SESSION['user_id'];
$data = json_decode(file_get_contents("php://input"), true);

// Validate poll_id and option_id in request
if (!isset($data['poll_id']) || !isset($data['option_id'])) {
    echo json_encode(["error" => "Invalid request"]);
    exit;
}

$pollId = $data['poll_id'];  // Ensure poll_id is passed correctly
$optionId = $data['option_id'];

// Check if the poll exists
$pollQuery = "SELECT user_id FROM polls WHERE id = ?";
$pollStmt = sqlsrv_query($conn, $pollQuery, [$pollId]);
if (!$pollStmt) {
    $error = "Poll query failed: " . print_r(sqlsrv_errors(), true);
    error_log($error); // Log the error to server logs
    echo json_encode([
        "error" => "Poll query failed",
        "details" => sqlsrv_errors(),
        "query" => $pollQuery,
        "params" => [$pollId]
    ]);
    exit;
}

$ownerRow = sqlsrv_fetch_array($pollStmt, SQLSRV_FETCH_ASSOC);
if (!$ownerRow) {
    echo json_encode(["error" => "Poll not found"]);
    exit;
}

// Check if the user is the owner of the poll
if ($ownerRow['user_id'] == $userId) {
    echo json_encode(["error" => "You cannot vote on your own poll."]);
    exit;
}

// Check if the option exists
$optionQuery = "SELECT id FROM poll_options WHERE id = ? AND poll_id = ?";
$optionStmt = sqlsrv_query($conn, $optionQuery, [$optionId, $pollId]);
if (!$optionStmt) {
    $error = "Option query failed: " . print_r(sqlsrv_errors(), true);
    error_log($error); // Log the error to server logs
    echo json_encode([
        "error" => "Option query failed",
        "details" => sqlsrv_errors(),
        "query" => $optionQuery,
        "params" => [$optionId, $pollId]
    ]);
    exit;
}

$optionRow = sqlsrv_fetch_array($optionStmt, SQLSRV_FETCH_ASSOC);
if (!$optionRow) {
    echo json_encode(["error" => "Option not found for this poll"]);
    exit;
}

// Check if the user has already voted
$checkVoteQuery = "SELECT id FROM votes WHERE user_id = ? AND option_id IN (SELECT id FROM poll_options WHERE poll_id = ?)";
$checkVoteStmt = sqlsrv_query($conn, $checkVoteQuery, [$userId, $pollId]);
if (!$checkVoteStmt) {
    $error = "Vote check query failed: " . print_r(sqlsrv_errors(), true);
    error_log($error); // Log the error to server logs
    echo json_encode([
        "error" => "Vote check query failed",
        "details" => sqlsrv_errors(),
        "query" => $checkVoteQuery,
        "params" => [$userId, $pollId]
    ]);
    exit;
}

if (sqlsrv_fetch_array($checkVoteStmt, SQLSRV_FETCH_ASSOC)) {
    echo json_encode(["error" => "You have already voted in this poll."]);
    exit;
}

// Insert the vote
$voteQuery = "INSERT INTO votes (user_id, option_id, poll_id) VALUES (?, ?, ?)";
$voteStmt = sqlsrv_query($conn, $voteQuery, [$userId, $optionId, $pollId]);

if ($voteStmt) {
    echo json_encode(["success" => "Vote recorded successfully"]);
} else {
    $error = "Failed to record vote: " . print_r(sqlsrv_errors(), true);
    error_log($error); // Log the error to server logs
    echo json_encode([
        "error" => "Failed to record vote",
        "details" => sqlsrv_errors(),
        "query" => $voteQuery,
        "params" => [$userId, $optionId, $pollId]
    ]);
}
?>
