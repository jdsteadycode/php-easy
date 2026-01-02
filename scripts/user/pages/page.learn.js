    // grab the modules..
    // import {AdminStore} from "/php_easy/scripts/admin/store.js";
    import {UserStore} from "/php_easy/scripts/user/store.js";
    import {learnHTML} from "/php_easy/scripts/user/templates/learn.html.js";
    import {LearnApi} from "/php_easy/scripts/user/apis/apis.learn.js"
    import {Toast} from "/php_easy/scripts/common/toasts.js";
    import {AuthActions} from "/php_easy/scripts/auth.js";
    import {Modal} from "/php_easy/scripts/admin/modals/modals.js";

    // () -> render concepts (categories) ui..
    function renderConcepts() {

        // get the html..
        const categoriesHTML = document.querySelector(".js-learn-concepts");
        // empty it..
        categoriesHTML.innerHTML = "";

        // get the data.
        const categories = UserStore.categories;

        // initial categories clutter..
        let clutter = "";

        // iterate over the data..
        categories.forEach(function(category, index) {

            // accumulate the categories clutter..
            clutter += `
                <div class="learn-card" key=${index}>
                    <h3>${category.name}</h3>
                    <button class="learn-btn js-learn-btn" data-category-id="${category.id}">Explore →</button>
                </div>
            `;
        });

        // add the final html..
        categoriesHTML.innerHTML = clutter;
    }

    // () -> attach concepts page events..
    function attachPageEvents() {

        // event to concepts container..
        document.querySelector(".js-learn-concepts").onclick = handleConceptClick;
    }

    // () -> manage learn page..
    export async function initLearn() {

        // show the topics html (view)..
        document.querySelector(".main").innerHTML = learnHTML;

        // grab the categories..
        const categoriesResponse = await LearnApi.getAllCategories();

        // check log..
        // console.log(categoriesResponse);

        // set the data..
        UserStore.categories = categoriesResponse.data;

        // render the categories (concepts)
        renderConcepts();

        // attach the events..
        attachPageEvents();
    }

    // () -> handle concept click..
    function handleConceptClick(event) {
        // check if explore button is clicked..
        if(event.target.classList.contains("js-learn-btn")) {

            // handle redirect to content page..
            handleRedirectToContentPage(event.target);
            return; 
        }
        return;
    }

    // () -> handle redirection to content page..
    function handleRedirectToContentPage(btn) {

        // get the category id (parent category)..
        const categoryId = btn.dataset.categoryId;

        // check log..
        console.log(categoryId);

        // craft the location..
        const redirectLocation = `${window.origin}/php_easy/pages/user/concept.php?category_id=${categoryId}`;

        // redirect the user..
        window.location.href = redirectLocation;
    }