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
    $request_method = $_SERVER["REQUEST_METHOD"] ?? NULL;

    // check the request method..
    if($request_method == "POST") {

        // get the incoming data..
        $raw_data = file_get_contents("php://input");
        $incoming_data = json_decode($raw_data, TRUE);

        // when no problem-set id and topic-ids?
        if(!$incoming_data["problemSetId"] || !$incoming_data["topicIds"] || count($incoming_data["topicIds"]) == 0) {

            // set the response code..
            http_response_code(422);

            // send error response to client..
            echo json_encode([
                "message" => "problem set id or topic ids are missing",
                "status" => false
            ]);
            exit();
        }

        // instantiate the problemSet..
        $problem_set = new ProblemSetController();

        // first,
        // check for existing ids..
        $existing_topic_ids = $problem_set->get_topic_ids_related_to_problem_set(
            "SELECT topic_id FROM problem_set_topic_jn WHERE problem_id = :problem_id",
            [
                "problem_id" => $incoming_data["problemSetId"]
            ]
        );

        // then,
        // delete the topic id from the problem_set
        $topics_to_be_deleted = $incoming_data["topicIds"];   // initial topic ids from client..
        $deleted_topics = NULL;     // initial outcome..
        
        // iterate over the topics..
        foreach ($topics_to_be_deleted as $topic) {

            // if topic exist..
            if(in_array($topic, $existing_topic_ids)) {

                // assign the topic to the respective problem set..
                $deleted_topics = $problem_set->delete_topics_assigned(
                    "
                    DELETE FROM problem_set_topic_jn 
                    WHERE problem_id = :problem_id 
                    AND topic_id = :topic_id
                    ",
                    [
                        "problem_id" => $incoming_data["problemSetId"], // recently added problem set's id..
                        "topic_id" => $topic, // incoming topic id from clients (via above topic array)
                    ]
                );
            }
        }


        // when topics are successfully un-assigned..
        if($deleted_topics != NULL || $deleted_topics == TRUE) {

            // set the response code..
            http_response_code(200);

            // send the response to client..
            echo json_encode([
                "message" => "topics removal success",
                "status" => true
            ]);  
            exit();
        }
        else {

            // set the response code..
            http_response_code(401);

            // send the response to client..
            echo json_encode([
                "message" => "topics removal failed",
                "status" => true
            ]);  
            exit();
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