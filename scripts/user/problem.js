// grab the modules..
import {AuthActions} from "/php_easy/scripts/auth.js";
import {AdminStore} from "/php_easy/scripts/admin/store.js";
import {PrepApi} from "/php_easy/scripts/user/apis/apis.prep.js";
import {PlaygroundApi} from "/php_easy/scripts/user/apis/apis.playground.js";
import {Modal} from "/php_easy/scripts/admin/modals/modals.js";
import {Toast} from "/php_easy/scripts/common/toasts.js";

// when document is loaded..
window.addEventListener("load", async function(event) {

    // check log..
    // console.log("problem page loaded");

    // get the verification status..
    const verificationStatus = await AuthActions.verifyOnLoad();

    // if un-authorized..
    if (verificationStatus["message"] !== "authorized" || verificationStatus["status"] === false) {

        // redirect the client back to login page..
        window.location.href = `${window.location.origin}/php_easy/pages/auth/login.php`;
        return;
    }

    // set the admin state..
    AdminStore.setCurrentUserId(verificationStatus["user_id"]);

    // get the problem set..
    const response = await PrepApi.getProblemSet(problemId);

    // set the problem set data..
    AdminStore.problemSetData = response.data[0];

    // check log..
    // console.log(AdminStore.problemSetData);

    // load the problem view..
    loadProblemView();
});

// () -> render the problem details..
function renderProblemDetails() {

    // check log..
    // console.log(AdminStore.problemSetData);

    // set the problem name..
    document.querySelector(".problem-title").innerText = AdminStore.problemSetData.title ?? "";

    // set the problem difficulty..
    document.querySelector(".difficulty").innerText = AdminStore.problemSetData.difficulty ?? "";

    // set the class as difficulty of problem..
    document.querySelector(".difficulty").classList.remove("easy", "medium", "hard");
    document.querySelector(".difficulty").classList.add(AdminStore.problemSetData.difficulty);

    // show the number of attempts..
    document.querySelector(".attempts").classList.remove("attempts-above-three",);
    document.querySelector(".attempts").innerText = AdminStore.problemSetData.attempts ?? 0;
    AdminStore.problemSetData.attempts > 3 ?
        document.querySelector(".attempts").classList.add("attempts-above-three") :
        document.querySelector(".attempts").classList.remove("attempts-above-three");

    // show the accepted status..
    document.querySelector(".accepted").innerText = AdminStore.problemSetData.is_accepted === 1 ? "Yes" : "No";
    AdminStore.problemSetData.is_accepted === 1 ?
     document.querySelector(".accepted").classList.add("accepted-success") :
     document.querySelector(".accepted").classList.add("accepted-fail");


    // set the topics..
    document.querySelector(".topics").innerText = AdminStore.problemSetData.topic_names.join(" • ") ?? "No topics.";
    

    // set the problem description..
    document.querySelector(".problem-description").innerText = AdminStore.problemSetData.description ?? "";

    // set the i/o.
    document.querySelector(".problem-input-text").innerText = AdminStore.problemSetData.sample_input ?? "";
    document.querySelector(".problem-output-text").innerText = AdminStore.problemSetData.sample_output ?? "";

    // set the hints..
    document.querySelector(".problem-hints").innerText = AdminStore.problemSetData.hints ?? "";

    // set the code (if saved || cached)..
   const savedCode = localStorage.getItem(`#problem_${AdminStore.problemSetData.id}`);

   // code editor..
   const editor = document.querySelector(".code-editor");

   // show the code saved or starter code..
   editor.value = savedCode ?? AdminStore.problemSetData.starter_code ?? "// write code here";

//    console.log(AdminStore.problemSetData);
}


// () -> handle output section html..
function displayOutput(output = "", toClear = false) {

    // get the output el..
    const outputEl = document.querySelector("#output");
    // empty it.
    outputEl.innerHTML = "";

    // when output is to be cleared..
    if(toClear) return outputEl.innerHTML = "click on ▶ Run button";

    // attach the formatted output..
    if(output && output !== "" && toClear === false) {

        // show the output..    
        outputEl.innerHTML = output;
    }
    else {

        // show the output..
        outputEl.innerHTML = `No output.`;
    }
}

// () -> attach the page events..
function attachProblemDetailsEvents() {

    // add event to code editor input..
    document.querySelector(".code-editor").oninput = handleCodeCache;

    // add event to `run button`..
    document.querySelector(".run-btn").onclick = handleCodeRun;

    // add event to `submit button`..
    document.querySelector(".submit-btn").onclick = handleCodeSubmit;

    // add event to back button..
    document.querySelector(".js-back-button").onclick = handleRedirectBack;

}

