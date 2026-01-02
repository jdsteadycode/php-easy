<?php
    // handle the type of content for client..
    header("Content-Type: application/json");

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // grab modules..
    require(dirname(__DIR__, 3) . "/config/config.php");

    // get the Admin Controller module..
    require(FILE_PATH . "/controllers/user/LearnController.php");

    // get the Helper utilies..
    // require(FILE_PATH . "/helpers/Helpers.php");

    // check the request method..
    if($_SERVER["REQUEST_METHOD"] == "GET") {

        // instantiate controller..
        $controller = new LearnController();

        // get category
        $category_id = $_GET["category_id"] ?? null;

        // when missing parent category id..
        if(empty($category_id) || !is_numeric($category_id)) {
            echo json_encode([
                "status" => false,
                "message" => "id missing"
            ]);
            exit();
        }
    
        // get all categories..
        $response = $controller->fetchChildCategories($category_id);
        
        // set the response code..
        http_response_code(200);

        // check log..
        echo json_encode([
            "status" => true,
            "message" => "child categories fetched",
            "data" => empty($response) ? [] : $response
        ]);
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