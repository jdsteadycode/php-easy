// A central object to handle API..
export const SettingsApi = {
  // () -> get all the topics..
  getUser: async function (id) {
    // make an php api call..
    return (
      fetch(
        `http://localhost:8888/php_easy/apis/admin/settings/read.php/${id}/`,
        {
          method: "GET",
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

  // () -> update the topics..
  updateProfile: async function (data = {}) {
    // make an php api call..
    return (
      fetch(
        `http://localhost:8888/php_easy/apis/admin/settings/update/update_profile.php`,
        {
          method: "PATCH",
          body: JSON.stringify(data),
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

  // () -> update the profile image of user..
  updateProfileImage: async function (image, id) {
    // for handling binaray data..
    const data = new FormData();
    data.append("profile_image", image);
    data.append("id", id);

    // make an php api call..
    return (
      fetch(
        `http://localhost:8888/php_easy/apis/admin/settings/update/update_profile_image.php`,
        {
          method: "POST",
          body: data,
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

  // () -> update the password..
  updatePassword: async function (oldPassword, newPassword, confirmPassword, id) {
    
    // set the data..
    const data = {
      "oldPassword": oldPassword,
      "newPassword": newPassword,
      "confirmPassword": confirmPassword,
      "id": id,
    };

    // make an php api call..
    return (
      fetch(
        `http://localhost:8888/php_easy/apis/admin/settings/update/update_password.php`,
        {
          method: "PATCH",
          body: JSON.stringify(data),
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

  // () -> delete the account..
  deleteAccount: async function (id) {

    // make an php api call..
    return (
      fetch(
        `http://localhost:8888/php_easy/apis/admin/settings/delete_account.php`,
        {
          method: "POST",
          body: JSON.stringify(id),
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
