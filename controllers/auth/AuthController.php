<?php

    // grab the modules..
    // going 2 steps out of current dir..
    require(dirname(__DIR__, 2) . "/config/config.php");

    // get the database module..
    require(FILE_PATH . "/db/db.php");

    // A AuthController Class
    class AuthController {

        // initial connection and pdo obj..
        public $pdo = null;
        public $db = null;

        // when Admin Controller is instantiated..
        public function __construct() {

            // try to connect with db..
            $this->db = new DB();

            $this->pdo = $this->db->handleConnection();
        }

        // () -> handle registeration of new user (for authentication)
        public function register_user($statement, $parameters = []) {

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // get id of topic last added or false (if ain't added)
            return $stmt ? $this->pdo->lastInsertId() : false;
        }

         // () -> handle login of new user (for authentication.)
         public function login_user($statement, $parameters = []) {

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // get user data or false (if ain't added)
            return $stmt ? $stmt->fetch(): false;
        }

    
    }

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // check log..
    $auth = new AuthController();

    // var_dump($topic);

    // 1..
    // add a new user
    // $added =  $auth->register_user(
    //     "INSERT INTO users (first_name, last_name, username, email, phone_number, password, role, created_at) VALUES (:first_name, :last_name, :username, :email, :phone_number, :password, :role, :created_at)",
    //     [
    //         "first_name" => "jeet",
    //         "last_name" => "desai",
    //         "username" => "jd",
    //         "email" => "desaijeet@gmail.com",
    //         "phone_number" => "1121121121",
    //         "password" => password_hash("Jeet", PASSWORD_DEFAULT),
    //         "role" => "admin",
    //         "created_at" => date("d-m-y h:i:s")
    //     ]
    // );

    // 2.
    // login a existing user..
    // $existing_user = $auth->login_user(
    //     "SELECT * FROM users WHERE email = :email",
    //     [
    //         "email" => "desaijeet@gmail.com"
    //     ]
    // );

    // check log..
    // var_dump($existing_user);