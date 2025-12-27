<?php
    // handle the type of content for client..
    header("Content-Type: application/json");

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // grab modules..
    require(dirname(__DIR__, 4) . "/config/config.php");

    // get the Admin Controller module..
    require(FILE_PATH . "/controllers/admin/SettingsController.php");


    // check the request method..
    if($_SERVER["REQUEST_METHOD"] == "POST") {

        // send data for update..
        $controller = new SettingsController();
        // $updated = $controller->handleUserUpdate($incoming_data, "users");

        // get the profile image..
        $profile_image = $_FILES["profile_image"] ?? null;

        // get the user id..
        $id = $_POST["id"] ?? "";

        // save the image..
        $savedImage = $controller->saveProfile($profile_image);

        // check if image is uploaded..
        if($savedImage == false) {

            // send the error response..
            echo json_encode([
                "status" => false,
                "message" => "check image again before upload"
            ]);
            exit();
        }

        // // ready the data for update..
        $updateData = [
            "profile_image" => $savedImage,
            "id" => $id
        ];

        // then, send the data to update..
        $updatedImageResponse = $controller->handleUserUpdate($updateData, "users");

        // set the response code..
        http_response_code(200);

        // send response to client..
        echo json_encode($updatedImageResponse);
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