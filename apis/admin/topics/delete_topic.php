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
    if($_SERVER["REQUEST_METHOD"] == "DELETE") {

        // grab the data..
        $data = file_get_contents("php://input");

        // sanitize the json data -> php native assoc array
        $id = json_decode($data, TRUE);

        // check for missing topic name..
        if(!$id) {

            // send response to client..
            echo json_encode([
                "message" => "missing topic delete details",
                "status" => false
            ]);
            exit();
        }


        // check log..
        // echo json_encode(["date" => date("d-m-y h:i:s"), "id" => $id]);

        // handle topic updation..
        $topic = new TopicController();
        $deleted_rows =  $topic->delete_topic(
            "UPDATE topics SET deleted_at = :deleted_at WHERE id = :id",
            [
                "deleted_at" => date("Y-m-d H:i:s"),
                "id" => $id
            ]
        );

        // check if topic added..
        if($deleted_rows > 0 || $deleted_rows != 0) {

            // send the response to client..
            echo json_encode([
                "message" => "deletion successful",
                "status" => true
            ]); 
            exit();
        }
        else {

            // otherwise..
            echo json_encode([
                "message" => "oops! couldn't delete..",
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