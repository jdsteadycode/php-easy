// grab modules..
import { LearnApi } from "/php_easy/scripts/user/apis/apis.learn.js";
import { Toast } from "/php_easy/scripts/common/toasts.js";
import { UserStore } from "/php_easy/scripts/user/store.js"

// () -> render playlist meta data..
function renderPlaylistMetaData(playlistTitle, playlistDescription) {

    // title..
    document.querySelector(".playlist-title").innerHTML = playlistTitle;

    // description..
    document.querySelector(".playlist-description").innerHTML = playlistDescription;
}

// () -> attach page events..
function attachPlaylistPageEvents() {

    // add event to back button
    document.querySelector(".js-back-button").onclick = handleRedirectBack;

    // add event to videos container..
    document.querySelector(".video-list-container").onclick = handleVideoOpen;
}

// load playlist videos
async function initPlaylistPage() {

    // when playlist id not found..
    if (!playlistId) {
        Toast.error("Invalid playlist");
        return;
    }

    // fetch playlist videos
    const res = await LearnApi.getPlaylistVideos(playlistId);

    // get the videos and playlists..
    const {playlist, videos} = res.data;

    // render the playlist meta data..
    renderPlaylistMetaData(playlist.name, playlist.description)

    // get the container
    const container = document.querySelector(".video-list-container");
    container.innerHTML = "";

    // get the path to thumbnail
    const thumbnailPath = `${window.origin}/php_easy/`;

    // for each video
    videos.forEach(video => {

        // make an video box element
        const div = document.createElement("div");
        div.setAttribute("data-video-id", video.id);
        div.className = `video-box`;

        // add the video details
        div.innerHTML = `
            <img src="${thumbnailPath}${video.thumbnail}" class="video-thumb" />
            <div class="video-title">${video.title}</div>
        `;

        // add the videos to playlist
        container.appendChild(div);
    });

    // attach Page events..
    attachPlaylistPageEvents();
}

// () -> load the playlists..
initPlaylistPage();

// () -> handle video open..
function handleVideoOpen(event) {

    // when video is clicked..
    if(event.target.classList.contains("video-box")) {

        // check log..
        // console.log(event.target.dataset.videoId);

        // redirect the user..
        redirectToVideo(event.target.dataset.videoId);
    }
    return;
}

// () -> redirect user to video..
function redirectToVideo(videoId) {
    
     window.location.href = `/php_easy/pages/user/video.php?video_id=${videoId}`;
}

// () -> handle redirect back..
function handleRedirectBack(event) {
    event.preventDefault();

    // last visited
    const lastPlaylistPage = sessionStorage.getItem("last_playlist_page");

    if (lastPlaylistPage) {
        // Redirect back to that playlist page
        window.location.href = lastPlaylistPage;
        sessionStorage.removeItem("last_playlist_page");
    } else {
        // Fallback to main page
        window.location.href = "/php_easy/pages/user/index.php";
    }
}