// grab the modules..
import {AdminStore} from "/php_easy/scripts/admin/store.js";
import {manageProblemSetsHTML} from "/php_easy/scripts/admin/templates/problemSets.html.js";
import {ProblemSetsApi} from "/php_easy/scripts/admin/apis/api.problemSets.js";
import {TopicsApi} from "/php_easy/scripts/admin/apis/api.topics.js";
import {Modal} from "/php_easy/scripts/admin/modals/modals.js";

// initial state for handling selecting/ de-selecting topics in dropdown..
const selectedTopics = new Set();

// initial state for handling un-assignment of topics..
const unAssignedTopics = new Set();

// () -> render the problem-sets..
function renderProblemSets() {
    
    // initially empty up the problemsets's element's HTML..
    document.querySelector(".js-problemset-items").innerHTML = "";

    // iterate over the problem sets..
    AdminStore.problemSets.forEach(function(problemSet, index) {

        // accumulate each problem..
        document.querySelector(".js-problemset-items").innerHTML += `
            <div class="item1" key="${index + 1}">
                <h3 class="t-op-nextlvl">1</h3>
                <h3 class="t-op-nextlvl">${problemSet.title}</h3>

                <h3 class="t-op-nextlvl problem-set-topics">
                    ${problemSet?.topics.map(function(topic, index) {
                        return `<span key='${index + 1}' 
                                      class='label-tag' 
                                      data-topicId='${problemSet?.topic_ids[index]}'
                                >📌 ${topic}
                                </span>`
                    }).join("")} 
                </h3>

                <h3 class="t-op-nextlvl">
                    <span 
                        class="label-tag 
                        ${problemSet.difficulty === 'easy' ? 'easy'
                             : problemSet.difficulty === "medium" ? 'medium' 
                             : 'hard'}"
                    >
                        ${problemSet.difficulty}
                    </span>
                </h3>

                <h3 class="t-op-nextlvl">${problemSet.username}</h3>
                <h3 class="t-op-nextlvl">${problemSet.created_at && (new Date(problemSet.created_at).toDateString())}</h3>

                <div class="actions js-problem-set-actions-group">
                    <span 
                        class="js-problemset-view"
                        data-problemsetid="${problemSet.id}"
                    >👁️</span>
                    <span 
                        class="js-problemset-edit"
                        data-problemsetid="${problemSet.id}"
                    >✏️</span>
                    <span 
                        class="js-problemset-delete"
                        data-problemsetid="${problemSet.id}"
                    >🗑️</span>
                </div>
            </div>
        `;
    });
}

// () -> render the topics in drop-down..
function renderTopicsInDropDown(modal, availableTopics = AdminStore.topics) {

    // initially empty up the dropdown topics list..
    modal.querySelector(".js-topic-list").innerHTML = "";

    // iterate over the topics available..
    availableTopics.forEach(function(topic, index) {

        // is topic selected..
        const isSelectedTopic = selectedTopics.has(topic.id);

        // accumulate each topic as with label and check box in dropdown list..
        modal.querySelector(".js-topic-list").innerHTML += `
            <label key='${index}'>
                <input 
                    type='checkbox' 
                    class='js-topic-checkbox'
                    data-topicId='${topic.id}'
                    value='${topic.id}'
                    ${isSelectedTopic ? 'checked' : ''}
                    > ${topic.name}
            </label>
        `;
    });
}

// () -> render the topics for deletion of assigned topics..
function renderAssignedTopics(modal, assignedTopics = []) {

    // initially empty up the assigned topics list..
    modal.querySelector(".js-assigned-topics").innerHTML = "";

    // iterate over the topics available..
    assignedTopics.forEach(function(topic, index) {

        // is topic un-assigned..
        const isUnAssigned = unAssignedTopics.has(topic.id);
        // console.log(unAssignedTopics, isUnAssigned);

        // accumulate each topic as with label and check box in assigned list..
        modal.querySelector(".js-assigned-topics").innerHTML += `
            <span 
                class='${isUnAssigned ? `label-tag pending-delete` : `label-tag`}'
                key='${index}'    
            >
                ${topic.name}
                <span 
                    class="remove-topic js-remove-topic" 
                    data-topic-id='${topic.id}'
                >
                    🗑
                </span>
            </span>
        `;
    });
}

