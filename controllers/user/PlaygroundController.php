<?php

    // grab the modules..
    require(dirname(__DIR__, 2) . "/config/config.php");

    // going 2 steps out of current dir..
    // get the user model..
    require_once(dirname(__DIR__, 2) . "/models/UserModel.php");

    // get the helper functions..
    require_once(dirname(__DIR__, 2) . "/helpers/Helpers.php");

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // A Class for handling playground controller..
    class PlaygroundController {

        // initial model..
        public $model = null;

        // when the controller is instantiated..
        public function __construct() {

            // try to connect with the model..
            $this->model = new UserModel();
        }

        // () -> handle the playground input/ output..
        public function handlePlaygroundIO(string $inputData) {

            // handle and process the input -> output..
            $output = Helpers::handleCode($inputData);

            // return the output..
            return [
                "status" => true,
                "message" => "input was processed",
                "data" => $output
            ];
        }
    } 

    // TEST..
    // $controller = new PlaygroundController();

