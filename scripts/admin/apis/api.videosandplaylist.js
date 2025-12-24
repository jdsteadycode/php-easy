// A central object to handle API..
export const VideoAndPlaylistApi = {

    // () -> add video with categories..
    addVideoWithCategories: async function(
        title, 
        description,
        videoUrl,
        thumbnailImageObj,
        categoryIds,
        uploadedBy
    ) {

        // check log..
        // console.log(
        //     title, 
        //     description,
        //     videoUrl,
        //     thumbnailImageObj,
        //     categoryIds,
        //     uploadedBy
        // );

        // return;

        // initial data to send..
        const data = new FormData();

        // set the data.. (as form data because, string + binary data i.e., image)
        data.append("title", title);
        data.append("description", description);
        data.append("videoUrl", videoUrl);
        data.append("thumbnail", thumbnailImageObj);
        data.append("categoryIds", categoryIds);
        data.append("uploadedBy", uploadedBy);

        // make an php api call..
        return fetch(
            "http://localhost:8888/php_easy/apis/admin/videoandplaylist/add.php",
            {
                "method": "POST",
                "body": data
            }
        )
        // grab the response..
        .then(function (response) {

            // when response is not successful.. 
            if(!response.ok) return {"status": false, "message": "http_error"};

            // return response.text();

            // get the response json parsed..
            return response.json();
        })
        // get the parsed json data..
        // .then(function (data) {

        //     // check log..
        //     // console.log(data);

        //     // get the data..
        //     return data;
        // })
        // when error arises..
        .catch(function (error) {

            // check log..
            console.log(error);

            // when request fails..
            return {"status": false, "message": "network_error"};
        });
    },

    // () -> to get all video(s) with categories..
    getVideos: async function() {

        // make an php api call..
        return fetch(
            "http://localhost:8888/php_easy/apis/admin/videoandplaylist/read.php",
            {
                "method": "GET",
            }
        )
        // grab the response..
        .then(function (response) {

            // when response is not successful.. 
            if(!response.ok) return {"status": false, "message": "http_error"};

            // return response.text();

            // get the response json parsed..
            return response.json();
        })
        // get the parsed json data..
        // .then(function (data) {

        //     // check log..
        //     // console.log(data);

        //     // get the data..
        //     return data;
        // })
        // when error arises..
        .catch(function (error) {

            // check log..
            console.log(error);

            // when request fails..
            return {"status": false, "message": "network_error"};
        });
    },

    // () -> update video data..
    updateVideo: async function(
        title, 
        description,
        videoUrl,
        thumbnailImageObj = null,
        videoId
    ) {

        // check log..
        // console.log(
        //     title, 
        //     description,
        //     videoUrl,
        //     thumbnailImageObj,
        //     videoId
        // );

        // return;

        // initial data to send..
        const data = new FormData();

        // set the data.. (as form data because, string + binary data i.e., image)
        data.append("title", title);
        data.append("description", description);
        data.append("videoUrl", videoUrl);
        data.append("thumbnail", thumbnailImageObj);
        data.append("videoId", videoId);

        // make an php api call..
        return fetch(
            "http://localhost:8888/php_easy/apis/admin/videoandplaylist/update/update_video.php",
            {
                "method": "POST",
                "body": data
            }
        )
        // grab the response..
        .then(function (response) {

            // when response is not successful.. 
            if(!response.ok) return {"status": false, "message": "http_error"};

            // return response.text();

            // get the response json parsed..
            return response.json();
        })
        // get the parsed json data..
        // .then(function (data) {

        //     // check log..
        //     // console.log(data);

        //     // get the data..
        //     return data;
        // })
        // when error arises..
        .catch(function (error) {

            // check log..
            console.log(error);

            // when request fails..
            return {"status": false, "message": "network_error"};
        });
    },

     // () -> assign new categories to a video..
    assignCategoriesToVideo: async function(
        categories,
        videoId
    ) {

        // wrap up the data for update..
        const data = {
            "categoryIds": categories,
            "videoId": videoId
        };

        // set the data.. (as form data because, string + binary data i.e., image)

        // make an php api call..
        return fetch(
            "http://localhost:8888/php_easy/apis/admin/videoandplaylist/update/assign_categories.php",
            {
                "method": "PATCH",
                "body": JSON.stringify(data)
            }
        )
        // grab the response..
        .then(function (response) {

            // when response is not successful.. 
            if(!response.ok) return {"status": false, "message": "http_error"};

            // return response.text();

            // get the response json parsed..
            return response.json();
        })
        // get the parsed json data..
        // .then(function (data) {

        //     // check log..
        //     // console.log(data);

        //     // get the data..
        //     return data;
        // })
        // when error arises..
        .catch(function (error) {

            // check log..
            console.log(error);

            // when request fails..
            return {"status": false, "message": "network_error"};
        });
    },

     // () -> remove/ un-assign existing categories to a video..
    unAssignCategoriesToVideo: async function(
        categories,
        videoId
    ) {

        // wrap up the data for update..
        const data = {
            "categoryIds": categories,
            "videoId": videoId
        };

        // set the data.. (as form data because, string + binary data i.e., image)

        // make an php api call..
        return fetch(
            "http://localhost:8888/php_easy/apis/admin/videoandplaylist/update/unassign_categories.php",
            {
                "method": "PATCH",
                "body": JSON.stringify(data)
            }
        )
        // grab the response..
        .then(function (response) {

            // when response is not successful.. 
            if(!response.ok) return {"status": false, "message": "http_error"};

            // return response.text();

            // get the response json parsed..
            return response.json();
        })
        // get the parsed json data..
        // .then(function (data) {

        //     // check log..
        //     // console.log(data);

        //     // get the data..
        //     return data;
        // })
        // when error arises..
        .catch(function (error) {

            // check log..
            console.log(error);

            // when request fails..
            return {"status": false, "message": "network_error"};
        });
    },
    
    // () -> delete video data..
    deleteVideo: async function(videoId) {

        // check log..
        // console.log(
        //     videoId
        // );

        // return;

        // initial data to send..
        const data = {
            "videoId": videoId,
        }

        // make an php api call..
        return fetch(
            "http://localhost:8888/php_easy/apis/admin/videoandplaylist/delete.php",
            {
                "method": "POST",
                "body": JSON.stringify(data)
            }
        )
        // grab the response..
        .then(function (response) {

            // when response is not successful.. 
            if(!response.ok) return {"status": false, "message": "http_error"};

            // return response.text();

            // get the response json parsed..
            return response.json();
        })
        // get the parsed json data..
        // .then(function (data) {

        //     // check log..
        //     // console.log(data);

        //     // get the data..
        //     return data;
        // })
        // when error arises..
        .catch(function (error) {

            // check log..
            console.log(error);

            // when request fails..
            return {"status": false, "message": "network_error"};
        });
    },

    // ***
    // for playlists-section.
    // ***
    // () -> add video with categories..
    addPlaylistWithVideos: async function(
        name, 
        description,
        createdBy,
        videoIds
    ) {

        // initial data to send..
        const data = new FormData();

        // set the data.. (as form data because, string + binary data i.e., image)
        data.append("name", name);
        data.append("description", description);
        data.append("createdBy", createdBy);
        data.append("videoIds", videoIds);

        // make an php api call..
        return fetch(
            "http://localhost:8888/php_easy/apis/admin/videoandplaylist/add_playlist.php",
            {
                "method": "POST",
                "body": data
            }
        )
        // grab the response..
        .then(function (response) {

            // when response is not successful.. 
            if(!response.ok) return {"status": false, "message": "http_error"};

            // return response.text();

            // get the response json parsed..
            return response.json();
        })
        // get the parsed json data..
        // .then(function (data) {

        //     // check log..
        //     // console.log(data);

        //     // get the data..
        //     return data;
        // })
        // when error arises..
        .catch(function (error) {

            // check log..
            console.log(error);

            // when request fails..
            return {"status": false, "message": "network_error"};
        });
    },

    // () -> get all playlists..
    getPlaylists: async function() {

        // make an php api call..
        return fetch(
            "http://localhost:8888/php_easy/apis/admin/videoandplaylist/read_playlists.php",
            {
                "method": "GET",
            }
        )
        // grab the response..
        .then(function (response) {

            // when response is not successful.. 
            if(!response.ok) return {"status": false, "message": "http_error"};

            // return response.text();

            // get the response json parsed..
            return response.json();
        })
        // get the parsed json data..
        // .then(function (data) {

        //     // check log..
        //     // console.log(data);

        //     // get the data..
        //     return data;
        // })
        // when error arises..
        .catch(function (error) {

            // check log..
            console.log(error);

            // when request fails..
            return {"status": false, "message": "network_error"};
        });
    },

    // () -> update the playlist details..
    updatePlaylist: async function(
        name, 
        description,
        playlistId
    ) {

        // initial data to send..
        const data = {
            "name": name,
            "description": description,
            "playlistId": playlistId
        }

        // make an php api call..
        return fetch(
            "http://localhost:8888/php_easy/apis/admin/videoandplaylist/update/update_playlist.php",
            {
                "method": "PATCH",
                "body": JSON.stringify(data)
            }
        )
        // grab the response..
        .then(function (response) {

            // when response is not successful.. 
            if(!response.ok) return {"status": false, "message": "http_error"};

            // return response.text();

            // get the response json parsed..
            return response.json();
        })
        // get the parsed json data..
        // .then(function (data) {

        //     // check log..
        //     // console.log(data);

        //     // get the data..
        //     return data;
        // })
        // when error arises..
        .catch(function (error) {

            // check log..
            console.log(error);

            // when request fails..
            return {"status": false, "message": "network_error"};
        });
    },

     // () -> assign the videos to playlist..
    assignVideosToPlaylist: async function(
        videoIds,
        playlistId
    ) {

        // initial data to send..
        const data = {
            "videoIds": videoIds,
            "playlistId": playlistId
        }

        // make an php api call..
        return fetch(
            "http://localhost:8888/php_easy/apis/admin/videoandplaylist/update/assign_videos.php",
            {
                "method": "PATCH",
                "body": JSON.stringify(data)
            }
        )
        // grab the response..
        .then(function (response) {

            // when response is not successful.. 
            if(!response.ok) return {"status": false, "message": "http_error"};

            // return response.text();

            // get the response json parsed..
            return response.json();
        })
        // get the parsed json data..
        // .then(function (data) {

        //     // check log..
        //     // console.log(data);

        //     // get the data..
        //     return data;
        // })
        // when error arises..
        .catch(function (error) {

            // check log..
            console.log(error);

            // when request fails..
            return {"status": false, "message": "network_error"};
        });
    },

     // () -> un-assign the videos from playlist..
    unAssignVideosToPlaylist: async function(
        videoIds,
        playlistId
    ) {

        // initial data to send..
        const data = {
            "videoIds": videoIds,
            "playlistId": playlistId
        }

        // make an php api call..
        return fetch(
            "http://localhost:8888/php_easy/apis/admin/videoandplaylist/update/unassign_videos.php",
            {
                "method": "PATCH",
                "body": JSON.stringify(data)
            }
        )
        // grab the response..
        .then(function (response) {

            // when response is not successful.. 
            if(!response.ok) return {"status": false, "message": "http_error"};

            // return response.text();

            // get the response json parsed..
            return response.json();
        })
        // get the parsed json data..
        // .then(function (data) {

        //     // check log..
        //     // console.log(data);

        //     // get the data..
        //     return data;
        // })
        // when error arises..
        .catch(function (error) {

            // check log..
            console.log(error);

            // when request fails..
            return {"status": false, "message": "network_error"};
        });
    },

     // () -> un-assign the videos from playlist..
    deletePlaylist: async function(playlistId) {

        // initial data to send..
        const data = {
            "playlistId": playlistId
        }

        // make an php api call..
        return fetch(
            "http://localhost:8888/php_easy/apis/admin/videoandplaylist/delete_playlist.php",
            {
                "method": "POST",
                "body": JSON.stringify(data)
            }
        )
        // grab the response..
        .then(function (response) {

            // when response is not successful.. 
            if(!response.ok) return {"status": false, "message": "http_error"};

            // return response.text();

            // get the response json parsed..
            return response.json();
        })
        // get the parsed json data..
        // .then(function (data) {

        //     // check log..
        //     // console.log(data);

        //     // get the data..
        //     return data;
        // })
        // when error arises..
        .catch(function (error) {

            // check log..
            console.log(error);

            // when request fails..
            return {"status": false, "message": "network_error"};
        });
    },
};
