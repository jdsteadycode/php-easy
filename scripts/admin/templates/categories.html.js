// html for manage categories..
export const manageCategoriesHTML = `
    <div class="main">

        <!-- info container -->
        <div class="info-container">
            <h2 class="info-heading">Manage Categories</h2>
            
            <p class="info-description">
                Add some categories for the videos and also, sub categories for each category..
            </p>

            <button 
                class="open-add-categories-btn js-open-add-categories-btn" 
            >➕ add</button>
        </div>

        <!-- main content container -->
        <div class="main-content-container">

            <!-- content-header -->
            <div class="main-content-header">
                <h1 class="main-content-heading">Current Categories</h1>
            </div>

            <!-- body -->
            <div class="main-content-body">

                <!-- table heading -->
                <div class="main-content-topic-heading">
                    <h3 class="t-op">No</h3>
                    <h3 class="t-op">Name</h3>
                    <h3 class="t-op">Added at</h3>
                    <h3 class="t-op">Actions</h3>
                </div>

                <!-- table rows -->
                <div class="items js-category-items">

                    <!-- ROW 1 -->
                    <div class="item1">
                        <h3 class="t-op-nextlvl">1</h3>

                        <h3 class="t-op-nextlvl">
                            Basics
                        </h3>

                        <h3 class="t-op-nextlvl">
                            14 Sep 2024
                        </h3>
                    </div>

                    <!-- ROW 2 -->
                    <div class="item1">
                        <h3 class="t-op-nextlvl">2</h3>

                        <h3 class="t-op-nextlvl">
                            Arrays
                        </h3>

                        <h3 class="t-op-nextlvl">
                            16 Sep 2024
                        </h3>

                        <h3 class="t-op-nextlvl sub-categories">
                            <span class="sub-empty">—</span>
                        </h3>
                    </div>

                </div>
            </div>
        </div>
    </div>
`;
