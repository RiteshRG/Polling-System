<?php
session_start(); // Start the session
header("Content-Type: application/json"); // Set JSON response header
include "dbConfig.php"; // Include database connection

// Check if user ID is stored in session
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["error" => "User not logged in"]);
    exit;
}

$userId = $_SESSION['user_id']; // Get user ID from session

$query = "
    SELECT 
        p.id AS poll_id, 
        p.user_id AS owner_id, 
        u.username, 
        p.title, 
        p.description, 
        p.created_at,
        po.id AS option_id, 
        po.option_text, 
        COALESCE(COUNT(v.id), 0) AS votes,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM votes v2 WHERE v2.user_id = ? AND v2.option_id = po.id
            ) 
            THEN 'selected' 
            ELSE 'unselected' 
        END AS status
    FROM polls p
    JOIN users u ON p.user_id = u.id
    JOIN poll_options po ON p.id = po.poll_id
    LEFT JOIN votes v ON po.id = v.option_id
    WHERE p.user_id = ? -- Filter by current user's poll
    GROUP BY p.id, p.user_id, u.username, p.title, p.description, p.created_at, po.id, po.option_text
    ORDER BY p.created_at DESC";

$params = [$userId, $userId]; // Bind session user ID

$stmt = sqlsrv_query($conn, $query, $params);

if ($stmt === false) {
    echo json_encode(["error" => "Query execution failed", "details" => sqlsrv_errors()]);
    exit;
}

$pollData = [];
while ($poll = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    $pollId = $poll['poll_id'];

    // Initialize poll data if not already set
    if (!isset($pollData[$pollId])) {
        $pollData[$pollId] = [
            "poll_id" => $pollId,
            "owner_id" => $poll['owner_id'], // Owner ID (user who created the poll)
            "username" => $poll['username'],
            "title" => $poll['title'],
            "description" => $poll['description'],
            "created_at" => $poll['created_at']->format('Y-m-d H:i:s'),
            "options" => [],
            "has_voted" => false, // Default vote status
        ];
    }

    // Check if the current user has voted for this poll
    if ($poll['status'] === 'selected') {
        $pollData[$pollId]["has_voted"] = true;
    }

    // Add poll options
    $pollData[$pollId]["options"][] = [
        "id" => $poll['option_id'],
        "option_text" => $poll['option_text'],
        "votes" => $poll['votes'],
        "status" => $poll['status']
    ];
}

// If no polls, return empty array or a message
if (empty($pollData)) {
    echo json_encode(["message" => "No polls found for this user"]);
    exit;
}

// Convert to JSON and return response
echo json_encode(array_values($pollData), JSON_PRETTY_PRINT);
?>
