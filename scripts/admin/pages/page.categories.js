// grab the modules..
import {AdminStore} from "/php_easy/scripts/admin/store.js";
import {manageCategoriesHTML} from "/php_easy/scripts/admin/templates/categories.html.js";
import {CategoriesApi} from "/php_easy/scripts/admin/apis/api.categories.js";
import {Modal} from "/php_easy/scripts/admin/modals/modals.js";

// initial state for selected parent..
let selectedParentCategory = {
    "name": null,
    "id": null,
};

// () -> render the categories..
function renderCategories() {

    // initially empty the html..
    document.querySelector(".js-category-items").innerHTML = "";

    // iterate over the categories..
    AdminStore.categories.forEach(function(category, index) {

        // accumulate to the html..
        document.querySelector(".js-category-items").innerHTML += `
        
            <div class="item1" key="${index}">
                <h3 class="t-op-nextlvl">1</h3>

                <h3 class="t-op-nextlvl">
                    ${category.parent_category_name}
                </h3>

                <h3 class="t-op-nextlvl">
                    ${category.created_at ?? "-"}
                </h3>

                <div class="actions js-categories-actions-group">
                    <span 
                        class="js-category-view"
                        data-categoryid="${category.parent_category_id}"
                    >👁️</span>
                    <span 
                        class="js-category-edit"
                        data-categoryid="${category.parent_category_id}"
                    >✏️</span>
                    <span 
                        class="js-category-delete"
                        data-categoryid="${category.parent_category_id}"
                    >🗑️</span>
                </div>
            </div>
        `;
    });
}

// () -> render the categories in drop-down..
function renderCategoriesInDropDown(modal, availableCategories = AdminStore.categories) {

    // when category is selected show in dropdown header/ bar..
    modal.querySelector(".selected-topics-text").innerHTML = 
    selectedParentCategory.id != null ? selectedParentCategory.name : "Select Category";

    // initially empty up the dropdown categories list..
    modal.querySelector(".js-category-list").innerHTML = "";

    // iterate over the topics available..
    availableCategories.forEach(function(category, index) {

        // accumulate each topic as with label and check box in dropdown list..
        modal.querySelector(".js-category-list").innerHTML += `
            <label key='${index}'>
                <input 
                    type="radio"
                    name="parent_category"
                    class="js-category-radio"
                    data-category-id="${category.parent_category_id}"
                    ${+selectedParentCategory?.id == category.parent_category_id ? 'checked' : ''}
                    > ${category.parent_category_name}
            </label>
        `;
    });
}

// () -> attach categories events..
function attachCategoriesEvents() {

    // attach the onclick event on open add category modal..
    document.querySelector(".js-open-add-categories-btn").onclick = handleOpenAddCategoryModal;
}

// () -> attach the dropdown events..
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

// () -> attach radio button events..
function attachRadioBtnEvents(modal) {

    // attach listender to parent div..
    modal.querySelector(".js-category-list").onclick = function(event) {

        // handle the radio events..
        handleRadioEvents(modal, event);
    };
}

// () -> attach input events..
function attachInputEvents(modal) {

    // add `input` event on sub category input el..
    modal.querySelector(".js-category-name-input").oninput = function(event) {

        // check input..
        handleCheckInput(modal, event, "js-add-category-btn");
    }

    // add `input` event on sub category input el..
    modal.querySelector(".js-sub-category-name-input").oninput = function(event) {

        // check input..
        handleCheckInput(modal, event, "js-add-sub-category-btn");
    }
}

// () -> search Categories..
function searchCategories(event, modal) {

    // check log..
    console.log(event.target.value.trim());

    // get the filtered categories..
    const availableCategories = 
    AdminStore.categories.filter(category => category.parent_category_name.includes(event.target.value.trim()));

    // render the dropdown again..
    renderCategoriesInDropDown(modal, availableCategories);
}

// () -> attach add categories action events.. (add category, add sub category)
function attachAddCategoryEvents(modal) {

    // attach the click events..
    modal.querySelector(".js-add-category-btn").onclick = handleNewCategoryAdd;
    modal.querySelector(".js-add-sub-category-btn").onclick = handleSubCategoryAdd;
}

// () -> handles the content for categories section..
export async function initManageCategories() {

    // update the HTML..
    document.querySelector(".main").innerHTML = manageCategoriesHTML;

    // get the categories..
    const response = await CategoriesApi.getCategories();

    // set the state..
    AdminStore.categories = response.data;

    // then, render the categories..
    renderCategories();

    // attach the events..
    attachCategoriesEvents();
}

