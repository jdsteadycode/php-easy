<?php

    // grab the modules..
    require(dirname(__DIR__, 2) . "/config/config.php");

    // going 2 steps out of current dir..
    // get the user model..
    require_once(dirname(__DIR__, 2) . "/models/LearnModel.php");

    // get the helper functions..
    // require_once(dirname(__DIR__, 2) . "/helpers/Helpers.php");

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // A Class for handling learn controller..
    class LearnController {

        // initial model..
        public $model = null;

        // when the controller is instantiated..
        public function __construct() {

            // try to connect with the model..
            $this->model = new LearnModel();
        }

     
        // () -> get all parent categories (from model)
        public function fetchParentCategories() {
            return $this->model->getParentCategories();
        }

        // () -> get all child categories (related to parent category from model)
        public function fetchChildCategories($parent_id) {
            if(!isset($parent_id) || !is_numeric($parent_id)) {
                return false;
            }
            return $this->model->getChildCategories((int)$parent_id);
        }

        // () -> fetch category (concept) content
        public function fetchCategoryContent($category_id) {
            if (!$category_id) {
                return false;
            }
            return $this->model->getCategoryContent($category_id);
        }

        // () -> fetch videos for category
        public function fetchCategoryVideos($category_id) {
            if (!$category_id) {
                return [];
            }
            return $this->model->getVideosByCategory($category_id);
        }

    } 

    // TEST..
    

