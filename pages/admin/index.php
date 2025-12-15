<?php
    // load the config
    require_once("../../config/config.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phpeasy - Admin</title>

    <!-- grab the styles -->
    <link 
        rel="stylesheet"
        href="../../styles/admin/style.css?v=<?php echo time(); ?>"
    />

    <!-- for manage_topics css -->
     <link 
        rel="stylesheet"
        href="../../styles/admin/contents/manage_topics.css?v=<?php echo time(); ?>"
    />

    <!-- for auth css -->
    <link 
        rel="stylesheet"
        href="../../styles/auth/logout.css?v=<?php echo time(); ?>"
    />

    <!-- for modals css -->
    <link 
        rel="stylesheet"
        href="../../styles/admin/modals.css?v=<?php echo time(); ?>"
    />

    <!-- for manage_problem_set css -->
    <link 
        rel="stylesheet"
        href="../../styles/admin/contents/manage_problem_sets.css?v=<?php echo time(); ?>"
    />

    <!-- responsive design -->
     <link 
        rel="stylesheet"
        href="../../styles/admin/responsive.css"
    />
</head>
<body>

    <!-- header section -->
    <?php  require_once(FILE_PATH . "/components/admin/admin_header.php") ?>

    <!-- main container -->
    <main class="main-container">

        <!-- sidebar navigation -->
        <?php  require_once(FILE_PATH . "/components/admin/admin_sidebar.php") ?>

        <!-- main content -->
        <div class="main">
        </div>

    </main>

    <!-- modals -->
    <!-- Overlay -->
    <div id="modalOverlay" class="modal-overlay"></div>

    <!-- View Modal -->
    <div id="viewModal" class="modal">
        <h2 class="modal-title">Topic Details</h2>

        <div class="modal-content">
            <p><strong>Name:</strong> <span id="viewTopicName"></span></p>
            <p><strong>Added At:</strong> <span id="viewAddedAt"></span></p>
            <p><strong>Updated At:</strong> <span id="viewUpdatedAt"></span></p>
            <p><strong>Deleted At:</strong> <span id="viewDeletedAt"></span></p>
            <p><strong>Total Problems Related:</strong> <span id="viewProblemsRelated"></span></p>
        </div>

        <button class="close-btn view-delete-close-btn">Close</button>
    </div>


    <!-- Update Modal -->
    <div id="updateModal" class="modal">
        <h2 class="modal-title">Update Topic</h2>

        <form id="updateForm">
            <label>Topic Name</label>
            <input type="text" id="updateTopicId" hidden/>
            <input type="text" id="updateTopicName" class="modal-input" required>
            
            <!-- buttons -->
            <div class="modal-button-group">
                <button class="primary-btn">Update</button>
                <button class="close-btn">Cancel</button>
            </div>
        </form>

    </div>


    <!-- Delete Modal -->
    <div id="deleteModal" class="modal">
        <h2 class="modal-title" style="color: #d9534f;">Delete Topic?</h2>

        <!-- impt for deletion of current topic.. -->
        <input type="text" id="deleteTopicId" hidden/>

        <!-- warning text -->
        <p class="modal-warning">Are you sure you want to delete this topic?</p>

        <div class="modal-button-group">
            <button class="danger-btn" id="confirmDeleteBtn">Yes Delete</button>
            <button class="close-btn">Cancel</button>
        </div>
    </div>


    <!-- for problem-sets -->
    <!-- Add / Update Problem Set Modal -->
    <div id="addProblemSetModal" class="modal modal-lg">

        <!-- modal header -->
        <div class="modal-header">
            <h2 class="modal-title">Add Problem Set</h2>
            <span class="modal-close">×</span>
        </div>

        <!-- modal body -->
        <form id="problemSetForm">

            <!-- basic info section -->
            <div class="modal-section">
                <label>Title</label>
                <input type="text" class="modal-input js-ps-title" required>

                <label>Description</label>
                <textarea class="modal-textarea js-ps-description"></textarea>
            </div>

            <!-- for difficulty and topics section -->
            <section class="modal-section modal-grid-2">
            <!-- DIFFICULTY -->
                <div class="modal-section">
                    <label>Difficulty</label>
                    <select class="modal-input js-ps-difficulty">
                        <option value="">Select difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>

                <!-- TOPICS -->
                <div class="modal-section">
                    <label>Assign Topics</label>
                    <!-- Topics Dropdown -->
                    <div class="topic-dropdown">

                        <div class="topic-dropdown-header js-topic-toggle">
                            <span class="selected-topics-text">
                                Select Topics
                            </span>
                            <span class="dropdown-arrow">▾</span>
                        </div>


                        <div class="topic-dropdown-body js-topic-dropdown">
                        

                            <!-- for searching of topics -->
                            <input 
                                type="text"
                                class="topic-search js-topic-search"
                                placeholder="Search topics..."
                            />
                            
                            <!-- list of available topics -->
                            <div class="topic-list js-topic-list">
                                
                                <!-- each topic here.. -->
                            </div>
                        
                        </div>

                    </div>

                </div>
            </section>

            <!-- sample input/ output section -->
            <section class="modal-section modal-grid-2">
                <div>
                    <label>Sample Input</label>
                    <textarea class="modal-textarea js-ps-input"></textarea>
                </div>
                <div>
                    <label>Sample Output</label>
                    <textarea class="modal-textarea js-ps-output"></textarea>
                </div>
            </section>

            <!-- hintstext section -->
            <section class="modal-section">
                <label>Hints</label>
                <textarea class="modal-textarea js-ps-hints"></textarea>
            </section>

            <!-- save button -->
            <button class="primary-btn">
                Save
            </button>
        </form>
    </div>

    <!-- footer section -->
    <?php require_once(FILE_PATH . "/components/admin/admin_footer.php") ?>

    <!-- scripts -->
    <script type="module" src="/php_easy/scripts/admin/index.js?v=<?php echo time(); ?>" defer></script>
</body>
</html>