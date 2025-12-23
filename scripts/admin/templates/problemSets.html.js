// html for manage problem_sets
export const manageProblemSetsHTML = `
        <!-- info container -->
        <div class="info-container">
            <h2 class="info-heading">Create a Problem Set</h2>
            
            <p class="info-description">Add some problem sets for sharpening logical thinking and interview preparation</p>

            <button 
                class="open-add-problem-set-btn js-ps-open-add-problemset-modal" 
            >➕ add</button>
        </div>

        <!-- main content container -->
        <div class="main-content-container">

            <!-- header -->
            <div class="main-content-header">
                <h1 class="main-content-heading">Current Problem Sets</h1>
            </div>

            <!-- body -->
            <div class="main-content-body">

                <!-- table heading -->
                <div class="main-content-topic-heading">
                    <h3 class="t-op">No</h3>
                    <h3 class="t-op">Title</h3>
                    <h3 class="t-op">Topics</h3>
                    <h3 class="t-op">Difficulty</h3>
                    <h3 class="t-op">Created By</h3>
                    <h3 class="t-op">Created At</h3>
                    <h3 class="t-op">Actions</h3>
                </div>

                <!-- rows -->
                <div class="items js-problemset-items">

                    <!-- problemSets here... -->
                </div>
            </div>
        </div>
`;