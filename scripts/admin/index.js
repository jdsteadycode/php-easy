// grab the modules..
import {AuthActions} from "../auth.js";
import {initManageTopics} from "./pages/page.topics.js";
import {initManageLogout} from "./pages/page.logout.js";
import {initManageDashboard} from "./pages/page.dashboard.js";
import {Modal} from "./modals/modals.js";

// when document is loaded..
window.addEventListener("load", AuthActions.verifyOnLoad);

// when document is clicked..
document.addEventListener("click", function(event) {

    // check if topics view/update/delete modal is clicked..
    if(event.target.classList.contains("close-btn")) {

        // check log..
        // console.log("yes clicked");

        // close the current modal..
        Modal.closeModal();
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
        console.log(navOption.innerText.trim().split("\n"));

        // get the option text..
        const navOptionText = navOption.innerText.trim().split("\n")[1];

        // check log..
        // console.log(loadHTML(navOptionText));

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

        // when it is manage problem sets..
        case `Manage Problem Sets`:

            // handle the problem sets view..
            // initManageProblemSets();
            return "Coming Soon";

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


// // () -> initialize the dropdown element..
// function initDropDownEl() {

//     // get the dropdown html elements..
//     const toggleBtn = document.querySelector(".js-topic-toggle");
//     const dropdownmenu = document.querySelector(".js-topic-dropdown");

//     // topic-list html.
//     const topicsListEl = document.querySelector(".js-topic-list");

//     // when toggle button of dropdownmenu section is clicked..
//     toggleBtn.onclick = function (event) {

//         // check log..
//         // console.log(dropdownmenu);


//         // toggle the display behavior
//         if (dropdownmenu.style.display === "none") {

//             // check log..
//             console.log(topics.length);

//             // show the menu
//             dropdownmenu.style.display = "block";

//             // initial topics clutter..
//             let topicsClutter = ``;

//             // iterate over the topics list..
//             topics.forEach(function (topic, index) {

//                 // accumulate to topics clutter..
//                 topicsClutter += `
//                     <label>
//                         <input value='${index}' hidden/>
//                         <input value='${topic.id}' type='checkbox' />
//                         ${topic.name}
//                     </label>
//                 `;
//             });


//             // append to topic list html..
//             topicsListEl.innerHTML = topicsClutter;
//         }
//         else {

//             // hide the menu
//             dropdownmenu.style.display = "none";
//         }
//     }
// }



// () -> handle topic add..
function handleTopicAdd(event) {

    // stop default behavior..
    event.preventDefault();

    // check log..
    // console.log("topic adding initiated");

    // grab the topic to add..
    const topicInput = document.querySelector(".js-topic-input").value.trim();

    // when topic is empty..
    if (topicInput === "" || !topicInput) {

        // show the error toast..
        document.querySelector(".js-error-msg").style.display = "block";
        document.querySelector(".js-error-msg").innerText = "topic is to be provided";
    } else {

        // hide the error and clear the error
        document.querySelector(".js-error-msg").style.display = "none";
        document.querySelector(".js-error-msg").innerText = "";
    }

    // check log..
    console.log(topicInput);

    // add the topic
    addTopic(topicInput);

    // clear the input..
    document.querySelector(".js-topic-input").value = "";
}

// () -> to open topics view/update/delete modal






// () -> handle open add problemset modal..
function handleOpenAddProblemSetModal() {

    // open the add problem set modal..
    openModal("problemSetModal");

}

// () -> handle open/fill update topic modal
function handleOpenUpdateTopicsModal(btn) {

    // check for current task's id..
    // console.log(btn.dataset.topicId);
    const topicId = btn.dataset.topicId;

    // grab the current topic..
    const topic = topics.find(topic => topic.id == topicId);

    // get the topic currently..
    // const topic = JSON.parse(btn.dataset.topic);

    // check log..
    // console.log(topic);

    // fill the modal data..
    document.querySelector("#updateTopicId").value = topic.id;
    document.querySelector("#updateTopicName").value = topic.name;

    // then, open view topic modal..
    openModal("updateModal");
}

// () -> handle update topic modal..
function handleUpdateTopic(event) {

    // prevent reload..
    event.preventDefault();

    // get the data to update..
    const topicId = document.querySelector("#updateTopicId").value;
    const topicName = document.querySelector("#updateTopicName").value;

    // check log..
    // console.log(topicId, topicName);

    // update the topic..
    updateTopic(topicId, topicName);

    // close the modal..
    closeModal(event);
}

// () -> handle open delete topic modal
function handleOpenDeleteTopicsModal(btn) {

    // check for current task's id..
    // console.log(btn.dataset.topicId);
    const topicId = btn.dataset.topicId;

    // grab the current topic..
    const topic = topics.find(topic => topic.id == topicId);

    // get the topic currently..
    // const topic = JSON.parse(btn.dataset.topic);

    // check log..
    // console.log(topic);

    // fill the modal data..
    document.querySelector("#deleteTopicId").value = topic.id;


    // then, open view topic modal..
    openModal("deleteModal");

}

// () -> handle delete topic modal..
function handleTopicDelete(event) {
    // prevent reload..
    event.preventDefault();

    // get the data to update..
    const topicId = document.querySelector("#deleteTopicId").value;

    // check log..
    // console.log(topicId);

    // delete the topic..
    deleteTopic(topicId);

    // close the modal..
    closeModal(event);
}