<?php

    // grab the modules..
    // going 2 steps out of current dir..
    require(dirname(__DIR__, 2) . "/config/config.php");

    // get the database module..
    require(FILE_PATH . "/db/db.php");

    // A TopicController Class
    class TopicController {

        // initial connection and pdo obj..
        public $pdo = null;
        public $db = null;

        // when Admin Controller is instantiated..
        public function __construct() {

            // try to connect with db..
            $this->db = new DB();

            $this->pdo = $this->db->handleConnection();
        }

        // () -> handle add up of new topic (for problem statements..)
        public function add_topic($statement, $parameters = []) {

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // get id of topic last added or false (if ain't added)
            return $stmt ? $this->pdo->lastInsertId() : false;
        }

         // () -> handle deletion of new topic (for problem statements..)
         public function delete_topic($statement, $parameters = []) {

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // get number of topic which deleted or false (if ain't added)
            return $stmt ? $stmt->rowCount() : false;
        }

        // () -> handle updation of new topic (for problem statements..)
         public function update_topic($statement, $parameters = []) {

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // get number of topic which deleted or false (if ain't added)
            return $stmt ? $stmt->rowCount() : false;
        }

        // () -> handle getting of all topics..
        public function all_topics($statement, $parameters = []) {

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // get number of topic which deleted or false (if ain't added)
            return $stmt ? $stmt->fetchAll() : false;
        }
    }

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // check log..
    // $topic = new TopicController();

    // var_dump($topic);

    // 1..
    // add topic for problem sets..
    // $added =  $topic->add_topic(
    //     "INSERT INTO topics (name, created_at) VALUES (:name, :created_at)",
    //     [
    //         "name" => false,
    //         "created_at" => date("Y-m-d H:i:s")
    //     ]
    // );

    // 2.
    // delete the topic
    // $deleted_rows =  $topic->delete_topic(
    //     "UPDATE topics SET deleted_at = :deleted_at WHERE id = :id",
    //     [
    //         "deleted_at" => date("Y-m-d H:i:s"),
    //         "id" => 1
    //     ]
    // );

    // 3. 
    // update the topic
    // $updated_rows = $topic->update_topic(
    //     "UPDATE topics SET name = :name, updated_at = :updated_at WHERE id = :id",
    //     [
    //         "name" => "axa",
    //         "updated_at" => date("Y-m-d H:i:s"),
    //         "id" => 1
    //     ]
    // );

    // 4.
    // grab all of the topics available..
    // $all_topics = $topic->all_topics(
    //     "SELECT * FROM topics"
    // );

    // check log..
    // var_dump($added);