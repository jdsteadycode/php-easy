<?php
    // begin the user session..
    session_start();

    // set the content type for client..
    header("Content-Type: application/json");

    // verify the user?
    if($_SESSION["user_role"] === "admin") {

        // set the response code..
        http_response_code(200);

        // send the response to client..
        echo json_encode([
            "message" => "authorized",
            "status" => true,
            "user_id" => $_SESSION["user_id"],
            "is_admin" => true
        ]);
        exit();
    }
 
    // when normal user..
    else if($_SESSION["user_role"] === "user") {

        // set the response code..
        http_response_code(200);

        // send the response to client..
        echo json_encode([
                "message" => "authorized",
                "user_id" => $_SESSION["user_id"],
                "status" => true,
                "is_admin" => false
        ]);
        exit();
    }

    // otherwise..
    else {

        // set the response code..
        http_response_code(403);

        // send the response to client..
        echo json_encode([
                "message" => "un-authorized",
                "status" => false,
        ]);
        exit();
    }