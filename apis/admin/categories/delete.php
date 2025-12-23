<?php
    // handle the type of content for client..
    header("Content-Type: application/json");

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // grab modules..
    require(dirname(__DIR__, 3) . "/config/config.php");

    // get the Admin Controller module..
    require(FILE_PATH . "/controllers/admin/CategoriesController.php");

    // instantiate the class..
    $controller = new CategoriesController();

    // check the request method..
    if($_SERVER["REQUEST_METHOD"] == "POST") {

        // get the data..
        $incomingData = file_get_contents("php://input");

        // sanitize the data from json  -> php native array..
        $data = json_decode($incomingData, TRUE);

        // handle new category addon
        $response = $controller->handleDeleteCategory(
            $data["categoryId"]
        );

        // set the response code..
        http_response_code(200);

        // check log..
        echo json_encode($response);
    
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