// () -> attach the events to problem set view..
function attachProblemSetsEvents() {

    // when the open add problem set modal is clicked..
    document.querySelector(".js-ps-open-add-problemset-modal").onclick = handleOpenProblemSetModal;

    // handle problem set actions..
    document.querySelector(".js-problemset-items").onclick = handleProblemSetActions;

    // when the save button (or form to add the problem set is submitted)..
    document.querySelector("#addProblemSetModal").onsubmit = handleAddProblemSet;

}

// () -> handle problem set actions..
function handleProblemSetActions(event) {

    // check log..
    // console.log(event.target.classList);

    // when view action is clicked..
    if(event.target.classList.contains("js-problemset-view")) {

        // check log..
        // console.log(event.target);

        // open the view problemset modal..
        handleOpenViewProblemSetModal(event.target);
        return;
    }

    // when edit action is clicked..
    if(event.target.classList.contains("js-problemset-edit")) {

        // check log..
        // console.log("edit modal needs to be opened");

        // open the update modal..
        handleOpenUpdateProblemSetModal(event.target);
        return;
    }


    return;
}

// () -> attach events to dropdown in problem set view..
function attachDropDownEvents(modal) {

    // when toggle dropdown menu is clicked..
    modal.querySelector(".js-topic-toggle").onclick = function(event) {

        // toggle the menu..
        modal.querySelector(".js-topic-dropdown")
        .classList.toggle("active");
    };

    // add the event listener to dropdown's search input..
    modal.querySelector(".js-topic-search").oninput = function(event) {

        // handle the search..
        searchTopics(event, modal);
    };
}

// () -> attach the event to check boxes parent `div`
function attachCheckboxEvents(modal) {

    // attach the change listener on the whole topics 
    modal.querySelector(".js-topic-list").onchange = handleTopicSelect;
}

// () -> attach assigned topics events..
function attachAssignedTopicsEvents(modal, topic_ids) {

    // add the event `click` to assigned topics list..
    modal.querySelector(".js-assigned-topics").onclick = function(event) {

        // handle the actions..
        handleAssignedTopicsActions(event, modal, topic_ids);
    };
}

// () -> handle the actions in assigned topics
function handleAssignedTopicsActions(event, modal, topic_ids) {

    // track the delete-button is clicked..
    if(event.target.classList.contains("js-remove-topic")) {

        // check log..
        // console.log(event.target.dataset.topicId);

        // handle the un-assignment
        toggleTopicsUnAssignement(event.target, modal, topic_ids);
        return;
    }
    // exit..
    return;
}

// () -> attach update section events..
function attachUpdateSectionEvents(modal) {

    // attach click event to modal..
    modal.onclick = handleUpdateSectionChanges;
}

// () -> handle the update section events..
function handleUpdateSectionChanges(event) {

    // check log..
    // console.log(event.target);

    // when the update problem set's button is clicked || form is submitted..
    if(event.target.classList.contains("js-update-ps-btn")) {

        // stop the reload when form is submitted..
        event.preventDefault();

        // handle problem-set update..
        handleUpdateProblemSet(event);
        return;
    }

    // when the add new topics button is clicked..
    if(event.target.classList.contains("js-add-new-topics-btn")) {

        // handle the new topics add to existing problem-set..
        handleAddNewTopicsToProblemSet(event);
        return;
    }
}


// () -> manage problem sets.. 
export async function initManageProblemSets() {
    // check log..
    // console.log("content for problem sets loaded..");

    // update the HTML..
    document.querySelector(".main").innerHTML = manageProblemSetsHTML;

    // get the problemsets, topics from api..
    const problemSetsResponse = await ProblemSetsApi.getProblemSets();
    const topicsResponse = await TopicsApi.getTopics();

    // update the state..
    AdminStore.problemSets = problemSetsResponse.data;
    AdminStore.topics = topicsResponse.data;

    // render out the problems sets available..
    renderProblemSets();

    // attach the events for problem-sets page..
    attachProblemSetsEvents();

}

