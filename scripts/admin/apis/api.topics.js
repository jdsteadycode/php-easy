// A central object to handle API..
export const TopicsApi = {

    // () -> get all the topics..
    getTopics: async function() {

        // make an php api call..
        return fetch(
            "http://localhost:8888/php_easy/apis/admin/topics/all_topics.php",
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

    // () -> add a topic..
    addTopic: async function(topicName) {
        
        // set the data to send..
        const data = new FormData();
        data.append("name", topicName);

        // make an php api call..
        return fetch(
            "http://localhost:8888/php_easy/apis/admin/topics/add_topic.php",
            {
                "method": "POST",
                "body": data
            }
        )
        // handle the response..
        .then(function (response) {

            // when response is not successful.. 
            if(!response.ok) return {"status": false, "message": "http_error"};

            // return response.text();

            // get the parsed json response..
            return response.json();
        })
        // get the parsed json data..
        // .then(function (data) {

        //     // check log..
        //     console.log(data);
        // })
        // re-render the topics
        // .then(initManageTopics)

        // when error arises..
        .catch(function (error) {

            // check log..
            console.log(error);

            // when request fails..
            return {"status": false, "message": "network_error"};
        });
    },

    // () -> update the existing topic..
    updateTopic: async function(topicId, topicName) {

            // when not given valid data for update.. (missing topic id)
            if (!topicId) return Promise.reject({"status": false, "message": "missing topic id"});

            // set the data to send..
            const data = new FormData();
            data.append("topic_name", topicName);
            data.append("__method", "PATCH");
            data.append("topic_id", topicId);

            // make an php api call..
            return fetch(
                "http://localhost:8888/php_easy/apis/admin/topics/update_topic.php",
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

                // get the parsed json response..
                return response.json();
            })
            // get the parsed json data..
            // .then(function (data) {

            //     // check log..
            //     console.log(data);
            // })
            // re-render the topics
            // .then(initManageTopics)

            // when error arises..
            .catch(function (error) {

                // check log..
                console.log(error);

                // when request fails..
                return {"status": false, "message": "network_error"};
            });
    },

    // () -> delete the existing topic..
    deleteTopic: async function(topicId) {

        // when not given valid data for deletion.. (missing topic id)
        if (!topicId) return Promise.resolve({"status": false, "message": "missing topic id"});

        // make an php api call..
        return fetch(
            "http://localhost:8888/php_easy/apis/admin/topics/delete_topic.php",
            {
                "method": "DELETE",
                "body": JSON.stringify(topicId)
            }
        )
        // grab the response..
        .then(function (response) {

            // when response is not successful.. 
            if(!response.ok) return {"status": false, "message": "http_error"};

            // return response.text();

            // return parsed json response..
            return response.json();
        })
        // get the parsed json data..
        // .then(function (data) {

        //     // check log..
        //     console.log(data);
        // })
        // re-render the topics
        // .then(initManageTopics)

        // when error arises..
        .catch(function (error) {

            // check log..
            console.log(error);

            // when request fails..
            return {"status": false, "message": "network_error"};
        });
    }   
};