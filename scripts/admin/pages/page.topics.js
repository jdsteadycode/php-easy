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
}

// () -> handle topics addon
function handleTopicAdd(event) {

    // restrict the reload behavior
    event.preventDefault();
}

// () -> manage topics..
export async function initManageTopics() {

    // show the topics html (view)..
    document.querySelector(".main").innerHTML = manageTopicsHTML;

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
    // console.log('one of the actions are clicked');

    // when the view topic button is clicked..
    if(event.target.classList.contains("js-view-btn")) {

        // open the topics view modal..
        handleOpenViewTopicsModal(event.target);
    }

    // when the update topic button is clicked..
    if(event.target.classList.contains("")) {}

    // when the delete topic button is clicked..
    if(event.target.classList.contains("")) {}

    // stop the further event processing..
    return;
}

// () -> handle open/fill view topic modal
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