// () -> to open add problem set modal..
function handleOpenProblemSetModal(event) {

    // check log..
    // console.log("open the problem set add modal");

    // current add problem set modal..
    const modal = document.querySelector("#addProblemSetModal");

    // render the topics in dropDown..
    renderTopicsInDropDown(modal);

    // then, after the modal events are done attach the dropdown events..
    attachDropDownEvents(modal);

    // after then bind the check box events..
    attachCheckboxEvents(modal);
    
    // open the modal..
    Modal.openModal("addProblemSetModal");
}

// () -> to open the view problem set modal..
function handleOpenViewProblemSetModal(btn) {

    // grab the current problem set id..
    const problemSetId = btn.dataset.problemsetid;

    // check log..
    // console.log(problemSetId);

    // get the current problem set to be viewed..
    const problemSet = AdminStore.problemSets.find(problemset => problemset.id == problemSetId);

    // check log..
    // console.log(problemSet);

    // fill the data in the modal..

    // initial details..
    document.querySelector(".js-view-title").innerText = problemSet?.title;
    document.querySelector(".js-view-description").innerText = problemSet?.description;

    // difficulty and topics..
    const difficultyClass = problemSet?.difficulty === "easy" ? "easy" : problemSet?.difficulty === "medium" ? "medium" : "hard";
    document.querySelector(".js-view-difficulty").innerText = problemSet?.difficulty;
    document.querySelector(".js-view-difficulty").setAttribute("class", `label-tag js-view-difficulty ${difficultyClass}`);


    // initially, empty the html..
    document.querySelector(".js-view-topics").innerHTML = "";
    // for topics associated to the problem set..
    problemSet.topics.forEach(function(topic, index) {

        // accumulate each topic with readable label..
        document.querySelector(".js-view-topics").innerHTML += `
            <span class='label-tag' key='${index}' topic-id='${problemSet?.topic_ids[index]}'>
             📌 ${topic}
            </span>
        `;
    });

    // sample input and output blocks for problemset..
    document.querySelector(".js-view-input").innerText = problemSet?.sample_input;
    document.querySelector(".js-view-output").innerText = problemSet?.sample_output;

    // for hintsText available for problemset..
    document.querySelector(".js-view-hints").innerText = problemSet?.hints;

    // at the end, open up the modal..
    Modal.openModal("viewProblemSetModal");
}

// () -> to open the update/ edit problem set modal..
function handleOpenUpdateProblemSetModal(btn) {

    // remove the previous topics data..
    selectedTopics.clear();
    unAssignedTopics.clear();

    // modal to open
    const modal = document.querySelector("#updateProblemSetModal");

    // grab the current problem set id..
    const problemSetId = btn.dataset.problemsetid;

    // check log..
    // console.log(problemSetId);

    // get the current problem set to be viewed..
    const problemSet = AdminStore.problemSets.find(problemset => problemset.id == problemSetId);

    // check log..
    console.log(problemSet);

    // fill the data in the modal..

    // Section 1.. (basic update problem set data..)
    document.querySelector(".js-update-ps-id").value = problemSet?.id ?? "";
    document.querySelector(".js-ps-update-title").value = problemSet?.title ?? "";
    document.querySelector(".js-ps-update-description").value = problemSet?.description ?? "";
    document.querySelector(".js-ps-update-difficulty").value = problemSet?.difficulty ?? "";
    document.querySelector(".js-ps-update-sample-input").value = problemSet?.sample_input ?? "";
    document.querySelector(".js-ps-update-sample-output").value = problemSet?.sample_output ?? "";
    document.querySelector(".js-ps-update-hintsText").value = problemSet?.hints ?? "";
    

    // Section 2.. (for new topics)
    // console.log(getUnAssignedTopics(problemSet?.topic_ids));

    // render the assigned topics dropdown..
    renderTopicsInDropDown(modal, getUnAssignedTopics(problemSet?.topic_ids ?? []));

    // then, after the modal events are done attach the dropdown events..
    attachDropDownEvents(modal);

    // after then bind the check box events..
    attachCheckboxEvents(modal);


    // Section 3.. (for already assigned topics removal)

    // render the already assigned topics..
    renderAssignedTopics(modal, getAssignedTopics(problemSet?.topic_ids ?? []));

    // attach the assigned topic remove button event..
    attachAssignedTopicsEvents(modal, problemSet?.topic_ids);

    // attach the button listeners for each section..
    attachUpdateSectionEvents(modal);

    // at the end, open up the modal..
    Modal.openModal("updateProblemSetModal");
}