// () -> load the problem view..
function loadProblemView() {

    // render the problem details..
    renderProblemDetails();

    // attach the events..
    attachProblemDetailsEvents();

    // check the problem id and user id..
    // console.log(AdminStore.problemSetData.id, AdminStore.currentUserId);
}

// () -> handle the code caching..
function handleCodeCache(event) {

    // store the user code..
    const code = event.target.value;

    // cache the code..
    cacheUserCode(code);
}

// () -> cache the user code..
function cacheUserCode(data) {

    // get the problem id
    const problemId = AdminStore.problemSetData.id;

    // save the code..
    localStorage.setItem(`#problem_${problemId}`, data);
}

// () -> handle code run..
async function handleCodeRun(event) {

    // update the text.
    event.target.innerText = "running..";

    // instantly disable it..
    event.target.setAttribute("disabled", "");

    // initial clear the output..
    displayOutput();

    // get the code typed..
    const codeEl = document.querySelector(".code-editor") ?? "";

    // get the trimmed value..
    const codeInput = codeEl ? codeEl.value.trim() : "";

    // check log..
    // console.log(codeInput);

    // send the code for execution..
    const execResponse = await PlaygroundApi.runCode(codeInput);

    // check log..
    console.log(execResponse);

    // show output..
    if(execResponse["std_out"].trim() !== "") {

        // show the output
        displayOutput(execResponse["std_out"]);

        // enable the submit button..
        document.querySelector(".submit-btn").hasAttribute("disabled") ? 
        document.querySelector(".submit-btn").removeAttribute("disabled") 
        : "";
    }
    else {

        // show err
        displayOutput(execResponse["std_err"]);

        // disable the submit button..
        document.querySelector(".submit-btn").setAttribute("disabled", "");
    }

    // after 1.5
    setTimeout(function() {

        // update the text..
        event.target.innerText = "Run ▶";

        // enable the button..
        event.target.removeAttribute("disabled");
    }, 1500);
}

// () -> handle code submission..
async function handleCodeSubmit(event) {

    // update the text.
    event.target.innerText = "submitting..";

    // instantly disable it..
    event.target.setAttribute("disabled", "");

    // get the code typed..
    const codeEl = document.querySelector(".code-editor");

    // get the trimmed value..
    const codeInput = codeEl ? codeEl.value.trim() : "";

    // check log..
    // console.log(codeInput);

    // send the code for execution..
    const execResponse = await PlaygroundApi.submitCode(codeInput, AdminStore.problemSetData.id);

    // check log..
    // console.log(execResponse);
    
    // show the toast
    Toast.show({
        "message": execResponse.message,
        "type": execResponse.status ? "success" : "info",
        "duration": 2800
    });

    // when test case(s) failed..
    if(!execResponse.status) {

        // get failed test cases..
        const failedTestCases = execResponse.results.filter(result => result.status === false);

        // initial failed test case clutter..
        let failedTestCaseClutter = "";

        failedTestCases.forEach(function(testCase, index) {

            // add the failed ones only..
            failedTestCaseClutter += `
                <p class="output-message">❌ failed</p>
                    <div class="failed-testcase">
                        <strong>Expected Output</strong>
                        <pre id="expected-output">${JSON.stringify(testCase.intended_result)}</pre>

                        <strong>Your Output</strong>
                        <pre id="actual-output">${JSON.stringify(testCase.actual_result)}</pre>
                    </div> 
            `;
        });

        // add to final output container..
        document.querySelector(".output-box").innerHTML = failedTestCaseClutter;
    } 
    // when pass..
    else {
        document.querySelector(".output-box").innerHTML = "🎉 Accepted — all test cases passed!";
    }

    // after submission get the data..
    const response = await PrepApi.getProblemSet(problemId);

    // set the problem set data..
    AdminStore.problemSetData = response.data[0];

    // render the data..
    renderProblemDetails();

    // after 1.5
    setTimeout(function() {

        // update the text..
        event.target.innerText = "Submit";

        // enable the button..
        event.target.removeAttribute("disabled");
    }, 1500);
}

// () -> handle redirect user back..
function handleRedirectBack(event) {

    // get the last viewed page..
    const lastView = sessionStorage.getItem("last_view");

    // when last viewed page is Practice..
    if (lastView === "Practice") {

        // go back to main shell
        window.location.href = "/php_easy/pages/user/index.php";

    } else {

        // fallback
        window.location.href = "/php_easy/pages/user/index.php";
    }
}