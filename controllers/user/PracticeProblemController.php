<?php
    // start the session
    session_start();

    // grab the modules..
    require(dirname(__DIR__, 2) . "/config/config.php");

    // going 2 steps out of current dir..
    // get the user model..
    require_once(dirname(__DIR__, 2) . "/models/PracticeProblemSetModel.php");

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // A Class for handling playground controller..
    class PracticeProblemController {

        // initial model..
        public $model = null;

        // when the controller is instantiated..
        public function __construct() {

            // try to connect with the model..
            $this->model = new PracticeProblemSet();
        }

        // () -> handle the problem sets..
        public function handleAllProblemSets() {

            // get all..
            $all = $this->model->getProblemSets() ?? [];

            // iterate over the problem_set returned..
            foreach($all as &$problem) {

                // sanitize the topics string -> array for frontend..
                $problem["topic_names"] = $problem["topic_names"] ? explode(", ", $problem["topic_names"]) : [];
                $problem["topic_ids"] = $problem["topic_ids"] ? explode(", ", $problem["topic_ids"]) : [];
            }

            // empty the problem.. (still points to last problemset)
            unset($problem);

            // get the response data..
            return [
                "status" => true,
                "message" => "all problems fetch success",
                "data" => $all
            ];
       } 

       // () -> handle the problem set..
        public function handleProblemSet($id = null) {

            // when id not given..
            if(!$id) {
                return [
                    "status" => false,
                    "message" => "problem couldn't be fetched, missing details"
                ];
            }

            // get the problem
            $data = $this->model->getProblem($id) ?? [];

            // iterate over the problem_set returned..
            foreach($data as &$problem) {

                // sanitize the topics string -> array for frontend..
                $problem["topic_names"] = $problem["topic_names"] ? explode(", ", $problem["topic_names"]) : [];
                $problem["topic_ids"] = $problem["topic_ids"] ? explode(", ", $problem["topic_ids"]) : [];
            }

            // empty the problem.. (still points to last problemset)
            unset($problem);

            // get the response data..
            return [
                "status" => true,
                "message" => "problem fetch success",
                "data" => $data
            ];
       } 

       // () -> get the starter code from problem..
       public function handleGetStarterCode($id = null) { 

            // when id not given..
            if(!$id) {
                return [
                    "status" => false,
                    "message" => "problem couldn't be fetched, missing details"
                ];
            }

            // get the starter code
            $data = $this->model->getStarterCode($id);

            // get the response data..
            return [
                "status" => true,
                "message" => "starter code fetch success",
                "data" => $data["starter_code"] ?? ""
            ];
       } 

       // () -> get all related test cases of a problem (if any)
       public function getAllTestCases($id = null) { 

            // when id not given..
            if(!$id) {
                return [
                    "status" => false,
                    "message" => "test cases couldn't be fetched, missing details"
                ];
            }

            // get the available test cases..
            $data = $this->model->getTestCases($id) ?? [];

            // get the response data..
            return [
                "status" => true,
                "message" => "test cases fetch success",
                "data" => $data
            ];
       } 

       // () -> get function type of problem set..
       public function getFunctionType($id = null) {

            // when id not given..
            if(!$id) {
                return [
                    "status" => false,
                    "message" => "function type couldn't be fetched, missing details"
                ];
            }

            // get type of function
            $data = $this->model->getFunctionTypeOfProblem($id) ?? [];

            // get the response data..
            return [
                "status" => true,
                "message" => "function type fetch success",
                "data" => $data
            ];
        
       }

       // () -> get function name of problem set..
       public function getFunctionName($id = null) {

            // when id not given..
            if(!$id) {
                return [
                    "status" => false,
                    "message" => "function name couldn't be fetched, missing details"
                ];
            }

            // get type of function
            $data = $this->model->getFunctionNameOfProblem($id) ?? [];

            // get the response data..
            return [
                "status" => true,
                "message" => "function name fetch success",
                "data" => $data
            ];
        
       }

       // () -> save submission
        public function handleSaveSubmission(array $data) {

            $submissionId = $this->model->saveSubmission($data);

            if ($submissionId && is_numeric($submissionId)) {
                return $submissionId; // return the inserted submission ID
            }

            return false;
        }

        // () -> save solution
         public function handleSaveSolution(array $data) {
            $solutionId = $this->model->saveSolution($data);
            return $solutionId;
        }

        // () -> get the paths and related problem sets..
        public function handleProblemSetsByPath() {

            // get the data..
            $rows = $this->model->getProblemSetsByPaths();

            // initial problems
            $grouped = [];

            foreach ($rows as $row) {
                $grouped[$row["path_name"]][] = [
                    "id" => $row["problem_id"],
                    "title" => $row["title"],
                    "difficulty" => $row["difficulty"],
                    "is_solved" => (bool)$row["is_solved"],
                    "is_attempted" => (bool)$row["is_attempted"]
                ];
            }

            // return $rows;
            return [
                "status" => true,
                "data" => $grouped
            ];
        }

       
    }
    
    // TEST..
    // $controller = new PracticeProblemController();
    // $data = $controller->handleProblemSetsByPath();

    // try to get problems..
    // $data = $controller->handleAllProblemSets();

    // check log..
    // var_dump($data);

    // get the starter code..
    // $starterCode = $controller->handleGetStarterCode(4);

    // check log..
    // var_dump($starterCode);


    // TEST
    // $code = <<<PHP
    // function showUser(\$name, \$age) {
    //     echo "Hey I'm \$name, And I'm in my \$age's";
    // }
    // PHP;


    // evaluate the code submitted..
    // $evaluation = $controller->handleCodeEvaluation($code);

    // check log..
    // var_dump($evaluation);
?>
 