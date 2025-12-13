<?php

    // class to handle the communication b|w DB..
    class DB {

        // initial credentials..
        public $host = "localhost";
        public $user = "root";
        public $password = "";
        public $dbname = "php_db";

        // initial connection var..
        public $con = null;

        // () -> handle the connection
        public function handleConnection() {

            // try..
            try {

                // try to connect..
                $this->con = new PDO("mysql:host=$this->host;dbname=$this->dbname", $this->user, $this->password);

                // set the errormode to execption..
                $this->con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                // set the default mode for SELECT queries..
                $this->con->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

                // get the con..
                return $this->con;
            }

            // handle errors..
            catch(Exception $e) {

                // log the error..
                // error_log($e->getMessage());

                // when ain't connected..
                return false;
            }
        }

         // () -> handle the execution of commands and queries..
        public function executeCommandOrQuery($statement = "", $parameters = []) {

            // try..
            try {

                // connect if not-connected!
                if(!$this->con) $this->handleConnection();

                // prepare the incoming command or query.. (compiled and takes less time once stored..)
                $stmt = $this->con->prepare($statement);

                // execute..
                if($stmt->execute($parameters)) {

                    // get the statement..
                    return $stmt;
                }

                // when problem..
                return false;

            }

            // handle errors.
            catch(Exception $e) {

                // get the error..
                return $e->getMessage();
            }
        }

    }

    // check log..
    // $db = new DB();

    // try to connect
    // $db->handleConnection();

    // log..
    // var_dump();