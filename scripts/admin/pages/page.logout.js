// grab the modules..
import {logoutHTML} from "../templates/logout.html.js";
import {AuthActions} from "../../auth.js";

// () -> handles the Logout Page..
export function initManageLogout() {

    // load the logout Modal html..
    document.querySelector(".main").innerHTML = logoutHTML;

    // bind the events..
    attachLogoutEvents();
}

// () -> attach events..
function attachLogoutEvents() {

    // handle the clicks..
    document.querySelector(".logout-actions")
    .onclick = function(event) {

        // listen for logout-cancel button click..
        if(event.target.classList.contains("js-logout-cancel")) {

            // check log..
            // console.log("logout cancel initiated");

            // cancel the logout..
            AuthActions.logoutTheUserCancel();
            return;
        }

        // listen for logout confrim button click..
        if(event.target.classList.contains("js-logout-confirm")) {

            // check log..
            console.log("logout confirm initiated");

            // make the user logout..
            AuthActions.logoutTheUser();
            return;
        }

        // exit the further event flow..
        return;
    }
}

// () 