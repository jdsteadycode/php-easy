// initial topics array..
let topics = [];

// when document is loaded..
window.addEventListener("load", verifyUser);

// () -> check user.
function verifyUser() {

    // make an php api call..
    fetch(
        `http://localhost:8888/php_easy/middleware/auth/verify.php`,
        {
            "method": "POST",
            "credentials": "include"
        }
    )
    // grab the response..
    .then(function(response) {

        // return response.text();
        return response.json();
    })
    // log the response..
    .then(function(data) {

        // check log..
        console.log(data);

        // if un-authenticated..
        if(data["message"] !== "authenticated" || !data["status"]) {

            // redirect the client back to login page..
            window.location.href = `${window.location.origin}/php_easy/pages/auth/login.php`;
            return;
        }
    })
    // when error..
    .catch(function(error) {

        // log the error
        console.log(error);
    });

    // after loaded and task done..
    window.removeEventListener("load", verifyUser);
}

// () -> logout the user..
function logoutUser() {

    // make an php api call..
    fetch(
        "http://localhost:8888/php_easy/apis/auth/logout.php",
        {
            "method": "POST",
            "credentials": "include"
        }
    )
    // grab the response..
    .then(function(response) {

        // return response.text();
        return response.json();
    })
    // log the json sanitized response..
    .then(function(data) {

        // check log..
        console.log(data);

        // according to the response..
        if(data.message === "logout successfull" && data.status) {

            // log the message..
            console.log(data.message + " " + data.status);

            // after 1.5 second delay..
            setTimeout(function() {

                // redirect the client to login page..
                window.location.href = `${window.location.origin}/php_easy/pages/auth/login.php`;
                return;
            }, 1500);
        }
    })
    // when error arises..
    .catch(function(error) {

        // check log..
        console.log(error);
    });
}

// () -> add a topic..
function addTopic(topicName) {

    // set the data to send..
    const data = new FormData();
    data.append("name", topicName);

    // make an php api call..
    fetch(
        "http://localhost:8888/php_easy/apis/admin/topics/add_topic.php",
        {
            "method": "POST",
            "body": data
        }
    )
    // grab the response..
    .then(function(response) {

        return response.json();
    })
    // get the parsed json data..
    .then(function(data) {

        // check log..
        console.log(data);
    })
    // re-render the topics
    .then(initManageTopics)

    // when error arises..
    .catch(function(error) {

        // check log..
        console.log(error);
    });
}

// () -> all the topics
function allTopics() {

    // make an php api call..
    return fetch(
        "http://localhost:8888/php_easy/apis/admin/topics/all_topics.php",
        {
            "method": "GET",
        }
    )
    // grab the response..
    .then(function(response) {

        return response.json();
    })
    // get the parsed json data..
    .then(function(data) {

        // check log..
        // console.log(data);

        // get the data..
        return data;
    })
    // when error arises..
    .catch(function(error) {

        // check log..
        console.log(error);
    });
}

// () -> update the topic..
function updateTopic(topicId, topicName) {

    // set the data to send..
    const data = new FormData();
    data.append("topic_name", topicName);
    data.append("__method", "PATCH");
    data.append("topic_id", topicId);

    // make an php api call..
    fetch(
        "http://localhost:8888/php_easy/apis/admin/topics/update_topic.php",
        {
            "method": "POST",
            "body": data
        }
    )
    // grab the response..
    .then(function(response) {

        return response.json();
    })
    // get the parsed json data..
    .then(function(data) {

        // check log..
        console.log(data);
    })
    // re-render the topics
    .then(initManageTopics)

    // when error arises..
    .catch(function(error) {

        // check log..
        console.log(error);
    });
}

// () -> delete the topic..
function deleteTopic(topicId) {

    // when not given valid data for deletion.. (missing topic id)
    if(!topicId) return;

    // make an php api call..
    fetch(
        "http://localhost:8888/php_easy/apis/admin/topics/delete_topic.php",
        {
            "method": "DELETE",
            "body": JSON.stringify(topicId)
        }
    )
    // grab the response..
    .then(function(response) {

        return response.json();
    })
    // get the parsed json data..
    .then(function(data) {

        // check log..
        console.log(data);
    })
    // re-render the topics
    .then(initManageTopics)

    // when error arises..
    .catch(function(error) {

        // check log..
        console.log(error);
    });
}


