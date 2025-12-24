// grab the modules..
import {AdminStore} from "/php_easy/scripts/admin/store.js";
import {manageVideosAndPlaylistHTML} from "/php_easy/scripts/admin/templates/videosandplaylist.html.js";
import {CategoriesApi} from "/php_easy/scripts/admin/apis/api.categories.js";
import {Modal} from "/php_easy/scripts/admin/modals/modals.js";
import {Toast} from "/php_easy/scripts/common/toasts.js";
import { VideoAndPlaylistApi } from "/php_easy/scripts/admin/apis/api.videosandplaylist.js";

// initial state for handling (selected categories (for both add and update video!))..
const selectedCategories = new Set();

// initial state for handling (selected videos (for both add and update video!))
const selectedVideos = new Set();

// initial state for handling un-assignment of categories
const categoriesToBeUnAssigned = new Set();

// initial state for handling removal of videos from playlists..
const videoIdsToBeRemoved = new Set();

// () -> attach events to module..
function attachVideoAndPlaylistEvents() {

    // add event to open add video modal..
    document.querySelector(".js-open-add-videos-btn").onclick = handleOpenAddVideoModal;

    // add event to open add playlist modal..
    document.querySelector(".js-open-add-playlists-btn").onclick = handleOpenAddPlaylistModal;
}

