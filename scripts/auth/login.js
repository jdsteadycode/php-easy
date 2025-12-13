// grab the html elements..
const loginBtn = document.querySelector(".js-login-btn");

// () -> handle the login..
function login(email, password) {

    // wrap up the email and password in formData Obj..
    const data = new FormData();
    data.append("email", email);
    data.append("password", password);

    // make an php api call..
    fetch(
        `http://localhost:8888/php_easy/apis/auth/login.php`,
        {
            "method": "POST",
            "body": data,
            "credentials": "include"    // send the cookie with each request..
        }
    )
    // grab the response..
    .then(function(response) {

        // return response.text();
        return response.json();
    })
    // sanitize the json response -> javascript native code..
    .then(function(data) {

        // check log..
        console.log(data);

        // when invalid credentials..
        if(data.message === "invalid credentials") {

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
        if(data.message === "successful login" && data.status === true) {

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
                if(data.user_role === "admin") {

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


    })
    // handle error
    .catch(function(error) {

        // check log..
        console.log(error);
    });
}

// when login btn is clickd..
loginBtn.onclick = function(event) {

    // grab the inputs..
    const email = document.querySelector(".js-email").value.trim();
    const password = document.querySelector(".js-password").value.trim();

    // stop the reload behavior..
    event.preventDefault();

    // check log..
    console.log("login is initiated", email, password);

    // make the user login..
    login(email, password);
}
