// grab the modules..
import {initManageDashboard} from "/php_easy/scripts/admin/pages/page.dashboard.js";
import {Modal} from "/php_easy/scripts/admin/modals/modals.js";
import {AdminStore} from "/php_easy/scripts/admin/store.js";

// A central Auth level Apis..
export const AuthApi = {

    // () -> user is user? 
    // handle the verification stuff..
    verifyUser: async function() {

        // make an php api call..
        return fetch(
                `http://localhost:8888/php_easy/middleware/auth/verify.php`,
                {
                    "method": "POST",
                    "credentials": "include"
                }
            )
            // grab the response..
            .then(function (response) {

                // when response is not successful..
                if(!response.ok) return  {"status": false, "message": "http_error"};

                // for debugging php based api problems..
                // return response.text();

                // otherwise, receive the json response parsed data..
                return response.json();
            })
            // log the response..
            // .then(function (data) {

            //     // check log..
            //     console.log(data);

            //     // if un-authenticated..
            //     if (data["message"] !== "authenticated" || !data["status"]) {

            //         // redirect the client back to login page..
            //         window.location.href = `${window.location.origin}/php_easy/pages/auth/login.php`;
            //         return;
            //     }
            // })
            // when error..
            .catch(function (error) {

                // log the error
                console.log(error);

                // when the verification api call fails..
                return {"status": false, "message": "network_error"};
            });
    },

    // () -> handle the login of a user
    login: async function(data) {

        // make an php api call..
        return fetch(
            `http://localhost:8888/php_easy/apis/auth/login.php`,
            {
                "method": "POST",
                "body": data,
                "credentials": "include"    // send the cookie with each request..
            }
        )
        // grab the response..
        .then(function(response) {

            // when response is not successful..
            if(!response.ok) return  {"status": false, "message": "http_error"};

            // return response.text();
            return response.json();
        })
        // when error..
        .catch(function(error) {

            // check log..
            console.log(error);

            // when the verification api call fails..
            return {"status": false, "message": "network_error"};
        });
    },

    // () -> handle the logout of a user..
    logout: async function() {

        // make an php api call..
        return fetch(
                "http://localhost:8888/php_easy/apis/auth/logout.php",
                {
                    "method": "POST",
                    "credentials": "include"
                }
            )
            // grab the response..
            .then(function (response) {

                // when response is not successful..
                if(!response.ok) return  {"status": false, "message": "http_error"};

                // return response.text();
                return response.json();
            })
            // log the json sanitized response..
            // .then(function (data) {

            //     // check log..
            //     console.log(data);

            //     // according to the response..
            //     if (data.message === "logout successfull" && data.status) {

            //         // log the message..
            //         console.log(data.message + " " + data.status);

            //         // after 1.5 second delay..
            //         setTimeout(function () {

            //             // redirect the client to login page..
            //             window.location.href = `${window.location.origin}/php_easy/pages/auth/login.php`;
            //             return;
            //         }, 1500);
            //     }
            // })
            // when error arises..
            .catch(function (error) {

                // check log..
                console.log(error);

                // when the verification api call fails..
                return {"status": false, "message": "network_error"};
            });
    }
}

// A central Auth Actions (UI based actions)
export const AuthActions = {

    // () -> verify the user on load..
    verifyOnLoad: async function() {

        // try..
        try{

            // grab the data from api..
            const data = await AuthApi.verifyUser();

            // check log..
            // console.log(data);

            // else, get the verified
            return data;
        }

        // handle the errors..
        catch(error) {

            // log the error..
            console.log("Auth Verification Failed", error);
        }
    },

    // () -> login the user..
    loginTheUser: async function(userData) {
        
        // try..
        try{

            // grab the data from api..
            const data = await AuthApi.login(userData);

            // when invalid credentials..
            if(data["message"] === "invalid credentials") {

                // show the toast..
                document.querySelector(".js-error-msg").style.display = "block";
                document.querySelector(".js-error-msg").innerText = data.message;

                // just after 1.5 seconds..
                setTimeout(function() {

                    // show the toast..
                    document.querySelector(".js-error-msg").innerText = "";
                    document.querySelector(".js-error-msg").style.display = "none";

                }, 1500);
                return;
            }

            // handle the redirection..
            // according to the role..
            if(data["message"] === "successful login" && data["status"]) {

                // show the toast..
                document.querySelector(".js-success-msg").innerText = ``;
                document.querySelector(".js-success-msg").style.display = "block";
                document.querySelector(".js-success-msg").innerText = data.message;


                // after 1.5 seconds..
                setTimeout(function() {

                    // clear the toast..
                    document.querySelector(".js-success-msg").innerText = ``;
                    document.querySelector(".js-success-msg").style.display = "none";


                    // handle the based on the role..
                    if(data["user_role"] === "admin") {

                        // check for path..
                        // console.log(window.location.origin);

                        // redirect the admin..
                        window.location.href = window.location.origin + `/php_easy/pages/admin/index.php`;
                        return;
                    }

                    // coming soon for user..
                    document.querySelector(".js-success-msg").innerText = "coming soon for users.."
                    document.querySelector(".js-success-msg").style.display = "block";

                }, 1500);

            }
            
        }

        // handle the errors..
        catch(error) {

            // log the error..
            console.log("Login Failed", error);
        }
    },

    // () -> logout the user..
    logoutTheUser: async function() {

        // try..
        try{

            // grab the response from api..
            const data = await AuthApi.logout();

            // according to the response..
            if (data["message"] === "logout successfull" && data["status"]) {

                // log the message..
                console.log(data.message + " " + data.status);

                // after 1.5 second delay..
                setTimeout(function () {

                    // redirect the client to login page..
                    window.location.href = `${window.location.origin}/php_easy/pages/auth/login.php`;
                }, 1500);
            }
        }

        // handle the errors..
        catch(error) {

            // log the error..
            console.log("Auth Verification Failed", error);
        }
    },

    // () -> logout cancel..
    logoutTheUserCancel: function(event) {

        // close the modal..
        Modal.closeModal();

        // redirect the dashboard view..
        initManageDashboard();
    },
}