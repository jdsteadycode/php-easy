// grab the modules..
import {AuthActions} from "/php_easy/scripts/auth.js";
import {AdminStore} from "/php_easy/scripts/admin/store.js";
import {initManageLogout} from "/php_easy/scripts/admin/pages/page.logout.js";
import {initHome} from "/php_easy/scripts/user/pages/page.home.js";
import {initPrep} from "/php_easy/scripts/user/pages/page.prep.js";
import {initPlayground} from "/php_easy/scripts/user/pages/page.playground.js";
import {initLearn} from "/php_easy/scripts/user/pages/page.learn.js";
import {Modal} from "/php_easy/scripts/admin/modals/modals.js";

// get the nav options..
const navoptions = document.querySelectorAll(".nav-option");

// when document is loaded..
window.addEventListener("load", async function(event) {

    // get the verification status..
    const verificationStatus = await AuthActions.verifyOnLoad();

    // if un-authenticated..
    if (verificationStatus["message"] !== "authorized" || verificationStatus["status"] === false) {

        // redirect the client back to login page..
        window.location.href = `${window.location.origin}/php_easy/pages/auth/login.php`;
        return;
    }

    // set the admin state..
    AdminStore.setCurrentUserId(verificationStatus["user_id"]);

    // check last seen page..
    const lastViewPage = sessionStorage.getItem("last_view");

    // check log..
    // console.log(lastViewPage);

    // when the last view page..
    if(lastViewPage) {
        // load the learn page..
        handlePageContent(lastViewPage);
        sessionStorage.removeItem("last_view");
    }
    else {
        // show the home page..
        handlePageContent("Home");
    }
});

// when document is clicked..
document.addEventListener("click", function(event) {

    // check if topics view/update/delete modal is clicked..
    if(event.target.classList.contains("close-btn") || event.target.classList.contains("modal-close")) {

        // check log..
        // console.log("yes clicked");

        // close the current modal..
        Modal.closeModal(event);
        return;
    }

    // stop further event process..
    return;
})

// grab the html elements..
let menuicn = document.querySelector(".menuicn");
let nav = document.querySelector(".navcontainer");

// add the listener to the hamburger icon
menuicn.addEventListener("click", () => {

    // add/ remove the class across the clicks..
    nav.classList.toggle("navclose");
});


// attach the listener to the options..
// console.log(navoptions);

// iterate over the options..
navoptions.forEach(function (navOption) {

    // when a navoption is clicked..
    navOption.onclick = function () {
        // get nav text..
        const navOptionText = navOption.innerText.trim().split("\n")[1].trim();

        // show the page content..
        handlePageContent(navOptionText);
    };
});


// () -> handle active state of nav options..
function setActiveNav(page) {
    navoptions.forEach(opt => opt.classList.remove("nav-option-active"));

    navoptions.forEach(opt => {
        const text = opt.innerText.trim().split("\n")[1]?.trim();
        if (text === page) {
            opt.classList.add("nav-option-active");
        }
    });
}



// () -> handle page specific content..
// after the html loads..
function handlePageContent(page) {

    // update the nav option state 
    setActiveNav(page);

    // according to the page..
    switch (page) {

        // when it is home..
        case `Home`:
            initHome();
            break;

        // when it is learn..
        case `Learn`:
            initLearn();
            break;

        // when it is practice (prep view)..
        case `Practice`:

            // handle the practice (prep view)..
            initPrep();
            break;

        // when it is playground (free practice view)..
        case `Playground`:

            // handle the playground (free practice view)..
            initPlayground();
            break;
        
        // when it is logout..
        case `Logout`:

            // handle the logout view..
            initManageLogout();
            break;

        // for coming soon
        default:
            break;
    }
}