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

    } 

    // TEST..
    $controller = new VideoAndPlaylistController();

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