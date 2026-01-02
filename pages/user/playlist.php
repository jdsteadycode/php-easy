<?php
// get the playlist id
$playlistId = $_GET["playlist_id"] ?? null;
?>

<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Playlist | PHP Learn</title>
    <link rel="stylesheet" href="/php_easy/styles/admin/style.css" />
    <link rel="stylesheet" href="/php_easy/styles/user/contents/playlist.css" />
    <link rel="stylesheet" href="/php_easy/styles/common/toasts.css" />
</head>
<body>
    <div class="playlist-page main">
        <!-- BACK BUTTON -->
        <button class="back-button js-back-button">back</button>

        <!-- Playlist header -->
        <div class="playlist-header">
            <h1 class="playlist-title">Playlist Name</h1>
            <p class="playlist-description">Description about the playlist.</p>
        </div>

        <!-- Video list container -->
        <div class="video-list-container">
            <!-- JS will populate videos here -->
        </div>
    </div>

    <!-- toast container -->
    <section id="toast-container"></section>

    <!-- JS -->
    <script>
        // get the playlist id from PHP
        const playlistId = <?= $playlistId ?? "" ?>;
    </script>
    <script type="module" src="/php_easy/scripts/user/playlist.js" defer></script>
</body>
</html>
