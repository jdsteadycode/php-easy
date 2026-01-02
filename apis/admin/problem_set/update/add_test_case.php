<?php
    // handle the type of content for client..
    header("Content-Type: application/json");

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // grab modules..
    require(dirname(__DIR__, 4) . "/config/config.php");

    // get the Admin Controller module..
    require(FILE_PATH . "/controllers/admin/ProblemSetController.php");

    // check the request method..
    if($_SERVER["REQUEST_METHOD"] == "POST") {

        $controller = new ProblemSetController();

        // get the data..
        $raw_data = file_get_contents("php://input");

        // sanitize the incoming data..
        $data = json_decode($raw_data, true);

        // extract the testcases
        $testCases = $data["testCaseData"] ?? [];
        $problemId = $data["problemId"] ?? "";

        // initial state..
        $allInserted = true;

        // iterate over the test cases..
        foreach($testCases as $testCase) {

            // check for the inputs..
            $inputs = json_decode($testCase["input"], true);
            $expected_output = json_decode($testCase["expected_output"], true);

            // when inputs for must follow json structure
            if($inputs === null && json_last_error() !== JSON_ERROR_NONE) {

                // check log..
                // var_dump(gettype($inputs));
                // die();

                echo json_encode([
                    "status" => false,
                    "message" => "Note inputs must follow json structure \n i.e., must not end with `;` etc.."
                ]);
                exit();
            }

            // when inputs is not an json arr..
            if(!is_array($inputs)) {

                // check log..
                // var_dump(gettype($inputs));
                // die();

                echo json_encode([
                    "status" => false,
                    "message" => "Note inputs must be enclosed within json array \n i.e., '[val1, valn..]'"
                ]);
                exit();
            }

            // check for expected output input?
            if ($expected_output === null && json_last_error() !== JSON_ERROR_NONE) {
                echo json_encode([
                    "status" => false,
                    "message" => "Expected output must be valid JSON. 
                     ex: \"Hey I'm Jash, And I'm in my 25's\""
                ]);
                exit();
            }



            // add the test case..
            $added = $controller->add_testcases_to_problem(
                "
                INSERT INTO test_cases
                (problem_id, input, expected_output)
                VALUES
                (:problem_id, :input, :expected_output)
                ",
                [
                    "problem_id" => $problemId,
                    "input" => json_encode($inputs),
                    "expected_output" => json_encode($expected_output)
                ]
            );

            // var_dump($added);

            // If any insert fails, mark false
            if ($added === null || $added === false) {
                $allInserted = false;
                break; // optional: stop further inserts
            }
        }

        // check log..
        // var_dump($added);

        // send response to client..
        echo json_encode([
            "message" => $allInserted
                ? "Test cases assigned successfully"
                : "Failed to add one or more test cases",
            "status" => $allInserted
        ]);
        exit();
    }

    // when request method doesn't match?
    else {

        // send response to client..
        echo json_encode([
            "message" => "invalid request method",
            "status" => false
        ]);
        exit();
    }