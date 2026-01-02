// A central object to handle API..
export const LearnApi = {
  // () -> get all categories (parent categories)
  getAllCategories: async function () {
    // make an php api call..
    return (
      fetch(
        `http://localhost:8888/php_easy/apis/user/learn/get_categories.php`,
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

  // () -> get all sub categories (from parent category)
  getAllSubCategories: async function (categoryId) {
    // make an php api call..
    return (
      fetch(
        `http://localhost:8888/php_easy/apis/user/learn/get_childcategories.php?category_id=${categoryId}`,
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

  // () -> get the contents for sub category (child category/ sub category)
  getSubCategoryContent: async function (categoryId) {
    // make an php api call..
    return (
      fetch(
        `http://localhost:8888/php_easy/apis/user/learn/get_category_content.php?category_id=${categoryId}`,
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

  // () -> get the video links (references for child category)
  getSubCategoryReferences: async function (categoryId) {
    // make an php api call..
    return (
      fetch(
        `http://localhost:8888/php_easy/apis/user/learn/get_category_videos.php?category_id=${categoryId}`,
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