// grab the html elements..
let menuicn = document.querySelector(".menuicn");
let nav = document.querySelector(".navcontainer");

// add the listener to the hamburger icon
menuicn.addEventListener("click", () => {

    // add/ remove the class across the clicks..
    nav.classList.toggle("navclose");
});


// html for dashboard..
const dashboardHTML = `
    <div class="main">
            <!-- <div class="searchbar2">
                <input type="text" name="" id="" placeholder="Search" />
                <div class="searchbtn">
                    <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180758/Untitled-design-(28).png"
                        class="icn srchicn" alt="search-button" />
                </div>
            </div> -->


            <!-- top content boxes -->
            <div class="box-container">
                <div class="box box1">
                    <div class="text">
                        <h2 class="topic-heading">10</h2>
                        <h2 class="topic">Total categories</h2>
                    </div>

                    <!-- <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210184645/Untitled-design-(31).png"
                        alt="Views" /> -->

                    <span class="box-emoji">
                        👀
                    </span>
                </div>

                <div class="box box2">
                    <div class="text">
                        <h2 class="topic-heading">150</h2>
                        <h2 class="topic">Total topics</h2>
                    </div>

                    <!-- <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210185030/14.png" alt="likes" /> -->

                    <span class="box-emoji">
                        👍
                    </span>
                </div>

                <div class="box box3">
                    <div class="text">
                        <h2 class="topic-heading">320</h2>
                        <h2 class="topic">Total Submissions</h2>
                    </div>

                    <!-- <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210184645/Untitled-design-(32).png"
                        alt="comments" /> -->

                    <span class="box-emoji">
                        ✔️
                    </span>
                </div>

                <div class="box box4">
                    <div class="text">
                        <h2 class="topic-heading">70</h2>
                        <h2 class="topic">Total users</h2>
                    </div>

                    <!-- <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210185029/13.png"
                        alt="published" /> -->

                        <span class="box-emoji">
                            🔢
                        </span>
                </div>
            </div>

            <!-- main content container -->
            <div class="main-content-container">

                <!-- content-header -->
                <div class="main-content-header">
                    <h1 class="main-content-heading">Current Users</h1>
                    <button class="view">View All</button>
                </div>

                <!-- body -->
                <div class="main-content-body">
                    <div class="main-content-topic-heading">
                        <h3 class="t-op">Name</h3>
                        <h3 class="t-op">Has practiced?</h3>
                        <h3 class="t-op">Submissions</h3>
                        <h3 class="t-op">Status</h3>
                    </div>

                    <div class="items">
                        <div class="item1">
                            <h3 class="t-op-nextlvl">Jake</h3>
                            <h3 class="t-op-nextlvl">No</h3>
                            <h3 class="t-op-nextlvl">5</h3>
                            <h3 class="t-op-nextlvl label-tag">Active</h3>
                        </div>

                        <div class="item1">
                            <h3 class="t-op-nextlvl">Sam</h3>
                            <h3 class="t-op-nextlvl">Yes</h3>
                            <h3 class="t-op-nextlvl">10</h3>
                            <h3 class="t-op-nextlvl label-tag">Active</h3>
                        </div>

                        <div class="item1">
                            <h3 class="t-op-nextlvl">Palash</h3>
                            <h3 class="t-op-nextlvl">No</h3>
                            <h3 class="t-op-nextlvl">0</h3>
                            <h3 class="t-op-nextlvl label-tag in-active">In-Active</h3>
                        </div>

                       
                    </div>
                </div>
            </div>
        </div>
`;

