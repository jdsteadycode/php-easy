// html for manage videosAndPlaylistHTML..
export const manageVideosAndPlaylistHTML = `
        <!-- info container -->
        <section class="info-parent-container">
            <!-- info container -->
            <div class="info-container video-container">
                <h2 class="info-heading">Add video</h2>

                <p class="info-description">
                    Add some videos with respective categories for learning module for
                    users..
                </p>

                <button class="open-add-categories-btn js-open-add-videos-btn">
                    ➕ add
                </button>
            </div>

            <!-- info container -->
            <div class="info-container playlist-container">
                <h2 class="info-heading">Add playlist</h2>

                <p class="info-description">
                    Create some playlists with respective videos for structured learning..
                </p>

                <button class="open-add-categories-btn js-open-add-playlists-btn">
                    ➕ add
                </button>
            </div>
        </section>

        <!-- main content container -->
        <div class="main-content-container">

            <!-- content-header -->
            <div class="main-content-header">
                <h1 class="main-content-heading">Current Videos</h1>
            </div>

            <!-- body -->
            <div class="main-content-body">

                <!-- table heading -->
                <div class="main-content-topic-heading video-table-heading">
                    <h3 class="t-op">No</h3>
                    <h3 class="t-op">Thumbnail</h3>
                    <h3 class="t-op">Title</h3>
                    <h3 class="t-op">Added at</h3>
                    <h3 class="t-op">Actions</h3>
                </div>

                <!-- table rows -->
                <div class="items js-videos">

                    <!-- ROW 1 -->
                    <div class="item1 video-item">
                        <h3 class="t-op-nextlvl">1</h3>

                        <img 
                            class="video-thumb"
                            alt="thumbnail"
                        />

                        <h3 class="t-op-nextlvl video-title">
                            PHP Variables & Datatypes
                        </h3>

                        <h3 class="t-op-nextlvl">
                            22 Dec 2025
                        </h3>

                        <div class="actions">
                            <span class="js-video-view">👁️</span>
                            <span class="js-video-edit">✏️</span>
                            <span class="js-video-delete">🗑️</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <!-- PLAYLISTS SECTION -->
        <div class="main-content-container playlist-content-container">

            <!-- header -->
            <div class="main-content-header">
                <h1 class="main-content-heading">Current Playlists</h1>
            </div>

            <!-- body -->
            <div class="main-content-body">

                <!-- table heading -->
                <div class="main-content-topic-heading playlist-table-heading">
                    <h3 class="t-op">No</h3>
                    <h3 class="t-op">Playlist Name</h3>
                    <h3 class="t-op">Videos</h3>
                    <h3 class="t-op">Created at</h3>
                    <h3 class="t-op">Actions</h3>
                </div>

                <!-- table rows -->
                <div class="items js-playlists">

                    <!-- ROW -->
                    <div class="item1 playlist-item">
                        <h3 class="t-op-nextlvl">1</h3>

                        <h3 class="t-op-nextlvl playlist-title">
                            PHP Fundamentals
                        </h3>

                        <h3 class="t-op-nextlvl playlist-video-count">
                            12 videos
                        </h3>

                        <h3 class="t-op-nextlvl">
                            22 Dec 2025
                        </h3>

                        <div class="actions">
                            <span class="js-playlist-view">👁️</span>
                            <span class="js-playlist-edit">✏️</span>
                            <span class="js-playlist-delete">🗑️</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>

`;
