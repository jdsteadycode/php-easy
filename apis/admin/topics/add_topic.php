<?php
    // handle the type of content for client..
    header("Content-Type: application/json");

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // grab modules..
    require(dirname(__DIR__, 3) . "/config/config.php");

    // get the Admin Controller module..
    require(FILE_PATH . "/controllers/admin/TopicController.php");

    // check the request method..
    if($_SERVER["REQUEST_METHOD"] == "POST") {

        // grab the data..
        $name = $_POST["name"] ?? "";

        // check for missing topic name..
        if($name === "") {

            // send response to client..
            echo json_encode([
                "message" => "missing topic name",
                "status" => false
            ]);
            exit();
        }

        // instantiate the class..
        $topic = new TopicController();

        // check for duplicate topic..
        // get all topic names..
        $topic_names = $topic->all_topic_names(
            "SELECT name FROM topics"
        );

        // check if duplicate..
        if(TopicValidator::is_duplicate_topic($topic_names, $name)) {

            // set the response code..
            http_response_code(422);

            // send response to client..
            echo json_encode([
                "message" => "OOPS! topic already exists",
                "status" => false
            ]);
            exit();
        }

        // check log..
        // echo json_encode(["date" => date("d-m-y h:i:s")]);

        // handle topic addon..
        $added = $topic->add_topic(
            "INSERT INTO topics (name, created_at) VALUES (:name, :created_at)",
            [
                "name" => $name,
                "created_at" => date("Y-m-d H:i:s")
            ]
        );

        // check if topic added..
        if($added != FALSE) {

            // set the response code..
            http_response_code(200);

            // send the response to client..
            echo json_encode([
                "message" => "$name was recently added..",
                "status" => true
            ]); 
            exit();
        }
        else {

            // set the response code..
            http_response_code(500);

            // otherwise..
            echo json_encode([
                "message" => "oops! $name couldn't be added..",
                "status" => false
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