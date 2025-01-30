<?php
error_reporting(0); // Disable all PHP error reporting
ini_set('display_errors', 0);

header('Access-Control-Allow-Origin: *'); // Allow CORS from all origins
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'shecare_forum';
$username = 'root';
$password = 'hello';
// Create connection
$conn = new mysqli($host, $username, $password, $dbname);
try {
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    $query = "SELECT * FROM topics ORDER BY created_at DESC";
    $result = $conn->query($query);
    
    if (!$result) {
        throw new Exception("Database query failed: " . $conn->error);
    }

    $topics = [];
    while ($row = $result->fetch_assoc()) {
        $topics[] = [
            'id' => $row['id'],
            'title' => $row['title'],
            'content' => isset($row['content']) ? $row['content'] : null, // Handle undefined 'content' key
            'created_at' => $row['created_at'],
        ];
    
    }

    echo json_encode([
        "status" => "success",
        "topics" => $topics
    ]);
} catch (Exception $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
