// grab the modules..
import {AdminStore} from "/php_easy/scripts/admin/store.js";
import {manageCategoriesHTML} from "/php_easy/scripts/admin/templates/categories.html.js";
import {CategoriesApi} from "/php_easy/scripts/admin/apis/api.categories.js";
import {Modal} from "/php_easy/scripts/admin/modals/modals.js";
import {Toast} from "/php_easy/scripts/common/toasts.js";


// initial state for selected parent..
let selectedParentCategory = {
    "name": null,
    "id": null,
};

// () -> render the categories..
function renderCategories() {

    // initially empty the html.
    const items = document.querySelector(".js-category-items");
    if(items) document.querySelector(".js-category-items").innerHTML = "";

    // iterate over the categories..
    AdminStore.categories.forEach(function(category, index) {

        // accumulate to the html..
        items.innerHTML += `
            <div class="item1" key="${index}">
                <h3 class="t-op-nextlvl">1</h3>

                <h3 class="t-op-nextlvl">
                    ${category.parent_category_name}
                </h3>

                <h3 class="t-op-nextlvl">
                    ${new Date(category.created_at).toDateString() ?? "-"}
                </h3>

                <div class="actions js-categories-actions-group">
                    <span 
                        class="js-category-view"
                        data-parentcategoryid="${category.parent_category_id}"
                    >👁️</span>
                    <span 
                        class="js-category-edit"
                        data-parentcategoryid="${category.parent_category_id}"
                    >✏️</span>
                    <span 
                        class="js-category-delete"
                        data-parentcategoryid="${category.parent_category_id}"
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

// () -> render the sub categories for update category modal form..
function renderUpdateCategorySubCategories(modal, data) {

    // empty the html (for sub categories update)
    modal.querySelector(".js-existing-sub-categories").innerHTML = "";

    // initial edit sub categories clutter/ template..
    let subCategoriesClutter = "";

    // iterate over the sub-categories..
    data.child_categories.forEach(function(subCategory, index) {

        // accumulate each sub category..
        subCategoriesClutter += `
            <span 
                class="sub-category-edit">
                <p>${subCategory}</p>
                <span 
                    class="actions js-edit-sub-category" 
                    data-sub-category-id="${data.child_categories_ids[index]}"
                    data-mode="edit"
                >
                ✒️
                </span>
            </span>
        `;
    });

    // add the the html..
    modal.querySelector(".js-existing-sub-categories").innerHTML = subCategoriesClutter;
}

// () -> attach categories events..
function attachCategoriesEvents() {

    // attach the onclick event on open add category modal..
    document.querySelector(".js-open-add-categories-btn").onclick = handleOpenAddCategoryModal;

    // attach categories action events..
    const items = document.querySelector(".js-category-items");
    if(items) items.onclick = handleCategoryActions;
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
    modal.querySelector(".js-add-sub-category-btn").onclick = function(event) {

        // handle the sub category add for (add category form)
        handleSubCategoryAdd(
            modal,
            event
        );
    };
}

// () -> attach update category modal action events..
function attachUpdateCategoryEvents(modal) {

    // attach the click events..
    modal.querySelector(".js-update-parent-category-btn").onclick = function(event) {

        // handle the update parent category..
        handleParentCategoryUpdate(modal, event);
    }
    modal.querySelector(".js-add-sub-category-btn").onclick = function(event) {

        // handle the update parent category..
        handleSubCategoryAdd(modal, event, "edit");
    }

    modal.querySelector(".js-existing-sub-categories").onclick = function(event) {

        // handle the edit action..
        handleEditSubCategory(modal, event.target);
    }
}

// () -> attach delete category modal action events..
function attachDeleteCategoryModalEvents(modal) {
    
    // add the listener to delete btn..
    modal.querySelector(".js-confirm-delete-category").onclick = function(event) {

      // add delete handler..
      handleDeleteCategory(modal, event);
    };
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

// () -> handle category actions..
function handleCategoryActions(event) {

    // check log..
    // console.log(event.target);

    // when view category action is clicked..
    if(event.target.classList.contains("js-category-view")) {

        // check log..
        // console.log("parent category view is initiated..");

        // open the view category modal..
        handleOpenViewCategoryModal(event);
        return;
    }

    // when update/ edit catgory action is clicked..
    if(event.target.classList.contains("js-category-edit")) {

        // check log..
        // console.log(event.target);

        // open the edit/ update category modal..
        handleOpenEditCategoryModal(event);
        return;
    }

    // when delete category action is clicked..
    if(event.target.classList.contains("js-category-delete")) {

        // check log..
        // console.log(event.target);

        // open the Delete category modal..
        handleOpenDeleteCategoryModal(event);
        return;
    }


    return;
}

// () -> handle open view category modal..
function handleOpenViewCategoryModal(event){

    // check log..
    // console.log("view category modal");

    // set the modal..
    const modal = document.querySelector("#viewCategoryModal");

    // get the category id..
    const parentCategoryId = event.target.dataset.parentcategoryid;

    // check log..
    // console.log(parentCategoryId);

    // get the category data..
    const category = AdminStore.categories.find(category => category.parent_category_id == +parentCategoryId);

    // check log the current category..
    // console.log(category);

    // set the data..

    // basic info
    modal.querySelector(".js-category-name").innerText = category.parent_category_name ?? "-";

    // date info..
    // created on..
    modal.querySelector(".js-category-created-at").innerText =
    category.created_at 
    ?
    (new Date(category.created_at).toDateString() + " " + new Date(category.created_at).toLocaleTimeString())
    :
    "-";

    // updated on..
    modal.querySelector(".js-category-updated-at").innerText =
    category.updated_at 
    ?
    (new Date(category.updated_at).toDateString() + " " + new Date(category.updated_at).toLocaleTimeString())
    :
    "-";

    // sub categories details..
    // intially empty it..
    modal.querySelector(".js-subcategory-list").innerHTML = "";

    // initial sub categories skeletion (html)..
    let subCategoriesClutter = "";

    // when sub-categories are available..
    category.child_categories.forEach(function(subCategory, index) {

        // accumulate each sub category in the clutter..
        subCategoriesClutter += `
            <span 
                class="subcategory-chip" key='${index}' 
                data-subcategory-id=${category.child_categories_ids[index]}
            >
                🔖 ${subCategory}
            </span>
        `;
    });

    // add to final html..
    modal.querySelector(".js-subcategory-list").innerHTML = subCategoriesClutter;

    // when no sub-categories for the given parent..
    document.querySelector(".js-no-subcategories").innerHTML = 
    category.child_categories.length == 0 ? 
    "No sub categories found"
     : 
    "";

    // open the modal..
    Modal.openModal("viewCategoryModal");
 }

// () -> handle open edit/ manage category modal..
function handleOpenEditCategoryModal(event) {

    // get the modal..
    const modal = document.querySelector("#updateCategoryModal");

    // check log the data..
    // console.log(event.target.dataset.parentcategoryid);

    // grab the category id..
    const categoryId = event.target.dataset.parentcategoryid;

    // get the category data..
    const category = AdminStore.categories.find(category => category.parent_category_id == +categoryId);

    // check log..
    // console.log(category);

    // set the data for update..
    // Section 1
    // parent category id 
    modal.querySelector(".js-update-parent-category-id").value = categoryId ?? "";
    // parent category name
    modal.querySelector(".js-update-parent-category-name").value = category.parent_category_name ?? "";

    // Section 3

    // render the sub-categories..
    renderUpdateCategorySubCategories(modal, category);

    // when none of sub-categories found..
    modal.querySelector(".js-no-existing-sub-categories").innerHTML = 
    category.child_categories == 0 ? "No sub categories found" : "";

    // attach the update category events..
    attachUpdateCategoryEvents(modal);

    // open the modal..
    Modal.openModal("updateCategoryModal");
}

// () -> handle open remove/ delete category modal..
function handleOpenDeleteCategoryModal(event) {

    // check log..
    // console.log(event.target);

    // open the delete category model..
    const modal = document.querySelector("#deleteCategoryModal");

    // set the id for deletion..
    modal.querySelector(".js-delete-category-id").value = event.target.dataset.parentcategoryid;

    // attach the delete category modal events..
    attachDeleteCategoryModalEvents(modal);

    // open up the modal..
    Modal.openModal("deleteCategoryModal");
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

    // show the toast
    Toast.show({
       "title": response.status ? "Success" : "Error",
       "message": response.message,
       "type": response.status ? "success" : "error",
       "duration": 2800
    }); 

   
    // clear the texts..
    nameEl.value = "";

    // then fetch the categories again..
    const categoriesResponse = await CategoriesApi.getCategories();

    // and update the state..
    AdminStore.categories = categoriesResponse.data;

    // re-render things..
    renderCategories();

    // do re-render the dropdown..
    renderCategoriesInDropDown(
        document.querySelector("#addCategoryModal"), 
        AdminStore.categories
    );

    return;
}

// () -> handle sub category addon..
async function handleSubCategoryAdd(
    modal,
    event,
    actionType = "add"
) {

    // stop the default behavior..
    event.preventDefault();

    // get the name of category..
    const subCategoryEl = 
     actionType === "add" ?
     modal.querySelector(".js-sub-category-name-input") 
     : 
     // for update form
     modal.querySelector(".js-new-sub-category-name");

    // get the parent's id..
    const parentId = 
    actionType === "add" ?
    selectedParentCategory["id"]
    :
    // for update form
    modal.querySelector(".js-update-parent-category-id").value.trim();
    
    // check log..
    // console.log(actionType, parentId, subCategoryEl.value.trim());

    // try to add category..
    const response = await CategoriesApi.addCategory(
        subCategoryEl.value.trim(),
        parentId
    );

    // show the toast
    Toast.show({
       "title": response.status ? "Success" : "Error",
       "message": response.message,
       "type": response.status ? "success" : "error",
       "duration": 2800
    }); 

    // clear the texts..
    subCategoryEl.value = "";

    // then fetch the categories again..
    const categoriesResponse = await CategoriesApi.getCategories();

    // and update the state..
    AdminStore.categories = categoriesResponse.data;

    // re-render things..
    renderCategories();

    //..
    // for update category form..
    // get the data of the parent..
    let data = null;
    
    // when action type is other than add (edit/ update)
    if(actionType !== "add") {

        // get the data..
        data = AdminStore.categories.find(category => category.parent_category_id == +(modal.querySelector(".js-update-parent-category-id").value.trim()))
    }
    
    // for add category form..
    actionType === "add" 
    ? 
    renderCategoriesInDropDown(
        document.querySelector("#addCategoryModal"), 
        AdminStore.categories
    ) 
    :
    // when in update categories modal 
    renderUpdateCategorySubCategories(modal, data);

    // check log..
    // console.log(response + " from sub cat add");

    // check log..
    // console.log(event.target);

    // after..
    // clear the texts..
    return;
}

// () -> handle updation of parent category..
async function handleParentCategoryUpdate(modal, event) {

    // get the update data..
    const parentId = modal.querySelector(".js-update-parent-category-id").value.trim();

    // name of parent category (updated name)
    const parentCategoryName = modal.querySelector(".js-update-parent-category-name").value.trim();

    // check log..
    // console.log(parentId, parentCategoryName);

    // make an update
    const response = await CategoriesApi.updateCategory(
        parentCategoryName,
        parentId
    );

    // check log..
    // console.log(response);

    // show the toast..
    Toast.show({
        "title": response.status ? "Success" : "Error",
        "message": response.message,
        "type": response.status ? "success" : "error",
        "duration": 2800
    });

    // then fetch the categories again..
    const categoriesResponse = await CategoriesApi.getCategories();

    // and update the state..
    AdminStore.categories = categoriesResponse.data;

    // re-render things..
    renderCategories();
    return;
}

// () -> handle update sub category event..
async function handleEditSubCategory(modal, btn) {

    // check when sub category label area is clicked..
    if(btn.classList.contains("js-edit-sub-category")) {

        // check log..
        // console.log(btn.innerText.trim());

        // get the current mode..
        let mode = btn.dataset.mode;

        // when mode is edit..
        if(mode === "edit") {

            // update the state..
            btn.dataset.mode = "save";
            btn.innerText = "✔️";
            
            // check log.. (content from previous element)
            // console.log(btn.previousElementSibling.firstChild.data);
            // console.log(btn.previousElementSibling);

            // previous element..
            const previousElem = btn.previousElementSibling;

            // an new input element
            const inputElem = document.createElement("input");

            // set the input value..
            inputElem.value = btn.previousElementSibling.textContent;

            // add just above btn..
            btn.parentNode.insertBefore(inputElem, btn);

            // remove the previous (p tag)
            previousElem.remove();
        }

        // when mode is save the update..
        else {

            // update the state..
            btn.dataset.mode = "edit";
            btn.innerText = "✒️";

            // check log.. (content from previous element)
            // console.log(btn.previousElementSibling.firstChild.data);
            // console.log(btn.previousElementSibling);

            // get the previous Element.
            const previousElem = btn.previousElementSibling;

            // create a new paragraph element..
            const paraElem = document.createElement("p");

            // check log..
            // console.log(previousElem.value.trim(), btn.dataset.subCategoryId);   

            // set the data to update..
            const categoryId = btn.dataset.subCategoryId;
            const categoryName = previousElem.value.trim();

            // make an update..
            const response = await CategoriesApi.updateCategory(
                categoryName,
                categoryId
            );

            // show the toast..
            Toast.show({
              "title": response.status ? "Success" : "Error",
              "message": response.message,
              "type": response.status ? "success" : "error",
              "duration": 2800
            }); 

            // get the categories again..
            const categoriesResponse = await CategoriesApi.getCategories();

            // and update the state..
            AdminStore.categories = categoriesResponse.data;

            // re-render things..
            renderCategories();

            // set the text..
            paraElem.innerText = previousElem.textContent || previousElem.value.trim();

            // add just before the btn elem..
            btn.parentNode.insertBefore(paraElem, btn);

            // remove the previous Element..
            previousElem.remove();
        }

        // exit..
        return;
    }
    // exit..
    return;
}

// () -> handle deletion of category..
async function handleDeleteCategory(modal, event) {

    // get the id for deletion..
    const categoryId = modal.querySelector(".js-delete-category-id").value.trim();

    // check log..
    // console.log(categoryId);

    // make the category delete..
    const response = await CategoriesApi.deleteCategory(categoryId);

    // check log..
    // console.log(response);

    // show the toast..
    Toast.show({
        "title": response.status ? "Success" : "Error",
        "message": response.message,
        "type": response.status ? "success" : "error",
        "duration": 2800
    }); 

    // get the categories again..
    const categoriesResponse = await CategoriesApi.getCategories();

    // and update the state..
    AdminStore.categories = categoriesResponse.data;

    // re-render things..
    renderCategories();

    // after, close the modal..
    Modal.closeModal(event);
}