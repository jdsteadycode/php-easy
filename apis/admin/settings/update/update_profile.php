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
    if($_SERVER["REQUEST_METHOD"] == "PATCH") {

        // get the incoming data..
        $raw_data = file_get_contents("php://input");
        $incoming_data = json_decode($raw_data, TRUE);

        // send data for update..
        $controller = new SettingsController();
        $updated = $controller->handleUserUpdate($incoming_data, "users");

        // set the response code..
        http_response_code(200);

        // send response to client..
        echo json_encode($updated);
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