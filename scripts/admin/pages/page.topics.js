    // grab the modules..
    import {AdminStore} from "../store.js";
    import {TopicsApi} from "../apis/api.topics.js";
    import {manageTopicsHTML} from "../templates/topics.html.js";
    import {Modal} from "../modals/modals.js";

    // () -> render the topics..
    function renderTopics() {

        // get the items Element..
        const itemsContainerEl = document.querySelector(".items");
        itemsContainerEl.innerHTML = "";

        // iterate over the topics..
        AdminStore.topics.forEach(function(topic, index) {

            // accumulate each topic item to container..
            itemsContainerEl.innerHTML += `
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
                        >
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
                            >
                            ❌
                            </span>
                        `
                }
                    </div>
                </div>
            `;
        });        
    }

    // () -> attach events for topics page..
    function attachTopicEvents() {

        // for adding the topic..
        document.querySelector(".js-topic-add-btn").onclick = handleTopicAdd;

        // for topic actions..
        document.querySelector(".items").onclick = handleTopicActions;

        // for update topic form..
        document.querySelector("#updateForm").onsubmit = handleTopicUpdate;

        // for delete topic modal group..
        document.querySelector("#confirmDeleteBtn").onclick = handleTopicDelete;
    }

        // () -> handle topic add..
    async function handleTopicAdd(event) {

        // stop default behavior..
        event.preventDefault();

        // check log..
        // console.log("topic addon initiated..");
        // return;


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
        // console.log(topicInput);

        // add the topic
        await TopicsApi.addTopic(topicInput);

        // get the topics again..
        const response = await TopicsApi.getTopics();

        // update the state..
        AdminStore.topics = response.data;

        // re-render the topics..
        renderTopics();

        // clear the input..
        document.querySelector(".js-topic-input").value = "";
    }

    // () -> manage topics..
    export async function initManageTopics() {

        // check log..
        // console.log("topics page loaded..");

        // show the topics html (view)..
        document.querySelector(".main").innerHTML = manageTopicsHTML;
        // document.querySelector(".main").innerHTML = "<div>page content loaded..</div>";

        // get the topics..
        const response = await TopicsApi.getTopics();
        
        // set the topics state..
        // save the topics..
        AdminStore.topics = response.data;

        // show the topics..
        renderTopics();

        // bind the events..
        attachTopicEvents();
    }

    // () -> attach the topic actions
    function handleTopicActions(event) {

        // check log..
        // console.log('one of the actions are clicked', event.target);

        // when the view topic button is clicked..
        if(event.target.classList.contains("js-view-btn")) {

            // open the topics view modal..
            handleOpenViewTopicsModal(event.target);
            return;
        }

        // when the update topic button is clicked..
        if(event.target.classList.contains("js-edit-btn")) {

            // check log..
            // console.log("edit topics modal is to be opened");

            // open the topics edit modal..
            handleOpenUpdateTopicsModal(event.target);
            return;
        }

        // when the delete topic button is clicked..
        if(event.target.classList.contains("js-delete-btn")) {

            // open the delete topic modal..
            handleOpenDeleteTopicsModal(event.target);
            return;
        }

        // stop the further event processing..
        return;
    }

    // () -> handle open/fill view topic modal..
    function handleOpenViewTopicsModal(btn) {

        // check for current task's id..
        // console.log(btn.dataset.topicId);
        const topicId = btn.dataset.topicId;

        // grab the current topic..
        const topic = AdminStore.topics.find(topic => topic.id == topicId);

        // check log..
        // console.log(topic);

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
        Modal.openModal("viewModal");
    }

    // () -> handle open/fill update topic modal
    function handleOpenUpdateTopicsModal(btn) {

        // check for current task's id..
        // console.log(btn.dataset.topicId);
        const topicId = btn.dataset.topicId;

        // grab the current topic..
        const topic = AdminStore.topics.find(topic => topic.id == topicId);

        // get the topic currently..
        // const topic = JSON.parse(btn.dataset.topic);

        // check log..
        // console.log(topic);

        // fill the modal data..
        document.querySelector("#updateTopicId").value = topic.id;
        document.querySelector("#updateTopicName").value = topic.name;

        // then, open view topic modal..
        Modal.openModal("updateModal");
    }

    // () -> handle update topic..
    async function handleTopicUpdate(event) {

        // prevent reload..
        event.preventDefault();

        // get the data to update..
        const topicId = document.querySelector("#updateTopicId").value;
        const topicName = document.querySelector("#updateTopicName").value;

        // check log..
        // console.log(topicId, topicName);

        // update the topic..
        await TopicsApi.updateTopic(topicId, topicName);

        // get the topics again..
        const response = await TopicsApi.getTopics();
        const topics = await response.data;

        // update the state..
        AdminStore.topics = topics;

        // re-render the topics..
        renderTopics();

        // close the modal..
        Modal.closeModal(event);
    }
    
    // () -> handle open delete topic modal
    function handleOpenDeleteTopicsModal(btn) {

        // check for current task's id..
        // console.log(btn.dataset.topicId);
        const topicId = btn.dataset.topicId;

        // grab the current topic..
        const topic = AdminStore.topics.find(topic => topic.id == topicId);


        // check log..
        // console.log(topic);

        // fill the modal data..
        document.querySelector("#deleteTopicId").value = topic.id;


        // then, open view topic modal..
        Modal.openModal("deleteModal");

    }

    // () -> handle delete topic modal..
    async function handleTopicDelete(event) {

        // get the data to update..
        const topicId = document.querySelector("#deleteTopicId").value;

        // check log..
        // console.log(topicId);

        // delete the topic..
        await TopicsApi.deleteTopic(topicId);

        // get all the topics..
        const response = await TopicsApi.getTopics();
        
        // save new topics again..
        AdminStore.topics = response.data;

        // re-render the topics..
        renderTopics();

        // close the modal..
        Modal.closeModal(event);
    }