// A central store for handling the data (topics, problemsets etc)
export const AdminStore = {
    // initial state for data..
    topics: [],
    problemSets: [],
    categories: [],
    videos: [],
    playlists: [],
    userData: [],
    currentUserId: null,

    // for general..
    prepData: [],  // for all problem set.. 
    problemSetData: {},     // single problem set..

    // () -> set the current user id..
    setCurrentUserId: function(incomingUserId) {

        // update the state..
        this.currentUserId = incomingUserId;
    }
}