// () -> handle the searching of topics
function searchTopics(event, modal) {

    // check log..
    // console.log(event.target.value.trim());

    // grab the sanitized search text input..
    const searchInputValue = event.target.value.trim();

    // get the all matching topics..
    const availableTopics = AdminStore.topics.filter(topic => topic.name.includes(searchInputValue));

    // check log..
    // console.log(availableTopics);

    // render the topics again..
    renderTopicsInDropDown(modal, availableTopics);
}

// () -> get the un-assigned topics..
function getUnAssignedTopics(topic_ids) {  

    // get the topics whose..
    return AdminStore.topics.filter(function(topic, index) {

        // id ain't present in already assigned..
        return topic && !topic_ids.includes(topic.id.toString());
    });
}

// () -> get assigned topics..
function getAssignedTopics(topic_ids) {

    // get the topics whose..
    return AdminStore.topics.filter(function(topic, index) {

        // id is only present in already assigned..
        return topic && topic_ids.includes(topic.id.toString());
    });
}

// () -> when topic is checked..
function handleTopicSelect(event) {

    // check if it ain't an checkbox..
    if(!event.target.classList.contains("js-topic-checkbox")) return;

    // check log..
    // console.log("check box is checked", event.target.value);

    // get the topic id..
    const topicId = +(event.target.value.trim());

    // check if it's already selected?
    // i.e., already contains in selectedTopics..
    if(selectedTopics.has(topicId)) {

        // remove the current topic-id..
        selectedTopics.delete(topicId);
    }

    // otherwise, add one..
    else {

        // add the id of topic..
        selectedTopics.add(topicId);
    }
}

// () -> handle the toggling of topics un-assignment..
function toggleTopicsUnAssignement(btn, modal, topic_ids) {

    // check log
    // console.log(modal, topic_ids);

    // get the topic id to un-assign..
    const topicId = btn.dataset.topicId;

    // check log..
    // console.log(topicId + " is to be un-assigned");

    // check if it already contains..
    if(unAssignedTopics.has(+topicId)) {

        // remove the existing topic to be removed..
        unAssignedTopics.delete(+topicId);
    }
    // otherwise, add one to remove..
    else {

        // un-assign the topic..
        unAssignedTopics.add(+topicId);
    }

    // check log..
    // console.log(unAssignedTopics.size)

    // re-render the assigned topics..
    renderAssignedTopics(modal, getAssignedTopics(topic_ids));
}
 
