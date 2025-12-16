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

            // send error response to client..
            echo json_encode(["status" => false, "message" => "problem set id and topic ids are missing"]);
            exit();
        }


        // instantiate the class..
        $problem_set = new ProblemSetController();


        // first,
        // check for existing ids..
        $existing_topic_ids = $problem_set->get_topic_ids_related_to_problem_set(
            "SELECT topic_id FROM problem_set_topic_jn WHERE problem_id = :problem_id",
            [
                "problem_id" => $incoming_data["problemSetId"]
            ]
        );
        
        $topics = array_values($incoming_data["topicIds"]);  // new topics from client..
        $assign_topic = NULL;   // initial outcome..
        // iterate over the topics..
        foreach ($topics as $topic) {

            // if it's new topic id..
            if(!in_array($topic, $existing_topic_ids)) {

                // assign the topic to the respective problem set..
                $assign_topic = $problem_set->add_topics_to_problem_set(
                    "
                    INSERT INTO problem_set_topic_jn 
                    (problem_id, topic_id)
                    VALUES
                    (:problem_id, :topic_id)
                    ",
                    [
                        "problem_id" => $incoming_data["problemSetId"], // recently added problem set's id..
                        "topic_id" => $topic, // incoming topic id from clients (via above topic array)
                    ]
                );
            }
        }

        // when assignment is successful..
        if($assign_topic != NULL) {

            // send the response to client..
            echo json_encode([
                "status" => true,
                "message" => "new topics were successfuly added to the problem set"
            ]);
            exit();
        }
        else {

            // otherwise,
            echo json_encode([
                "status" => false,
                "message" => "new topics assignment failed to existing problem set"
            ]);
            exit();
        }

        // send the response to client..
        // echo json_encode([
        //     "status" => true,
        //     "message" => "topics assignment has begun",
        //     "data" => $incoming_data
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