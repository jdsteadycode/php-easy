<?php

    // grab the modules..
    // going 2 steps out of current dir..
    require(dirname(__DIR__, 1) . "/config/config.php");

    // get the database module..
    require(FILE_PATH . "/db/db.php");

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // A PracticeProblemSet Class
    class PracticeProblemSet {

        // initial connection and pdo obj..
        public $pdo = null;
        public $db = null;

        // when Admin Controller is instantiated..
        public function __construct() {

            // instantiate the class..
            $this->db = new DB();

            // make interaction with db
            $this->pdo = $this->db->handleConnection();
        }

        // () -> get all problem sets details..
        public function getProblemSets() {

            // initial statement, parameters
            $statement = null;
            $parameters = [];

            // make query for all problem sets with topics..
            $statement = "
                SELECT 
                    problem_set.*,
                    GROUP_CONCAT(DISTINCT topics.name ORDER BY topics.id SEPARATOR ', ') AS topic_names,
                    GROUP_CONCAT(DISTINCT topics.id ORDER BY topics.id SEPARATOR ', ') AS topic_ids,
                    (
                        SELECT COUNT(*)
                        FROM submissions s
                        WHERE s.problem_id = problem_set.id
                        AND s.user_id = :userId
                    ) AS attempts,

                    EXISTS (
                        SELECT 1
                        FROM solutions sol
                        WHERE sol.problem_id = problem_set.id
                        AND sol.user_id = :userId
                    ) AS is_solved
                FROM problem_set
                LEFT JOIN problem_set_topic_jn ON  (problem_set_topic_jn.problem_id = problem_set.id)
                LEFT JOIN topics ON (topics.id = problem_set_topic_jn.topic_id)
                WHERE problem_set.deleted_at IS NULL
                GROUP BY problem_set.id;
            ";

            $parameters["userId"] = $_SESSION["user_id"];

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // when db/ command problem
            if(!$stmt instanceof PDOStatement) {
                return false;
            }

            // get rows..
            return $stmt->fetchAll();
        }

        // () -> get paths (and related all problems)
        public function getProblemSetsByPaths() {
            $statement = "
                SELECT 
                    pp.id AS path_id,
                    pp.name AS path_name,
                    ps.id AS problem_id,
                    ps.title,
                    ps.difficulty,

                    EXISTS (
                        SELECT 1 FROM solutions sol
                        WHERE sol.problem_id = ps.id
                        AND sol.user_id = :userId
                    ) AS is_solved,

                    EXISTS (
                        SELECT 1 FROM submissions sub
                        WHERE sub.problem_id = ps.id
                        AND sub.user_id = :userId
                    ) AS is_attempted

                FROM problem_paths pp
                JOIN problem_path_jn ppj ON pp.id = ppj.path_id
                JOIN problem_set ps ON ps.id = ppj.problem_id

                WHERE ps.deleted_at IS NULL
                ORDER BY pp.order_index, ppj.order_index
            ";

            $stmt = $this->db->executeCommandOrQuery(
                $statement,
                ["userId" => $_SESSION["user_id"]]
            );

            return $stmt->fetchAll();
        }


        // () -> get single problem set details..
        public function getProblem($problemId) {

            // check log..
            // var_dump($_SESSION["user_id"], $problemId);

            // initial statement, parameters
            $statement = null;
            $parameters = [];

            // make query for all problem sets with topics..
            $statement = "
                SELECT 
                    problem_set.*,

                    GROUP_CONCAT(DISTINCT topics.name ORDER BY topics.id SEPARATOR ', ') AS topic_names,
                    GROUP_CONCAT(DISTINCT topics.id ORDER BY topics.id SEPARATOR ', ') AS topic_ids,
                    (
                        SELECT COUNT(*) 
                        FROM submissions 
                        WHERE submissions.problem_id = problem_set.id
                        AND submissions.user_id = :userId
                    ) AS attempts,

                     (
                        SELECT COUNT(*)
                        FROM solutions
                        WHERE solutions.problem_id = problem_set.id
                        AND solutions.user_id = :userId
                    ) AS is_accepted

                FROM problem_set
                LEFT JOIN problem_set_topic_jn 
                    ON problem_set_topic_jn.problem_id = problem_set.id
                LEFT JOIN topics 
                    ON topics.id = problem_set_topic_jn.topic_id

                WHERE problem_set.deleted_at IS NULL
                AND problem_set.id = :problemId

                GROUP BY problem_set.id;

            ";

            // attach params..
            $parameters["problemId"] = $problemId;
            $parameters["userId"] = $_SESSION["user_id"];


            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // when db/ command problem
            if(!$stmt instanceof PDOStatement) {
                return false;
            }

            // get rows..
            return $stmt->fetchAll();
        }

        // Save a new submission
        public function saveSubmission(array $data) {

            $statement = "
                INSERT INTO submissions
                (user_id, problem_id, code, execution_status, created_at)
                VALUES
                (:user_id, :problem_id, :code, :execution_status, :created_at)
            ";

            $parameters = [
                "user_id" => $data["user_id"],
                "problem_id" => $data["problem_id"],
                "code" => $data["code"],
                "execution_status" => $data["execution_status"] ?? null,
                "created_at" => date("Y-m-d H:i:s")
            ];

            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            return $stmt ? $this->pdo->lastInsertId() : false;
        }

        // Save the solution
        public function saveSolution(array $data) {

             $statement = "
                INSERT INTO solutions (problem_id, user_id, code, created_at)
                VALUES (:problem_id, :user_id, :code, :created_at)
                ON DUPLICATE KEY UPDATE
                    code = VALUES(code),
                    updated_at = VALUES(created_at)
            ";

            $parameters = [
                "problem_id" => $data["problem_id"],
                "user_id" => $data["user_id"],
                "code" => $data["code"],
                "created_at" => date("Y-m-d H:i:s")
            ];

            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            return $stmt ? true : false;
        }

        // () -> get the starter code..
        public function getStarterCode($problemId) {

            // initial statement, parameters
            $statement = null;
            $parameters = [];

            // make query for starter code related to given problem
            $statement = "     
                SELECT starter_code 
                FROM problem_set
                WHERE id = :problem_id;
            ";

            // attach params..
            $parameters["problem_id"] = $problemId;

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // when db/ command problem
            if(!$stmt instanceof PDOStatement) {
                return false;
            }

            // get rows..
            return $stmt->fetch();
        }

        // () -> get the available test cases..
        public function getTestCases($problemId) {

            // initial statement, parameters
            $statement = null;
            $parameters = [];

            // make query for test cases related to given problem
            $statement = "     
                SELECT *
                FROM test_cases
                WHERE problem_id = :problem_id;
            ";

            // attach params..
            $parameters["problem_id"] = $problemId;

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // when db/ command problem
            if(!$stmt instanceof PDOStatement) {
                return false;
            }

            // get rows..
            return $stmt->fetchAll();
        }

        // () -> get the function type of problem_set
        public function getFunctionTypeOfProblem($problemId) {

            // initial statement, parameters
            $statement = null;
            $parameters = [];

            // make query for test cases related to given problem
            $statement = "     
                SELECT function_type AS type
                FROM problem_set
                WHERE id = :problem_id;
            ";

            // attach params..
            $parameters["problem_id"] = $problemId;

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // when db/ command problem
            if(!$stmt instanceof PDOStatement) {
                return false;
            }

            // get rows..
            return $stmt->fetch();
        }

        // () -> get the function name of problem_set
        public function getFunctionNameOfProblem($problemId) {

            // initial statement, parameters
            $statement = null;
            $parameters = [];

            // make query for test cases related to given problem
            $statement = "     
                SELECT function_name AS name
                FROM problem_set
                WHERE id = :problem_id;
            ";

            // attach params..
            $parameters["problem_id"] = $problemId;

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // when db/ command problem
            if(!$stmt instanceof PDOStatement) {
                return false;
            }

            // get rows..
            return $stmt->fetch();
        }

    }


    // TRY
    // $model = new PracticeProblemSet();
    // $all = $model->getProblemSets();

    // check log..
    // var_dump($all);
?>
