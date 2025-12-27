<?php

    // grab the modules..
    // going 2 steps out of current dir..
    require(dirname(__DIR__, 1) . "/config/config.php");

    // get the database module..
    require(FILE_PATH . "/db/db.php");

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // A UserModel Class
    class UserModel {

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

        // () -> get user details..
        public function getUserDetails($id) {

            // intial statement and parameters..
            $statement = NULL;
            $parameters = [];

            // prepare the statement..
            $statement = "
                SELECT *
                FROM users
                WHERE id = :id 
                AND deleted_at IS NULL
            ";

            // attach parameters..
            $parameters = [
                "id" => $id
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

        // () -> update the user details..
        public function updateUserDetails(string $statement, array $parameters) {

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // when db/ command problem
            if(!$stmt instanceof PDOStatement) {
                return false;
            }

            // get rows affected, on success..
            return $stmt->rowCount();
        }

        // () -> update the new password..
        public function updatePassword(string $password, string $id) {

            // initial statement, parameters//
            $statement = null;
            $parameters = [];

            // make update password command statement..
            $statement = "
                UPDATE users
                SET password = :password
                WHERE id = :id
            ";

            // attach params..
            $parameters["password"] = $password;
            $parameters["id"] = $id;

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // when db/ command problem
            if(!$stmt instanceof PDOStatement) {
                return false;
            }

            // get rows affected, on success..
            return $stmt->rowCount();
        }

        // () -> delete the account..
        public function deleteAccount(string $id) {

            // initial statement, parameters//
            $statement = null;
            $parameters = [];

            // make update password command statement..
            $statement = "
                UPDATE users
                SET deleted_at = :deleted_at
                WHERE id = :id
            ";

            // attach params..
            $parameters["deleted_at"] = date("Y-m-d H:i:s");
            $parameters["id"] = $id;

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // when db/ command problem
            if(!$stmt instanceof PDOStatement) {
                return false;
            }

            // get rows affected, on success..
            return $stmt->rowCount();
        }
    }

?>
