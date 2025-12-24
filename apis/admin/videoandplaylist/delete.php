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
    if($_SERVER["REQUEST_METHOD"] == "POST") {

        // get the data..
        $raw_data = file_get_contents("php://input");

        // parse the json response -> php native assoc array
        $data = json_decode($raw_data, true);

        // delete the video..
        $deletedResponse = $controller->handleDeleteVideo($data["videoId"]);
    
        // set the response code..
        http_response_code(200);

        // check log..
        // var_dump($categoryIds);

        // check log..
        echo json_encode($deletedResponse);
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