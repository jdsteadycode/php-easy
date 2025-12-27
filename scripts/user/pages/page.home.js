    // grab the modules..
    import {AdminStore} from "/php_easy/scripts/admin/store.js";
    import {homeHTML} from "/php_easy/scripts/user/templates/home.html.js";
    import {Toast} from "/php_easy/scripts/common/toasts.js";
    import {AuthActions} from "/php_easy/scripts/auth.js";
    import {Modal} from "/php_easy/scripts/admin/modals/modals.js";
  

    // () -> manage home page..
    export function initHome() {

        // show the topics html (view)..
        document.querySelector(".main").innerHTML = homeHTML;
    }

   