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
        $name = $_POST["name"] ?? "";
        $description = $_POST["description"] ?? "";
        $created_by = $_POST["createdBy"] ?? "";
        $videoIdString = $_POST["videoIds"];

        // sanitize the video ids into an array..
        $videoIds = explode(",", $videoIdString);

        // add a new playlist..
        $addedResponse = $controller->handleAddPlaylistWithVideos(
            [
                "name" => $name,
                "description" => $description,
                "created_by" => $created_by
            ],
            $videoIds
        );
    
        // set the response code..
        http_response_code(200);

        // check log..
        // var_dump($videoIds);

        // check log..
        echo json_encode($addedResponse);
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