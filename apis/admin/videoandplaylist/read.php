<?php
    // handle the type of content for client..
    header("Content-Type: application/json");

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // grab modules..
    require(dirname(__DIR__, 3) . "/config/config.php");

    // get the Admin Controller module..
    require(FILE_PATH . "/controllers/admin/VideoAndPlaylistController.php");

    // instantiate the class..
    $controller = new VideoAndPlaylistController();

    // check the request method..
    if($_SERVER["REQUEST_METHOD"] == "GET") {

        // get all videos..
        $response = $controller->handleAllVideos();
    
        // set the response code..
        http_response_code(200);

        // check log..
        // var_dump($categoryIds);

        // check log..
        echo json_encode($response);
        exit();
    
    }
    else {

        // set the response code..
        http_response_code(405);

        // send response to client..
        echo json_encode([
            "message" => "invalid request method",
            "status" => false
        ]);
        exit();
    }