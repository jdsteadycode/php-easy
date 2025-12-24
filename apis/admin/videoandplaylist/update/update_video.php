<?php
    // handle the type of content for client..
    header("Content-Type: application/json");

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // grab modules..
    require(dirname(__DIR__, 4) . "/config/config.php");

    // get the Admin Controller module..
    require(FILE_PATH . "/controllers/admin/VideoAndPlaylistController.php");

    // instantiate the class..
    $controller = new VideoAndPlaylistController();

    // check the request method..
    if($_SERVER["REQUEST_METHOD"] == "POST") {

        // get the data..
        $title = $_POST["title"] ?? "";
        $description = $_POST["description"] ?? "";
        $video_url = $_POST["videoUrl"] ?? "";

        // initial thumbnail
        $thumbnail = null;

        // get the video id
        $videoId = $_POST["videoId"] ?? null;

        // when thumbnail is provided (for update)
        if(isset($_FILES["thumbnail"])) {

            // save the thumbnail..
            $thumbnail = $controller->saveThumbnail($_FILES["thumbnail"]);
        }

        // update the video data..
        $updatedResponse = $controller->handleUpdateVideo(
            $title,
            $description,
            $video_url,
            $thumbnail,
            $videoId
        );
    
        // set the response code..
        http_response_code(200);

        // check log..
        // var_dump($categoryIds);

        // check log..
        echo json_encode($updatedResponse);
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