// A central object to handle API..
export const PrepApi = {

  // () -> get all problemsets 
  getProblemSets: async function () {
    // make an php api call..
    return (
      fetch(
        `http://localhost:8888/php_easy/apis/user/problemsets/read.php`,
        {
          method: "GET"
        }
      )
        // grab the response..
        .then(function (response) {
          // when response is not successful..
          if (!response.ok) return { status: false, message: "http_error" };

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
          return { status: false, message: "network_error" };
        })
    );
  },

   // () -> get single problemset
  getProblemSet: async function (id = null) {
    // make an php api call..
    return (
      fetch(
        `http://localhost:8888/php_easy/apis/user/problemsets/read.php?p_id=${id}`,
        {
          method: "GET"
        }
      )
        // grab the response..
        .then(function (response) {
          // when response is not successful..
          if (!response.ok) return { status: false, message: "http_error" };

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
          return { status: false, message: "network_error" };
        })
    );
  },

};
