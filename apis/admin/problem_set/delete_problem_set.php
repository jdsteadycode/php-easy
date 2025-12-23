<?php
    // handle the type of content for client..
    header("Content-Type: application/json");

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // grab modules..
    require(dirname(__DIR__, 3) . "/config/config.php");

    // get the Admin Controller module..
    require(FILE_PATH . "/controllers/admin/ProblemSetController.php");

    // get the incoming data..
    $raw_data = file_get_contents("php://input");
    $incoming_data = json_decode($raw_data, TRUE);

    // check the request method..
    $request_method = $incoming_data["__method"] ?? $_SERVER["REQUEST_METHOD"];
    if($request_method == "DELETE") {

        // check for problem set id?
        if(!$incoming_data["problemSetId"] || $incoming_data["problemSetId"] == NULL) {

            // set the response code..
            http_response_code(422);

            // send the response to cliemt..
            echo json_encode([
                "message" => "problem set is missing.",
                "status" => false,
            ]);
            exit();
        }

        // instantiate the clas..
        $problem_set = new ProblemSetController();

        // delete the problem_set
        $deleted_problem = $problem_set->delete_problem_set(
            "
            UPDATE problem_set
                SET deleted_at = :deleted_at
            WHERE id = :id
            ",
            [
                "deleted_at" => date("Y-m-d H:i:s"),
                "id" => $incoming_data["problemSetId"],
            ]
        );

        // check..
        if($deleted_problem != FALSE) {

            // set the response code..
             http_response_code(200);

            // otherwise..
            echo json_encode([
                "message" => "problem set deletion success",
                "status" => true
            ]);
            exit();
        }
        
        // when failed..
        else {

            // set the response code..
            http_response_code(401);

             // otherwise..
            echo json_encode([
                "message" => "problem set deletion failed.",
                "status" => false,
            ]);
        }
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