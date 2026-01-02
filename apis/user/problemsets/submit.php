<?php

    // handle the type of content for client..
    header("Content-Type: application/json");

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // grab modules..
    require(dirname(__DIR__, 3) . "/config/config.php");

    // get the Admin Controller module..
    require(FILE_PATH . "/controllers/user/PracticeProblemController.php");

    // get the Helper utilies..
    require(FILE_PATH . "/helpers/Helpers.php");

    // () -> run the file for execution & evaluation..
    function runUserCode($file, $fName, $fType, $testCases) {   

        // () -> custom error function
        set_error_handler(function ($severisty, $message, $file, $line) {
            throw new ErrorException($message, 0, $severity, $file, $line);
        });

        // check file before evaluation/ tests..
        try{

            // get the file.
            require $file;

            // check if user code contains appropriate/ correct function?
            // verify the db defined function == user code's function name
            if(!function_exists($fName)) {
                return [
                    "error" => "Function Not Found",
                    "passed" => 0,
                    "failed" => count($testCases),
                    "results" => [],
                    "message" => "Expected Function Name: '$fName' not found"
                ];
            }

        

            // check log..
            // file_get_contents($file);

            // initial count for test cases..
            $passed = 0;
            $failed = 0;

            // initial results..
            $results = [];

            // for each test case from all test cases..
            foreach($testCases as $testCase) {

                // sanitize the test case input and expected output..
                $t_input = json_decode($testCase["input"], true);
                $t_expected_output = json_decode($testCase["expected_output"], true);

                // get the output from function..
                // check for type of function!
                // single param (eg: printArr([]) -> pass argument as it is)
                // when multi, (eg: sumNums($a, $b, $n) -> spread as many arguments available to it..)
                $actual = $fType === "single_param" ? $fName($t_input) : $fName(...$t_input);

                // count passed and failed..
                if($actual === $t_expected_output) {
                    $passed++;
                } else {
                    $failed++;
                }

                // save the results..
                $results[] = [
                    "test_case_id" => $testCase["id"],
                    "actual_result" => $actual,
                    "intended_result" => $t_expected_output,
                    "status" => $actual === $t_expected_output
                ];
            }

            // get the final results..
            return [
                "results" => $results,
                "passed" => $passed,
                "failed" => $failed
            ];

        }
        // handle runtime problems..
        catch(Throwable $e) {
            return [
                "error" => "Run Time Error",
                "results" => [],
                "passed" => 0,
                "failed" => count($testCases),
                "message" => "{$e->getMessage()}"
            ];
        }
        finally {
            restore_error_handler();
        }
    }

    // check the request method..
    if($_SERVER["REQUEST_METHOD"] == "POST") {

        // get the data..
        $raw_data = file_get_contents("php://input");

        // parse json string -> php native assoc array..
        $data = json_decode($raw_data, true);

        // get the practice problems..
        $controller = new PracticeProblemController();

        // get the data
        $functionName = $controller->getFunctionName($data["problemId"]);
        $functionType = $controller->getFunctionType($data["problemId"]);
        $testCases = $controller->getAllTestCases($data["problemId"]);


        // set the response code..
        http_response_code(200);

        // ready the data..
        $fName = $functionName["data"]["name"];
        $fType = $functionType["data"]["type"];
        $userCode = $data["code"];

        // validate the incoming code..
        // i.e., check if any extra thing like echo statements or function calls are given??
        $codeChecked = Helpers::getFullCode($userCode);

        // check?
        if($codeChecked !== "") {

            // update the code of response
            // http_response_code(422);

            // get the falied response
            echo json_encode([
                "status" => false,
                "message" => "Submitted Code must not contain any other echo/ statements other than function body containing an return statement"
            ]);
            exit();
        }


        // initial results for evaluation..
        $results = [];

        // make an temp file (for separate execution)
        // via tempnam -> allowing to make an file with unique name each time being created..
        $tempFile = tempnam(sys_get_temp_dir(), "test_");

        // save the code and content to it..
        file_put_contents(
            $tempFile,
            "<?php\n" . $userCode
        );


        // evaluation..
        $evaluation = runUserCode($tempFile, $fName, $fType, $testCases["data"] ?? []);

        // destroy the file (instantly)
        unlink($tempFile);

        // if run time error..
        if(isset($evaluation["error"])) {
            echo json_encode([
                "status" => false,
                "message" => $evaluation["message"],
                "error" => $evaluation["error"],
                "message" => $evaluation["message"],
                "passed" => $evaluation["passed"],
                "failed" => $evaluation["failed"],
                "results" => $evaluation["results"]
            ]);
            exit();
        }

        // get passed, failed, and status..
        $passed = $evaluation["passed"];
        $failed = $evaluation["failed"];
        $status = ($failed === 0);
 
        // update the submission according to resutls..
        // die($submissionId);

        // save the initial submssion..
        $submissionId = $controller->handleSaveSubmission([
            "user_id" => $_SESSION["user_id"],
            "problem_id" => $data["problemId"],
            "code" => $data["code"],
            "execution_status" => $status ? "success" : "error"
        ]);

        // if test cases cleared..
        if($status) {

            // save the solution
            $controller->handleSaveSolution([
                "user_id" => $_SESSION["user_id"],
                "problem_id" => $data["problemId"],
                "code" => $data["code"],
            ]);
        }


        // send the response
        echo json_encode([
            "message" => $failed === 0 ? "Congrats All test cases are passed" : "$failed case(s) failed",
            "results" => $evaluation["results"],
            "status" => $failed === 0 ? true : false
        ]);
        exit();

    }
    else {

        // set the response code..
        http_response_code(405);

        // send response to client..
        echo json_encode([
            "message" => "invalid request method",
            "status" => false
        ]);
        exit();
    }