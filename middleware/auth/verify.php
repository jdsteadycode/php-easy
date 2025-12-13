<?php
    // begin the user session..
    session_start();

    // set the content type for client..
    header("Content-Type: application/json");

    // verify the user..
    if(!isset($_SESSION["user_id"])) {

        // not authenticated..
        echo json_encode([
            "message" => "un-authenticated",
            "status" => false
        ]);
        exit();
    }

    // according to the user's role..
    if($_SESSION["user_role"] === "admin") {

        // send the response to client..
        echo json_encode([
            "message" => "authenticated",
            "status" => true,
            "user_id" => $_SESSION["user_id"],
            "is_admin" => true
        ]);
        exit();
    }

    // send the response to client..
    // when normal user..
    echo json_encode([
            "message" => "authenticated",
            "user_id" => $_SESSION["user_id"],
            "status" => true,
            "is_admin" => false
    ]);
    exit();