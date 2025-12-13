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
            <!-- <div class="searchbar2">
                <input type="text" name="" id="" placeholder="Search" />
                <div class="searchbtn">
                    <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180758/Untitled-design-(28).png"
                        class="icn srchicn" alt="search-button" />
                </div>
            </div> -->


            <!-- top content boxes -->
            <div class="box-container">
                <div class="box box1">
                    <div class="text">
                        <h2 class="topic-heading">10</h2>
                        <h2 class="topic">Total categories</h2>
                    </div>

                    <!-- <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210184645/Untitled-design-(31).png"
                        alt="Views" /> -->

                    <span class="box-emoji">
                        👀
                    </span>
                </div>

                <div class="box box2">
                    <div class="text">
                        <h2 class="topic-heading">150</h2>
                        <h2 class="topic">Total topics</h2>
                    </div>

                    <!-- <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210185030/14.png" alt="likes" /> -->

                    <span class="box-emoji">
                        👍
                    </span>
                </div>

                <div class="box box3">
                    <div class="text">
                        <h2 class="topic-heading">320</h2>
                        <h2 class="topic">Total Submissions</h2>
                    </div>

                    <!-- <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210184645/Untitled-design-(32).png"
                        alt="comments" /> -->

                    <span class="box-emoji">
                        ✔️
                    </span>
                </div>

                <div class="box box4">
                    <div class="text">
                        <h2 class="topic-heading">70</h2>
                        <h2 class="topic">Total users</h2>
                    </div>

                    <!-- <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210185029/13.png"
                        alt="published" /> -->

                        <span class="box-emoji">
                            🔢
                        </span>
                </div>
            </div>

            <!-- main content container -->
            <div class="main-content-container">

                <!-- content-header -->
                <div class="main-content-header">
                    <h1 class="main-content-heading">Current Users</h1>
                    <button class="view">View All</button>
                </div>

                <!-- body -->
                <div class="main-content-body">
                    <div class="main-content-topic-heading">
                        <h3 class="t-op">Name</h3>
                        <h3 class="t-op">Has practiced?</h3>
                        <h3 class="t-op">Submissions</h3>
                        <h3 class="t-op">Status</h3>
                    </div>

                    <div class="items">
                        <div class="item1">
                            <h3 class="t-op-nextlvl">Jake</h3>
                            <h3 class="t-op-nextlvl">No</h3>
                            <h3 class="t-op-nextlvl">5</h3>
                            <h3 class="t-op-nextlvl label-tag">Active</h3>
                        </div>

                        <div class="item1">
                            <h3 class="t-op-nextlvl">Sam</h3>
                            <h3 class="t-op-nextlvl">Yes</h3>
                            <h3 class="t-op-nextlvl">10</h3>
                            <h3 class="t-op-nextlvl label-tag">Active</h3>
                        </div>

                        <div class="item1">
                            <h3 class="t-op-nextlvl">Palash</h3>
                            <h3 class="t-op-nextlvl">No</h3>
                            <h3 class="t-op-nextlvl">0</h3>
                            <h3 class="t-op-nextlvl label-tag in-active">In-Active</h3>
                        </div>

                       
                    </div>
                </div>
            </div>
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

        <button class="close-btn view-delete-close-btn " onclick="closeModal(event)">Close</button>
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
                <button class="primary-btn" onclick="handleUpdateTopic(event);">Update</button>
                <button class="close-btn" onclick="closeModal(event)">Cancel</button>
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
            <button class="danger-btn" id="confirmDeleteBtn" onclick="handleTopicDelete(event);">Yes Delete</button>
            <button class="close-btn" onclick="closeModal(event)">Cancel</button>
        </div>
    </div>


    <!-- footer section -->
    <?php require_once(FILE_PATH . "/components/admin/admin_footer.php") ?>

    <!-- scripts -->
    <script src="../../scripts/admin/index.js?v=<?php echo time(); ?>"></script>
</body>
</html>