// () -> render the videos..
function renderVideos() {

    // initially empty the videos list..
    let videosListHTML = document.querySelector(".js-videos");
    videosListHTML.innerHTML = "";

    // initial video clutter (html skeleton)
    let videosClutter = "";

    // grab the videos available..
    const videoData = AdminStore.videos;

    // check log..
    // console.log(videoData);
    
    // initial dir of project..
    const projectDir = "php_easy";

    // initial final path 
    const pathToFile = `${window.origin}/${projectDir}/`;

    // iterate the video-data..
    videoData.forEach(function(video, index) {

        // accumulate the video clutter with video data each..
        videosClutter += `
                    <div class="item1 video-item">
                        <h3 class="t-op-nextlvl">${index + 1}</h3>

                        <img 
                            src=${pathToFile + video.thumbnail}
                            class="video-thumb"
                            alt="thumbnail"
                        />

                        <h3 class="t-op-nextlvl video-title">
                            ${video.title}
                        </h3>

                        <h3 class="t-op-nextlvl">
                            ${video.created_at ? new Date(video.created_at).toDateString() : "-"}
                        </h3>

                        <div class="actions">
                            <span 
                                class="js-video-view"
                                data-video-id="${video.video_id}"
                            >
                                👁️
                            </span>
                            <span 
                                class="js-video-edit"
                                data-video-id="${video.video_id}"
                            >
                                ✏️
                            </span>
                            <span 
                                class="js-video-delete"
                                data-video-id="${video.video_id}"
                            >
                                🗑️
                            </span>
                        </div>
                    </div>
        `;
    });

    // finally add the clutter to html..
    videosListHTML.innerHTML = videosClutter;
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

// () -> render the assigned categories (Section 3 of update video modal)
function renderAssignedCategories(modal, assignedCategories = []) {
    // intially empty the already assigned categories list..
    modal.querySelector(".js-assigned-video-categories").innerHTML = "";

    // initial assigned categories clutter 
    let assignedCategoriesClutter = "";

    // iterate over the assigned categories..
    assignedCategories.forEach(function(category, index) {

        // is category in list of un-assigned ones..
        const isToBeUnAssigned = categoriesToBeUnAssigned.has((category.parent_category_id).toString());

        // accumulate each category..
        assignedCategoriesClutter += `
                <span 
                    class='${isToBeUnAssigned ? `label-tag pending-delete` : `label-tag`}'
                >
                    ${category.parent_category_name}
                    <span 
                        class="remove-topic js-remove-video-category" 
                        data-category-id="${category.parent_category_id}"
                    >🗑</span>
                </span>  
        `;
    });

    // add to final html..
    modal.querySelector(".js-assigned-video-categories").innerHTML = assignedCategoriesClutter;
}

// () -> get un-assigned categories
function getUnAssignedCategories(categories_ids) {  

    // get the topics whose..
    return AdminStore.categories.filter(function(category, index) {

        // id ain't present in already assigned..
        return category && !categories_ids.includes(category.parent_category_id);
    });
}

// () -> get assigned categories
function getAssignedCategories(categories_ids) {  

    // get the topics whose..
    return AdminStore.categories.filter(function(category, index) {

        // id ain't present in already assigned..
        return category && categories_ids.includes(category.parent_category_id);
    });
}

// () -> attach dropdown events..
function attachDropDownEvents(modal, unAssignedCategories = []) {

    modal.id === "addVideoModal"  || modal.id === "updateVideoModal" ?
    // when toggle dropdown menu is clicked..
    modal.querySelector(".js-category-toggle").onclick = function(event) {

        // toggle the menu..
        modal.querySelector(".js-category-dropdown")
        .classList.toggle("active");
    }
    :

    // when add playlist modal or update Playlist modal..
    modal.id === "addPlaylistModal" || modal.id === "updatePlaylistModal"
    ?
    // when toggle dropdown menu is clicked..
    modal.querySelector(".js-video-toggle").onclick = function(event) {

        // toggle the menu..
        modal.querySelector(".js-video-dropdown")
        .classList.toggle("active");
    }
    :
    "";

    // add the event listener to dropdown's search input.
    // when video modal?
    modal.id === "addVideoModal" || modal.id === "updateVideoModal" 
    ?
    modal.querySelector(".js-category-search").oninput = function(event) {

        // type of modal.
        const modalType = modal.id === "addVideoModal" ? "view" : "update";

        // handle the search..
        searchCategories(event, modal, modalType, unAssignedCategories);
    }
    :
    // when playlist modals?
    modal.id === "addPlaylistModal" || modal.id === "updatePlaylistModal"
    ?
    modal.querySelector(".js-video-search").oninput = function(event) {

        // type of modal.
        const modalType = modal.id === "addPlaylistModal" ? "view" : "update";

        // handle the search..
        searchVideosForPlaylistSection(event, modal, modalType, unAssignedCategories);
    }
    :
    "";
}

// () -> attach the checkbox events..
function attachCheckboxEvents(modal) {

    // check log
    // console.log(modal);

    // when video modal(s)?
    modal.id === "addVideoModal" || modal.id === "updateVideoModal"
        ?
    // add the click event to categories list..
    modal.querySelector(".js-category-list").onclick = handleCheckboxChange
        :

    // when playlist modal(s)?
    modal.id === "addPlaylistModal"  || modal.id === "updatePlaylistModal"
        ?
    // playlist section..
    // add the click event to videos list..
    modal.querySelector(".js-video-list").onclick = handleCheckboxChange
        :
    "";
}

// () -> attach add video form events
function attachAddVideoFormEvents(modal) {

    // when the save button is clicked..
    modal.querySelector(".js-save-video-btn").onclick = function(event) {

        // handle save video..
        handleSaveVideo(modal, event);
    }
}

// () -> attach video-list action events..
function attachVideoListActionEvents() {

    // attach click event on the video list element..
    document.querySelector(".js-videos").onclick = handleVideoListActions;
}

// () -> attach the update video modal events..
function attachUpdateVideoModalEvents(modal) {

    // attach click event to section 1's video changes btn..
    modal.querySelector(".js-update-video-btn").onclick = function(event) {
        // handle update..
        handleUpdateVideo(modal, event);
    }

    // attach click event to section 2's add selected categories btn..
    modal.querySelector(".js-add-video-categories-btn").onclick = function(event) {

        // handle assignment of new categories..
        handleAddSelectedCategories(modal, event);
    }

    // attach click event to section 3's remove categories btn..
    modal.querySelector(".js-save-removed-video-categories-btn").onclick = function(event) {

        // handle removal of assigned categories..
        handleRemoveCategories(event, modal);
    }
}

// () -> attach the assigned categories events for (update video modal)
function attachAssignedCateogriesEvents(modal, assignedCategories = []) {

    // add click event..
    modal.querySelector(".js-assigned-video-categories").onclick = function(event) {

        // handle assigned video categories..
        handleAssignedVideoCategories(event, modal, assignedCategories);
    }
}

// () -> attach the delete modal events..
function attachDeleteVideoModalEvents(modal) {

    //. add click event to the button..
    modal.querySelector(".js-confirm-delete-video").onclick = function(event) {

        // handle deletion of video..
        handleDeleteVideo(event, modal);
    }
}

// () -> handle rendering videos and playlist module..
export async function initmanageVideosAndPlaylists() {

    // update the html..
    document.querySelector(".main").innerHTML = manageVideosAndPlaylistHTML;

    // get the videos available..
    const videosResponse = await VideoAndPlaylistApi.getVideos();

    // get the playlists available..
    const playlistsResponse = await VideoAndPlaylistApi.getPlaylists();

    // get the categories..
    const categoriesResponse = await CategoriesApi.getCategories();

    // load the videos and categories..
    AdminStore.videos = videosResponse.data;
    AdminStore.playlists = playlistsResponse.data;
    AdminStore.categories = categoriesResponse.data;

    // render the videos listing..
    renderVideos();

    // render the playlists listing..
    renderPlaylists();

    // attach the events..
    attachVideoAndPlaylistEvents();

    // attach videos/ playlist action events..
    attachVideoListActionEvents();
    attachPlaylistActionEvents();
}

// () -> handle video-list action events..
function handleVideoListActions(event) {

    // when the view video action is clicked..
    if(event.target.classList.contains("js-video-view")) {

        // check log..
        // console.log(event.target);

        // handle open view video modal..
        handleOpenViewVideoModal(event);
    }

    // when the update video action is clicked..
    if(event.target.classList.contains("js-video-edit")) {

        // check log..
        // console.log(event.target);

        // handle open view video modal..
        handleOpenUpdateVideoModal(event);
        return;
    }

    // when the delete video action is clicked..
    if(event.target.classList.contains("js-video-delete")) {

        // handle open view video modal..
        handleOpenDeleteVideoModal(event);
        return;
    }

    return;
}

// () -> handle open view video modal..
function handleOpenViewVideoModal(event) {

    // get the video id to be viewed..
    const videoId = event.target.dataset.videoId;

    // get the modal to be opened..
    const modal = document.querySelector("#viewVideoModal");

    // check log..
    // console.log(videoId);

    // get the current video..
    const video = AdminStore.videos.find(video => video.video_id == +videoId);

    // check log..
    // console.log(video);

    // set the video data..
    modal.querySelector(".js-view-video-title").innerText = video.title ?? "-"; 
    modal.querySelector(".js-view-video-thumbnail").src = `${window.origin}/php_easy/${video.thumbnail}`; 
    modal.querySelector(".js-view-video-description").innerText = video.description ?? "-";

    // for categories related to given video..
    const videoCategoriesHTML = document.querySelector(".js-view-video-categories");
    // empty it initially,
    videoCategoriesHTML.innerHTML = "";

    // intial categories clutter..
    let videoCategoriesClutter = "";

    // iterate for categories available respect to video to be opened..
    video.video_category_names.forEach(function(categoryName, index) {

        // accumulate each category with clutter..
        videoCategoriesClutter += `
            <span 
                key="${index}"
                class="subcategory-chip"
                data-category-id="${video.video_category_ids[index]}"
            >
               🔖 ${categoryName}
            </span>
        `;
    });

    // add the video categories clutter to final html..
    videoCategoriesHTML.innerHTML = videoCategoriesClutter;

    // set the video link..
    document.querySelector(".js-view-video-url").href = video.video_url ? `${video.video_url}` : "#";

    // set the video date details..
    document.querySelector(".js-view-video-created-at").innerText =
    video.created_at 
        ?
    (new Date(video.created_at).toDateString() + " " + new Date(video.created_at).toLocaleTimeString())
        :
    "-";

    document.querySelector(".js-view-video-updated-at").innerText =
    video.updated_at 
        ?
    (new Date(video.updated_at).toDateString() + " " + new Date(video.updated_at).toLocaleTimeString())
        :
    "-";

    document.querySelector(".js-view-video-deleted-at").innerText =
    video.deleted_at 
        ?
    (new Date(video.deleted_at).toDateString() + " " + new Date(video.deleted_at).toLocaleTimeString())
        :
    "-";


    // open the modal..
    Modal.openModal("viewVideoModal");
}

// () -> handle open add video modal..
function handleOpenAddVideoModal(event) {

    // clean up existing selected categories..
    selectedCategories.clear();

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

// () -> handle open update video modal..
async function handleOpenUpdateVideoModal(event) {

    // clean up existing selected categories..
    selectedCategories.clear();
    categoriesToBeUnAssigned.clear();

    // get the id of current video..
    const videoId = event.target.dataset.videoId;

    // get the video..
    const video = AdminStore.videos.find(video => video.video_id == +videoId);

    // check log..
    // console.log(video);

    // get the model to open..
    const modal = document.querySelector("#updateVideoModal");

    // fill the existing data..
    // for section 1..

    // set id..
    modal.querySelector(".js-update-video-id").value = video.video_id ?? "";
    // fill title
    modal.querySelector(".js-video-update-title").value = video.title ?? "";

    // fill description
    modal.querySelector(".js-video-update-description").value = video.description ?? "";

    // fill the video url
    modal.querySelector(".js-video-update-url").value = video.video_url ?? "";

    // initially empty the video thumbnail
    modal.querySelector(".js-video-update-thumbnail").value = "";

    // attach update modal events..
    attachUpdateVideoModalEvents(modal);


    // Section 2..
    // get the categories..
    const categoriesResponse = await CategoriesApi.getCategories();
    AdminStore.categories = categoriesResponse.data;

    // check log..
    // console.log(getUnAssignedCategories([44]));

    // then, render the categories in dropdown..
    renderCategoriesInDropDown(modal, getUnAssignedCategories(video.video_category_ids));

    // attach update modal drop down events..
    attachDropDownEvents(modal, getUnAssignedCategories(video.video_category_ids));

    // then, add checkbox events..
    attachCheckboxEvents(modal);


    // Section 3..
    renderAssignedCategories(modal, getAssignedCategories(video.video_category_ids));

    // attach assigned categories events..
    attachAssignedCateogriesEvents(modal, getAssignedCategories(video.video_category_ids));

    // open the modal..
    Modal.openModal("updateVideoModal");
}

// () -> handle open delete video modal..
function handleOpenDeleteVideoModal(event) {

    // get the modal..
    const modal = document.querySelector("#deleteVideoModal");

    // set the data.
    modal.querySelector(".js-video-delete-id").value = event.target.dataset.videoId;

    // attach the events..
    attachDeleteVideoModalEvents(modal);

    // open the modal for delete..
    Modal.openModal("deleteVideoModal");
}


// () -> search the categories..
function searchCategories(event, modal, modalType = "view", unAssignedCategories = []) {

    // check log..
    // console.log(event.target.value.trim(), modal);

    // get the available categories matching the entered text..
    const availableCategories = 
    modalType !== "view" 
        ?
    // when update modal
    unAssignedCategories.filter(category => category.parent_category_name.includes(event.target.value.trim()))
        :
    // when normal view modal
    AdminStore.categories.filter(category => category.parent_category_name.includes(event.target.value.trim()));

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

    // when video list's checkbox is clicked..
    if(event.target.classList.contains("js-video-checkbox")) {

        // check log..
        // console.log(event.target);

        // handle toggle video selection..
        toggleVideoSelection(event.target);
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

     // get the videos data..
    let videosResponse = await VideoAndPlaylistApi.getVideos();

    // update the video state..
    AdminStore.videos = videosResponse.data;

    // re-render the videos..
    renderVideos();

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

// () -> handle update video..
async function handleUpdateVideo(modal, event) {

    // restrict the reload behavior..
    event.preventDefault();

    // get the data to update..
    const videoIdEl = modal.querySelector(".js-update-video-id");
    const videoTitleEl = modal.querySelector(".js-video-update-title");
    const videoDescriptionEl = modal.querySelector(".js-video-update-description");
    const videoUrlEl = modal.querySelector(".js-video-update-url");
    const thumbnailEl = modal.querySelector(".js-video-update-thumbnail");

    // handle thumbnail image
    const thumbnailImageObj = thumbnailEl.files.length > 0 ? thumbnailEl.files[0] : null;

    // check log..
    // console.log(videoIdEl.value, videoTitleEl.value, videoDescriptionEl.value, videoUrlEl.value, thumbnailImageObkj);

    // make the update..
    const updateResponse = await VideoAndPlaylistApi.updateVideo(
        videoTitleEl.value.trim(), 
        videoDescriptionEl.value.trim(),
        videoUrlEl.value.trim(),
        thumbnailImageObj,
        videoIdEl.value.trim()
    ); 

    // check log..
    // console.log(updateResponse);

    // re-fetch the data..
    const videosResponse = await VideoAndPlaylistApi.getVideos();

    // update the state..
    AdminStore.videos = videosResponse.data;

    // re-render the videos list..
    renderVideos();

    // show the toast..
    Toast.show({
       "title": updateResponse.status ? "Success" : "Error",
       "message": updateResponse.message,
       "type": updateResponse.status ? "success" : "error",
       "duration": 2800
    });
}

// () -> handle add selected categories..
async function handleAddSelectedCategories(modal, event) {

    // update the text..
    event.target.innerText = "assigning..";

    // disable the current button..
    event.target.setAttribute("disabled", "");

    // get the video ids..
    const videoId = modal.querySelector(".js-update-video-id").value.trim();

    // get the selected categories..
    // console.log([...selectedCategories], videoId);

    // get the response..
    const assignedResponse = await VideoAndPlaylistApi.assignCategoriesToVideo([...selectedCategories], videoId);

    // check log.
    // console.log(assignedResponse);

    // re-fetch the data..
    const videosResponse = await VideoAndPlaylistApi.getVideos();

    // update the state..
    AdminStore.videos = videosResponse.data;

    // re-render the videos list..
    renderVideos();

    // show the toast..
    Toast.show({
       "title": assignedResponse.status ? "Success" : "Error",
       "message": assignedResponse.message,
       "type": assignedResponse.status ? "success" : "error",
       "duration": 2800
    });

    // after 3 seconds..
    setTimeout(function(){

        // close modal..
        Modal.closeModal(event);

        // update the text..
        event.target.innerText = "Add Selected Categories";

        // enable it..
        event.target.removeAttribute("disabled");
    }, 3000);
}

// () -> handle assigned video categories..
function handleAssignedVideoCategories(event, modal, assignedCategories) {

    // when remove button is clicked..
    if(event.target.classList.contains("js-remove-video-category")) {

        // handle toggle for removal of assigned categories..
        toggleAssignedCategories(event.target, modal, assignedCategories);
    }
    return;
}

// () -> toggle assigned already categories..
function toggleAssignedCategories(categoryEl, modal, assignedCategories) {

    // check log..
    console.log(categoryEl);

    // get the category id..
    const categoryId = categoryEl.dataset.categoryId;

    // get the video

    // save the category
    categoriesToBeUnAssigned.has(categoryId) ? categoriesToBeUnAssigned.delete(categoryId) : categoriesToBeUnAssigned.add(categoryId);

    // check log..
    // console.log(categoriesToBeUnAssigned);

    // re-render the categories..
    renderAssignedCategories(modal, assignedCategories);
}

// () -> handle remove assigned categories..
async function handleRemoveCategories(event, modal) {

    // update the text..
    event.target.innerText = "removing..";

    // disable it..
    event.target.setAttribute("disabled", "");

    // get the categories to be removed..
    const categories = [...categoriesToBeUnAssigned];

    // get the video id..
    const videoId = modal.querySelector(".js-update-video-id").value.trim();

    // check log..
    // console.log(videoId, categories);

    // get response from un-assigning videos..
    const unAssignCategoriesResponse = await VideoAndPlaylistApi.unAssignCategoriesToVideo(categories, videoId); 

    // get the response from categories..
    const response = await VideoAndPlaylistApi.getVideos();

    // save the videos..
    AdminStore.videos = response.data;

    // render the videos..
    renderVideos();

    // show the toast..
    Toast.show({
       "title": unAssignCategoriesResponse.status ? "Success" : "Error",
       "message": unAssignCategoriesResponse.message,
       "type": unAssignCategoriesResponse.status ? "success" : "error",
       "duration": 2800
    });

    // after 3 seconds..
    setTimeout(function() {

        // close the modal..
        Modal.closeModal(event);

        // update the text..
        event.target.innerText = "Remove Selected Categories";
        
        // enable it..
        event.target.removeAttribute("disabled");
    }, 3000);
}

// () -> handle the deletion of video..
async function handleDeleteVideo(event, modal) {

    // get the video id..
    const videoId = modal.querySelector(".js-video-delete-id").value;

    // delete the video..
    let deletedResponse = await VideoAndPlaylistApi.deleteVideo(videoId);

    // get the videos data..
    let videosResponse = await VideoAndPlaylistApi.getVideos();

    // update the video state..
    AdminStore.videos = videosResponse.data;

    // re-render the videos..
    renderVideos();

    // show the toast..
    Toast.show({
       "title": deletedResponse.status ? "Success" : "Error",
       "message": deletedResponse.message,
       "type": deletedResponse.status ? "success" : "error",
       "duration": 2800
    });

    // close the modal..
    Modal.closeModal(event);
}

/*
    for playlists
*/
// () -> handle opening of Add Playlist Modal..
function handleOpenAddPlaylistModal(event) {

    // clear existing selected videos..
    selectedVideos.clear();

    // get the modal..
    const modal = document.querySelector("#addPlaylistModal");

    // render the drop down..
    renderVideosInDropDown(modal);

    // add the events for dropdown..
    attachDropDownEvents(modal);

    // attach checkbox events..
    attachCheckboxEvents(modal);

    // attach the form events..
    attachAddPlaylistFormEvents(modal);

    // open the modal..
    Modal.openModal("addPlaylistModal");
}

// () -> render the videos..
function renderPlaylists() {

    // initially empty the playlists list..
    let playlistsHTML = document.querySelector(".js-playlists");
    playlistsHTML.innerHTML = "";

    // initial playlists clutter (html skeleton)
    let playlistsClutter = "";

    // grab the videos available..
    const playlistsData = AdminStore.playlists;

    // check log..
    // console.log(playlistsData);


    // iterate the video-data..
    playlistsData.forEach(function(playlist, index) {

        // accumulate the playlists clutter with video data each..
        playlistsClutter += `
           <div class="item1 playlist-item">
                <h3 class="t-op-nextlvl">${index + 1}</h3>

                <h3 class="t-op-nextlvl playlist-title">
                    ${playlist.name}
                </h3>

                <h3 class="t-op-nextlvl playlist-video-count">
                    ${playlist.no_of_videos}
                </h3>

                <h3 class="t-op-nextlvl">
                    ${playlist.created_at ? new Date(playlist.created_at).toDateString() : "-"}
                </h3>

                <div class="actions">
                    <span 
                        class="js-playlist-view"
                        data-playlist-id="${playlist.playlist_id}"
                    >
                        👁️
                    </span>
                    <span 
                        class="js-playlist-edit"
                        data-playlist-id="${playlist.playlist_id}"
                    >
                        ✏️
                    </span>
                    <span 
                        class="js-playlist-delete"
                        data-playlist-id="${playlist.playlist_id}"
                    >
                        🗑️
                    </span>
                </div>
            </div>         
        `;
    });

    // finally add the clutter to html..
    playlistsHTML.innerHTML = playlistsClutter;
}

// () -> rendering the videos available in drop dowm
function renderVideosInDropDown(modal, videos = AdminStore.videos) {

    // check log..
    // console.log(videos);

    // initially empty up the dropdown videos list..
    modal.querySelector(".js-video-list").innerHTML = "";

    // initial clutter..
    let videoClutter = "";

    // iterate over the videos available..
    videos.forEach(function(video, index) {

        // is video already selected..
        const isVideoSelected = selectedVideos.has((video.video_id).toString());

        // accumulate the clutter..
        videoClutter += `
            <label key='${index}'>
                <input 
                    type="checkbox"
                    name="video"
                    class="js-video-checkbox"
                    data-category-id="${video.video_id}"
                    ${isVideoSelected ? "checked" : ""}
                    > ${video.title}
            </label>
        `;
    });

    // accumulate each topic as with label and check box in dropdown list..
    modal.querySelector(".js-video-list").innerHTML = videoClutter;
}

// () -> render the assigned Videos (Section 3 of update playlist modal)
function renderAssignedVideos(modal, assignedVideos = []) {

    // intially empty the already assigned videos list..
    modal.querySelector(".js-assigned-playlist-videos").innerHTML = "";

    // initial assigned videos clutter 
    let assignedVideosClutter = "";

    // iterate over the assigned categories..
    assignedVideos.forEach(function(video, index) {

        // is video to be removed from playlist?
        const isToBeRemoved = videoIdsToBeRemoved.has((video.video_id).toString());
            
        // accumulate each category..
        assignedVideosClutter += `
                <span class='${isToBeRemoved ? `label-tag pending-delete` : `label-tag`}' key='${index}'>
                    ${video.title}
                    <span 
                        class="remove-topic js-remove-playlist-video" 
                        data-video-id="${video.video_id}"
                    >🗑</span>
                </span>  
        `;
    });

    // add to final html..
    modal.querySelector(".js-assigned-playlist-videos").innerHTML = assignedVideosClutter;
}

// () -> render the videos for view playlist modal..
function renderVideosOfPlaylist(modal, videoNames = [], videoIds = []) {

    // initially empty the videos html..
    modal.querySelector(".js-view-playlist-videos").innerHTML = "";

    // initial video clutter..
    let videoClutter = "";

    // iterate over the video-names
    videoNames.forEach(function(name, index) {

        // accumulate each video name to clutter..
        videoClutter += `
            <span 
                key="${index}"
                class="subcategory-chip"
                data-video-id="${videoIds[index]}"    
            >
                ${name}
            </span>
        `;
    });

    // add to final videos names html..
    modal.querySelector(".js-view-playlist-videos").innerHTML = videoClutter;
}

// () -> add form events for playlist..
function attachAddPlaylistFormEvents(modal) {

    // when the save button is clicked..
    modal.querySelector(".js-save-playlist-btn").onclick = function(event) {

        // handle save video..
        handleSavePlaylist(modal, event);
    }
}

// () -> attach the delete playlist modal events..
function attachDeletePlaylistModalEvents(modal) {

    // add click event to delete confirmation btn..
    modal.querySelector(".js-confirm-delete-playlist").onclick = function(event) {
        
        // handle playlist removal..
        handleDeletePlaylist(event, modal);
    };
}

// () -> search the videos..
function searchVideosForPlaylistSection(event, modal, modalType = "view", unAssignedVideos = []) {

    // check log..
    // console.log(event.target.value.trim(), modal);

    // check log..
    // console.log(unAssignedVideos);

    // get the available videos matching the entered text..
    const availableVideos = 
    modalType !== "view" 
        ?
    // when update modal
    unAssignedVideos.filter(video => video.title.includes(event.target.value.trim()))
        :
    // when normal view modal
    AdminStore.videos.filter(video => video.title.includes(event.target.value.trim()));

    // check log..
    // console.log(matchingCategories);

    // re-render the dropdown..
    renderVideosInDropDown(modal, availableVideos);
}

// () -> toggle the video selection..
function toggleVideoSelection(inputEl) {

    // check log..
    console.log(inputEl);

    // get the category id..
    const videoId = inputEl.dataset.categoryId;

    // update the state..
    selectedVideos.has(videoId) ? selectedVideos.delete(videoId) : selectedVideos.add(videoId);

    // check log..
    // console.log(selectedVideos);
}

// () -> handle save playlist data..
async function handleSavePlaylist(modal, event) {

    // restrict the reload behavior..
    event.preventDefault();

    // get the data..
    const nameEl = modal.querySelector(".js-playlist-name");
    const descriptionEl = modal.querySelector(".js-playlist-description");

    // get the videos to be assigned..
    const videosToBeAssigned = [...selectedVideos];

    // check log..
    console.log(nameEl.value.trim(), descriptionEl.value.trim(), AdminStore.currentUserId, videosToBeAssigned);

    // try to save the playlist..
    const savedResponse = await VideoAndPlaylistApi.addPlaylistWithVideos(
        nameEl.value.trim(),
        descriptionEl.value.trim(),
        AdminStore.currentUserId,
        videosToBeAssigned
    );

    // check log..
    console.log(savedResponse);

    // render the playlists again..
    const playlistsResponse = await VideoAndPlaylistApi.getPlaylists();

    // check log..
    // console.log(playlistsResponse);

    // update the state..
    AdminStore.playlists = playlistsResponse.data;

    // re-render the playlist listing..
    renderPlaylists();

    // show the toast..
    Toast.show({
       "title": savedResponse.status ? "Success" : "Error",
       "message": savedResponse.message,
       "type": savedResponse.status ? "success" : "error",
       "duration": 2800
    });

    // clear the texts..
    nameEl.value = "";
    descriptionEl.value = "";
    selectedVideos.clear();

    // close the modal..
    Modal.closeModal(event);
}

// () -> attach playlist action events..
function attachPlaylistActionEvents() {

    // attach click event on the playlist list element..
    document.querySelector(".js-playlists").onclick = handlePlaylistActions;
}

// () -> handle the playlist actions (view/ update/ delete)
function handlePlaylistActions(event) {

    // check when update (edit) icon is clicked..
    if(event.target.classList.contains("js-playlist-edit")) {

        // check log..
        // console.log("edit of playlist is initiated");

        // open the update modal..
        handleOpenUpdatePlaylistModal(event);
        return;
    }

    // check when view icon is clicked..
    if(event.target.classList.contains("js-playlist-view")) {

        // check log..
        // console.log("viewing of playlist is initiated");

        // open the view playlist modal. 
        handleOpenViewPlaylistModal(event);
        return;
    }

    // check when delete icon is clicked..
    if(event.target.classList.contains("js-playlist-delete")) {

        // check log..
        // console.log("deletion of playlist is initiated");

        // open the view playlist modal. 
        handleOpenDeletePlaylistModal(event);
        return;
    }
    return;
}

// () -> handle open edit/ update playlist modal..
function handleOpenUpdatePlaylistModal(event) {

    // clear the selected videos..
    selectedVideos.clear();
    videoIdsToBeRemoved.clear();

    // get the modal..
    const modal = document.querySelector("#updatePlaylistModal");

    // get the playlist id..
    const playlistId = event.target.dataset.playlistId;

    // get the playlist..
    const playlist = AdminStore.playlists.find(playlist => playlist.playlist_id == +playlistId);

    // check log..
    // console.log(playlist);

    // set the data..
    // Section 1.
    modal.querySelector(".js-playlist-update-name").value = playlist.name ?? "";
    modal.querySelector(".js-playlist-update-description").value = playlist.description ?? "";

    // set the id for updation..
    modal.querySelector(".js-update-playlist-id").value = playlistId ?? playlist.playlist_id;

    // attach update playlist form events..
    attachUpdatePlaylistModalEvents(modal);

    // Section 2.
    
    // render the videos in dropdown..
    renderVideosInDropDown(modal, getUnAssignedVideos(playlist.video_ids));

    // attach the drop down events..
    attachDropDownEvents(modal, getUnAssignedVideos(playlist.video_ids));

    // attach the checkbox events..
    attachCheckboxEvents(modal);

    // Section 3.
    // render the already assigned videos there..
    renderAssignedVideos(modal, getAssignedVideos(playlist.video_ids));

    // attach the already assigned (playlisted) videos events..
    attachAssignedVideoEvents(modal, getAssignedVideos(playlist.video_ids));

    // open the modal..
    Modal.openModal("updatePlaylistModal");
}

// () -> handle open view playlist modal..
function handleOpenViewPlaylistModal(event) {

    // modal to open..
    const modal = document.querySelector("#viewPlaylistModal");

    // get the playlist id..
    const playlistId = event.target.dataset.playlistId;

    // get the playlist..
    const playlist = AdminStore.playlists.find(playlist => playlist.playlist_id == +playlistId);

    // set the playlist details..
    modal.querySelector(".js-view-playlist-name").innerText = playlist.name ?? "-";
    modal.querySelector(".js-view-playlist-description").innerText = playlist.description ?? "-";
    modal.querySelector(".js-view-playlist-video-count").innerText = `${playlist.no_of_videos} Videos` ?? "-";

    // render the videos..
    renderVideosOfPlaylist(modal, playlist.video_titles, playlist.video_ids);

    // set the dates..
    modal.querySelector(".js-view-playlist-created-at").innerText = 
    playlist?.created_at 
    ?
    (new Date(playlist?.created_at).toDateString() + " " + new Date(playlist?.created_at).toLocaleTimeString()) 
    : 
    "-";
    modal.querySelector(".js-view-playlist-updated-at").innerText = 
    playlist?.updated_at 
    ?
    (new Date(playlist?.updated_at).toDateString() + " " + new Date(playlist?.updated_at).toLocaleTimeString()) 
    : 
    "-";

    // open the modal..
    Modal.openModal("viewPlaylistModal");
}

// () -> handle open delete playlist modal..
function handleOpenDeletePlaylistModal(event) {

    // modal to open..
    const modal = document.querySelector("#deletePlaylistModal");

    // playlist id..
    const playlistId = event.target.dataset.playlistId;

    // set the details..
    modal.querySelector(".js-delete-playlist-id").innerText = playlistId;

    // check log..
    // console.log(playlistId);

    // attach delete modal action events..
    attachDeletePlaylistModalEvents(modal);

    // open the modal..
    Modal.openModal("deletePlaylistModal");
}

// () -> get un-assigned videos
function getUnAssignedVideos(video_ids) {  

    // get the videos whose..
    return AdminStore.videos.filter(function(video, index) {

        // id ain't present in already assigned..
        return video && !video_ids.includes(video.video_id);
    });
}

// () -> get assigned videos..
function getAssignedVideos(video_ids) {  

    // get the videos whose..
    return AdminStore.videos.filter(function(video, index) {

        // id ain't present in already assigned..
        return video && video_ids.includes(video.video_id);
    });
}

// () -> attach the update Playlist modal events..
function attachUpdatePlaylistModalEvents(modal) {

    // attach click event to section 1's save playlist changes btn..
    modal.querySelector(".js-update-playlist-btn").onclick = function(event) {

        // handle update..
        handleUpdatePlaylist(modal, event);
    }

    // attach click event to section 2's add selected videos btn..
    modal.querySelector(".js-add-playlist-videos-btn").onclick = function(event) {

        // handle assignment of new categories..
        handleAddSelectedVideos(modal, event);
    }

    // attach click event to section 3's remove videos btn..
    modal.querySelector(".js-save-removed-playlist-videos-btn").onclick = function(event) {

        // handle removal of assigned categories..
        handleRemoveVideos(event, modal);
    }
}

// () -> attach the assigned videos events for (update playlist modal)
function attachAssignedVideoEvents(modal, assignedVideos = []) {

    // add click event..
    modal.querySelector(".js-assigned-playlist-videos").onclick = function(event) {

        // handle assigned videos in update playlist modal..
        handleAssignedVideos(event, modal, assignedVideos);
    }
}

// () -> handle already assigned videos in playlist..
function handleAssignedVideos(event, modal, assignedVideos) {

    // when bin icon is clicked..
    if(event.target.classList.contains("js-remove-playlist-video")) {

        // toggle the assigned videos..
        toggleAssignedVideos(event.target, modal, assignedVideos);
        return;
    }
    return;
}

// () -> toggle assigned already videos..
function toggleAssignedVideos(videoEl, modal, assignedVideos) {

    // check log..
    // console.log(videoEl);

    // get the category id..
    const videoId = videoEl.dataset.videoId;

    // save the video id..
    videoIdsToBeRemoved.has(videoId) ? videoIdsToBeRemoved.delete(videoId) : videoIdsToBeRemoved.add(videoId);

    // check log..
    // console.log(videoIdsToBeRemoved);

    // re-render the categories..
    renderAssignedVideos(modal, assignedVideos);
}

// () -> handle update playlist data..
async function handleUpdatePlaylist(modal, event) {

    // restrict the default behavior..
    event.preventDefault();

    // update the text..
    event.target.innerText = "saving..";

    // disable the button..
    event.target.setAttribute("disabled", "");

    // get the playlist details..
    const playlistId = modal.querySelector(".js-update-playlist-id").value.trim();
    const playlistName = modal.querySelector(".js-playlist-update-name").value.trim();
    const playlistDescription = modal.querySelector(".js-playlist-update-description").value.trim();

    // check log..
    // console.log(playlistName, playlistDescription, playlistId);

    // make the update..
    const updatedResponse =  await VideoAndPlaylistApi.updatePlaylist(
        playlistName,
        playlistDescription,
        playlistId
    );

    // check log..
    // console.log(updatedResponse);

    // show the toast..
    Toast.show({
       "title": updatedResponse.status ? "Success" : "Error",
       "message": updatedResponse.message,
       "type": updatedResponse.status ? "success" : "error",
       "duration": 2800
    });

    // after 2 seconds..
    setTimeout(function(){

        // close the modal..
        Modal.closeModal(event);

        // update the text..
        event.target.innerText = "Save Playlist Changes";

        // disable the button..
        event.target.removeAttribute("disabled");
    }, 2000);
}

// () -> handle selected videos..
async function handleAddSelectedVideos(modal, event) {

    // update the text..
    event.target.innerText = "playlisting..";

    // make button disabled..
    event.target.setAttribute("disabled", "");

    // get the playlist id..
    const playlistId = modal.querySelector(".js-update-playlist-id").value.trim();
    const videoIdsToBePlaylisted = [...selectedVideos];

    // check log..
    // console.log(modal.querySelector(".js-update-playlist-id").value.trim(), [...selectedVideos]);

    // handle playlisting..
    const playlistedResponse = await VideoAndPlaylistApi.assignVideosToPlaylist(videoIdsToBePlaylisted, playlistId);

    // again fetch the playlists..
    const response = await VideoAndPlaylistApi.getPlaylists();

    // update the state..
    AdminStore.playlists = response.data;

    // render the playlists again..
    renderPlaylists();

    // check log..
    // console.log(playlistedResponse);

    // show the toast..
    Toast.show({
       "title": playlistedResponse.status ? "Success" : "Error",
       "message": playlistedResponse.message,
       "type": playlistedResponse.status ? "success" : "error",
       "duration": 2800
    });
    
     // after 2 seconds close..
    setTimeout(function(){

        // close the modal..
        Modal.closeModal(event);

        // update the text again..
        event.target.innerText = "Add Selected Videos";

        // make the button enabled..
        event.target.removeAttribute("disabled");
    }, 2000);
}

// () -> handle removal of assigned videos..
async function handleRemoveVideos(event, modal) {

    // update the text..
    event.target.innerText = "removing..";

    // disable the button..
    event.target.setAttribute("disabled", "");

    // get the playlist id and videos ids to be removed from playlist..
    const playlistId = modal.querySelector(".js-update-playlist-id").value.trim();
    const videoIds = [...videoIdsToBeRemoved];

    // check log..
    // console.log(modal.querySelector(".js-update-playlist-id").value.trim(), [...videoIdsToBeRemoved]);

    // handle playlisting..
    const playlistResponse = await VideoAndPlaylistApi.unAssignVideosToPlaylist(videoIds, playlistId);

    // again fetch the playlists..
    const response = await VideoAndPlaylistApi.getPlaylists();

    // update the state..
    AdminStore.playlists = response.data;

    // render the playlists again..
    renderPlaylists();

    // check log..
    // console.log(playlistedResponse);

    // show the toast..
    Toast.show({
       "title": playlistResponse.status ? "Success" : "Error",
       "message": playlistResponse.message,
       "type": playlistResponse.status ? "success" : "error",
       "duration": 2800
    });

    // after 2 seconds close..
    setTimeout(function(){

        // close the modal..
        Modal.closeModal(event);

        // update the text again..
        event.target.innerText = "Remove Selected Videos";

        // make the button enabled..
        event.target.removeAttribute("disabled");
    }, 2000);
}

// () -> handle the deletion of playlist..
async function handleDeletePlaylist(event, modal) {

    // get the playlist id to remove..
    const playlistId = modal.querySelector(".js-delete-playlist-id").innerText.trim();

    // try to delete the playlist..
    const deleteResponse = await VideoAndPlaylistApi.deletePlaylist(playlistId);

    // after, again fetch playlists..
    const playlistsResponse = await VideoAndPlaylistApi.getPlaylists();

    // update the state..
    AdminStore.playlists = playlistsResponse.data;

    // render the playlists..
    renderPlaylists();

    // show the toast..
    Toast.show({
       "title": deleteResponse.status ? "Success" : "Error",
       "message": deleteResponse.message,
       "type": deleteResponse.status ? "success" : "error",
       "duration": 2800
    });

    // close the modal..
    Modal.closeModal(event);
}