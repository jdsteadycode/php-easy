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

    // check the request method..
    if($_SERVER["REQUEST_METHOD"] == "POST") {

        // get the data..

        // id of creator..
        $created_by = $_POST["created_by"];

        // initial details about the problem-set..
        $title = $_POST["title"];
        $description = $_POST["description"];
        $difficulty = $_POST["difficulty"];

        // get the topic ids to relate with the topics that are related to the problem-set..
        // $topic_ids = explode(",", $_POST["topicIds"]); 
        $topic_ids = json_decode($_POST["topicIds"], TRUE);

        // handle the optional sample input/ output..
        $sample_input = $_POST["sampleInput"];
        $sample_output = $_POST["sampleOutput"];

        // the hints for the problem set..
        $hintsText = $_POST["hintsText"];

        // try to add the problem-set..
        $problem_set = new ProblemSetController();

        // initiate the problem set addon along with the topic ids..
        $added_problem_or_not = $problem_set->add_problem_set_with_topics(
            [
                 "title" => $title, 
                 "description"=> $description,
                 "difficulty"=> $difficulty, 
                 "sample_input"=> $sample_input ?? NULL, 
                 "sample_output"=> $sample_output ?? NULL, 
                 "hints"=> $hintsText ?? NULL, 
                 "created_by"=> $created_by, 
                 "created_at"=> date("Y-m-d H:i:s") 
            ],
            $topic_ids
        );

        // as per the response..
        if(gettype($added_problem_or_not) == "int") {

            // return the response to client..
            echo json_encode([
                "message" => "problem statement with title: $title was added with topics successfully",
                "status" => true,
                "response_code" => http_response_code(201),
            ]);
            exit();
        }
        else {

            // return the error to the client..
            echo json_encode([
                "message" => "problem statement couldn't be added",
                "status" => false
            ]);
            exit();
        }

        // send the response to client
        // echo json_encode([
        //     "message" => "problem statement addon is initiated",
        //     "status" => true,
        //     "data" => [
        //         "title" => $title,
        //         "description" => $description,
        //         "difficulty" => $difficulty,
        //         "topic_ids" => $topic_ids,
        //         "sample_input" => $sample_input,
        //         "sample_output" => $sample_output,
        //         "hintsText" => $hintsText,
        //         "created_by" => $created_by
        //     ]
        // ]);
    }
    else {

        // send response to client..
        echo json_encode([
            "message" => "invalid request method",
            "status" => false
        ]);
        exit();
    }