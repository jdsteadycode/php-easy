<?php

    // grab the modules..
    // going 2 steps out of current dir..
    require_once(dirname(__DIR__, 2) . "/models/CategoriesModel.php");

    // A Class for handling Categories Logic..
    class CategoriesController {

        // initial model..
        public $model = null;

        // when the controller is instantiated..
        public function __construct() {

            // try to connect with the model..
            $this->model = new CategoriesModel();
        }

        // () -> for handling adding of new categories (either parent or child)
        public function handleAddCategory($name, $parentId = null)  {

            // when data seems to be empty
            if(!$name || trim($name) === "") {

                // return the error array..
                return [
                    "message" => "missing category name",
                    "status" => false
                ];
            }

            // handle creation of new category/ sub-category
            $create = $this->model->addCategory($name, $parentId);

            // when created successfully..
            if($create) {

                // return success array..
                return [
                    "message" => "$name category was added successfully",
                    "status" => true
                ];
            }
            else {

                // return failed array..
                return [
                    "message" => "$name category already exists!",
                    "status" => false
                ];
            }
        }

        // () -> for handling existing category checks before any DML operations..
        public function categoryExists($categoryId) {

            // check..
            $check = $this->model->checkCategory($categoryId);
            
            // when no category exists..
            if($check) {

                // a new can be added..
                return true;
            }
            else {

                // ottherwise, can't add one..
                return false;
            }
        }

        // () -> for handling updation of category (either parent or child)
        public function handleUpdateCategory($categoryId, $name = null)  {

            // when data seems to be empty
            if(!$name || trim($name) === "" || !$categoryId || $categoryId === "") {

                // return the error array..
                return [
                    "message" => "missing category details",
                    "status" => false
                ];
            }

            // when category doesn't exist..
            if(!$this->categoryExists($categoryId)) {

                // return error array..
                return [
                    "message" => "category doesn't exist",
                    "status" => false
                ];
            }

            // handle updation of existing  category/ sub-category
            $update = $this->model->updateCategory($categoryId, $name);

            // when created successfully..
            if($update === 1) {

                // return success array..
                return [
                    "message" => "$name category was updated successfully",
                    "status" => true
                ];
            }

            // when nothing updated..
            else if($update === 0) {

                // return success array..
                return [
                    "message" => "No changes for $name category",
                    "status" => true
                ];
            }

            // when command or db runs into an issue..
            else {

                // return failed array..
                return [
                    "message" => "$name category couldn't be updated",
                    "status" => false
                ];
            }
        }

        // () -> for deleting the existing category (either parent or child)
        public function handleDeleteCategory($categoryId) {

            // trim up the id..
            $categoryId = trim($categoryId);    

            // when data seems to be empty
            if($categoryId === "" || !ctype_digit($categoryId) || (int)($categoryId) <= 0) {

                // return the error array..
                return [
                    "message" => "missing category details",
                    "status" => false
                ];
            }

            // check..
            $delete = $this->model->deleteCategory(((int)$categoryId));

            // when deleted..
            if($delete === 1) {

                // success array.
                return [
                    "message" => "category delete was successful",
                    "status" => true
                ];
            }

            // when none deleted..
            else if($delete === 0) {

                // failed array
                return [
                    "message" => "already deleted or none-rows to delete",
                    "status" => false
                ];
            }

            // when command/ db error..
            else {

                // failed array..
                return [
                    "message" => "couldn't delete the category given",
                    "status" => false
                ];
            }
        }

        // () -> for handling all categories..
        public function handleAllCategories() {

            // get the rows..
            $all = $this->model->getAllCategories();

            // sanitize the child_categories..
            foreach($all as &$data) {

                // handle parsing of child_categories string -> indexed array
                $data["child_categories"] = $data["child_categories"] 
                    ? explode(", ", $data["child_categories"])
                    : [];

                $data["child_categories_ids"] = $data["child_categories_ids"] 
                    ? array_map(
                        'intval',
                        explode(", ", $data["child_categories_ids"])
                    )       // sanitize the string child_categories_ids into integer ones..
                    : [];
            }

            // get the final data..
            return $all;
        }
    } 

    // check log..
    // $controller = new CategoriesController();

    // 1. a new category
    // $check = $controller->handleAddCategory(
    //     "intermediate",
    // );

    // check log..
    // var_dump($check);

    // 2.
    // check for existing category..
    // $existingCategory = $controller->categoryExists();

    

    // 3. update the category..
    // $check = $controller->handleUpdateCategory("4", "variables");

    // check log..
    // var_dump($check);


    // 4.
    // handle deletion of category
    // $check = $controller->handleDeleteCategory("4");

    // check log..
    // var_dump($check);


    // 5.
    // all of the categories..
    // $check = $controller->handleAllCategories();

    // check log..
    // var_dump($check);
