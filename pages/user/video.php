<?php
    // get the id
    $id = $_GET["video_id"] ?? null;

    // check log..
    // var_dump($id);
?>

<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Video Name</title>
        <link rel="stylesheet" href="/php_easy/styles/admin/style.css" />
        <link rel="stylesheet" href="/php_easy/styles/user/contents/video.css" />
        <link rel="stylesheet" href="/php_easy/styles/common/toasts.css" />
    </head>
    <body>

        <main class="main" data-video-id="<?= $id ?>"></main>

        <!-- toast container -->
        <section id="toast-container"></section>


        <!-- problem script -->
        <script type="module" src="/php_easy/scripts/user/pages/video/page.video.js" defer></script>
    </body>
</html>
