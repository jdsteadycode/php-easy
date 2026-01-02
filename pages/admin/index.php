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

    <!-- for manage categories css -->
     <link 
        rel="stylesheet"
        href="../../styles/admin/contents/manage_categories.css?v=<?php echo time(); ?>"
    />

    <!-- for manage videos and playlist css -->
    <link 
        rel="stylesheet"
        href="../../styles/admin/contents/manage_videosandplaylist.css?v=<?php echo time(); ?>"
    />

    <!-- for settings css -->
     <link 
        rel="stylesheet"
        href="../../styles/admin/contents/settings.css?v=<?php echo time(); ?>"
    />

    <!-- for toasts css -->
     <link 
        rel="stylesheet"
        href="../../styles/common/toasts.css?v=<?php echo time(); ?>"
     />

    <!-- responsive design -->
     <link 
        rel="stylesheet"
        href="../../styles/admin/responsive.css"
    />
</head>
<body>

    <!-- header section -->
    <?php  require_once(FILE_PATH . "/components/header.php") ?>

    <!-- main container -->
    <main class="main-container">

        <!-- sidebar navigation -->
        <?php  require_once(FILE_PATH . "/components/sidebar.php") ?>

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
            <div class="modal-section">
                <button class="primary-btn">
                    Save
                </button>
            </div>
        </form>
    </div>

    <!-- View Problem Set Modal -->
    <div id="viewProblemSetModal" class="modal modal-lg">

        <!-- Header -->
        <div class="modal-header">
            <h2 class="modal-title">Problem Set Details</h2>
            <span class="modal-close js-close-view-modal">×</span>
        </div>

        <!-- Body -->
        <div class="modal-body">

            <!-- Title -->
            <div class="view-section">
                <h3 class="view-title js-view-title">
                    Two Sum Problem
                </h3>
            </div>

            <!-- Description -->
            <div class="view-section">
                <span class="view-label">Description</span>
                <p class="view-description js-view-description">
                    Given an array of integers, return indices of the two numbers such that they add up to a specific target.
                </p>
            </div>

            <!-- Meta Info -->
            <div class="view-meta-grid">

                <!-- Difficulty -->
                <div class="difficulty-section">
                    <span class="view-label">Difficulty</span>
                    <span class="label-tag js-view-difficulty">Medium</span>
                </div>

                <!-- Topics -->
                <div>
                    <span class="view-label">Topics</span>
                    <div class="view-topics js-view-topics problem-set-topics">
                        <span class="label-tag">Array</span>
                        <span class="label-tag">Hash Map</span>
                    </div>
                </div>

            </div>

            <!-- Sample IO -->
            <div class="view-io-grid">

                <div>
                    <span class="view-label">Sample Input</span>
                    <pre class="view-code js-view-input">
                       nums = [2,7,11,15], target = 9
                    </pre>
                </div>

                <div>
                    <span class="view-label">Sample Output</span>
                    <pre class="view-code js-view-output">
                       [0,1]
                    </pre>
                </div>

            </div>

            <!-- Updated at -->
            <div class="view-date-grid">
                <div class="view-section">
                    <span class="view-label">Updated at</span>
                    <p class="view-hints js-view-updated-at">
                        2025-01-01
                    </p>
                </div>

                <!-- Deleted at -->
                <div class="view-section">
                    <span class="view-label">Deleted at</span>
                    <p class="view-hints js-view-deleted-at">
                        2025-01-02
                    </p>
                </div>
            </div>

            <!-- Hints -->
            <div class="view-section">
                <span class="view-label">Hints</span>
                <p class="view-hints js-view-hints">
                    Use a hash map to store visited numbers.
                </p>
            </div>

        </div>

    </div>

    <!-- update/edit Problem Set Modal -->
    <div id="updateProblemSetModal" class="modal modal-lg">

        <!-- Modal Header -->
        <div class="modal-header">
            <h2 class="modal-title">Update Problem Set</h2>
            <span class="modal-close js-close-update-modal">×</span>
            <input class="js-update-ps-id" hidden/>
        </div>

        <!-- Modal Body (Scrollable) -->
        <div class="modal-body update-problemset-modal-body ">

            <!-- SECTION 1: CORE UPDATE DATA -->
            <form id="updateProblemSetForm" class="modal-section-box">

                <h4 class="section-heading">Basic Details</h4>

                <div class="modal-section">
                    <label>Title</label>
                    <input type="text" class="modal-input js-ps-update-title" />
                </div>

                <div class="modal-section">
                    <label>Description</label>
                    <textarea class="modal-textarea js-ps-update-description"></textarea>
                </div>

                <div class="modal-section modal-grid-2">
                    <div>
                        <label>Difficulty</label>
                        <select class="modal-input js-ps-update-difficulty">
                            <option value="">Select</option>
                            <option value="easy">easy</option>
                            <option value="medium">medium</option>
                            <option value="hard">hard</option>
                        </select>
                    </div>
                </div>

                <div class="modal-section modal-grid-2">
                    <div>
                        <label>Sample Input</label>
                        <textarea class="modal-textarea js-ps-update-sample-input"></textarea>
                    </div>
                    <div>
                        <label>Sample Output</label>
                        <textarea class="modal-textarea js-ps-update-sample-output"></textarea>
                    </div>
                </div>

                <div class="modal-section">
                    <label>Hints</label>
                    <textarea class="modal-textarea js-ps-update-hintsText"></textarea>
                </div>

                <button type="submit" class="update-primary-btn js-update-ps-btn">
                    Save Changes
                </button>

            </form>

            
            <!-- SECTION 2: TOPICS DATA (ADD NEW TO EXISTING TOPICS) -->
            <div class="modal-section-box">

                <h4 class="section-heading">Add Topics</h4>

                <!-- Topic Dropdown (Reuse existing component) -->
                <div class="modal-section">
                    <label>Select Topics</label>

                    <div class="topic-dropdown">
                        <div class="topic-dropdown-header js-topic-toggle">
                            <span class="selected-topics-text">
                                Select Topics
                            </span>
                            <span class="dropdown-arrow">▾</span>
                        </div>

                        <div class="topic-dropdown-body js-topic-dropdown">
                            <input 
                                type="text"
                                class="topic-search js-topic-search"
                                placeholder="Search topics..."
                            />

                            <div class="topic-list js-topic-list">
                                <!-- dynamically rendered -->
                            </div>
                        </div>
                    </div>
                </div>

                <button class="update-primary-btn js-add-new-topics-btn">
                    Add Selected Topics
                </button>

            </div>

            
            <!-- SECTION 3: TOPICS DATA (REMOVE EXISTING TOPICS) -->
            <div class="modal-section-box">

                <h4 class="section-heading">Remove Topics</h4>

                <div class="assigned-topics js-assigned-topics">
                    <!-- Example -->
                    <!--
                    <span class="label-tag">
                        Arrays
                        <span class="remove-topic js-remove-topic" data-topic-id="3">🗑</span>
                    </span>
                    -->
                </div>

                <!-- save changes -->
                <button class="update-danger-btn js-save-deleted-topics-btn">
                    delete topics
                </button>
            </div>

            <!-- SECTION 4: FUNCTION DEFINITION -->
            <div class="modal-section-box">

                <h4 class="section-heading">Function Definition</h4>

                <!-- Function Name -->
                <div class="modal-section">
                    <label>Function Name</label>
                    <input 
                        type="text" 
                        class="modal-input js-ps-update-function-name"
                        placeholder="e.g. sortNumbers"
                    />
                    <small class="form-hint">
                        Must match the function name used in starter code
                    </small>
                </div>

                <!-- Function Type -->
                <div class="modal-section">
                    <label>Function Type</label>
                    <select class="modal-input js-ps-update-function-type">
                        <option value="single_param">
                            Single Parameter (Array)
                        </option>
                        <option value="multi_param">
                            Multiple Parameters
                        </option>
                    </select>
                    <small class="form-hint">
                        Single → function(array $data) <br>
                        Multi → function($a, $b, ...)
                    </small>
                </div>

                <!-- Starter Code -->
                <div class="modal-section">
                    <label>Starter Code</label>
                    <textarea 
                        class="modal-textarea js-ps-update-starter-code"
                        rows="8"
                        placeholder="function sortNumbers(array $nums) { }"
                    ></textarea>
                    <small class="form-hint">
                        This code is shown to users and used by the judge
                    </small>
                </div>

                <button class="update-primary-btn js-save-function-meta-btn">
                    Save Function Definition
                </button>

            </div>


            <!-- SECTION 4: TEST CASES DATA -->
            <div class="modal-section-box">

                <h4 class="section-heading">Test Cases</h4>

                <div class="test-cases-container js-test-cases-container">
                    <!-- Example test case template -->
                    
                    <div class="modal-section test-case-item">
                        <label>Input</label>
                        <textarea class="modal-textarea js-testcase-input"></textarea>

                        <label>Expected Output</label>
                        <textarea class="modal-textarea js-testcase-output"></textarea>

                        <span class="remove-topic js-remove-testcase">🗑 Remove</span>
                    </div>
                   
                </div>

                <div class="modal-button-group">
                    <button class="update-primary-btn js-add-testcase-btn">
                        Add Test Case
                    </button>

                    <button class="update-primary-btn js-save-testcases-btn">
                        Save test Case(s)
                    </button>
                </div>            
            </div>
        </div>
    </div>

    <!-- delete problem set conf Modal -->
    <div class="modal" id="deleteProblemSetModal">

        <!-- header -->
        <div class="modal-header">
            <h3 class="modal-title">Delete Problem Set</h3>
            <span class="modal-close js-close-delete-modal">&times;</span>
        </div>

        <!-- body -->
        <div class="modal-content">

            <p class="modal-warning">
                ⚠️ This action is irreversible
            </p>

            <p>
                Are you sure you want to delete this problem set?
            </p>

            <!-- modal title -->
            <p>
                <input class="js-ps-delete-ps-id" hidden/>
                <strong class="js-delete-ps-title">
                    <!-- dynamically injected title -->
                </strong>
            </p>
        </div>

        <!-- actions -->
        <button 
            class="danger-btn js-confirm-delete-problemset"
        >
            Delete
        </button>
    </div>

    <!-- for categories -->
    <!-- for adding categories and sub-categories modal -->
    <div id="addCategoryModal" class="modal modal-lg">

        <!-- Modal Header -->
        <div class="modal-header">
            <h2 class="modal-title">Manage Categories</h2>
            <span class="modal-close js-close-category-modal">×</span>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">

           <!-- add category -->
            <form class="modal-section-box js-add-category-form">

                <h4 class="section-heading">Add Category (Parent)</h4>

                <div class="modal-section">
                    <label>Category Name</label>
                    <input 
                        type="text"
                        class="modal-input js-category-name-input"
                        placeholder="Enter category name"
                    />

                    <!-- toast notification -->
                    <span class="js-response-toast"></span>
                </div>

                <button type="submit" class="update-primary-btn js-add-category-btn">
                    Add Category
                </button>

            </form>

            <!-- sub-category section -->
            <form class="modal-section-box js-add-sub-category-form">

                <h4 class="section-heading">Add Sub Category (Child)</h4>

                <!-- Parent Category Dropdown -->
                <div class="modal-section">
                    <label>Select Parent Category</label>

                    <!-- REUSED DROPDOWN -->
                    <div class="topic-dropdown">
                        <div class="topic-dropdown-header js-category-toggle">
                            <span class="selected-topics-text">
                                Select Category
                            </span>
                            <span class="dropdown-arrow">▾</span>
                        </div>

                        <div class="topic-dropdown-body js-category-dropdown">
                            <input 
                                type="text"
                                class="topic-search js-category-search"
                                placeholder="Search categories..."
                            />

                            <div class="topic-list js-category-list">
                                <!-- dynamically rendered -->
                                
                                <label>
                                    <input 
                                        type="radio"
                                        name="parent_category"
                                        class="js-category-radio"
                                        data-category-id="1"
                                    />
                                    Basics
                                </label>
                               
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sub Category Input -->
                <div class="modal-section">
                    <label>Sub Category Name</label>
                    <input 
                        type="text"
                        class="modal-input js-sub-category-name-input"
                        placeholder="Enter sub category name"
                    />
                </div>

                <button type="submit" class="update-primary-btn js-add-sub-category-btn">
                    Add Sub Category
                </button>

                <!-- response toast for sub category -->
                <span class="js-sub-category-response-toast"></span>
            </form>

        </div>
    </div>

    <!-- for viewing the category -->
    <div id="viewCategoryModal" class="modal modal-lg">

        <div class="modal-content">

            <!-- Modal Header -->
            <div class="modal-header">
                <h2 class="modal-title">View Category</h2>
                <span class="modal-close js-close-modal">×</span>
            </div>

            <!-- Modal Body -->
            <div class="modal-body">

                <!-- SECTION 1: BASIC DETAILS -->
                <section class="modal-section">
                    <h3 class="section-title">Basic Details</h3>

                    <div class="detail-row">
                        <span class="detail-label">Category Name</span>
                        <span class="detail-value js-category-name">Basics</span>
                    </div>
                </section>

                <!-- SECTION 2: DATE DETAILS -->
                <section class="modal-section">
                    <h3 class="section-title">Date Information</h3>

                    <div class="detail-row">
                        <span class="detail-label">Added On</span>
                        <span class="detail-value js-category-created-at">
                            2025-12-19 10:05:52
                        </span>
                    </div>

                    <div class="detail-row">
                        <span class="detail-label">Updated On</span>
                        <span class="detail-value js-category-updated-at">
                            —
                        </span>
                    </div>
                </section>

                <!-- SECTION 3: SUB CATEGORIES -->
                <section class="modal-section">
                    <h3 class="section-title">Sub Categories</h3>

                    <!-- When sub categories exist -->
                    <div class="subcategory-list js-subcategory-list">
                        <!-- injected dynamically -->
                        <!-- Example -->
                        <!-- <span class="subcategory-chip">🔖 variables</span> -->
                    </div>

                    <!-- when sub categories seem to be empty -->
                    <!-- Empty state -->
                    <p class="empty-text js-no-subcategories">
                    </p>
                </section>
            </div>
        </div>
    </div>

    <!-- for updating the category -->
     <div id="updateCategoryModal" class="modal modal-lg">

        <!-- Modal Header -->
        <div class="modal-header">
            <h2 class="modal-title">Update Category</h2>
            <span class="modal-close js-close-update-category-modal">×</span>
            <input type="text" class="js-update-parent-category-id" hidden/>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">

            <!-- SECTION 1: MAIN CATEGORY -->
            <div class="modal-section-box">
                <h4 class="section-heading">
                    Main Category
                </h4>

                <div class="modal-section">
                    <div>
                        <label>Category Name</label>
                        <input 
                            type="text"
                            class="modal-input js-update-parent-category-name"
                            placeholder="Enter category name"
                        />
                    </div>

                    <div class="actions js-update-category-modal-actions">
                        <button class="update-primary-btn js-update-parent-category-btn">
                            Update
                        </button>
                    </div>

                </div>

            </div>

            <!-- SECTION 2: ADD SUB CATEGORY -->
            <div class="modal-section-box">

                <h4 class="section-heading">
                    Add Sub Category
                </h4>

                <div class="modal-section">
                    <div>
                        <label>Sub Category Name</label>
                        <input 
                            type="text"
                            class="modal-input js-new-sub-category-name"
                            placeholder="Enter sub category name"
                        />
                    </div>

                    <div class="actions js-update-category-modal-actions">
                        <button class="update-primary-btn js-add-sub-category-btn">
                            Add
                        </button>
                    </div>

                </div>

                <!-- response toast -->
                <span class="js-add-sub-category-toast"></span>

            </div>

            <!-- SECTION 3: EXISTING SUB CATEGORIES -->
            <div class="modal-section-box">

                <h4 class="section-heading">
                    Existing Sub Categories
                </h4>

                <div class="assigned-topics js-existing-sub-categories">
                    <!-- dynamically rendered -->
                   
                </div>

                <!-- when no existing sub-categories exist -->
                <p class="empty-text js-no-existing-sub-categories">
                </p>

            </div>

        </div>

    </div>

    <!-- for deleting the category -->
    <div class="modal" id="deleteCategoryModal">

        <!-- header -->
        <div class="modal-header">
            <h3 class="modal-title">Delete Category</h3>
            <span class="modal-close js-close-delete-category-modal">×</span>
        </div>

        <!-- body -->
        <div class="modal-content">
            <p class="modal-warning">
                ⚠️ This action is irreversible
            </p>

            <p>
                Deleting this category may also affect its sub categories.
            </p>

            <!-- category info -->
            <p>
                <input class="js-delete-category-id" hidden />
                <strong class="js-delete-category-name">
                    <!-- dynamically injected category name -->
                </strong>
            </p>

        </div>

        <!-- actions -->
        <button 
            class="danger-btn js-confirm-delete-category"
        >
            Delete
        </button>

    </div>

    <!-- for video and playlist module -->
    <!-- 1. add video modal.. -->
     <div id="addVideoModal" class="modal modal-lg">
        <!-- modal header -->
        <div class="modal-header">
            <h2 class="modal-title">Add Video</h2>
            <span class="modal-close">×</span>
        </div>

        <!-- modal body -->
        <form id="addVideoForm" enctype="multipart/form-data">

            <!-- BASIC INFO -->
            <div class="modal-section">
                <label>Video Title</label>
                <input 
                    type="text" 
                    class="modal-input js-video-title" 
                    placeholder="Enter video title"
                    required
                >

                <label>Description</label>
                <textarea 
                    class="modal-textarea js-video-description"
                    placeholder="Short description about the video"
                ></textarea>
            </div>

            <!-- VIDEO URL & THUMBNAIL -->
            <section class="modal-section modal-grid-2">

                <div>
                    <label>YouTube Video URL</label>
                    <input 
                        type="url" 
                        class="modal-input js-video-url"
                        placeholder="https://youtube.com/..."
                        required
                    >
                </div>

                <div>
                    <label>Thumbnail Image</label>
                    <input 
                        type="file" 
                        class="modal-input js-video-thumbnail"
                    >
                </div>

            </section>

            <!-- CATEGORIES -->
            <section class="modal-section">
                <label>Assign Categories</label>

                <!-- Categories Dropdown -->
                <div class="topic-dropdown">

                    <div class="topic-dropdown-header js-category-toggle">
                        <span class="selected-topics-text">
                            Select Categories
                        </span>
                        <span class="dropdown-arrow">▾</span>
                    </div>

                    <div class="topic-dropdown-body js-category-dropdown">

                        <!-- search -->
                        <input 
                            type="text"
                            class="topic-search js-category-search"
                            placeholder="Search categories..."
                        />

                        <!-- category list -->
                        <div class="topic-list js-category-list">
                            
                            <!-- Example: -->
                            <label>
                                <input type="checkbox" value="36">
                                Variables
                            </label>
                           
                        </div>

                    </div>

                </div>
            </section>

            <!-- SAVE -->
            <button class="primary-btn js-save-video-btn">
                Save Video
            </button>

        </form>
     </div>

    <!-- 2. view video Modal -->
    <div id="viewVideoModal" class="modal modal-lg">

        <!-- Header -->
        <div class="modal-header">
            <h2 class="modal-title">Video Details</h2>
            <span class="modal-close js-close-view-video-modal">×</span>
        </div>

        <!-- Body -->
        <div class="modal-body">

            <!-- Title -->
            <div class="view-section">
                <h3 class="view-title js-view-video-title">
                    PHP Variables and Datatypes
                </h3>
            </div>

            <!-- Thumbnail -->
            <div class="view-section">
                <span class="view-label">Thumbnail</span>
                <img 
                    src="" 
                    alt="Video Thumbnail"
                    class="view-video-thumbnail js-view-video-thumbnail"
                />
            </div>

            <!-- Description -->
            <div class="view-section">
                <span class="view-label">Description</span>
                <p class="view-description js-view-video-description">
                    A detailed explanation of variables and datatypes in PHP.
                </p>
            </div>

            <!-- Meta Info -->
            <div class="view-meta-grid">

                <!-- Uploaded By -->
                <div class="view-section">
                    <span class="view-label">Uploaded By</span>
                    <p class="view-text js-view-video-uploaded-by">
                        Admin
                    </p>
                </div>

                <!-- Categories -->
                <div class="view-section">
                    <span class="view-label">Categories</span>
                    <div class="view-topics js-view-video-categories">
                        <!-- category chips -->
                        <span class="label-tag">Variables</span>
                        <span class="label-tag">Datatypes</span>
                    </div>
                    
                </div>
            </div>

            <!-- Video URL -->
            <div class="view-section">
                <span class="view-label">Video Link</span>
                <a 
                    href="#" 
                    target="_blank"
                    class="view-video-link js-view-video-url"
                >
                    👉 Open on YouTube
                </a>
            </div>

            <!-- Dates -->
            <div class="view-date-grid">

                <!-- Created At -->
                <div class="view-section">
                    <span class="view-label">Created At</span>
                    <p class="view-text js-view-video-created-at">
                        2025-12-19
                    </p>
                </div>

                <!-- Updated At -->
                <div class="view-section">
                    <span class="view-label">Updated At</span>
                    <p class="view-hints js-view-video-updated-at">
                        —
                    </p>
                </div>

                <!-- Deleted At -->
                <div class="view-section">
                    <span class="view-label">Deleted At</span>
                    <p class="view-hints js-view-video-deleted-at">
                        —
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- 3. update video modal  -->
    <!-- Update / Edit Video Modal -->
    <div id="updateVideoModal" class="modal modal-lg">

        <!-- Modal Header -->
        <div class="modal-header">
            <h2 class="modal-title">Update Video</h2>
            <span class="modal-close js-close-update-video-modal">×</span>
            <input type="hidden" class="js-update-video-id" />
        </div>

        <!-- Modal Body -->
        <div class="modal-body update-video-modal-body">

            <!-- SECTION 1: BASIC VIDEO DETAILS -->
            <form class="modal-section-box js-update-video-form" enctype="multipart/form-data">

                <h4 class="section-heading">Basic Details</h4>

                <div class="modal-section">
                    <label>Title</label>
                    <input 
                        type="text" 
                        class="modal-input js-video-update-title"
                    />
                </div>

                <div class="modal-section">
                    <label>Description</label>
                    <textarea 
                        class="modal-textarea js-video-update-description">
                    </textarea>
                </div>

                <div class="modal-section">
                    <label>Video URL</label>
                    <input 
                        type="url" 
                        class="modal-input js-video-update-url"
                    />
                </div>

                <div class="modal-section">
                    <label>Replace Thumbnail</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        class="modal-input js-video-update-thumbnail"
                    />
                    <small class="helper-text">
                        Leave empty to keep existing thumbnail
                    </small>
                </div>

                <button 
                    type="submit" 
                    class="update-primary-btn js-update-video-btn"
                >
                    Save Video Changes
                </button>

            </form>

            <!-- SECTION 2: ADD CATEGORIES -->
            <div class="modal-section-box">

                <h4 class="section-heading">Add Categories</h4>

                <div class="modal-section">
                    <label>Select Categories</label>

                    <div class="topic-dropdown">
                        <div class="topic-dropdown-header js-category-toggle">
                            <span class="selected-topics-text">
                                Select Categories
                            </span>
                            <span class="dropdown-arrow">▾</span>
                        </div>

                        <div class="topic-dropdown-body js-category-dropdown">

                            <input 
                                type="text"
                                class="topic-search js-category-search"
                                placeholder="Search categories..."
                            />

                            <div class="topic-list js-category-list">
                                <!-- rendered dynamically -->
                            </div>

                        </div>
                    </div>
                </div>

                <button class="update-primary-btn js-add-video-categories-btn">
                    Add Selected Categories
                </button>

            </div>

            <!-- SECTION 3: REMOVE EXISTING CATEGORIES -->
            <div class="modal-section-box">

                <h4 class="section-heading">Remove Categories</h4>

                <div class="assigned-topics js-assigned-video-categories">
                    <!-- Example chip -->
                    <!--
                    <span class="label-tag">
                        Variables
                        <span 
                            class="remove-topic js-remove-video-category" 
                            data-category-id="42"
                        >🗑</span>
                    </span>
                    -->
                </div>

                <button class="update-danger-btn js-save-removed-video-categories-btn">
                    Remove Selected Categories
                </button>

            </div>

        </div>
    </div>

    <!-- 4. delete video modal -->
    <!-- delete video confirmation Modal -->
    <div class="modal" id="deleteVideoModal">

        <!-- header -->
        <div class="modal-header">
            <h3 class="modal-title">Delete Video</h3>
            <span class="modal-close js-close-delete-video-modal">×</span>
        </div>

        <!-- body -->
        <div class="modal-content">

            <p class="modal-warning">
                ⚠️ This action is irreversible
            </p>

            <p>
                Are you sure you want to delete this video?
            </p>
            <!-- **ignore this** -->
            <input type="text" class="js-video-delete-id" hidden />
        </div>

        <!-- actions -->
        <button 
            class="danger-btn js-confirm-delete-video"
        >
            Delete
        </button>
    </div>

    <!-- **for playlist section** -->
    <!-- 1. add playlist modal -->
    <div id="addPlaylistModal" class="modal modal-lg">

        <!-- modal header -->
        <div class="modal-header">
            <h2 class="modal-title">Add Playlist</h2>
            <span class="modal-close js-close-playlist-modal">×</span>
        </div>

        <!-- modal body -->
        <form id="addPlaylistForm">

            <!-- BASIC INFO -->
            <div class="modal-section">
                <label>Playlist Name</label>
                <input 
                    type="text" 
                    class="modal-input js-playlist-name"
                    placeholder="Enter playlist name"
                    required
                >

                <label>Description</label>
                <textarea 
                    class="modal-textarea js-playlist-description"
                    placeholder="Short description about the playlist"
                ></textarea>
            </div>

            <!-- ASSIGN VIDEOS -->
            <section class="modal-section">
                <label>Assign Videos</label>

                <!-- Videos Dropdown -->
                <div class="topic-dropdown">

                    <div class="topic-dropdown-header js-video-toggle">
                        <span class="selected-topics-text js-selected-videos-text">
                            Select Videos
                        </span>
                        <span class="dropdown-arrow">▾</span>
                    </div>

                    <div class="topic-dropdown-body js-video-dropdown">

                        <!-- search -->
                        <input 
                            type="text"
                            class="topic-search js-video-search"
                            placeholder="Search videos..."
                        />

                        <!-- video list -->
                        <div class="topic-list js-video-list">
                            
                            <!-- Example -->
                            <label>
                                <input type="checkbox" value="12">
                                PHP Variables Explained
                            </label>

                        </div>

                    </div>

                </div>
            </section>

            <!-- SAVE -->
            <button class="primary-btn js-save-playlist-btn">
                Save Playlist
            </button>
        </form>
    </div>


    <!-- 2. Update / Edit Playlist Modal -->
    <div id="updatePlaylistModal" class="modal modal-lg">

        <!-- Modal Header -->
        <div class="modal-header">
            <h2 class="modal-title">Update Playlist</h2>
            <span class="modal-close js-close-update-playlist-modal">×</span>
            <input type="text" class="js-update-playlist-id" hidden/>
        </div>

        <!-- Modal Body -->
        <div class="modal-body update-playlist-modal-body">

            <!-- SECTION 1: BASIC PLAYLIST DETAILS -->
            <form class="modal-section-box js-update-playlist-form">

                <h4 class="section-heading">Basic Details</h4>

                <div class="modal-section">
                    <label>Playlist Name</label>
                    <input 
                        type="text" 
                        class="modal-input js-playlist-update-name"
                    />
                </div>

                <div class="modal-section">
                    <label>Description</label>
                    <textarea 
                        class="modal-textarea js-playlist-update-description">
                    </textarea>
                </div>

                <button 
                    type="submit" 
                    class="update-primary-btn js-update-playlist-btn"
                >
                    Save Playlist Changes
                </button>

            </form>

            <!-- SECTION 2: ADD VIDEOS TO PLAYLIST -->
            <div class="modal-section-box">

                <h4 class="section-heading">Add Videos</h4>

                <div class="modal-section">
                    <label>Select Videos</label>

                    <div class="topic-dropdown">

                        <div class="topic-dropdown-header js-video-toggle">
                            <span class="selected-topics-text">
                                Select Videos
                            </span>
                            <span class="dropdown-arrow">▾</span>
                        </div>

                        <div class="topic-dropdown-body js-video-dropdown">

                            <!-- search -->
                            <input 
                                type="text"
                                class="topic-search js-video-search"
                                placeholder="Search videos..."
                            />

                            <!-- video list -->
                            <div class="topic-list js-video-list">
                                <!-- rendered dynamically -->
                            </div>

                        </div>
                    </div>
                </div>

                <button class="update-primary-btn js-add-playlist-videos-btn">
                    Add Selected Videos
                </button>

            </div>

            <!-- SECTION 3: REMOVE EXISTING VIDEOS -->
            <div class="modal-section-box">

                <h4 class="section-heading">Remove Videos</h4>

                <div class="assigned-topics js-assigned-playlist-videos">
                    <!-- Example chip -->
                    <!--
                    <span class="label-tag">
                        PHP Variables
                        <span 
                            class="remove-topic js-remove-playlist-video" 
                            data-video-id="12"
                        >🗑</span>
                    </span>
                    -->
                </div>

                <button class="update-danger-btn js-save-removed-playlist-videos-btn">
                    Remove Selected Videos
                </button>

            </div>

        </div>
    </div>

    <!-- View Playlist Modal -->
    <div id="viewPlaylistModal" class="modal modal-lg">

        <!-- Header -->
        <div class="modal-header">
            <h2 class="modal-title">Playlist Details</h2>
            <span class="modal-close js-close-view-playlist-modal">×</span>
        </div>

        <!-- Body -->
        <div class="modal-body">

            <!-- Playlist Title -->
            <div class="view-section">
                <h3 class="view-title js-view-playlist-name">
                    PHP Fundamentals
                </h3>
            </div>

            <!-- Description -->
            <div class="view-section">
                <span class="view-label">Description</span>
                <p class="view-description js-view-playlist-description">
                    This playlist covers the core concepts of PHP required for beginners.
                </p>
            </div>

            <!-- Meta Info -->
            <div class="view-meta-grid view-playlists-video-data-grid">

                <!-- Total Videos -->
                <div class="view-section">
                    <span class="view-label">Total Videos</span>
                    <span class="js-view-playlist-video-count">
                        2 Videos
                    </span>
                </div>

                <!-- Videos List -->
                <div class="view-section">
                    <span class="view-label">Videos in Playlist</span>

                    <div class="view-topics js-view-playlist-videos playlist-video-list">
                        <!-- Example -->
                        <!--
                        <span class="label-tag">
                            PHP Variables
                        </span>
                        <span class="label-tag">
                            PHP Datatypes
                        </span>
                        -->
                    </div>
                </div>
            </div>

            <!-- Dates -->
            <div class="view-date-grid">

                <!-- Created At -->
                <div class="view-section">
                    <span class="view-label">Created at</span>
                    <p class="view-hints js-view-playlist-created-at">
                        2025-12-24 13:44:59
                    </p>
                </div>

                <!-- Updated At -->
                <div class="view-section">
                    <span class="view-label">Updated at</span>
                    <p class="view-hints js-view-playlist-updated-at">
                        2025-12-24 14:35:27
                    </p>
                </div>

            </div>

            <!-- Deleted At (Optional / Hidden if null) -->
            <div class="view-section js-view-playlist-deleted-wrapper" style="display:none;">
                <span class="view-label">Deleted at</span>
                <p class="view-hints js-view-playlist-deleted-at">
                    2025-12-25
                </p>
            </div>

        </div>
    </div>

    <!-- Delete Playlist Modal -->
    <div class="modal" id="deletePlaylistModal">

        <!-- Header -->
        <div class="modal-header">
            <h3 class="modal-title">Delete Playlist</h3>
            <span class="modal-close js-close-delete-playlist-modal">×</span>
        </div>

        <!-- Body -->
        <div class="modal-content">
            <p class="modal-warning">
                ⚠️ This action is irreversible
            </p>

            <p>
                Deleting this playlist will permanently remove it and unassign
                all videos linked to this playlist.
            </p>

            <!-- Playlist info -->
            <p>
                <input type="hidden" class="js-delete-playlist-id" />
                <strong class="js-delete-playlist-name">
                    <!-- dynamically injected playlist name -->
                </strong>
            </p>
        </div>

        <!-- Actions -->
        <button 
            class="danger-btn js-confirm-delete-playlist"
        >
            Delete
        </button>

    </div>


    <!-- for settings module -->
    <!-- 1. UPDATE PROFILE MODAL -->
    <div id="updateProfileModal" class="modal modal-lg">

        <!-- Modal Header -->
        <div class="modal-header">
            <h2 class="modal-title">Update Profile</h2>
            <span class="modal-close js-close-update-profile-modal">×</span>
            <input type="hidden" class="js-update-user-id" />
        </div>

        <!-- Modal Body -->
        <div class="modal-body update-profile-modal-body">

            <!-- SECTION 1: BASIC PROFILE DETAILS -->
            <form class="modal-section-box js-update-profile-form">

                <h4 class="section-heading">Basic Information</h4>

                <div class="modal-section two-col">
                    <div class="field">
                        <label>First Name</label>
                        <input 
                            type="text"
                            class="modal-input js-update-first-name"
                            placeholder="Enter first name"
                        />
                    </div>

                    <div class="field">
                        <label>Last Name</label>
                        <input 
                            type="text"
                            class="modal-input js-update-last-name"
                            placeholder="Enter last name"
                        />
                    </div>
                </div>

                <div class="modal-section">
                    <label>Username</label>
                    <input 
                        type="text"
                        class="modal-input js-update-username"
                        placeholder="Enter username"
                    />
                </div>

                <div class="modal-section">
                    <label>Gender</label>
                    <select class="modal-select js-update-gender">
                        <option value="">Select gender</option>
                        <option value="male">male</option>
                        <option value="female">female</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                </div>

                <div class="modal-section">
                    <label>Bio</label>
                    <textarea 
                        class="modal-textarea js-update-bio"
                        placeholder="Write something about yourself..."
                    ></textarea>
                </div>

                <button 
                    type="submit"
                    class="update-primary-btn js-save-profile-btn"
                >
                    Save Profile Changes
                </button>
            </form>
        </div>
    </div>

    <!-- 2. UPDATE PROFILE IMAGE -->
     <!-- Update Profile Image Modal -->
    <div id="updateProfileImageModal" class="modal modal-sm">

        <!-- Modal Header -->
        <div class="modal-header">
            <h2 class="modal-title">Update Profile Image</h2>
            <span class="modal-close js-close-profile-image-modal">×</span>
        </div>

        <!-- Modal Body -->
        <div class="modal-body update-profile-image-body">

            <!-- Image Preview -->
            <div class="profile-image-preview">
                <!-- default fallback if no image -->
                <div class="profile-image-placeholder js-profile-image-placeholder">
                    👤
                </div>

                <!-- actual image -->
                <img 
                    src="" 
                    alt="Profile Image"
                    class="profile-image js-profile-image-preview"
                    hidden
                />
            </div>

            <!-- Upload Section -->
            <form class="profile-image-form js-profile-image-form" enctype="multipart/form-data">

                <label class="upload-label">
                    Choose Image
                    <input 
                        type="file"
                        accept="image/*"
                        class="profile-image-input js-profile-image-input"
                        hidden
                    />
                </label>

                <!-- helper text -->
                <p class="upload-hint">
                    JPG, PNG • Max 2MB
                </p>

                <!-- action buttons -->
                <div class="modal-action-buttons">
                    <button 
                        type="submit"
                        class="update-primary-btn js-save-profile-image-btn"
                    >
                        Update Image
                    </button>

                    <button 
                        type="button"
                        class="update-danger-btn js-remove-profile-image-btn"
                    >
                        Remove Image
                    </button>
                </div>

            </form>

            <!-- messages -->
            <p class="error-msg js-profile-image-error"></p>
            <p class="success-msg js-profile-image-success"></p>

        </div>
    </div>

    <!-- Section 2 privacy and security -->
     <!-- Update Password Modal -->
    <div id="updatePasswordModal" class="modal modal-md">

        <!-- Modal Header -->
        <div class="modal-header">
            <h2 class="modal-title">Update Password</h2>
            <span class="modal-close js-close-update-password-modal">×</span>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
            <form class="password-update-form js-password-update-form">

                <!-- Current Password -->
                <div class="modal-section">
                    <label>Current Password</label>
                    <input 
                        type="password"
                        class="modal-input js-current-password"
                        placeholder="Enter current password"
                    />
                </div>

                <!-- New Password -->
                <div class="modal-section">
                    <label>New Password</label>
                    <input 
                        type="password"
                        class="modal-input js-new-password"
                        placeholder="Enter new password"
                    />
                </div>

                <!-- Confirm Password -->
                <div class="modal-section">
                    <label>Confirm New Password</label>
                    <input 
                        type="password"
                        class="modal-input js-confirm-password"
                        placeholder="Re-enter new password"
                    />
                </div>

                <!-- Info text -->
                <p class="password-hint">
                    Password must be at least 8 characters long.
                </p>

                <!-- update the password confirm -->
                <button 
                    type="submit"
                    class="update-primary-btn js-save-password-btn"
                >
                    Update Password
                </button>
            </form>
        </div>
    </div>

    <!-- delete account modal -->
    <!-- Delete Account Confirmation Modal -->
    <div id="deleteAccountModal" class="modal modal-sm">

        <!-- Modal Header -->
        <div class="modal-header">
            <h2 class="modal-title">Delete Account</h2>
            <span class="modal-close js-close-delete-account-modal">×</span>
        </div>

        <!-- Modal Body -->
        <div class="modal-body delete-account-modal-body">

            <!-- Warning Section -->
            <div class="delete-warning-box">
                <div class="delete-icon">⚠️</div>

                <h3 class="delete-heading">
                    Are you absolutely sure?
                </h3>

                <p class="delete-message">
                    This action <strong>cannot be undone</strong>.  
                    All your account data, profile details, and related content
                    will be permanently deleted.
                </p>
            </div>

            <!-- Confirmation Input -->
            <div class="modal-section">
                <label>
                    Type <strong>DELETE</strong> to confirm
                </label>
                <input 
                    type="text" 
                    class="modal-input js-delete-confirm-input"
                    placeholder="Type DELETE here"
                />
            </div>

            <!-- final delete btn -->
            <button 
                class="update-danger-btn js-confirm-delete-account-btn"
                disabled>
                confirm
            </button>
        </div>
    </div>


    <!-- toast container -->
    <section id="toast-container"></section>

    <!-- scripts -->
    <script type="module" src="/php_easy/scripts/admin/index.js?v=<?php echo time(); ?>" defer></script>
</body>
</html>