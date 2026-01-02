<?php
    // handle the type of content for client..
    header("Content-Type: application/json");

    // grab modules..
    require(dirname(__DIR__, 3) . "/config/config.php");

    // get the Admin Controller module..
    require(FILE_PATH . "/controllers/admin/TopicController.php");

    // check the request method..
    if($_SERVER["REQUEST_METHOD"] == "GET") {

        // handle all topics
        $topic = new TopicController();
        $all_topics = $topic->all_topics(
            "SELECT * FROM topics WHERE deleted_at IS NULL"
        );

        // send the response to client..
        echo json_encode([
            "message" => "topics fetched",
            "data" => $all_topics,
            "status" => true
        ]);
        exit();
    }
    else {

        // send response to client..
        echo json_encode([
            "message" => "invalid request method",
            "status" => false
        ]);
        exit();
    }