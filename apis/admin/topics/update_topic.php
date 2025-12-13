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

    // get the method..
    $method = isset($_POST["__method"]) ? $_POST["__method"]  : $_SERVER["REQUEST_METHOD"];

    // check the request method..
    if($method == "PATCH") {

        // grab the data..
        $name = $_POST["topic_name"] ?? NULL;
        $id = $_POST["topic_id"] ?? NULL;

        // check for missing topic name..
        if(!$name || !$id) {

            // send response to client..
            echo json_encode([
                "message" => "missing topic update details",
                "status" => false
            ]);
            exit();
        }

        // check log..
        // echo json_encode(["date" => date("d-m-y h:i:s")]);

        // handle topic updation..
        $topic = new TopicController();
        $updated = $topic->update_topic(
            "UPDATE topics SET name = :name, updated_at = :updated_at WHERE id = :id",
            [
                "name" => $name,
                "updated_at" => date("Y-m-d H:i:s"),
                "id" => $id
            ]
        );

        // check if topic added..
        if($updated != FALSE) {

            // send the response to client..
            echo json_encode([
                "message" => "$name was recently updated..",
                "status" => true
            ]); 
            exit();
        }
        else {

            // otherwise..
            echo json_encode([
                "message" => "oops! $name couldn't be updated..",
                "status" => false
            ]);
            exit();
        }
    }
    else {

        // send response to client..
        echo json_encode([
            "message" => "invalid request method",
            "status" => false
        ]);
        exit();
    }