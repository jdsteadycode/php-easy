// grab the modules..
import {AuthActions} from "/php_easy/scripts/auth.js";
import {AdminStore} from "/php_easy/scripts/admin/store.js";
import {initManageTopics} from "/php_easy/scripts/admin/pages/page.topics.js";
import {initManageProblemSets} from "/php_easy/scripts/admin/pages/page.problemSet.js";
import {initManageCategories} from "/php_easy/scripts/admin/pages/page.categories.js";
import {initManageLogout} from "/php_easy/scripts/admin/pages/page.logout.js";
import {initManageDashboard} from "/php_easy/scripts/admin/pages/page.dashboard.js";
import {initmanageVideosAndPlaylists} from "/php_easy/scripts/admin/pages/page.videosandplaylist.js";
import {Modal} from "/php_easy/scripts/admin/modals/modals.js";

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

// get the nav options..
const navoptions = document.querySelectorAll(".nav-option");

// attach the listener to the options..
// console.log(navoptions);

// iterate over the options..
navoptions.forEach(function (navOption) {

    // when a navoption is clicked..
    navOption.onclick = function (event) {

        // de-activate any navoption..
        navoptions.forEach(opt => opt.classList.remove("nav-option-active"));

        // check log..
        // console.log(navOption.innerText.trim().split("\n"));

        // get the option text..
        const navOptionText = navOption.innerText.trim().split("\n")[1].trim();

        // check log..
        // console.log(navOptionText);

        // add the class..
        // make the current nav-option active
        navOption.classList.add("nav-option-active");

        // load the page content..
        handlePageContent(navOptionText);

        // exit the function call..
        return;

        // check log..
        // console.log(navOption);
    }
});


// () -> handle page specific content..
// after the html loads..
function handlePageContent(page) {

    // according to the page..
    switch (page) {

        // when it is manage topics..
        case `Manage Topics`:

            // handle topics view..
            initManageTopics();
            break;

        // when it is dashboard..
        case `Dashboard`:

            // handle the dashboard view..
            initManageDashboard();
            break;

        // when it is categories..
        case `Manage Categories`:

            // handle the categories view..
            initManageCategories();
            break;

        // when it is manage problem sets..
        case `Manage Problem Sets`:

            // handle the problem sets view..
            initManageProblemSets();
            break;

        // when it is manage videos and playlists..
        case `Manage Videos / Playlists`:

            // handle the videos and playlists view..
            initmanageVideosAndPlaylists();
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