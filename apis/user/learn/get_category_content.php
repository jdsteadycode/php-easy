<?php
header("Content-Type: application/json");
date_default_timezone_set('Asia/Kolkata');

require(dirname(__DIR__, 3) . "/config/config.php");
require(FILE_PATH . "/controllers/user/LearnController.php");

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode([
        "status" => false,
        "message" => "Invalid request method"
    ]);
    exit;
}

$category_id = $_GET["category_id"] ?? null;

if (!$category_id) {
    http_response_code(422);
    echo json_encode([
        "status" => false,
        "message" => "category_id missing"
    ]);
    exit;
}

$controller = new LearnController();
$data = $controller->fetchCategoryContent($category_id);

http_response_code(200);
echo json_encode([
    "status" => true,
    "message" => "category content fetched",
    "data" => $data
]);
exit;
