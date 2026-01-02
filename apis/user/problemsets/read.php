<?php
    // handle the type of content for client..
    header("Content-Type: application/json");

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // grab modules..
    require(dirname(__DIR__, 3) . "/config/config.php");

    // get the Admin Controller module..
    require(FILE_PATH . "/controllers/user/PracticeProblemController.php");

    // get the Helper utilies..
    // require(FILE_PATH . "/helpers/Helpers.php");

    // check the request method..
    if($_SERVER["REQUEST_METHOD"] == "GET") {

        // get the practice problems..
        $controller = new PracticeProblemController();

        // all problem sets..
        $all = $controller->handleProblemSetsByPath();

        // set the response code..
        http_response_code(200);

        // check for id given..
        $problemId = $_GET["p_id"] ?? null;

        // when single problem is requested..
        if($problemId && (int)$problemId != 0) {

            // send the single problem set response..
            // echo json_encode("single problem $problemId");

            // get the problem..
            $problem = $controller->handleProblemSet($problemId);

            // send problem..
            echo json_encode($problem);
            exit();
        }

        // send the problem sets..
        echo json_encode($all);
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