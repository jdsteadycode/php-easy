<?php
    // begin the new user session..
    session_start();

    // handle the type of content for client..
    header("Content-Type: application/json");

    // grab modules..
    require(dirname(__DIR__, 2) . "/config/config.php");

    // get the Admin Controller module..
    require(FILE_PATH . "/controllers/auth/AuthController.php");

    // see the request method..
    if($_SERVER["REQUEST_METHOD"] == "POST") {

        // grab the user details..
        $email = $_POST["email"] ?? "";
        $password = $_POST["password"] ?? "";

        // check for empty credentials..
        if(!$email  || !$password) {

            // when empty credentials found
            echo json_encode([
                "message" => "missing credentials",
                "status" => false
            ]);
            exit();
        }

        // handle auth..
        $auth = new AuthController();

        // get the credentails..
        $existing_user = $auth->login_user(
            "SELECT * FROM users WHERE email = :email AND deleted_at IS NULL",
            [
                "email" => $email
            ]
        );

        // check if user exists..
        if(!$existing_user) {

            // when no user found..
            echo json_encode([
                "message" => "user doesn't exist",
                "status" => false
            ]);
            exit();
        }

        // verify the user..
        if(password_verify($password, $existing_user["password"])) {

            // set the current user session..
            $_SESSION["user_id"] = $existing_user["id"];
            $_SESSION["user_role"] = $existing_user["role"];

            // regenerate the session id..
            session_regenerate_id(true);

            // success..
            echo json_encode([
                "message" => "successful login",
                "user_id" => $_SESSION["user_id"],
                "user_role" => $_SESSION["user_role"],
                "status" => true
            ]);
            exit();
        }
        else {

            // when invalid credentials
            echo json_encode([
                "message" => "invalid credentials",
                "status" => false
            ]);
            exit();
        }
    }
    else {

        // send error response to client..
        echo json_encode(["message" => "invalid request method", "status" => false]);
        exit();
    }