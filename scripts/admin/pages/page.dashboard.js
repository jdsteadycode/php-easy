// check log..
// console.log("dashboard page ui loaded..");

// grab the modules..
import {dashboardHTML} from "../templates/dashboard.html.js";

// () -> load the dashboard related stuff..
export function initManageDashboard() {

    // load the html..
    document.querySelector(".main").innerHTML = dashboardHTML;
}