// A central store for handling the data (topics, problemsets etc)
export const AdminStore = {
    // initial state for data..
    topics: [],
    problemSets: [],
    categories: [],
    videos: [],
    playlists: [],
    currentUserId: null,

    // () -> set the current user id..
    setCurrentUserId: function(incomingUserId) {

        // update the state..
        this.currentUserId = incomingUserId;
    }
}