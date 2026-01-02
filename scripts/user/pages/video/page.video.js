// grab modules..
import { LearnApi } from "/php_easy/scripts/user/apis/apis.learn.js";
import { Toast } from "/php_easy/scripts/common/toasts.js";

// () -> attach back button events..
function attachBackButtonEvents() {
    document.querySelector(".js-back-btn").onclick = handleRedirectBack;
}

// () -> handle content load..
async function initVideoPage() {

    // get the main container..
    const mainContainer = document.querySelector(".main");

    // get video id..
    const videoId = mainContainer.dataset.videoId;

    // fetch video
    const res = await LearnApi.getVideo(videoId);

    if (!res.status) {
        Toast.error("Video not found");
        return;
    }

    // get the video details
    const video = res.data["data"];

    // check log..
    // console.log(video);

    // get the embedded url!
    const embeddedUrl = getYoutubeEmbedUrl(video.video_url);

    // update the html
    mainContainer.innerHTML = `
        <section class="video-watch-page">

            <button class="back-btn js-back-btn">
                ← Back
            </button>

            <h2 class="video-title">${video.title}</h2>

            <div class="video-player">
                <iframe
                    width="100%"
                    height="450"
                    src="${embeddedUrl}"
                    frameborder="0"
                    allowfullscreen
                ></iframe>
            </div>

            <p class="video-description">
                ${video.description ?? ""}
            </p>

        </section>
    `;

    // attach back button events..
    attachBackButtonEvents();
}

// () -> parse the youtube url into playable version..
function getYoutubeEmbedUrl(url) {

    // 🚨 guard clause
    if (!url || typeof url !== "string") {
        console.warn("Invalid video URL:", url);
        return "";
    }

    // youtu.be/xxxx
    if (url.includes("youtu.be")) {
        const id = url.split("youtu.be/")[1];
        return `https://www.youtube.com/embed/${id}`;
    }

    // youtube.com/watch?v=xxxx
    if (url.includes("watch?v=")) {
        const id = url.split("watch?v=")[1];
        return `https://www.youtube.com/embed/${id}`;
    }

    return "";
}

// () -> load the video page when the html loads..
initVideoPage();

// () -> handle back redirection..
function handleRedirectBack(event) {

    // get the last open page..
    // when is openned from playlist page
    const lastView = sessionStorage.getItem("last_playlist_page");

    // console.log(lastView);
    // return;

    // when last view page is learn..
    if (lastView) {

        // go back to main shell
        window.location.href = window.origin + lastView;
        sessionStorage.removeItem("last_playlist_page");

    } else {

        // fallback
        window.location.href = "/php_easy/pages/user/index.php";
    }
}