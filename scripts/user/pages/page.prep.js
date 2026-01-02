    // grab the modules..
    import {AdminStore} from "/php_easy/scripts/admin/store.js";
    import {prepHTML} from "/php_easy/scripts/user/templates/prep.html.js";
    import {PrepApi} from "/php_easy/scripts/user/apis/apis.prep.js";
    import {TopicsApi} from "/php_easy/scripts/admin/apis/api.topics.js";

  
    // () -> render the problem sets..
    function renderPrepData(filteredData = AdminStore.prepData) {

        // initial problemSetDifficulty..
        const problemsetSetsDifficulty = {};

        // get the html..
        const prepHTML = document.querySelector(".js-prep-paths");
        // remove content from it..
        prepHTML.innerHTML = "";

        // check log..
        // console.log(AdminStore.prepData);

        // initial clutter..
        let clutter = "";

        // iterate over the data..
        for(let data in filteredData) {

            // get the stats..
            const totalSolved = filteredData[data].filter(problem => problem.is_solved).length;
            const totalProblems = filteredData[data].length;
            const progressPercentage = Math.round(((totalSolved / totalProblems) * 100));

            // accumulate the clutter with problemset data..
            clutter += `
                <div class="prep-path" data-path-name=${data}>

                    <!-- PATH HEADER -->
                    <div class="path-header js-path-toggle">
                        <div class="path-info">
                            <h2 class="path-title">${data}</h2>
                            <p class="path-meta">
                               ${filteredData[data].length} problems 
                               • 
                               Progress: (${totalSolved} / ${totalProblems}) Solved
                            </p>
                            <div class="path-progress">
                                <div class="path-progress-bar" style="width: ${progressPercentage}%"></div>
                            </div>
                        </div>

                        <span class="path-toggle-icon">⌄</span>
                    </div>

                    <!-- PROBLEMS UNDER PATH -->
                    <div class="path-problems">

                        <!-- PROBLEM CARD -->
                        ${filteredData[data].map(function(problem, index) {

                            // count number of easy, hard, medium problems..
                            problemsetSetsDifficulty[problem.difficulty] ? 
                            problemsetSetsDifficulty[problem.difficulty]++ :
                            problemsetSetsDifficulty[problem.difficulty] = 1;
                            return (`
                               <div class="problem-card" data-problem-id="${problem.id}">
                                    <div class="problem-info">
                                        <h3 class="problem-title">${problem.title ?? "N/A"}</h3>
                                       <!-- <p class="problem-topic">Control Flow</p> -->
                                    </div>

                                    <div class="problem-meta">
                                        <span class="difficulty ${problem.difficulty}">
                                            ${problem.difficulty ?? "N/A"}
                                        </span>
                                        <span class="status ${problem.is_solved ? "solved" : "unsolved"}">
                                            ${problem.is_attempted ? "Attempted"
                                                 : 
                                                 problem.is_solved ? "✔ Solved" : "🆕 New"}
                                        </span>
                                        <button class="solve-btn" data-problem-id="${problem.id}">Solve →</button>
                                    </div>
                                </div> 
                            `);
                        }).join(" ")}
                    </div>
                </div>
            `;
        };

        // check log..
        // console.log(problemsetSetsDifficulty);

        // update the difficulty labels..
        document.querySelector(".prep-stats").innerHTML = `
            <div class="prep-stats">
                <span>🟢 Easy: ${problemsetSetsDifficulty["easy"] ?? 0}</span>
                <span>🟡 Medium: ${problemsetSetsDifficulty["medium"] ?? 0}</span>
                <span>🔴 Hard: ${problemsetSetsDifficulty["hard"] ?? 0}</span>
            </div>
        `;

        // add to final html..
        prepHTML.innerHTML = clutter;
    }

    // () -> attach the prep events..
    function attachPrepEvents() {

        // attach the event to solve button..
        document.querySelector(".js-prep-paths").onclick = handlePrepEvents;

        // attach search button event..
        document.querySelector(".filter-search").oninput = handleSearchProblems;

        // attach difficulty section events..
        document.querySelector(".filter-left").onclick = handleDifficultyFilter;
    }

    // () -> manage preparation (problem sets) page..
    export async function initPrep() {

        // show the topics html (view)..
        document.querySelector(".main").innerHTML = prepHTML;

        // get the problemset data..
        const response = await PrepApi.getProblemSets();

        // get all topics available..
        const topicsResponse = await TopicsApi.getTopics();

        // update the state..
        AdminStore.prepData = response.data;

        // check log..
        // console.log(AdminStore.prepData);

        // render the prep data (problem sets)
        renderPrepData();

        // attach the events..
        attachPrepEvents();
    }

    // () -> handle the page events..
    function handlePrepEvents(event) {

        // when toggle button is clicked..
        if(event.target.classList.contains("js-path-toggle")) {
            
            // check log
            // console.log("clicked");

            // handle problem view..
            // handleProblemView(event.target);

            // go for paths list element..
            // console.log(event.target.parentElement);

            // toggle the open/ closing of paths
            event.target.parentElement.querySelector(".path-problems").classList.toggle("collapsed");
            return;
        }

        // when the view problem..
        if(event.target.classList.contains("solve-btn")) {
            
            // check log
            console.log("clicked");

            // handle problem view..
            handleProblemView(event.target);
            return;
        }
        return;
    }

    // () -> handle view problem..
    function handleProblemView(btn) {

        // get the origin..
        const origin = window.origin;

        // initial folder..
        const path = "php_easy/pages/user/problem.php";

        // check log..
        // console.log(btn.dataset.problemId);

        // get the current problem id..
        const problemId = btn.dataset.problemId;

        // set the history
        sessionStorage.setItem("last_view", "Practice");

        // redirect the client to new page..
        window.location.href = `${origin}/${path}?p_id=${problemId}`;
    }

    // () -> hanlde search problems..
    function handleSearchProblems(event) {

        // check log..
        // console.log(event.target.value.trim());

        // filter the problems..
        const filteredProblems = filterBySearch(event.target.value.trim());

        // render the problems..
        renderPrepData(filteredProblems);
    }

    // () -> filter by search
    function filterBySearch(searchText) {
        // initial path..
        let result = {};

        // iterate over the data..
        for(let path in AdminStore.prepData) {

            // get the problems which match difficulty
            const availableProblems = AdminStore.prepData[path].filter(problem => problem.title.toLowerCase().includes(searchText.toLowerCase()));

            // only keep paths which have problems after filtering..
            if(availableProblems.length > 0) {
                result[path] = availableProblems;
            }
        }

        return result;
    }

    // () -> filter by difficulty
    function filterByDifficulty(difficultyText) {
        
        // initial path..
        let result = {};

        // iterate over the data..
        for(let path in AdminStore.prepData) {

            // get the problems which match difficulty
            const matchedProblems = AdminStore.prepData[path].filter(problem => problem.difficulty === difficultyText.toLowerCase());

            // only keep paths which have problems after filtering..
            if(matchedProblems.length > 0) {
                result[path] = matchedProblems;
            }
        }

        return result;
    }

    // () -> handle difficulty filters..
    function handleDifficultyFilter(event) {

        // remove active from all buttons
        document.querySelectorAll(".filter-btn")
            .forEach(btn => btn.classList.remove("active"));

        // check when filter button is clicked..
        if(event.target.classList.contains("filter-btn")) {

            // check log..
            console.log(event.target.innerText);

            // update the active state..
            event.target.classList.add("active");

            if(event.target.innerText === "All") {

                // all problems..
                renderPrepData();
                return;
            }

            // get matching ones..
            const filteredData = filterByDifficulty(event.target.innerText);

            // render the problems accordingly..
            renderPrepData(filteredData);
        }
        return;
    }