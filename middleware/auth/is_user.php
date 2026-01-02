<?php
    // begin the user session..
    session_start();

    // set the content type for client..
    header("Content-Type: application/json");

    // is user?
    if(!isset($_SESSION["user_id"])) {

        // set the response code..
        http_response_code(401);

        // not authenticated..
        echo json_encode([
            "message" => "un-authenticated",
            "status" => false
        ]);
        exit();
    }
    // otherwise..
    else {

        // set the response code..
        http_response_code(200);

        // send the response to client..
        echo json_encode([
                "message" => "authenticated",
                "user_id" => $_SESSION["user_id"],
                "is_admin" => $_SESSION["user_role"] === "admin",
                "status" => true,
        ]);
        exit();
    }