// A central object to handle API..
export const ProblemSetsApi = {

    // () -> get all the problemsets..
    getProblemSets: async function() {

        // make an php api call..
        return fetch(
            "http://localhost:8888/php_easy/apis/admin/problem_set/all_problem_sets.php",
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

    // () -> add the problemSet along with the topics..
    addProblemSetsAndTopics: async function(
        title, 
        description, 
        difficulty, 
        topicIds = [], 
        sampleInput, 
        sampleOutput, 
        hintsText, 
        createdBy) {
        
        // set the data to send..
        const data = new FormData();
        data.append("title", title);
        data.append("description", description);
        data.append("difficulty", difficulty);
        data.append("topicIds", JSON.stringify(topicIds));
        data.append("sampleInput", sampleInput);
        data.append("sampleOutput", sampleOutput);
        data.append("hintsText", hintsText);
        data.append("created_by", createdBy);

        // make an php api call..
        return fetch(
            "http://localhost:8888/php_easy/apis/admin/problem_set/add_problem_set.php",
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

    // () -> update the problemSet only..
    updateProblemSet: async function(
        title, 
        description, 
        difficulty, 
        sampleInput, 
        sampleOutput, 
        hintsText, 
        problemId) {
        
        // set the data to send..
        const data = new FormData();
        data.append("__method", "PATCH"); 
        data.append("title", title);
        data.append("description", description);
        data.append("difficulty", difficulty);
        data.append("sampleInput", sampleInput);
        data.append("sampleOutput", sampleOutput);
        data.append("hintstext", hintsText);
        data.append("problemSetId", problemId);

        // make an php api call..
        return fetch(
            "http://localhost:8888/php_easy/apis/admin/problem_set/update/update_problem_set.php",
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

    // () -> new topics to problem..
    assignNewTopicsToProblemSet: async function(problemSetId, topic_ids) {

        // set the data to send..
        const data = {
            "problemSetId": problemSetId,
            "topicIds": topic_ids
        }

        // make an php api call..
        return fetch(
            "http://localhost:8888/php_easy/apis/admin/problem_set/update/assign_topics.php",
            {
                "method": "POST",
                "body": JSON.stringify(data)
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

    // () -> remove the assigned topics from problem..
    removeAssignedTopicsFromProblemSet: async function(problemSetId, topic_ids) {

        // set the data to send..
        const data = {
            "problemSetId": problemSetId,
            "topicIds": topic_ids
        }

        // make an php api call..
        return fetch(
            "http://localhost:8888/php_easy/apis/admin/problem_set/update/unassign_topics.php",
            {
                "method": "POST",
                "body": JSON.stringify(data)
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

    // () -> delete the existing problem set.
    deleteProblemSet: async function(problemSetId = "") {

        // set the data to send..
        const data = {
            "problemSetId": problemSetId,
            "__method": "DELETE"
        }

        // make an php api call..
        return fetch(
            "http://localhost:8888/php_easy/apis/admin/problem_set/delete_problem_set.php",
            {
                "method": "POST",
                "body": JSON.stringify(data)
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
    }
};