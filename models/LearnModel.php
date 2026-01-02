<?php

    // grab the modules..
    // going 2 steps out of current dir..
    require(dirname(__DIR__, 1) . "/config/config.php");

    // get the database module..
    require(FILE_PATH . "/db/db.php");

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // A Learn Class
    class LearnModel {

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

        // Get all parent categories 
        public function getParentCategories() {
            $statement = "
                SELECT id, name
                FROM categories
                WHERE parent_id IS NULL 
                    AND deleted_at IS NULL
                ORDER BY id
            ";
            $stmt = $this->db->executeCommandOrQuery($statement);
            return $stmt ? $stmt->fetchAll() : [];
        }

        // Get all child categories (related to parent)
        public function getChildCategories($parent_id) {
            $statement = "
                SELECT id, name
                FROM categories
                WHERE parent_id = :parent_id
                AND deleted_at IS NULL
                ORDER BY name;

            ";
            $parameters["parent_id"] = $parent_id;
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);
            return $stmt ? $stmt->fetchAll() : [];
        }

        // Get content for a specific child category (concept)
        public function getCategoryContent($category_id) {

            $statement = "
                SELECT 
                    cc.id,
                    cc.description,
                    cc.example_code,
                    cc.notes,
                    c.name AS category_name
                FROM category_contents cc
                INNER JOIN categories c ON c.id = cc.category_id
                WHERE cc.category_id = :category_id
                LIMIT 1
            ";

            $parameters = [
                "category_id" => $category_id
            ];

            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            return $stmt ? $stmt->fetch() : null;
        }

         // Get videos related to a category (concept)
        public function getVideosByCategory($category_id) {

            $statement = "
                SELECT 
                    v.id,
                    v.title,
                    v.description,
                    v.video_url
                FROM videos v
                INNER JOIN video_category_jn vcj 
                    ON vcj.video_id = v.id
                WHERE vcj.category_id = :category_id
                AND v.deleted_at IS NULL
                ORDER BY v.created_at DESC
            ";

            $parameters = [
                "category_id" => $category_id
            ];

            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            return $stmt ? $stmt->fetchAll() : [];
        }
   
    }

    // instantiate the Model Class..
    // $model = new Playground();
?>

