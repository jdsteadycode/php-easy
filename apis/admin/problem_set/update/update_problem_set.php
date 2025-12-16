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

    // request method
    $request_method = $_POST["__method"] ?? NULL;

    // check the request method..
    if($request_method == "PATCH") {

        // get the incoming data..
        $title = $_POST["title"];
        $description = $_POST["description"];
        $difficulty = $_POST["difficulty"];
        $sample_input = $_POST["sampleInput"];
        $sample_output = $_POST["sampleOutput"];
        $hints = $_POST["hintstext"];
        $id  = $_POST["problemSetId"] ?? NULL;

        // when no problem-set id?
        if(!$id) {

            // send error response to client..
            echo json_encode(["status" => false, "message" => "problem set id is missing"]);
            exit();
        }

        // instantiate the problem-set class..
        $problem_set = new ProblemSetController();

        // make the problem-set update..
        $updated_or_not =  $problem_set->update_problem_set(
            "
            UPDATE problem_set
                SET title = :title, description = :description, difficulty = :difficulty, sample_input = :sample_input, sample_output = :sample_output, hints = :hints, updated_at = :updated_at
            WHERE id = :id 
            ",
            [
                "title" => $title, 
                "description"=> $description,
                "difficulty"=> $difficulty, 
                "sample_input"=> $sample_input, 
                "sample_output"=> $sample_output, 
                "hints"=> $hints, 
                "updated_at"=> date("Y-m-d H:i:s"),
                "id" => $id
            ],
        );

        // when update is successful..
        if($updated_or_not != FALSE) {

             // send the successful response to client..
             echo json_encode([
                "message" => "updated",
                "status" => true
            ]);
            exit();
        }
        else {

            // send the successful response to client..
             echo json_encode([
                "message" => "failed to update",
                "status" => false
            ]);
            exit(); 
        }

        // check log..
        // echo json_encode([
        //     "message" => "update problem set is requested",
        //     "status" => true,
        //     "data" => [
        //         "title" => $title,
        //         "description" => $description,
        //         "difficulty" => $difficulty,
        //         "sample_input" => $sample_input,
        //         "sample_output" => $sample_output,
        //         "hints" => $hints,
        //         "problem_set_id" => $id
        //     ]
        // ]);
        // exit();
    }
    else {

        // send response to client..
        echo json_encode([
            "message" => "invalid request method",
            "status" => false
        ]);
        exit();
    }