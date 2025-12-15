<?php

    // grab the modules..
    // going 2 steps out of current dir..
    require(dirname(__DIR__, 2) . "/config/config.php");

    // get the database module..
    require(FILE_PATH . "/db/db.php");

    // A ProblemSetController Class
    class ProblemSetController {

        // initial connection and pdo obj..
        public $pdo = null;
        public $db = null;

        // when Admin Controller is instantiated..
        public function __construct() {

            // try to connect with db..
            $this->db = new DB();

            $this->pdo = $this->db->handleConnection();
        }

        // ADD
        // () -> handle add up of new problemset ()
        public function add_problem_set($statement, $parameters = []) {

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // get id of problem_set last added or false (if ain't added)
            return $stmt ? $this->pdo->lastInsertId() : false;
        }

        // () -> handle adding and setting up the topics for (above problemset addon)
        public function add_topics_to_problem_set($statement, $parameters = []) {

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // true when topic was successfully assigned to the respective problem set..
            return $stmt ? true : false;
        }

        // () -> handle problem_set addon with the topics..
        public function add_problem_set_with_topics($problem_set_data, $topics) {

            // try safelly..
            try {

                // begin a new transaction..
                $this->pdo->beginTransaction();

                // 1. add a new problem set..

                // first a new problem..
                $added_problemset_id = $this->add_problem_set(
                    "
                    INSERT INTO problem_set
                    (title, description, difficulty, sample_input, sample_output, hints, created_by, created_at)
                    VALUES 
                    (:title, :description, :difficulty, :sample_input, :sample_output, :hints, :created_by, :created_at)
                    ",
                    $problem_set_data
                );


                // check if problem not added..
                if(!$added_problemset_id) {
                    throw new Exception("Problem couldn't be added!");
                }


                // 2.
                // now,
                // for each of the topic..
                foreach ($topics as $topic) {

                    // assign the topic to the respective problem set..
                    $assign_topic = $this->add_topics_to_problem_set(
                        "
                        INSERT INTO problem_set_topic_jn 
                        (problem_id, topic_id)
                        VALUES
                        (:problem_id, :topic_id)
                        ",
                        [
                            "problem_id" => $added_problemset_id, // recently added problem set's id..
                            "topic_id" => $topic, // incoming topic id from clients (via above topic array)
                        ]
                    );

                    // when topic couldn't be assigned..
                    if(!$assign_topic) {
                        throw new Exception("Topic couldn't be assigned to current problem-set");
                    }
                }


                // save the changes..
                $this->pdo->commit();

                // at last get the id of problem set when anything goes right..
                return $added_problemset_id;  
 
            }

            // handle the run-time errors..
            catch(Exception $exception) {

                // when any problem!
                // go previous check point..
                $this->pdo->rollBack();

                // false for problem..
                return false;
            }
        }


        // () -> handle the removal of existing topics related to problemset ()
        public function delete_topics_assigned($statement, $parameters = []) {

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // if deleted topics get no of topics.. else false..
            return $stmt && $stmt->rowCount() > 0;
        }

         // UPDATE 
         // () -> handle the updation of problemset ()
         public function update_problem_set($statement, $parameters = []) {

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // true when the update was successfull..
            return $stmt ? true : false;
         }
    
         // () -> handle all topic_ids added respective to problemset
         public function get_topic_ids_related_to_problem_set($statement, $parameters = []) {

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // when topicids exist get'em else false..
            if($stmt) {

                // get each as assoc array..
                $existing_topics = $stmt->fetchAll();

                // sanitize the ids..
                $ids = [];

                // iterate over the ids..
                foreach ($existing_topics as $topic) {

                    // save each id only..
                    $ids[] = $topic["topic_id"];
                }

                // get the ids..
                return $ids;
            }
            else {

                // false when, no error..
                return false;
            }
        }

        // DELETE
        // () -> handle deletion of problemset ()
        public function delete_problem_set($statement, $parameters = []) {

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // true when the update was successfull..
            return $stmt ? true : false;
         }


         // () -> handle all problem-sets..
         public function all_problem_sets($statement, $parameters = []) {

            // execute the query
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // if found, fetch all else 0..
            return $stmt->fetchAll();
         }
    }
    

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

   
    // handle problem sets..
    // $problem_set = new ProblemSetController();

    // check log..
    // var_dump($problem_set);

    // 1. add a new problem set..
    // $added_problem_or_not = $problem_set->add_problem_set_with_topics(
    //     [
    //          "title" => "a demo title", 
    //          "description"=> "a demo desc",
    //          "difficulty"=> "easy", 
    //          "sample_input"=> "echo ('hello php')", 
    //          "sample_output"=> "hello php", 
    //          "hints"=> NULL, 
    //          "created_by"=> 1, 
    //          "created_at"=> date("Y-m-d H:i:s") 
    //     ],
    //     [22]
    // );
    
    
    // #UPDATION
    // 1. just update the existing problem_set
    // $updated_or_not =  $problem_set->update_problem_set(
    //     "
    //     UPDATE problem_set
    //         SET title = :title, description = :description, difficulty = :difficulty, sample_input = :sample_input, sample_output = :sample_output, hints = :hints, updated_at = :updated_at
    //      WHERE id = :id 
    //     ",
    //      [
    //          "title" => "no demo title", 
    //          "description"=> "no demo desc",
    //          "difficulty"=> "easy", 
    //          "sample_input"=> "echo ('hello php')", 
    //          "sample_output"=> "hello php", 
    //          "hints"=> NULL, 
    //          "updated_at"=> date("Y-m-d H:i:s"),
    //          "id" => 1
    //     ],
    // );

    // 2. adding the topics into existing problem_set..

    // check for existing ids..
    // $existing_topic_ids = $problem_set->get_topic_ids_related_to_problem_set(
    //     "SELECT topic_id FROM problem_set_topic_jn WHERE problem_id = :problem_id",
    //     [
    //         "problem_id" => 1
    //     ]
    // );
    
    // $topics = [22, 26];  // new topics from client..
    // $assign_topic = NULL;   // initial outcome..
    // // iterate over the topics..
    // foreach ($topics as $topic) {

    //     // if it's new topic id..
    //     if(!in_array($topic, $existing_topic_ids)) {

    //         // assign the topic to the respective problem set..
    //         $assign_topic = $problem_set->add_topics_to_problem_set(
    //             "
    //             INSERT INTO problem_set_topic_jn 
    //             (problem_id, topic_id)
    //             VALUES
    //             (:problem_id, :topic_id)
    //             ",
    //             [
    //                 "problem_id" => 1, // recently added problem set's id..
    //                 "topic_id" => $topic, // incoming topic id from clients (via above topic array)
    //             ]
    //         );
    //     }
    // }

    // // check log..
    // var_dump($assign_topic);
    

    // 3.
    // delete the topic id from the problem_set
    // $topics_to_be_deleted = [22];   // initial topic ids from client..
    // $deleted_topics = NULL;     // initial outcome..
    
    // // iterate over the topics..
    // foreach ($topics_to_be_deleted as $topic) {

    //     // if topic exist..
    //     if(in_array($topic, $existing_topic_ids)) {

    //         // assign the topic to the respective problem set..
    //         $deleted_topics = $problem_set->delete_topics_assigned(
    //             "
    //             DELETE FROM problem_set_topic_jn 
    //             WHERE problem_id = :problem_id 
    //             AND topic_id = :topic_id
    //             ",
    //             [
    //                 "problem_id" => 1, // recently added problem set's id..
    //                 "topic_id" => $topic, // incoming topic id from clients (via above topic array)
    //             ]
    //         );
    //     }
    // }

    // check log
    // var_dump($deleted_topics);
    

    // DELETE
    // 4.
    // delete the problem_set
    // $deleted_problem = $problem_set->delete_problem_set(
    //     "
    //     UPDATE problem_set
    //         SET deleted_at = :deleted_at
    //     WHERE id = :id
    //     ",
    //     [
    //         "deleted_at" => date("Y-m-d H:i:s"),
    //         "id" => 1,
    //     ]
    // );

    // check log..
    // var_dump($deleted_problem);

    // 5.
    // all of the problem sets..
    // $all_problem_sets = $problem_set->all_problem_sets(
    //     "
    //         SELECT 
    //             problem_set.id,
    //             problem_set.title,
    //             problem_set.description,
    //             problem_set.difficulty,
    //             problem_set.created_at,
    //             users.username,
    //             GROUP_CONCAT(topics.name ORDER BY topics.name SEPARATOR ', ') AS topics
    //         FROM problem_set
    //         INNER JOIN users 
    //             ON users.id = problem_set.created_by
    //         LEFT JOIN problem_set_topic_jn 
    //             ON problem_set.id = problem_set_topic_jn.problem_id
    //         LEFT JOIN topics 
    //             ON topics.id = problem_set_topic_jn.topic_id
    //         GROUP BY problem_set.id
    //     ",
    //     []
    // );

    // check log..
    // var_dump($all_problem_sets);