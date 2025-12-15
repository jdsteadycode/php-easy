// grab the modules..
import {AuthActions} from "../auth.js";

// grab the html elements..
const loginBtn = document.querySelector(".js-login-btn");

// () -> handle the login..
function login(email, password) {

    // wrap up the email and password in formData Obj..
    const data = new FormData();
    data.append("email", email);
    data.append("password", password);

    // make the user login..
    AuthActions.loginTheUser(data);
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
