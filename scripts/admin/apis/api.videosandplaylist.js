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
    }
    
};
