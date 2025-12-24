<?php

    // grab the modules..
    require(dirname(__DIR__, 2) . "/config/config.php");


    // going 2 steps out of current dir..
    require_once(dirname(__DIR__, 2) . "/models/VideoAndPlaylistModel.php");

    // A Class for handling video and playlists Logic..
    class VideoAndPlaylistController {

        // initial model..
        public $model = null;

        // when the controller is instantiated..
        public function __construct() {

            // try to connect with the model..
            $this->model = new VideoAndPlaylistModel();
        }

        // () -> for handling adding of new video with categories 
        public function handleAddVideoWithCategories(array $videoData, array $categories)  {

            // when data seems to be empty
            if(count($videoData) == 0 || count($categories) == 0) {

                // return the error array..
                return [
                    "message" => "missing video and categories data",
                    "status" => false
                ];
            }

            // handle creation of new video and playlist..
            $addedVideoId = $this->model->addVideoWithCategories($videoData, $categories);

            // when created successfully..
            if($addedVideoId) {

                // video title of current added video..
                $videoTitle = $videoData["title"];

                // return success array..
                return [
                    "message" => "$videoTitle titled video was added successfully",
                    "status" => true
                ];
            }
            else {

                // return failed array..
                return [
                    "message" => "video already exists",
                    "status" => false
                ];
            }
        }

        // () -> save the thumbnail image of video..
        public function saveThumbnail($imageFile) {

            // target destination..
            $targetDestination = FILE_PATH . "/uploads/videos/thumbnails/";     // locate from the absolute path from given dir..

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
            $image = uniqid("thumbnail_", true) . "." . $allowedExtensions[$currentImageExtension];
            $toBeUploadedAt = $targetDestination . $image;

            // check if image is uploaded..
            if(!move_uploaded_file($tempName, $toBeUploadedAt)) {
                return false;
            }

            // when successful upload..
            return "uploads/videos/thumbnails/" . $image;
        }

        // () -> handle fetching of all video data..
        public function handleAllVideos() {

            // get the videos..
            $all = $this->model->getVideos();

            // when db problem..
            if($all === false) {

                // return the failed response..
                return [
                    "status" => false,
                    "message" => "couldn't fetch the videos.."
                ];
            }

            // iterate over the video-data..
            foreach($all as &$video) {

                // parse the strings -> assoc arrays..
                $video["video_category_names"] = 
                !empty($video["video_category_names"])
                ?
                    explode(", ", $video["video_category_names"])
                : 
                    [];

                $video["video_category_ids"] = 
                !empty($video["video_category_ids"])
                ?
                    array_map("intval", explode(", ", $video["video_category_ids"]))
                : 
                    [];
            }


            // return em.
            return [
                "status" => true,
                "message" => count($all) > 0 ? "videos fetch success" : "no videos found",
                "data" => $all
            ];
        }

        // UPDATE..

        // 1,
        // () -> handle existing video updation..
        public function handleUpdateVideo(
            $title = null, 
            $description = null, 
            $video_url = null, 
            $thumbnail = null, 
            $video_id = null
        ) {
            
            // make the video update..
            $update = $this->model->updateVideo($title, $description, $video_url, $thumbnail, $video_id);

            // when updated..
            if($update > 0) {

                // get the success array..
                return [
                    "status" => true,
                    "message" => "video details updated successfully"
                ];
            }
            else {

                // get the failed array..
                return [
                    "status" => false,
                    "message" => "video details couldn't be updated! try again"
                ];
            }
        }

        // 2.
        // () -> handle existing categories to respective video..
        public function handleExistingCategoriesOfVideo($videoId) {

            // get the data..
            $categories = $this->model->getCategoriesOfVideo($videoId);

             // sanitize the ids..
            $ids = [];

            // iterate over the ids..
            foreach ($categories as $category) {

                // save each id only..
                $ids[] = $category["category_id"];
            }

            // get the ids..
            return $ids;
        }

        // 3.
        // () -> handle adding new categories to respective video..
        public function handleNewCategoriesOfVideo(array $categories, $videoId = null) {

            // when no categories and videoId provided..
            if(empty($categories) || !$videoId || trim($videoId) === "") {

                // get the failed array..
                return [
                    "status" => false,
                    "message" => "categories or video data is missing"
                ];
            }

            // get all existing categories of given video..
            $existing_categories = $this->handleExistingCategoriesOfVideo($videoId);

            // intial flag for update..
            $error = false;
            $assignedCount = 0;

            // iterate over each category id..
            foreach ($categories as $categoryId) {

                // if category is new one..
                if(!in_array($categoryId, $existing_categories)) {

                    // assign the category..
                    $isAssigned = $this->model->addVideoCategory($videoId, $categoryId);

                    // if assigned..
                    if(!$isAssigned) {

                        // update state..
                        $error = true;
                        break;
                    }

                    // update state..
                    $assignedCount++;
                }
            }

            // when error..
            if($error) {

                // get the failed array..
                return [
                    "status" => false,
                    "message" => "couldn't assign category, check again"
                ];
            }

            // get the success array..
            return [
                "status" => true,
                "message" => $assignedCount > 0 ? "added $assignedCount categories" : "no new categories were assigned"
            ];
        }

        // () -> handle removal of existing categories from respective video..
        public function handleRemovalOfCategoriesInVideo(array $categories, $videoId = null) {

            // when no categories and videoId provided..
            if(empty($categories) || !$videoId || trim($videoId) === "") {

                // get the failed array..
                return [
                    "status" => false,
                    "message" => "categories or video data is missing"
                ];
            }

            // get all existing categories of given video..
            $existing_categories = $this->handleExistingCategoriesOfVideo($videoId);

            // intial flag for update..
            $unassignedRows = null;

            // iterate over each category id..
            foreach ($categories as $categoryId) {

                // if category is new one..
                if(in_array($categoryId, $existing_categories)) {

                    // un-assign the category..
                    $unassignedRows = $this->model->removeVideoCategory($videoId, $categoryId);
                }
            }

            // when categories are successfully assigned..
            if($unassignedRows !== null && $unassignedRows > 0) {

                // get the success array..
                return [
                    "status" => true,
                    "message" => "categories un-assigned from video successfully"
                ];
            }
            else {

                // get the failed array..
                return [
                    "status" => false,
                    "message" => "oops category didn't exist"
                ];
            }
        }

        // DELETE
        // () -> handle deletion of video..
        public function handleDeleteVideo($videoId) {

            // trim up the id..
            $videoId = trim($videoId);    

            // when data seems to be empty
            if($videoId === "" || !ctype_digit($videoId) || (int)($videoId) <= 0) {

                // return the error array..
                return [
                    "message" => "missing category details",
                    "status" => false
                ];
            }

            // check..
            $delete = $this->model->deleteVideo(((int)$videoId));

            // when deleted..
            if($delete === 1) {

                // success array.
                return [
                    "message" => "video delete was successful",
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
                    "message" => "couldn't delete the video given",
                    "status" => false
                ];
            }
        }


        // for playlists..
        // () -> for handling adding of new playlists with videos 
        public function handleAddPlaylistWithVideos(array $playlistData, array $videos)  {

            // when data seems to be empty
            if(count($playlistData) == 0 || !$videos || count($videos) == 0) {

                // return the error array..
                return [
                    "message" => "missing playlist and videos data",
                    "status" => false
                ];
            }

            // handle creation of new playlist with videos..
            $addedPlaylistId = $this->model->addPlaylistWithVideos($playlistData, $videos);

            // when created successfully..
            if($addedPlaylistId) {

                // playlist name of current added playlist
                $playlistName = $playlistData["name"];

                // return success array..
                return [
                    "message" => "$playlistName playlist was created successfully",
                    "status" => true
                ];
            }
            else {

                // return failed array..
                return [
                    "message" => "playlist already exists",
                    "status" => false
                ];
            }
        }

        // () -> handle fetching of all playlist data..
        public function handleAllPlaylists() {

            // get the playlists.. (if query fails return empty array..)
            $all = $this->model->getPlaylists();

            // when db problem..
            if($all === false) {

                // return the failed response..
                return [
                    "status" => false,
                    "message" => "couldn't fetch the playlists.."
                ];
            }

            // iterate over the video-data..
            foreach($all as &$playlist) {

                // parse the strings -> assoc arrays..
                $playlist["video_titles"] = 
                !empty($playlist["video_titles"])
                ?
                    explode(", ", $playlist["video_titles"])
                : 
                    [];

                $playlist["video_ids"] = 
                !empty($playlist["video_ids"])
                ?
                    array_map("intval", explode(", ", $playlist["video_ids"]))
                : 
                    [];
            }


            // return em.
            return [
                "status" => true,
                "message" => count($all) > 0 ? "playlists fetch success" : "no playlist found",
                "data" => $all
            ];
        }

        // UPDATE..

        // 1,
        // () -> handle existing playlist updation..
        public function handleUpdatePlaylist(
            $name = null, 
            $description = null,
            $playlist_id = null
        ) {

            // check the incoming details (for update)
            if(
                !$name || trim($name) === "" || 
                !$description || trim($description) === "" || 
                !$playlist_id || trim($playlist_id) === ""
            ) {

                // get the failed array..
                return [
                    "status" => false,
                    "message" => "playlist details are missing"
                ];
            }
            
            // make the video update..
            $update = $this->model->updatePlaylist($name, $description, $playlist_id);

            // when updated..
            if($update > 0) {

                // get the success array..
                return [
                    "status" => true,
                    "message" => "playlist details updated successfully"
                ];
            }
            else {

                // get the failed array..
                return [
                    "status" => false,
                    "message" => "playlist details couldn't be updated! try again"
                ];
            }
        }

        // 2.
        // () -> handle existing videos of respective playlist..
        public function handleExistingVideosOfPlaylist($playlistId) {

            // get the data..
            $videos = $this->model->getVideosOfPlaylist($playlistId);

            // when db error..
            if($videos === false) {

                // get the failed array..
                return [
                    "status" => false,
                    "message" => "couldn't fetch the videos of playlist.."
                ];
            }

             // sanitize the ids..
            $ids = [];

            // iterate over the ids..
            foreach ($videos as $video) {

                // save each id only..
                $ids[] = $video["video_id"];
            }

            // get the ids..
            return $ids;
        }

        // 3.
        // () -> handle adding new videos to respective playlist..
        public function handleNewVideosOfPlaylist(array $videos, $playlistId = null) {

            // when no videos$videos and videoId provided..
            if(empty($videos) || !$playlistId || trim($playlistId) === "") {

                // get the failed array..
                return [
                    "status" => false,
                    "message" => "videos data or playlist data is missing"
                ];
            }

            // get all existing videos of given playlist..
            $existing_videos = $this->handleExistingVideosOfPlaylist($playlistId);

            // intial flag for update..
            $error = false;
            $assignedCount = 0;

            // iterate over each category id..
            foreach ($videos as $videoId) {

                // if category is new one..
                if(!in_array($videoId, $existing_videos)) {

                    // assign the video..
                    $isAssigned = $this->model->addVideoToPlaylist($videoId, $playlistId);

                    // if assigned..
                    if(!$isAssigned) {

                        // update state..
                        $error = true;
                        break;
                    }

                    // update state..
                    $assignedCount++;
                }
            }

            // when error..
            if($error) {

                // get the failed array..
                return [
                    "status" => false,
                    "message" => "couldn't add the video to playlist, check again"
                ];
            }

            // get the success array..
            return [
                "status" => true,
                "message" => $assignedCount > 0 ? "added $assignedCount videos" : "no new videos were assigned to playlist"
            ];
        }

        // () -> handle removal of existing videos from respective playlist..
        public function handleRemovalOfVideosInPlaylist(array $videos, $playlistId = null) {

            // when no videos and playlistid provided..
            if(empty($videos) || !$playlistId || trim($playlistId) === "") {

                // get the failed array..
                return [
                    "status" => false,
                    "message" => "videos or playlist data is missing"
                ];
            }

            // get all existing videos of given playlist..
            $existing_videos = $this->handleExistingVideosOfPlaylist($playlistId);

            // intial flag for update..
            $unassignedRows = 0;

            // iterate over each video id..
            foreach ($videos as $video_id) {

                // if category is new one..
                if(in_array($video_id, $existing_videos)) {

                    // un-assign the video..
                    $unassignedRows += $this->model->removeVideoFromPlaylist($video_id, $playlistId);
                }
            }

            // when error..
            if($unassignedRows === false) {

                // get the failed array..
                return [
                    "status" => false,
                    "message" => "oops videos didn't exist"
                ];
            }

            // get the success array..
            return [
                    "status" => true,
                    "message" => $unassignedRows > 0 ? "$unassignedRows videos removed from playlist successfully" : "None of them were removed from playlist"
            ];
        }

        // DELETE
        // () -> handle deletion of playlist..
        public function handleDeletePlaylist($playlistId) {

            // trim up the id..
            $playlistId = trim($playlistId);    

            // when data seems to be empty
            if($playlistId === "" || !ctype_digit($playlistId) || (int)($playlistId) <= 0) {

                // return the error array..
                return [
                    "message" => "missing playlist details",
                    "status" => false
                ];
            }

            // check..
            $delete = $this->model->deletePlaylist(((int)$playlistId));

            // when deleted..
            if($delete === 1) {

                // success array.
                return [
                    "message" => "playlist delete was successful",
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
                    "message" => "couldn't delete the playlist given",
                    "status" => false
                ];
            }
        }

    } 

    // TEST..
    // $controller = new VideoAndPlaylistController();

    // // first handle the thumbnail..
    // $thumbnailImageFile = $_FILES["thumbnail"];

    // // try to save to the destination..
    // $saved = $controller->saveThumbnail($thumbnailImageFile);

    // // if success
    // if($saved !== false) {

    //     // get the path..
    //     $thumbnailUrl = $saved;

    //     // ready the data..
    //     $videoData = [];
    //     $videoData["thumbnail"] = $thumbnailUrl;

    //     // rest of the data..
    // }

    // 1. add a new video with categories..
    // try to add new video with categories..
    // $add = $controller->handleAddVideoWithCategories(
    //     [
    //         "title" => "php variables and datatypes",
    //         "description" => "A detailed video on php variables",
    //         "video_url" => "https://youtu.be/przRGJtl0HY",
    //         "thumbnail" => "https://i.ytimg.com/vi/przRGJtl0HY/hq720.jpg?sqp=-oaymwFBCNAFEJQDSFryq4qpAzMIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB8AEB-AH-CYAC0AWKAgwIABABGCIgVihyMA8=&rs=AOn4CLD0wGqT4YZo_vXX43tZbGr7TFHPrw",
    //         "uploaded_by" => 1, // admin's id..
    //     ],
    //     [42, 43]
    // );

    // generate the unique name..
    // $uniqueFileName = uniqid("thumbnail_", true) . "." . "123.png";
    // echo $uniqueFileName;


    // UPDATE
    // 2. assign categories to existing video..
    // $assigned = $controller->handleNewCategoriesOfVideo(
    //     [44, 42],
    //     4
    // );

    // check log..
    // var_dump($assigned);

    // 3. un-assign the categories from the related video..
    // $unassigned = $controller->handleRemovalOfCategoriesInVideo(
    //     [42],
    //     4
    // );

    // check log..
    // var_dump($unassigned);
