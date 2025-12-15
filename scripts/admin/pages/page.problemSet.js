// grab the modules..
import {AdminStore} from "/php_easy/scripts/admin/store.js";
import {manageProblemSetsHTML} from "/php_easy/scripts/admin/templates/problemSets.html.js";
import {ProblemSetsApi} from "/php_easy/scripts/admin/apis/api.problemSets.js";
import {TopicsApi} from "/php_easy/scripts/admin/apis/api.topics.js";
import {Modal} from "/php_easy/scripts/admin/modals/modals.js";

// initial state for handling selecting/ de-selecting topics in dropdown..
const selectedTopics = new Set();

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

                <div class="actions">
                    <span class="js-problemset-view">👁️</span>
                    <span class="js-problemset-edit">✏️</span>
                    <span class="js-problemset-delete">🗑️</span>
                </div>
            </div>
        `;
    });
}

// () -> render the topics in drop-down..
function renderTopicsInDropDown(availableTopics = AdminStore.topics) {

    // initially empty up the dropdown topics list..
    document.querySelector(".js-topic-list").innerHTML = "";

    // iterate over the topics available..
    availableTopics.forEach(function(topic, index) {

        // is topic selected..
        const isSelectedTopic = selectedTopics.has(topic.id);

        // accumulate each topic as with label and check box in dropdown list..
        document.querySelector(".js-topic-list").innerHTML += `
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

// () -> attach the events to problem set view..
function attachProblemSetsEvents() {

    // when the open add problem set modal is clicked..
    document.querySelector(".js-ps-open-add-problemset-modal").onclick = handleOpenProblemSetModal;

    // when the save button (or form to add the problem set is submitted)..
    document.querySelector("#addProblemSetModal").onsubmit = handleAddProblemSet;
}

// () -> attach events to dropdown in problem set view..
function attachDropDownEvents() {

    // when toggle dropdown menu is clicked..
    document.querySelector(".js-topic-toggle").onclick = handleDropDown;

    // add the event listener to dropdown's search input..
    document.querySelector(".js-topic-search").oninput = searchTopics;
}

// () -> attach the event to check boxes parent `div`
function attachCheckboxEvents() {

    // attach the change listener on the whole topics 
    document.querySelector(".js-topic-list").onchange = handleTopicSelect;
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

    // render the topics in dropDown..
    renderTopicsInDropDown();

    // attach the events for problem-sets page..
    attachProblemSetsEvents();

    // then, after the modal events are done attach the dropdown events..
    attachDropDownEvents();

    // after then bind the check box events..
    attachCheckboxEvents();
}

// () -> to open add problem set modal..
function handleOpenProblemSetModal(event) {

    // check log..
    // console.log("open the problem set add modal");
    
    // open the modal..
    Modal.openModal("addProblemSetModal");
}

// () -> handle dropdown menu section..
function handleDropDown(event) {

    // check log..
    console.log("drop down is to be toggled", event.target);

    // toggle the dropdown's open (active state)..
    document.querySelector(".js-topic-dropdown").classList.toggle("active");
}

// () -> handle the searching of topics
function searchTopics(event) {

    // check log..
    // console.log(event.target.value.trim());

    // grab the sanitized search text input..
    const searchInputValue = event.target.value.trim();

    // get the all matching topics..
    const availableTopics = AdminStore.topics.filter(topic => topic.name.includes(searchInputValue));

    // check log..
    // console.log(availableTopics);

    // render the topics again..
    renderTopicsInDropDown(availableTopics);
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