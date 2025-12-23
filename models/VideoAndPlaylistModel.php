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
    class VideoAndPlaylistModel {

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

        // () -> handle add up of a new video..
        public function addVideo(
            $title,
            $description,
            $video_url,
            $thumbnail,
            $uploaded_by
        ) {

            // intial statement and parameters..
            $statement = null;
            $parameters = [];

            // prepare the statement..
            $statement = "
                INSERT INTO videos
                (title, description, video_url, thumbnail, uploaded_by, created_at)
                VALUES
                (:title, :description, :video_url, :thumbnail, :uploaded_by, :created_at)
            ";

            // attach parameters..
            $parameters = [
                "title" => $title,
                "description" => $description,
                "video_url" => $video_url,
                "thumbnail" => $thumbnail,
                "uploaded_by" => $uploaded_by,
                "created_at" => date("Y-m-d H:i:s")
            ];

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // get id of video last added or false (if ain't added)
            return $stmt ? $this->pdo->lastInsertId() : false;
        }

        // () -> handle adding and setting up the categories for (above video addon)
        public function addVideoCategory($videoId, $categoryId) {

            // intial statement and parameters..
            $statement = null;
            $parameters = [];

            // prepare the statement..
            $statement = "
                INSERT INTO video_category_jn
                (video_id, category_id)
                VALUES
                (:video_id, :category_id)
            ";

            // attach parameters..
            $parameters = [
                "video_id" => $videoId,
                "category_id" => $categoryId
            ];

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // true when topic was successfully assigned to the respective video..
            return $stmt ? true : false;
        }

        // () -> handle video creation with the categories..
        public function addVideoWithCategories(array $videoDetails, array $categories) {

            // try safelly..
            try {

                // begin a new transaction.
                $this->pdo->beginTransaction();

                // 1. add a new video
                // first a new video..
                $addedVideoId = $this->addVideo(
                    $videoDetails["title"],
                    $videoDetails["description"],
                    $videoDetails["video_url"],
                    $videoDetails["thumbnail"],
                    $videoDetails["uploaded_by"]
                );


                // check if video not added..
                if(!$addedVideoId) {
                    throw new Exception("video couldn't be added!");
                }


                // 2.
                // now,
                // for each of the category..
                foreach ($categories as $category) {

                    // assign the category to the respective video..
                    $assignCategory = $this->addVideoCategory($addedVideoId, $category);

                    // when topic couldn't be assigned..
                    if(!$assignCategory) {
                        throw new Exception("Category couldn't be assigned to current video");
                    }
                }


                // save the changes..
                $this->pdo->commit();

                // at last get the id of video when anything goes right..
                return $addedVideoId;  
 
            }

            // handle the run-time errors..
            catch(Exception $exception) {

                // when any problem!
                // go previous check point..
                $this->pdo->rollBack();

                // false for problem..
                return false;
            }
        }

        // () -> handle all videos fetch/ get..
        public function getVideos() {

            // intial statement and parameters..
            $statement = null;
            $parameters = [];

            // prepare the statement..
            $statement = "
                SELECT 
                    videos.id AS video_id,
                    videos.title,
                    videos.description,
                    videos.video_url,
                    videos.thumbnail,
                    videos.uploaded_by,
                    videos.created_at,
                    videos.updated_at,
                    videos.deleted_at,
                    GROUP_CONCAT(categories.`name` ORDER BY categories.id SEPARATOR ', ') AS video_category_names,
                    GROUP_CONCAT(categories.`id` ORDER BY categories.id SEPARATOR ', ') AS video_category_ids
                FROM videos
                LEFT JOIN video_category_jn ON (videos.id = video_category_jn.video_id)
                LEFT JOIN categories ON (categories.id = video_category_jn.category_id AND categories.deleted_at IS NULL)
                WHERE videos.deleted_at IS NULL
                GROUP BY videos.id;
            ";

            // attach parameters..
            $parameters = [];

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // get all videos or false (if any db fetch problem)..
            return $stmt ? $stmt->fetchAll() : false;
        }
    }