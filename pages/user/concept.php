<?php
// load config
require_once("../../config/config.php");
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PhpEasy - Concept View</title>

    <!-- main style -->
    <link rel="stylesheet" href="/php_easy/styles/admin/style.css?v=<?php echo time(); ?>" />
    <!-- learn specific styles -->
    <link rel="stylesheet" href="/php_easy/styles/user/contents/learn.css?v=<?php echo time(); ?>" />
    <!-- concept page styles -->
    <link rel="stylesheet" href="/php_easy/styles/user/contents/concept.css?v=<?php echo time(); ?>" />
</head>
<body>

    <!-- header -->
    <?php require_once(FILE_PATH . "/components/header.php") ?>

    <!-- main container -->
    <main class="main-container">

        <!-- concept content -->
        <div class="main">

            <!-- Breadcrumbs + Back Button -->
            <div class="concept-topbar">
                <div class="breadcrumbs">
                    <span>Learn</span> &rsaquo; 
                    <span class="parent-category">Basics</span> &rsaquo; 
                    <span class="sub-category">Arrays</span>
                </div>
                <!-- Child Concepts Selector -->
                <div class="concept-tabs js-concept-tabs">
                    <button class="concept-tab active" data-category-id="12">
                        Indexed Arrays
                    </button>
                    <button class="concept-tab" data-category-id="13">
                        Associative Arrays
                    </button>
                    <button class="concept-tab" data-category-id="14">
                        Multidimensional Arrays
                    </button>
                </div>
                <!-- back button -->
                <button class="back-btn" onclick="window.history.back()">← Back</button>
            </div>

            <!-- Concept Header -->
            <div class="concept-header">
                <h1 class="concept-title">Indexed Arrays</h1>
                <p class="concept-summary">
                    Indexed arrays store ordered lists of values accessed via numeric indexes.
                </p>
            </div>

            <!-- Concept Explanation -->
            <section class="concept-explanation">
                <h2>Explanation</h2>
                <p class="explanation-text js-explanation-text">
                    Indexed arrays in PHP allow you to store multiple values in a single variable.
                    Each value can be accessed using a numeric index starting from 0.
                </p>
                <p>
                    You can loop through the array using <code>for</code> or <code>foreach</code> loops
                    to access each element.
                </p>
            </section>

            <!-- Example Code -->
            <section class="concept-example">
                <h2>Example</h2>
                <pre class="concept-example-text js-concept-example-text">
&lt;?php
$names = ["John", "Alice", "Bob"];

echo $names[0]; // John

foreach($names as $name) {
    echo $name;
}
?&gt;
                </pre>
            </section>

            <!-- Notes / Tips -->
            <section class="concept-notes">
                <h2>Notes / Tips</h2>
                <ul class="notes-container js-notes-container">
                    <li>Indexes start at 0 by default.</li>
                    <li>You can add elements using <code>$array[] = 'value';</code></li>
                    <li>Use <code>count($array)</code> to get the number of elements.</li>
                </ul>
            </section>

            <!-- Related Resources -->
            <section class="concept-resources">
                <h2>Related Resources</h2>
                <ul class="resources-list js-resources-list">
                    <li><a href="https://www.php.net/manual/en/language.types.array.php" target="_blank">PHP Manual: Arrays</a></li>
                    <li><a href="https://www.youtube.com/watch?v=example" target="_blank">YouTube: Indexed Arrays Explained</a></li>
                </ul>
            </section>

            <!-- CTA -->
            <!-- <section class="concept-cta">
                <button class="primary-btn" onclick="window.location.href='/php_easy/pages/user/index.php'">
                    Practice Indexed Arrays →
                </button>
            </section> -->

        </div>
    </main>

    <!-- footer -->
    <?php require_once(FILE_PATH . "/components/footer.php") ?>

    <!-- js -->
     <script type="module" src="/php_easy/scripts/user/concept.js" defer></script>
</body>
</html>
