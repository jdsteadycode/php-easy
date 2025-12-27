<!-- php for handling dynamic code -->
<?php
    // check the current page..
    $currentPageUrl = $_SERVER["REQUEST_URI"];

    // check log..
    // var_dump($currentPage);

    // handle view / page load..
    function viewType(string $currentUrl) {
        // initial view..
        $view = "";

        // check if current uri is admin page..
        if(str_contains($currentUrl, "/user/")) {

            // update view..
            $view = "user";
        } 
        else if(str_contains($currentUrl, "/admin/")) {
            
            // update view..
            $view = "admin";
        }

        // get the view..
        return $view;
    }

    // initial nav options
    function renderNavOptions(string $pageView) {

        // initial html for nav options..
        $navOptions = "";

        if($pageView === "admin") {

            // set navoptions for admin..
            $navOptions = <<<HTML
                <div class="nav-option option1 nav-option-active">
                    <span class="nav-emoji"> 📑 </span>
                    <h3>Dashboard</h3>
                </div>

                <div class="option2 nav-option">
                    <span class="nav-emoji"> 🗒 </span>
                    <h3>Manage Topics</h3>
                </div>

                <div class="nav-option option3">
                    <span class="nav-emoji"> 📚 </span>
                    <h3>Manage Categories</h3>
                </div>

                <div class="nav-option option4">
                    <span class="nav-emoji"> 🎞 </span>
                    <h3>Manage Videos / Playlists</h3>
                </div>

                <div class="nav-option option5">
                    <span class="nav-emoji"> 📄 </span>
                    <h3>Manage Problem Sets</h3>
                </div>

                <div class="nav-option option5">
                    <span class="nav-emoji"> 👦🏻 </span>
                    <h3>Manage Users</h3>
                </div>
            HTML;
        }
        else if($pageView === "user") {

            // set navoptions for admin..
            $navOptions = <<<HTML
                <div class="nav-option option1 nav-option-active">
                    <span class="nav-emoji"> 📑 </span>
                    <h3>Playground</h3>
                </div>

                <div class="option2 nav-option">
                    <span class="nav-emoji"> 🗒 </span>
                    <h3>Practice</h3>
                </div>
            HTML;
        }

        // get the navOptions html..
        return $navOptions;
    }

    // get the view..
    $view = viewType($currentPageUrl);

    // get the current nav-options-html.
    $navOptionsHtml = renderNavOptions($view) 
?>

<!-- initial html for navContainer -->
<div class="navcontainer">
    <nav class="nav">
        <div class="nav-upper-options">
            
            <!-- render the navoptions accordingly -->
            <?= $navOptionsHtml ?>

            <div class="nav-option option6">
                <!-- <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183320/4.png"
                            class="nav-img" alt="settings" /> -->

                <span class="nav-emoji"> ⚙️ </span>
                <h3>Settings</h3>
            </div>

            <div class="nav-option logout">
                <!-- <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210183321/7.png"
                            class="nav-img" alt="logout" /> -->

                <span class="nav-emoji"> ⛓️‍💥 </span>
                <h3>Logout</h3>
            </div>
        </div>
    </nav>
</div>

