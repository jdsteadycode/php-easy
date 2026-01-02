// grab the modules..
import { AdminStore } from "/php_easy/scripts/admin/store.js";
import { playgroundHTML } from "/php_easy/scripts/user/templates/playground.html.js";
import {PlaygroundApi} from "/php_easy/scripts/user/apis/apis.playground.js";
import { Toast } from "/php_easy/scripts/common/toasts.js";
import { AuthActions } from "/php_easy/scripts/auth.js";
import { Modal } from "/php_easy/scripts/admin/modals/modals.js";

// () -> attach the playground page events..
function attachPlaygroundEvents() {

    // attach event to `run` button..
    document.querySelector(".js-run-code").onclick = handleCodeRun;

    // attach event to `clear` button..
    document.querySelector(".js-clear-output").onclick = handleCodeOutputClear;
}

// () -> manage playground page..
export function initPlayground() {
  // show the plaground html (view)..
  document.querySelector(".main").innerHTML = playgroundHTML;

  // attach events..
  attachPlaygroundEvents();
}

// () -> handle output section html..
function displayOutput(output = "", toClear = false) {

    // get the output el..
    const outputEl = document.querySelector(".js-output");
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

// () -> handle code run..
async function handleCodeRun(event) {

    // update the text.
    event.target.innerText = "running..";

    // instantly disable it..
    event.target.setAttribute("disabled", "");

    // get the code typed..
    const codeEl = document.querySelector(".js-code-input") ?? "";

    // get the trimmed value..
    const codeInput = codeEl ? codeEl.value.trim() : "";

    // check log..
    // console.log(codeInput);

    // send the code for execution..
    const execResponse = await PlaygroundApi.runCode(codeInput);

    // check log..
    // console.log(execResponse);

    // show output..
    if(execResponse["execution_status"] === "success") {

        // show the output
        displayOutput(execResponse["std_out"]);
    }
    else {

        // show the error
        displayOutput(execResponse["std_err"]);
    }

    // after 1.5
    setTimeout(function() {

        // update the text..
        event.target.innerText = "▶ Run";

        // enable the button..
        event.target.removeAttribute("disabled");
    }, 1500);
}

// () -> handle code output clear..
function handleCodeOutputClear(event) {

    // clear the output..
    displayOutput("", true);
}