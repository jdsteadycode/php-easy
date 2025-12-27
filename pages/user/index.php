<?php
    // load the config
    require_once("../../config/config.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phpeasy - play 'n' practice</title>

    <!-- grab the styles -->
    <link 
        rel="stylesheet"
        href="/php_easy/styles/admin/style.css?v=<?php echo time(); ?>"
    />

    <!-- grab the home css -->
    <link 
        rel="stylesheet"
        href="/php_easy/styles/user/contents/home.css?v=<?php echo time(); ?>"
    />

    <!-- grab the prep css -->
    <link 
        rel="stylesheet"
        href="/php_easy/styles/user/contents/prep.css?v=<?php echo time(); ?>"
    />

    <!-- grab the playground css -->
    <link 
        rel="stylesheet"
        href="/php_easy/styles/user/contents/playground.css?v=<?php echo time(); ?>"
    />

    <!-- for auth css -->
    <link 
        rel="stylesheet"
        href="/php_easy/styles/auth/logout.css?v=<?php echo time(); ?>"
    />

    <!-- for modals css -->
    <link 
        rel="stylesheet"
        href="/php_easy/styles/admin/modals.css?v=<?php echo time(); ?>"
    />

    <!-- for toasts css -->
     <link 
        rel="stylesheet"
        href="/php_easy/styles/common/toasts.css?v=<?php echo time(); ?>"
     />

    <!-- responsive design -->
     <link 
        rel="stylesheet"
        href="/php_easy/styles/admin/responsive.css"
    />
</head>
<body>

    <!-- header section -->
    <?php  require_once(FILE_PATH . "/components/header.php") ?>

    <!-- main container -->
    <main class="main-container">

        <!-- sidebar navigation -->
        <?php  require_once(FILE_PATH . "/components/sidebar.php") ?>

        <!-- main content -->
        <div class="main">
        </div>

    </main>

    <!-- footer -->
    <?php require_once(FILE_PATH . "/components/footer.php") ?>

    <!-- for modals  -->
    <!-- Overlay -->
    <div id="modalOverlay" class="modal-overlay"></div>

    <!-- toast container -->
    <section id="toast-container"></section>

    <!-- scripts -->
    <script type="module" src="/php_easy/scripts/user/index.js?v=<?php echo time(); ?>" defer></script>
</body>
</html>