<?php

    // grab the modules..
    require(dirname(__DIR__, 2) . "/config/config.php");

    // going 2 steps out of current dir..
    // get the user model..
    require_once(dirname(__DIR__, 2) . "/models/UserModel.php");

    // get the helper functions..
    require_once(dirname(__DIR__, 2) . "/helpers/Helpers.php");

    // important for sanitizing the current date and time..
    // set the date and time.. (according to india)
    date_default_timezone_set('Asia/Kolkata');

    // A Class for handling video and playlists Logic..
    class SettingsController {

        // initial model..
        public $model = null;

        // when the controller is instantiated..
        public function __construct() {

            // try to connect with the model..
            $this->model = new UserModel();
        }

        // () -> handle user details of a user..
        public function handleUserDetails($id = null) {

            // check id..
            if(!$id || $id === "") {

                return [
                    "status" => false,
                    "message" => "user id is missing"
                ];
            }

            // otherwise,
            $userDetails = $this->model->getUserDetails($id);

            // send response..
            return [
                "status" => true,
                "message" => $userDetails ? "user details fetch success" : "no user data found",
                "data" => $userDetails ? $userDetails : []
            ];
        }

       // () -> handle the updation of users..
       public function handleUserUpdate(array $userData, string $table) {

            // check and prepare the data for further updates..
            $checked = Helpers::handleUpdate($userData, $table);

            // when invalid data response..
            $invalid_response = $checked["status"] ?? null;

            // when missing data or invalid data..
            if($invalid_response === false) {

                // get the response..
                return $checked;
            }

            // send the data to model..
            $updated = $this->model->updateUserDetails($checked["statement"], $checked["parameters"]);

            // when update are visible.
            if($updated > 0) {

                // get the sucess array
                return [
                    "status" => true,
                    "message" => "$updated rows updated successfully"
                ];
            }

            // when nothing updated..
            if($updated === 0) {

                // get the sucess array
                return [
                    "status" => true,
                    "message" => "nothing updated"
                ];
            }

            // when cannot update..
            else {

                // get the failed array..
                return [
                    "status" => false,
                    "message" => "couldn't to update"
                ];
            }
       }

       // () -> save the profile image of video..
        public function saveProfile($imageFile) {

            // target destination..
            $targetDestination = FILE_PATH . "/uploads/images/";     // locate from the absolute path from given dir..

            // get the file name..
            $imageName = $imageFile["name"];

            // temporary storage location name..
            $tempName = $imageFile["tmp_name"];

            // get the extension of current file..
            $currentImageExtension = mime_content_type($tempName);

            // allowed extensions..
            $allowedExtensions = [
                "image/png" => "png",
                "image/jpg" => "jpg",
                "image/jpeg" => "jpeg",
                "image/webp" => "webp"
            ];

            // check if image was uploaded successfully..
            if(!isset($tempName) || $imageFile["error"] != 0) {
                return false;
            }

            // check if extension doesn't match
            if(!array_key_exists($currentImageExtension, $allowedExtensions)) {
                return false;
            }

            // a unique image name..
            $image = uniqid("profile_", true) . "." . $allowedExtensions[$currentImageExtension];
            $toBeUploadedAt = $targetDestination . $image;

            // check if image is uploaded..
            if(!move_uploaded_file($tempName, $toBeUploadedAt)) {
                return false;
            }

            // when successful upload..
            return "uploads/images/" . $image;
        }
        
        // () -> update the password..
        public function handleUpdatePassword($oldPassword = null, $newPassword = null, $confirmNewPassword = null, $id = null) {

            // check for data..
            if(!$oldPassword || $oldPassword === "" 
                || 
                !$newPassword || $newPassword === "" 
                || 
                !$confirmNewPassword || $confirmNewPassword === "" 
                || 
                !$id || $id === "") {

                return [
                    "status" => false,
                    "message" => "password update details are missing"
                ];
            }

            // verify the details..
            $details = $this->handleUserDetails($id);

            // check log..
            // var_dump($details);

            // when data ain't found..
            if(!$details["status"]) {
                return $details;
            }

            // when new password and confirm password don't match..
            if($newPassword !== $confirmNewPassword) {

                // get the error response..
                return [
                    "status" => false,
                    "message" => "new password and confirm new password did'nt match"
                ];
            }

            // check for the password..
            if(password_verify($oldPassword, $details["data"]["password"])) {

                // proceed for update..
                // return [
                //     "status" => true,
                //     "message" => "password can be updated"
                // ];

                // make the password update..
                $updated = $this->model->updatePassword(
                    password_hash($confirmNewPassword, true),
                    $id
                );

                // when update success
                if($updated > 0) {

                    // send response..
                    return [
                        "status" => true,
                        "message" => "password successfully updated"
                    ];
                }

                if($update == 0) {

                    // send response
                    return [
                        "status" => true,
                        "message" => "nothing changed"
                    ];
                }
               
                // when db error
                return [
                    "status" => false,
                    "message" => "couldn't update the password"
                ];
            }
            else {

                // stop..
                return [
                    "status" => false,
                    "message" => "Old password didn't match!"
                ];
            }
        }

        // () -> delete the account..
        public function handleDeleteAccount($id = null) {

            // when data ain't found..
            if($id === "") {
                return [
                    "status" => false,
                    "message" => "id is missing"
                ];
            }

            // make the delete..
            $delete = $this->model->deleteAccount($id);

            // when soft delete success
            if($delete > 0) {
                return [
                    "status" => true,
                    "message" => "account deleted successfully"
                ];
            }

            else if($delete == 0) {
                return [
                    "status" => false,
                    "message" => "account already deleted"
                ];
            }

            else {
                return [
                    "status" => false,
                    "message" => "couldn't delete your account"
                ];
            }
        }
    } 

    // TEST..
    // $controller = new SettingsController();

    // 1. try update
    // $update = $controller->handleUserUpdate(["first_name" => "jeet", "id" => "1"], "users");

    // check log..
    // var_dump($update);

    // 2. get user details..
    // $user = $controller->handleUserDetails(1);

    // check log..
    // var_dump($user);

    // 3. handle password update..
    // $update = $controller->handleUpdatePassword(
    //     "Jeet",
    //     "jeet",
    //     "jeet",
    //     1
    // );

    // check log..
    // var_dump($update);
   