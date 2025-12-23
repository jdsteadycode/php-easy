// grab the modules..
import {AdminStore} from "/php_easy/scripts/admin/store.js";
import {manageVideosAndPlaylistHTML} from "/php_easy/scripts/admin/templates/videosandplaylist.html.js";
import {CategoriesApi} from "/php_easy/scripts/admin/apis/api.categories.js";
import {Modal} from "/php_easy/scripts/admin/modals/modals.js";
import {Toast} from "/php_easy/scripts/common/toasts.js";
import { VideoAndPlaylistApi } from "/php_easy/scripts/admin/apis/api.videosandplaylist.js";

// initial state for handling (selected categories)..
const selectedCategories = new Set();

// () -> attach events to module..
function attachVideoAndPlaylistEvents() {

    // add event to open add video modal..
    document.querySelector(".js-open-add-videos-btn").onclick = handleOpenAddVideoModal;
}

// () -> render the categories in dropdown..
function renderCategoriesInDropDown(modal, availableCategories = AdminStore.categories) {

    // check log..
    // console.log(availableCategories);

    // initially empty up the dropdown categories list..
    modal.querySelector(".js-category-list").innerHTML = "";

    // iterate over the topics available..
    availableCategories.forEach(function(category, index) {

        // check if category is already selected?
        const isCategorySelected = selectedCategories.has(category.parent_category_id.toString());

        // check log..
        // console.log(isCategorySelected);

        // accumulate each topic as with label and check box in dropdown list..
        modal.querySelector(".js-category-list").innerHTML += `
            <label key='${index}'>
                <input 
                    type="checkbox"
                    name="parent_category"
                    class="js-category-checkbox"
                    data-category-id="${category.parent_category_id}"
                    ${isCategorySelected ? 'checked' : ''}
                    > ${category.parent_category_name}
            </label>
        `;
    });
}

// () -> attach dropdown events..
function attachDropDownEvents(modal) {

    // when toggle dropdown menu is clicked..
    modal.querySelector(".js-category-toggle").onclick = function(event) {

        // toggle the menu..
        modal.querySelector(".js-category-dropdown")
        .classList.toggle("active");
    };

    // add the event listener to dropdown's search input..
    modal.querySelector(".js-category-search").oninput = function(event) {

        // handle the search..
        searchCategories(event, modal);
    };
}

// () -> attach the checkbox events..
function attachCheckboxEvents(modal) {

    // add the click event to categories list..
    modal.querySelector(".js-category-list").onclick = handleCheckboxChange;
}

// () -> attach add video form events
function attachAddVideoFormEvents(modal) {

    // when the save button is clicked..
    modal.querySelector(".js-save-video-btn").onclick = function(event) {

        // handle save video..
        handleSaveVideo(modal, event);
    }
}

// () -> handle rendering videos and playlist module..
export async function initmanageVideosAndPlaylists() {

    // update the html..
    document.querySelector(".main").innerHTML = manageVideosAndPlaylistHTML;

    // get the categories..
    const categoriesResponse = await CategoriesApi.getCategories();

    // load the categories..
    AdminStore.categories = categoriesResponse.data;

    // attach the events..
    attachVideoAndPlaylistEvents();
}

// () -> handle open add video modal..
function handleOpenAddVideoModal(event) {

    // get the model to open..
    const modal = document.querySelector("#addVideoModal");

    // render the categories in dropdown..
    renderCategoriesInDropDown(modal, AdminStore.categories);

    // attach the dropdown events..
    attachDropDownEvents(modal);

    // attach the checkbox events..
    attachCheckboxEvents(modal);

    // attach form events..
    attachAddVideoFormEvents(modal);

    // open the modal..
    Modal.openModal("addVideoModal");
}

// () -> search the categories..
function searchCategories(event, modal) {

    // check log..
    // console.log(event.target.value.trim(), modal);

    // get the available categories matching the entered text..
    const availableCategories = AdminStore.categories.filter(category => category.parent_category_name.includes(event.target.value.trim()));

    // check log..
    // console.log(matchingCategories);

    // re-render the dropdown..
    renderCategoriesInDropDown(modal, availableCategories);
}

// () -> handle checkbox check event..
function handleCheckboxChange(event) {

    // check if category checkbox is clicked..
    if(event.target.classList.contains("js-category-checkbox")) {

        // check log..
        // console.log(event.target);

        // handle toggle category selection..
        toggleCategorySelection(event.target);
        // exit..
        return;
    }
    return;
}

// () -> toggle the category selection..
function toggleCategorySelection(inputEl) {

    // check log..
    // console.log(inputEl);

    // get the category id..
    const categoryId = inputEl.dataset.categoryId;

    // update the state..
    selectedCategories.has(categoryId) ? selectedCategories.delete(categoryId) : selectedCategories.add(categoryId);

    // check log..
    // console.log(selectedCategories);
}

// () -> handle save video..
async function handleSaveVideo(modal, event) {

    // restrict the reload behavior..
    event.preventDefault();

    // check log..
    // console.log(event, modal);

    // get the data elements..
    const titleEl = modal.querySelector(".js-video-title");
    const descriptionEl = modal.querySelector(".js-video-description");
    const videoUrlEl = modal.querySelector(".js-video-url");
    const thumbnailEl = modal.querySelector(".js-video-thumbnail");
    const categoryIds = [...selectedCategories];

    // creator's id..
    const uploadedBy = AdminStore.currentUserId;

    
    // send the video data..
    const videoAddResponse = await VideoAndPlaylistApi.addVideoWithCategories(
        titleEl.value.trim(),
        descriptionEl.value.trim(),
        videoUrlEl.value.trim(),
        thumbnailEl.files[0],
        categoryIds,
        uploadedBy
    );

    // show the toast..
    Toast.show({
       "title": videoAddResponse.status ? "Success" : "Error",
       "message": videoAddResponse.message,
       "type": videoAddResponse.status ? "success" : "error",
       "duration": 2800
    });


    // empty the inputs..
    titleEl.value = "";
    descriptionEl.value = "";
    videoUrlEl.value = "";
    thumbnailEl.value = "";

    // close the modal..
    Modal.closeModal(event);
}