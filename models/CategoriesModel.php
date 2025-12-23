<?php

    // grab the modules..
    // going 2 steps out of current dir..
    require(dirname(__DIR__, 1) . "/config/config.php");

    // get the database module..
    require(FILE_PATH . "/db/db.php");

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // A CategoriesModel Class
    class CategoriesModel {

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

        // () -> handle add up of new category (for video/ playlist)
        // same for the sub category..
        public function addCategory($name, $parentId = null) {

            // intial statement and parameters..
            $statement = NULL;
            $parameters = [];

            // prepare the statement..
            $statement = "
                INSERT INTO categories
                (name, created_at, parent_id)
                VALUES
                (:name, :created_at, :parent_id)
            ";

            // attach parameters..
            $parameters = [
                "name" => $name,
                "created_at" => date("Y-m-d H:i:s"),
                "parent_id" => $parentId
            ];

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // get id of topic last added or false (if ain't added)
            return $stmt ? $this->pdo->lastInsertId() : false;
        }

        // () -> handle checking of an existing category..
        public function checkCategory($categoryId) {

            // intial statement and parameters..
            $statement = NULL;
            $parameters = [];

            // prepare the statement..
            $statement = "
                SELECT name 
                FROM categories
                WHERE id = :id AND deleted_at IS NULL
            ";

            // attach parameters..
            $parameters = [
                "id" => $categoryId
            ];

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            //..
            if($stmt) {

                // get the row..
                return $stmt->fetch();
            }

            // when db/ query problem..
             return false;
        }

        // () -> handle updation of existing category (for video/ playlist..)
         public function updateCategory($categoryId, $name) {

            // intial statement and parameters..
            $statement = NULL;
            $parameters = [];

            // prepare the statement..
            $statement = "
                UPDATE categories
                SET 
                    name = :name,
                    updated_at = :updated_at
                WHERE id = :id 
                AND deleted_at IS NULL
            ";

            // attach parameters..
            $parameters = [
                "name" => $name,
                "updated_at" => date("Y-m-d H:i:s"),
                "id" => $categoryId
            ];

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // when db/ command problem
            if(!$stmt) {
                return false;
            }

            // get rows affected, on success..
            return $stmt->rowCount();
            
        }

        // () -> handle deletion of existing category (for video/ playlist..)
         public function deleteCategory($categoryId) {

            // intial statement and parameters..
            $statement = NULL;
            $parameters = [];

            // prepare the statement..
            $statement = "
                UPDATE categories
                SET 
                    deleted_at = :deleted_at
                WHERE id = :id AND deleted_at IS NULL
            ";

            // attach parameters..
            $parameters = [
                "deleted_at" => date("Y-m-d H:i:s"),
                "id" => $categoryId
            ];

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // when db/ command problem
            if(!$stmt) {
                return false;
            }

            // get rows affected, on success..
            return $stmt->rowCount();
            
        }

        // () -> handle all categories..
        public function getAllCategories() {

            // intial statement and parameters..
            $statement = NULL;

            // prepare the statement..
            $statement = "
                SELECT 
                    parent.id AS 'parent_category_id',
                    parent.name AS 'parent_category_name',
                    parent.created_at,
                    parent.updated_at,
                    parent.deleted_at,
                    GROUP_CONCAT(child.`name` ORDER BY child.id SEPARATOR ', ') AS child_categories,
                    GROUP_CONCAT(child.`id` ORDER BY child.id SEPARATOR ', ') AS child_categories_ids
                FROM categories parent
                LEFT JOIN categories child ON 
                    (parent.id = child.parent_id AND child.deleted_at IS NULL)
                WHERE parent.deleted_at IS NULL
                GROUP BY parent.id;

            ";

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters = NULL);

            // when db/ command problem
            if(!$stmt) {
                return false;
            }

            // get all rows, on success..
            return $stmt->fetchAll();
        }   
    }