// () -> handle add the problem set..
async function handleAddProblemSet(event) {

    // restrict the reload behavior..
    event.preventDefault();

    // check log.
    // console.log("adding the problem set");

    // get the inputs..

    // initial details..
    const psTitle = document.querySelector(".js-ps-title").value.trim();
    const psDescription = document.querySelector(".js-ps-description").value.trim();
    const psSelectedDifficulty = document.querySelector(".js-ps-difficulty").value.trim();

    // get the topic ids..
    const topicsSelected = Array.from(selectedTopics);

    // initial sample input/ output for problem-sets..
    const psSampleInput = document.querySelector(".js-ps-input").value.trim();
    const psSampleOutput = document.querySelector(".js-ps-output").value.trim();

    // if any hints and tips..
    const psHints = document.querySelector(".js-ps-hints").value.trim();

    // creator id..
    const createdBy = AdminStore.currentUserId;

    // check log..
    // console.log(psTitle, psDescription, psSelectedDifficulty, topicsSelected, psSampleInput, psSampleOutput, psHints);

    // add the problem-set..
    await ProblemSetsApi.addProblemSetsAndTopics(
        psTitle,
        psDescription,
        psSelectedDifficulty,
        topicsSelected,
        psSampleInput,
        psSampleOutput,
        psHints,
        createdBy
    );

    // get the problemsets..
    const response = await ProblemSetsApi.getProblemSets();

    // update the state..
    AdminStore.problemSets = response.data;

    // re-render the problem sets again..
    renderProblemSets();

    // close the modal..
    Modal.closeModal(event);

    // clear the inputs..
    document.querySelector(".js-ps-title").value = "";
    document.querySelector(".js-ps-description").value = "";
    document.querySelector(".js-ps-difficulty").value = "";
    document.querySelector(".js-ps-input").value = "";
    document.querySelector(".js-ps-output").value = "";
    document.querySelector(".js-ps-hints").value = "";
    selectedTopics.clear();
}

// () -> handle update the problem set..
async function handleUpdateProblemSet(event) {

    // check log..
    console.log("update is initiated");

    // get the data for update..
    const problemSetId = document.querySelector(".js-update-ps-id").value.trim();
    const problemSetTitle = document.querySelector(".js-ps-update-title").value.trim();
    const problemSetDescription = document.querySelector(".js-ps-update-description").value.trim();
    const problemSetDifficulty = document.querySelector(".js-ps-update-difficulty").value.trim();
    const problemSetSampleInput = document.querySelector(".js-ps-update-sample-input").value.trim();
    const problemSetSampleOutput = document.querySelector(".js-ps-update-sample-output").value.trim();
    const problemSetHintsText = document.querySelector(".js-ps-update-hintsText").value.trim();

    // check log..
    console.log(problemSetId, problemSetTitle, problemSetDifficulty, problemSetDescription, problemSetSampleInput, problemSetSampleOutput, problemSetHintsText);

    // update the btn text..
    event.target.innerText = "updating..";

    // initiate the update..
    await ProblemSetsApi.updateProblemSet(
        problemSetTitle, 
        problemSetDescription, 
        problemSetDifficulty, 
        problemSetSampleInput, 
        problemSetSampleOutput, 
        problemSetHintsText, 
        problemSetId
    );

    // check log..
    // console.log(response);

    // get the problem-sets..
    const response = await ProblemSetsApi.getProblemSets();

    // update the state..
    AdminStore.problemSets = response.data;

    // re-render the problem-sets..
    renderProblemSets();

    // after 1.5 seconds..
    setTimeout(function() {

        // close the modal..
        Modal.closeModal(event);

        // reset the button text..
        event.target.innerText = "Save Changes";
    }, 1500);
}

// () -> handle new topics to problem set..
async function handleAddNewTopicsToProblemSet(event) {

    // check log..
    // console.log("new topics to existing problem set is initiated");

    // check log topic_ids and problem-set id..
    // console.log(selectedTopics, document.querySelector(".js-update-ps-id").value.trim());

    // prepare the data to send..
    const problemSetId = document.querySelector(".js-update-ps-id").value.trim();
    const topicIds = [...selectedTopics];

    // check log..
    // console.log(problemSetId, topicIds);

    // initiate the update..
    await ProblemSetsApi.assignNewTopicsToProblemSet(problemSetId, topicIds);

    // get the problem sets..
    const response = await ProblemSetsApi.getProblemSets();

    // update the state..
    AdminStore.problemSets = response.data;

    // re-render the problem-sets..
    renderProblemSets();

    // after 1.5 seconds..
    setTimeout(function() {

        // close the modal..
        Modal.closeModal(event);

        // reset the button text..
        // event.target.innerText = "Save Changes";
    }, 1500);
}