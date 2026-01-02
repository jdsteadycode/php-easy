<?php
    // handle the type of content for client..
    header("Content-Type: application/json");

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // grab modules..
    require(dirname(__DIR__, 3) . "/config/config.php");

    // get the Admin Controller module..
    require(FILE_PATH . "/controllers/admin/ProblemSetController.php");

    // check the request method..
    if($_SERVER["REQUEST_METHOD"] == "GET") {

        // handle problem set..
        $problem_set = new ProblemSetController();
        $all_problem_sets = $problem_set->all_problem_sets(
            "
                SELECT 
                    problem_set.*,
                    users.username,
                    users.id as 'user_id',
                    GROUP_CONCAT(topics.name ORDER BY topics.name SEPARATOR ', ') AS topics,
                    GROUP_CONCAT(topics.id ORDER BY topics.id SEPARATOR ', ') AS topic_ids
                FROM problem_set
                INNER JOIN users 
                    ON users.id = problem_set.created_by
                LEFT JOIN problem_set_topic_jn 
                    ON problem_set.id = problem_set_topic_jn.problem_id
                LEFT JOIN topics 
                    ON topics.id = problem_set_topic_jn.topic_id
                WHERE problem_set.deleted_at IS NULL
                GROUP BY problem_set.id;
            ",
            []
        );

        // iterate over the problem_set returned..
        foreach($all_problem_sets as &$problem) {

            // sanitize the topics string -> array for frontend..
            $problem["topics"] = $problem["topics"] ? explode(", ", $problem["topics"]) : [];
            $problem["topic_ids"] = $problem["topic_ids"] ? explode(", ", $problem["topic_ids"]) : [];
        }

        // empty the problem.. (still points to last problemset)
        unset($problem);

        // send the response to client
        echo json_encode([
            "message" => "all problem statements fetch success",
            "data" => $all_problem_sets,
            "status" => true
        ]);
        exit();
    }
    else {

        // send response to client..
        echo json_encode([
            "message" => "invalid request method",
            "status" => false
        ]);
        exit();
    }