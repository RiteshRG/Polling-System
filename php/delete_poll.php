<?php
session_start();
header("Content-Type: application/json"); 

include "dbConfig.php"; 


$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['poll_id'])) {
    $pollId = $data['poll_id'];
    $userId = $_SESSION['user_id'];

    // Check if the poll exists and belongs to the current user
    $query = "SELECT * FROM polls WHERE id = ? AND user_id = ?";
    $stmt = sqlsrv_query($conn, $query, [$pollId, $userId]);

    if (sqlsrv_has_rows($stmt)) {
        // Proceed to delete votes, poll options, and then the poll itself

        $deleteVotesQuery = "DELETE FROM votes WHERE poll_id = ?";
        $deleteVotesStmt = sqlsrv_query($conn, $deleteVotesQuery, [$pollId]);

        if (!$deleteVotesStmt) {
            echo json_encode(["success" => false, "error" => "Failed to delete votes"]);
            exit;
        }

        $deleteOptionsQuery = "DELETE FROM poll_options WHERE poll_id = ?";
        $deleteOptionsStmt = sqlsrv_query($conn, $deleteOptionsQuery, [$pollId]);

        if (!$deleteOptionsStmt) {
            echo json_encode(["success" => false, "error" => "Failed to delete poll options"]);
            exit;
        }

        $deletePollQuery = "DELETE FROM polls WHERE id = ? AND user_id = ?";
        $deletePollStmt = sqlsrv_query($conn, $deletePollQuery, [$pollId, $userId]);

        if ($deletePollStmt) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "error" => "Failed to delete poll"]);
        }
    } else {
        echo json_encode(["success" => false, "error" => "Poll not found or you do not have permission to delete it"]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Invalid request"]);
}
?>
