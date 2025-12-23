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
        $title = $_POST["title"] ?? "";
        $description = $_POST["description"] ?? "";
        $video_url = $_POST["videoUrl"] ?? "";
        $uploadedBy = $_POST["uploadedBy"] ?? "";
        $categoryIdsString = $_POST["categoryIds"] ?? [];

        // get the thumbnail file..
        $thumbnail = $_FILES["thumbnail"] ?? null;

        // save the image..
        $savedThumbnail = $controller->saveThumbnail($thumbnail);

        // ready the data to for video addon..
        $categoryIds = explode(",", $categoryIdsString);

        // check if image is uploaded..
        if($savedThumbnail == false) {

            // send the error response..
            echo json_encode([
                "status" => false,
                "message" => "check image again before uploaded"
            ]);
            exit();
        }

        // add a new video..
        $addedResponse = $controller->handleAddVideoWithCategories(
            [
                "title" => $title,
                "description" => $description,
                "video_url" => $video_url,
                "thumbnail" => $savedThumbnail,
                "uploaded_by" => $uploadedBy
            ],
            $categoryIds
        );
    
        // set the response code..
        http_response_code(200);

        // check log..
        // var_dump($categoryIds);

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