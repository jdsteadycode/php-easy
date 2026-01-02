<?php
    // handle the type of content for client..
    header("Content-Type: application/json");

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // grab modules..
    require(dirname(__DIR__, 4) . "/config/config.php");

    // get the Admin Controller module..
    require(FILE_PATH . "/controllers/admin/ProblemSetController.php");

    // check the request method..
    if($_SERVER["REQUEST_METHOD"] == "PATCH") {

        //..
        $controller = new ProblemSetController();

        // get the data..
        $raw_data = file_get_contents("php://input");

        // sanitize the incoming data..
        $data = json_decode($raw_data, true);

        $saved = $controller->add_functionmeta(
            "UPDATE problem_set 
             SET starter_code = :starter_code,
             function_type = :function_type,
             function_name = :function_name
             WHERE id = :problem_id
            ",
            [
                "starter_code" => $data["starterCode"],
                "function_type" => $data["functionType"],
                "function_name" => $data["functionName"],
                "problem_id" => $data["problemId"]
            ]
        );
       
        // check log..
        // var_dump($added);

        // send response to client..
        echo json_encode([
            "message" => $saved ? "saved function meta data" : "oops! check data again",
            "status" => $saved ? true : false
        ]);
        exit();
    }

    // when request method doesn't match?
    else {

        // send response to client..
        echo json_encode([
            "message" => "invalid request method",
            "status" => false
        ]);
        exit();
    }