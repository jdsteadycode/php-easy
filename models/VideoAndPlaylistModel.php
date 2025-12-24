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

         // () -> handle removal of existing categories from video
        public function removeVideoCategory($videoId, $categoryId) {

            // intial statement and parameters..
            $statement = null;
            $parameters = [];

            // prepare the statement..
            $statement = "
                DELETE FROM
                video_category_jn
                WHERE category_id = :category_id 
                AND video_id = :video_id
            ";

            // attach parameters..
            $parameters = [
                "category_id" => $categoryId,
                "video_id" => $videoId
            ];

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // when success
            if($stmt) {

                // get rows deleted..
                return $stmt->rowCount();
            }

            // when nothing deleted..
            return false;
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

        // () -> handle updation of video details..
        public function updateVideo(
            $title,
            $description,
            $video_url,
            $thumbnail,
            $videoId
        ) {

            // intial statement and parameters..
            $statement = null;
            $parameters = [];

            
            // when thumbnail image for updation is given..
            if($thumbnail) {

                // prepare the statement..
                $statement = "
                    UPDATE videos
                        SET 
                            title = :title, 
                            description = :description, 
                            video_url = :video_url, 
                            thumbnail = :thumbnail, 
                            updated_at = :updated_at
                    WHERE id = :video_id
                ";

                // attach parameters..
                $parameters = [
                    "title" => $title,
                    "description" => $description,
                    "video_url" => $video_url,
                    "thumbnail" => $thumbnail,
                    "updated_at" => date("Y-m-d H:i:s"),
                    "video_id" => $videoId
                ];
            }

            // without thumbnail
            else {

                // prepare the statement..
                $statement = "
                    UPDATE videos
                        SET 
                            title = :title, 
                            description = :description, 
                            video_url = :video_url, 
                            updated_at = :updated_at
                    WHERE id = :video_id
                ";

                // attach parameters..
                $parameters = [
                    "title" => $title,
                    "description" => $description,
                    "video_url" => $video_url,
                    "updated_at" => date("Y-m-d H:i:s"),
                    "video_id" => $videoId
                ];
            }
            

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // when db/ command problem
            if(!$stmt) {
                return false;
            }

            // get rows affected, on success..
            return $stmt->rowCount();
        }

        // () -> handle deletion of video details..
        public function deleteVideo($videoId) {

            // intial statement and parameters..
            $statement = NULL;
            $parameters = [];

            // prepare the statement..
            $statement = "
                UPDATE videos
                SET 
                    deleted_at = :deleted_at
                WHERE id = :id AND deleted_at IS NULL
            ";

            // attach parameters..
            $parameters = [
                "deleted_at" => date("Y-m-d H:i:s"),
                "id" => $videoId
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

        // () -> handle all categories ids related to video..
        public function getCategoriesOfVideo($videoId) {

            // intial statement and parameters..
            $statement = null;
            $parameters = [];

            // prepare the statement..
            $statement = "
                SELECT category_id
                FROM video_category_jn
                WHERE video_id = :video_id
            ";

            // attach parameters..
            $parameters = [
                "video_id" => $videoId
            ];

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // when topicids exist get'em else false..
            if($stmt) {
                // get each as assoc array..
                return $stmt->fetchAll();
            }
            else {
                // false when, no error..
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

        // for playlists..
        // () -> make a new playlist..
        public function addPlaylist(
            $name,
            $description,
            $created_by,
        ) {

            // intial statement and parameters..
            $statement = null;
            $parameters = [];

            // prepare the statement..
            $statement = "
                INSERT INTO playlists
                (name, description, created_by, created_at)
                VALUES
                (:name, :description, :created_by, :created_at)
            ";

            // attach parameters..
            $parameters = [
                "name" => $name,
                "description" => $description,
                "created_by" => $created_by,
                "created_at" => date("Y-m-d H:i:s")
            ];

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // get id of playlist last added or false (if ain't added)
            return $stmt ? $this->pdo->lastInsertId() : false;
        }

        // () -> add video to playlist..
        public function addVideoToPlaylist($videoId, $playlistId) {

            // intial statement and parameters..
            $statement = null;
            $parameters = [];

            // prepare the statement..
            $statement = "
                INSERT INTO video_playlist_jn
                (playlist_id, video_id)
                VALUES
                (:playlist_id, :video_id)
            ";

            // attach parameters..
            $parameters = [
                "playlist_id" => $playlistId,
                "video_id" => $videoId
            ];

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // true when video was successfully assigned to the respective playlist..
            return $stmt ? true : false;
        }

        // () -> handle removal of existing videos from playlist
        public function removeVideoFromPlaylist($videoId, $playlistId) {

            // intial statement and parameters..
            $statement = null;
            $parameters = [];

            // prepare the statement..
            $statement = "
                DELETE FROM
                video_playlist_jn
                WHERE video_id = :video_id 
                AND playlist_id = :playlist_id
            ";

            // attach parameters..
            $parameters = [
                "playlist_id" => $playlistId,
                "video_id" => $videoId
            ];

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // when success
            if($stmt) {

                // get rows deleted..
                return $stmt->rowCount();
            }

            // when nothing deleted..
            return false;
        }

        // handle playlist creation with adding up of videos to it..
        public function addPlaylistWithVideos(array $playlistData, array $videos) {

            // try safelly..
            try {

                // begin a new transaction.
                $this->pdo->beginTransaction();

                // 1. add a new video
                // first a new video..
                $createdPlaylistId = $this->addPlaylist(
                    $playlistData["name"],
                    $playlistData["description"],
                    $playlistData["created_by"]
                );


                // check if playlist not added / created..
                if(!$createdPlaylistId) {
                    throw new Exception("playlist couldn't be added!");
                }


                // 2.
                // now,
                // for each of the video data..
                foreach ($videos as $video) {

                    // assign the video to the respective playlist..
                    $assignVideo = $this->addVideoToPlaylist($video, $createdPlaylistId);

                    // when video couldn't be assigned..
                    if(!$assignVideo) {
                        throw new Exception("Video couldn't be assigned to current playlist");
                    }
                }


                // save the changes..
                $this->pdo->commit();

                // at last get the id of playlist when everything goes right..
                return $createdPlaylistId;  
 
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

        // () -> handle all videos ids related to playlist..
        public function getVideosOfPlaylist($playlistId) {

            // intial statement and parameters..
            $statement = null;
            $parameters = [];

            // prepare the statement..
            $statement = "
                SELECT video_id
                FROM video_playlist_jn
                WHERE playlist_id = :playlist_id
            ";

            // attach parameters..
            $parameters = [
                "playlist_id" => $playlistId
            ];

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // when topicids exist get'em else false..
            if($stmt) {
                // get each as assoc array..
                return $stmt->fetchAll();
            }
            else {
                // false when, no error..
                return false;
            }
        }

        // () -> handle all videos fetch/ get..
        public function getPlaylists() {

            // intial statement and parameters..
            $statement = null;
            $parameters = [];

            // prepare the statement..
            $statement = "
                SELECT 
                    playlists.id AS playlist_id,
                    playlists.name,
                    playlists.description,
                    playlists.created_by,
                    playlists.created_at,
                    playlists.updated_at,
                    playlists.deleted_at,
                    COUNT(DISTINCT videos.id) AS no_of_videos,
                    GROUP_CONCAT(videos.title ORDER BY videos.id SEPARATOR ', ') AS video_titles,
                    GROUP_CONCAT(videos.id ORDER BY videos.id SEPARATOR ', ') AS video_ids
                FROM playlists
                LEFT JOIN video_playlist_jn 
                    ON playlists.id = video_playlist_jn.playlist_id
                LEFT JOIN videos 
                    ON videos.id = video_playlist_jn.video_id 
                    AND videos.deleted_at IS NULL
                WHERE playlists.deleted_at IS NULL
                GROUP BY playlists.id;
            ";

            // attach parameters..
            $parameters = [];

            // execute the command..
            $stmt = $this->db->executeCommandOrQuery($statement, $parameters);

            // get all videos or false (if any db fetch problem)..
            return $stmt ? $stmt->fetchAll() : false;
        }

        // () -> handle updation of playlist details..
        public function updatePlaylist(
            $name,
            $description,
            $playlist_id
        ) {

            // intial statement and parameters..
            $statement = null;
            $parameters = [];

            // prepare the statement..
            $statement = "
                UPDATE playlists
                SET 
                    name = :name, 
                    description = :description, 
                    updated_at = :updated_at
                WHERE id = :playlist_id
            ";

            // attach parameters..
            $parameters = [
                "name" => $name,
                "description" => $description,
                "updated_at" => date("Y-m-d H:i:s"),
                "playlist_id" => $playlist_id
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

        // () -> handle deletion of playlist details..
        public function deletePlaylist($playlistId) {

            // intial statement and parameters..
            $statement = NULL;
            $parameters = [];

            // prepare the statement..
            $statement = "
                UPDATE playlists
                SET 
                    deleted_at = :deleted_at
                WHERE id = :id AND deleted_at IS NULL
            ";

            // attach parameters..
            $parameters = [
                "deleted_at" => date("Y-m-d H:i:s"),
                "id" => $playlistId
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
    }