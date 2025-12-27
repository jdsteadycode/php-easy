<?php
    // handle the type of content for client..
    header("Content-Type: application/json");

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // grab modules..
    require(dirname(__DIR__, 3) . "/config/config.php");

    // get the Admin Controller module..
    // require(FILE_PATH . "/controllers/user/Playground.php");

    // get the Helper utilies..
    require(FILE_PATH . "/helpers/Helpers.php");

    // check the request method..
    if($_SERVER["REQUEST_METHOD"] == "POST") {

        // grab the incoming data..
        $incomingData = file_get_contents("php://input");

        // sanitize the json string -> assoc array (php native)
        $data = json_decode($incomingData, true);

        // check if code exists..
        $code = $data["code"] ?? "";

        // send the code further..
        $exec_output = Helpers::handleCode($code);
        
        // set the response code..
        http_response_code(200);

        // check log..
        echo json_encode($exec_output);
    
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