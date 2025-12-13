<?php
    // begin the new user session..
    session_start();

    // handle the type of content for client..
    header("Content-Type: application/json");

    // see the request method..
    if($_SERVER["REQUEST_METHOD"] == "POST") {

        // clear the session data..
        $_SESSION = [];
        // session_unset();
        
        // destory current user session..
        session_destroy();

        // send the response to client..
        echo json_encode([
            "message" => "logout successfull",
            "status" => true
        ]);
        exit();
    }
    else {

        // send error response to client..
        echo json_encode(["message" => "invalid request method", "status" => false]);
        exit();
    }