// html for manage topics..
const manageTopicsHTML  = `
    <div class="main">
            <!-- <div class="searchbar2">
                <input type="text" name="" id="" placeholder="Search" />
                <div class="searchbtn">
                    <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180758/Untitled-design-(28).png"
                        class="icn srchicn" alt="search-button" />
                </div>
            </div> -->


            <!-- info container -->
            <div class="info-container">
                <h2 class="info-heading">Add some topics for Problems</h2>

                <form class="topic-form">
                    <input 
                        type="text" 
                        class="topic-input js-topic-input" 
                        placeholder="Enter Topic Name" 
                        
                    />

                    <button class="topic-add-btn" onclick="handleTopicAdd(event);">Add Topic</button>
                </form>

                <!-- handle error toast -->
                <p class="error-msg js-error-msg" id="errorMsg"></p>

                <!-- handle success toast -->
                <p class="success-msg js-success-msg" id="successMsg"></p>
            </div>

            <!-- main content container -->
            <div class="main-content-container">

                <!-- content-header -->
                <div class="main-content-header">
                    <h1 class="main-content-heading">Current Topics</h1>
                   <!-- <button class="view">View All</button> -->
                </div>

                <!-- body -->
                <div class="main-content-body">
                    <div class="main-content-topic-heading">
                        <h3 class="t-op">No</h3>
                        <h3 class="t-op">Name</h3>
                        <h3 class="t-op">Added at</h3>
                        <h3 class="t-op">Actions</h3>
                    </div>

                    <div class="items">
                        <div class="item1">
                            <h3 class="t-op-nextlvl">1</h3>
                            <h3 class="t-op-nextlvl">oops</h3>
                            <h3 class="t-op-nextlvl">(View 2)</h3>
                        </div>

                        <div class="item1">
                            <h3 class="t-op-nextlvl">2</h3>
                            <h3 class="t-op-nextlvl">pdo</h3>
                            <h3 class="t-op-nextlvl">(View 3)</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
`;

// html for logout..
const logoutHTML = `
    <section class="logout-modal js-logout-modal show">
        <div class="logout-modal-content">
            <h2 class="logout-title">Confirm Logout</h2>
            <p class="logout-msg">Are you sure you want to logout?</p>

            <div class="logout-actions">
                <button class="logout-cancel js-logout-cancel" onclick="handleLogoutCancel();">Cancel</button>
                <button class="logout-confirm js-logout-confirm" onclick="handleLogoutConfirm();">Logout</button>
            </div>
        </div>
    </section>
`;

// () -> load the html..
function loadHTML(navOptionText) {

    // according the nav-option clicked..
    switch(navOptionText) {

        // when it is manage topics..
        case `Manage Topics`:
            return manageTopicsHTML;

        // when it is dashboard..
        case `Dashboard`:
            return dashboardHTML;

        // when it is logout..
        case `Logout`:
            return logoutHTML;
        
        // for coming soon
        default:
            return `
                <h4>Coming Soon</h4>
            `;
    }
}

// () -> handle page specific content..
// after the html loads..
function handlePageContent(page) {

    // according to the page..
    switch(page) {

        // when it is manage topics..
        case `Manage Topics`:

            // handle topics
            initManageTopics();
            break;

        // when it is dashboard..
        case `Dashboard`:
            break;

        // when it is logout..
        case `Logout`:
            break;
        
        // for coming soon
        default:
            break;
    }
}

// () -> manage topics..
async function initManageTopics() {

    // grab the data from topics
    const response = await allTopics();

    // check log..
    console.log(response.data);

    // save topics..
    topics = response.data;

    // initial topics list clutter
    let topicsClutter = ``;

    // iterate over the data..
    response.data.forEach(function(topic, index) {

        // accumulate in the clutter..
        topicsClutter += `
            <div class="item1">
                <h3 class="t-op-nextlvl">${index + 1}</h3>
                <h3 class="t-op-nextlvl">
                    ${topic.deleted_at ? 
                        `${topic.name} <span class="deleted-text">deleted</span>`
                        : `${topic.name}`
                    }
                </h3>
                <h3 class="t-op-nextlvl">${new Date(topic.created_at).toDateString()}</h3>
                
                <div class="actions">
                    <span 
                        class="js-view-btn" 
                        data-topic-id="${topic.id}"
                        onclick="handleOpenViewTopicsModal(this)">
                        🔍
                    </span> 
                    ${topic.deleted_at 
                        ? 
                        ""
                        : 
                        `
                        <span 
                            class="js-edit-btn"
                            data-topic-id="${topic.id}"
                            onclick="handleOpenUpdateTopicsModal(this)"
                        >
                            ✏️
                        </span>
                       `
                    }
                    ${topic.deleted_at 
                        ? 
                        ""
                        : 
                        `
                        <span 
                            class="js-delete-btn"
                            data-topic-id="${topic.id}"
                            onclick="handleOpenDeleteTopicsModal(this)"
                        >
                        ❌
                        </span>
                    `
                    }
                </div>
            </div>
        `;
    });

    // update the HTML..
    document.querySelector(".items").innerHTML = topicsClutter;
}