// () -> handle open add category modal..
function handleOpenAddCategoryModal(event) {

    // get the modal to open..
    const modal = document.querySelector("#addCategoryModal");

    // initially disable the submit category/ sub-category button..
    modal.querySelector(".js-add-category-btn").setAttribute("disabled", "");
    modal.querySelector(".js-add-sub-category-btn").setAttribute("disabled", "");

    // render the categories in dropdown..
    renderCategoriesInDropDown(modal);

    // attach the dropdown events..
    attachDropDownEvents(modal);

    // attach radio button events..
    attachRadioBtnEvents(modal);

    // attach input events..
    attachInputEvents(modal);

    // attach action events..
    attachAddCategoryEvents(modal);

    // open the modal..
    Modal.openModal("addCategoryModal");
}

// () -> handle radio button events..
function handleRadioEvents(modal, event) {

    // check log..
    // console.log(event.target);

    // when radio is clicked..
    if(event.target.classList.contains("js-category-radio")) {

        // check log..
        // console.log(event.target.dataset.categoryId);

        // handle the category selection
        handleCategorySelection(modal, event);
        return;
    }

    // exit immediately..
    return;
}

// () -> handle category selection..
function handleCategorySelection(modal, event) {

    // get the category id..
    const categoryId = event.target.dataset.categoryId;
    const categoryName = event.target.nextSibling.data.trim();
    
    // update the state..
    selectedParentCategory = {...selectedParentCategory, "id": categoryId, "name": categoryName};

    // check log..
    // console.log(selectedParentCategory);

    // update the selected one..
    modal.querySelector(".selected-topics-text").innerText = `${selectedParentCategory?.name} is selected!`;
    return;
}

// () -> check input..
// for category and sub-category
function handleCheckInput(modal, event, buttonClass) {

    // check for input..
    // console.log(event.target.value);

    // when the input is empty!
    if(event.target.value.trim() === "") {

        // disable the save sub category button..
        modal.querySelector(`.${buttonClass}`).setAttribute("disabled", "");
    }

    // otherwise..
    else {

       // disable the save sub category button..
        modal.querySelector(`.${buttonClass}`).removeAttribute("disabled"); 
    }
} 

// () -> handle new category addon..
async function handleNewCategoryAdd(event) {

    // stop the default behavior..
    event.preventDefault();

    // check log..
    // console.log(event.target);

    // get the name of category..
    const nameEl = document.querySelector(".js-category-name-input");
    
    // check log..
    // console.log(nameEl.value.trim());

    // try to add category..
    const response = await CategoriesApi.addCategory(nameEl.value.trim());
    
    // check log..
    // console.log(response);

    // show the message from the response..
    document.querySelector(".js-response-toast").innerText = response.message;
    document.querySelector(".js-response-toast").style.color = response.status ? "green" : "red";

    // after about 1.8 seconds..
    setTimeout(async () => {

        // remove the message and color from el..
        document.querySelector(".js-response-toast").innerText = "";
        document.querySelector(".js-response-toast").style.color = "";

        // clear the texts..
        nameEl.value = "";

        // then fetch the categories again..
        const response = await CategoriesApi.getCategories();

        // and update the state..
        AdminStore.categories = response.data;

        // re-render things..
        renderCategories();
        renderCategoriesInDropDown(
            document.querySelector("#addCategoryModal"), 
            AdminStore.categories
        );

    }, 1800);

}

// () -> handle sub category addon..
async function handleSubCategoryAdd(event) {

    // stop the default behavior..
    event.preventDefault();

    // get the name of category..
    const subCategoryEl = document.querySelector(".js-sub-category-name-input");

    // get the parent's id..
    const parentId = selectedParentCategory["id"];
    
    // check log..
    // console.log(nameEl.value.trim());

    // try to add category..
    const response = await CategoriesApi.addCategory(
        subCategoryEl.value.trim(),
        parentId
    );

    // show the message from the response..
    document.querySelector(".js-sub-category-response-toast").innerText = response.message;
    document.querySelector(".js-sub-category-response-toast").style.color = response.status ? "green" : "red";

    // after about 1.8 seconds..
    setTimeout(async () => {

        // remove the message and color from el..
        document.querySelector(".js-sub-category-response-toast").innerText = "";
        document.querySelector(".js-sub-category-response-toast").style.color = "";

        // clear the texts..
        subCategoryEl.value = "";

        // then fetch the categories again..
        const response = await CategoriesApi.getCategories();

        // and update the state..
        AdminStore.categories = response.data;

        // re-render things..
        renderCategories();
        renderCategoriesInDropDown(
            document.querySelector("#addCategoryModal"), 
            AdminStore.categories
        );

    }, 1800);

    

    // check log..
    // console.log(response + " from sub cat add");

    // check log..
    // console.log(event.target);

    // after..
    // clear the texts..
    return;
}
