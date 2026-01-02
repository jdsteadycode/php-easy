// grab the modules..
import {AuthActions} from "/php_easy/scripts/auth.js";
import {AdminStore} from "/php_easy/scripts/admin/store.js";
import {LearnApi} from "/php_easy/scripts/user/apis/apis.learn.js";
import {Modal} from "/php_easy/scripts/admin/modals/modals.js";
import {Toast} from "/php_easy/scripts/common/toasts.js";
import { UserStore } from "/php_easy/scripts/user/store.js";

// () -> attach the concept tabs events..
function attachConceptTabsEvents() {
    // add click event..
    document.querySelector(".js-concept-tabs").onclick = handleConceptChange;
}

// when document is loaded..
window.addEventListener("load", async function(event) {

    // check log..
    // console.log("content page loaded");

    // get the parent category id..
    const parentCategoryId = new URLSearchParams(window.location.search).get("category_id");

    // check log..
    // console.log(parentCategoryId);

    // get the sub categories..
    const response = await LearnApi.getAllSubCategories(parentCategoryId);

    // check log..
    // console.log(response);

    // set the data..
    UserStore.subCategories = response.data;

    // load the content
    loadContent();
});

// () -> render the sub categories..
function renderSubCategories() {
    // sub categories tab el..
    const subCategoriesTabEl = document.querySelector(".js-concept-tabs");
    // empty it..
    subCategoriesTabEl.innerHTML = "";

    // initial sub category clutter..
    let clutter = "";

    // get the sub categories..
    UserStore.subCategories.forEach(function(category, index) {

        // load each sub category with html..
        clutter += `
            <button 
                class="concept-tab active js-concept-tab" 
                data-category-id="${category.id}"
            >
                ${category.name}
            </button>
        `;
    });

    // add final clutter to tabs html..
    subCategoriesTabEl.innerHTML = clutter;
}

// () -> render the content..
function renderSubCategoryContent() {

    // get the current category content object data..
    const categoryContentData = UserStore.subCategoryContent;

    // check log..
    // console.log(categoryContentData);

    // set the title..
    document.querySelector(".concept-title").innerText = categoryContentData.category_name ?? "No title available";

    // set the explanation..
    document.querySelector(".js-explanation-text").innerText = categoryContentData.description ?? "No explanation available.";

    // set the example..
    document.querySelector(".js-concept-example-text").innerText = categoryContentData.example_code ?? "No Code Available.";

    // set the notes..
    const notes = categoryContentData.notes ? 
    categoryContentData.notes.split(".") : "No notes available";

    // remove the end empty note text.
    const notesData = notes.slice(0, notes.length - 1);

    // get the notes container..
    const notesContainerEl = document.querySelector(".js-notes-container");
    // empty it..
    notesContainerEl.innerHTML = "";

    // create an li clutter
    let clutter = "";

    // iterate over the notes..
    notesData.forEach(function(note, index) {

        // check log
        // console.log(note);

        // add the note content in li..
       clutter += `
            <li key="${index}">${note}</li>
       `;
    });

    // add to final html..
    notesContainerEl.innerHTML = clutter;

    // set the references..
    // get references container..
    const resourcesListEl = document.querySelector(".js-resources-list");
    // empty it..
    resourcesListEl.innerHTML = "";

    // initial resources clutter..
    let resourceClutter = "";

    // iterarte over the resources available..
    const resourcesData = UserStore.subCategoryReferences;

    // iterate over the resources data..
    resourcesData.forEach(function(resource, index) {

        // accumulate each resource..
        resourceClutter += `
            <li>
                <a href="${resource.video_url}" target="_blank">
                    Youtube: ${resource.title}
                </a>
            </li>
        `;
    });

    // accumulate to final resources..
    resourcesListEl.innerHTML = resourceClutter;
}

// () -> load the content
async function loadContent() {

    // render the sub categoris in tabs..
    renderSubCategories();

    // check for first tab content child*
    // console.log(document.querySelector(".js-concept-tabs").children[0]);

    // get the first child category (content) id..
    const categoryId =  document.querySelector(".js-concept-tabs").children[0].dataset.categoryId;

    // check log..
    // console.log(categoryId);

    // get the content data related to sub category..
    const subCategoryContentResponse = await LearnApi.getSubCategoryContent(categoryId);

    // get the references data related to sub category..
    const subCategoryReferencesResponse = await LearnApi.getSubCategoryReferences(categoryId);

    // check log..
    // console.log(subCategoryReferencesResponse);

    // check log..
    // console.log(subCategoryContentResponse);

    // set the content (of subcategory / concept)
    UserStore.subCategoryContent = subCategoryContentResponse.data;

    // set the references (of subcategory / concept)
    UserStore.subCategoryReferences = subCategoryReferencesResponse.data;

    // load the content..
    renderSubCategoryContent();

    // attach tabs events..
    attachConceptTabsEvents();
}

// () -> handle concept change..
function handleConceptChange(event) {

    // when tab is clicked..
    if(event.target.classList.contains("js-concept-tab")) {

        // check log..
        // console.log(event.target.dataset.categoryId);

        // get the category id
        const categoryId = event.target.dataset.categoryId;

        // () -> change concept..
        changeCategory(categoryId);
    }
    return;
}

// () -> update the category content..
async function changeCategory(categoryId) {

    // get category content again..
    const contentResponse = await LearnApi.getSubCategoryContent(categoryId);

    // update the state..
    UserStore.subCategoryContent = contentResponse.data;

    // render the sub Category Content again..
    renderSubCategoryContent();
}