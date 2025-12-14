// html for manage problem_sets
export const manageProblemSetsHTML = `
    <div class="main">

        <!-- info container -->
        <div class="info-container">
            <h2 class="info-heading">Create a Problem Set</h2>
            
            <p class="info-description">Add some problem sets for sharpening logical thinking and interview preparation</p>

            <button class="open-add-problem-set-btn js-open-add-modal-popup" onclick="handleOpenAddProblemSetModal();">➕ add</button>
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

                    <!-- example row -->
                    <div class="item1">
                        <h3 class="t-op-nextlvl">1</h3>
                        <h3 class="t-op-nextlvl">PHP Arrays</h3>

                        <h3 class="t-op-nextlvl">
                            <span class="label-tag">Arrays</span>
                            <span class="label-tag">Loops</span>
                        </h3>

                        <h3 class="t-op-nextlvl">
                            <span class="label-tag">Easy</span>
                        </h3>

                        <h3 class="t-op-nextlvl">admin</h3>
                        <h3 class="t-op-nextlvl">12 Jan 2025</h3>

                        <div class="actions">
                            <span onclick="openViewProblemSetModal(1)">👁️</span>
                            <span onclick="openEditProblemSetModal(1)">✏️</span>
                            <span onclick="openDeleteProblemSetModal(1)">🗑️</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
`;