// get the nav options..
const navoptions = document.querySelectorAll(".nav-option");

// attach the listener to the options..
// console.log(navoptions);

// iterate over the options..
navoptions.forEach(function(navOption) {

    // when a navoption is clicked..
    navOption.onclick = function(event) {

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

        // load the html..
        document.querySelector(".main").innerHTML = loadHTML(navOptionText);

        // load the page content..
        handlePageContent(navOptionText);

        // exit the function call..
        return;

        // check log..
        // console.log(navOption);
    }
});


// () -> handle logout confirma
function handleLogoutConfirm() {

    // check log..
    console.log("logout is initiated..");

    // make client logout..
    logoutUser();
}

// () -> handle logout cancellation..
function handleLogoutCancel() {

    // check log..
    console.log("would logout later", document.querySelector(".main").childNodes[1].classList);

    // hide the modal..
    document.querySelector(".main").childNodes[1].classList.remove("show");

    // de-activate any navoption..
    navoptions.forEach(opt => opt.classList.remove("nav-option-active"));

    // update with current active HTML content..
    navoptions.forEach(opt => opt.innerText.trim().split("\n") === "Dashboard" ? opt.classList.add("nav-option-active") : "");

    // update the html..
    document.querySelector(".main").innerHTML = loadHTML("Dashboard");
    
}

// () -> handle topic add..
function handleTopicAdd(event) {

    // stop default behavior..
    event.preventDefault();

    // check log..
    // console.log("topic adding initiated");

    // grab the topic to add..
    const topicInput = document.querySelector(".js-topic-input").value.trim();

    // when topic is empty..
    if(topicInput === "" || !topicInput) {

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
function openModal(id) {

    // un-hide the modal..
    document.getElementById("modalOverlay").style.display = "block";

    // of specific id delete || update || view modal..
    document.getElementById(id).style.display = "block";
}

// () -> to close topics view/update/delete modal
function closeModal(event) {

    // restrict the reload behavior
    event.preventDefault();

    // hide the modal..
    document.getElementById("modalOverlay").style.display = "none";
    document.querySelectorAll(".modal").forEach(modal => {
        modal.style.display = "none";
    });
}

// () -> handle open/fill view topic modal
function handleOpenViewTopicsModal(btn) {

    // check for current task's id..
    // console.log(btn.dataset.topicId);
    const topicId = btn.dataset.topicId;

    // grab the current topic..
    const topic = topics.find(topic => topic.id  == topicId);

    // get the topic currently..
    // const topic = JSON.parse(btn.dataset.topic);

    // check log..
    console.log(topic);

    // fill the modal data..
    document.querySelector("#viewTopicName").innerText = topic.name;
    document.querySelector("#viewAddedAt").innerText = 
    topic.created_at
     ? `${new Date(topic.created_at).toDateString()} ${new Date(topic.created_at).toLocaleTimeString()}` 
     : "-"
    document.querySelector("#viewUpdatedAt").innerText = 
    topic.updated_at
     ? `${new Date(topic.updated_at).toDateString()} ${new Date(topic.updated_at).toLocaleTimeString()}` 
     : "-";
    document.querySelector("#viewDeletedAt").innerText = 
    topic.deleted_at
     ? `${new Date(topic.deleted_at).toDateString()} ${new Date(topic.deleted_at).toLocaleTimeString()}` 
     : "-"
    document.querySelector("#viewProblemsRelated").innerText = topic.total_problems_related || "-";


    // then, open view topic modal..
    openModal("viewModal");

}

// () -> handle open/fill update topic modal
function handleOpenUpdateTopicsModal(btn) {

    // check for current task's id..
    // console.log(btn.dataset.topicId);
    const topicId = btn.dataset.topicId;

    // grab the current topic..
    const topic = topics.find(topic => topic.id  == topicId);

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
    const topic = topics.find(topic => topic.id  == topicId);

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