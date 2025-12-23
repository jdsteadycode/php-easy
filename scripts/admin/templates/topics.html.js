// html for manage topics..
export const manageTopicsHTML = `
            <!-- <div class="searchbar2">
                <input type="text" name="" id="" placeholder="Search" />
                <div class="searchbtn">
                    <img src="https://media.geeksforgeeks.org/wp-content/uploads/20221210180758/Untitled-design-(28).png"
                        class="icn srchicn" alt="search-button" />
                </div>
            </div> -->


            <!-- info container -->
            <div class="info-container">
                <h2 class="info-heading">Add some topics for Problems</h2>

                <form class="topic-form">
                    <input 
                        type="text" 
                        class="topic-input js-topic-input" 
                        placeholder="Enter Topic Name" 
                        
                    />

                    <button class="topic-add-btn js-topic-add-btn">Add Topic</button>
                </form>

                <!-- handle error toast -->
                <p class="error-msg js-error-msg" id="errorMsg"></p>

                <!-- handle success toast -->
                <p class="success-msg js-success-msg" id="successMsg"></p>
            </div>

            <!-- main content container -->
            <div class="main-content-container">

                <!-- content-header -->
                <div class="main-content-header">
                    <h1 class="main-content-heading">Current Topics</h1>
                   <!-- <button class="view">View All</button> -->
                </div>

                <!-- body -->
                <div class="main-content-body">
                    <div class="main-content-topic-heading">
                        <h3 class="t-op">No</h3>
                        <h3 class="t-op">Name</h3>
                        <h3 class="t-op">Added at</h3>
                        <h3 class="t-op">Actions</h3>
                    </div>

                    <div class="items">
                        <div class="item1">
                            <h3 class="t-op-nextlvl">1</h3>
                            <h3 class="t-op-nextlvl">oops</h3>
                            <h3 class="t-op-nextlvl">(View 2)</h3>
                        </div>

                        <div class="item1">
                            <h3 class="t-op-nextlvl">2</h3>
                            <h3 class="t-op-nextlvl">pdo</h3>
                            <h3 class="t-op-nextlvl">(View 3)</h3>
                        </div>
                    </div>
                </div>
            </div>
`;