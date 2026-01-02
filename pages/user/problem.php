<?php
    // get the id
    $id = $_GET["p_id"] ?? null;

    // check log..
    // var_dump($id);
?>

<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <title>Problem | PHP Practice</title>
        <link rel="stylesheet" href="/php_easy/styles/admin/style.css" />
        <link rel="stylesheet" href="/php_easy/styles/user/contents/problem.css" />
        <link rel="stylesheet" href="/php_easy/styles/common/toasts.css" />
    </head>
    <body>
        <div class="problem-page">
            <!-- LEFT PANEL -->
            <div class="problem-left">

                <!-- back button -->
                <button class="back-button js-back-button">back</button>

                <h1 class="problem-title">PHP Variables</h1>

                <div class="problem-meta">
                    <span class="difficulty">Easy</span>
                    <span class="topics">Variables, Basics</span>
                </div>

                <div class="problem-section problem-status">
                        <div>
                            <h3>Attempts</h3>
                            <span class="attempts">0</span>
                        </div>
                        <div>
                            <h3>Accepted</h3>
                            <span class="accepted">No</span>
                        </div>
                </div>

                <div class="problem-section">
                    <h3>Description</h3>
                    <p class="problem-description">Write a PHP program to declare a variable and print its value.</p>
                </div>

                <div class="problem-section">
                    <h3>Sample Input</h3>
                    <pre class="problem-input-text">$x = 10;</pre>
                </div>

                <div class="problem-section">
                    <h3>Sample Output</h3>
                    <pre class="problem-output-text">10</pre>
                </div>

                <div class="problem-section">
                    <h3>Hints</h3>
                    <ul class="problem-hints">
                        <li>Use echo to print output</li>
                    </ul>
                </div>
            </div>

            <!-- RIGHT PANEL -->
            <div class="problem-right">
                <div class="editor-header">
                    <span>Code Box</span>
                    <button class="submit-btn">Submit</button>
                    <button class="run-btn">Run ▶</button>
                </div>

                <textarea class="code-editor" spellcheck="false"></textarea>

                <div class="output-box">
                    <strong>Output:</strong>
                    <pre id="output">—</pre>
                </div>
            </div>
        </div>

        <!-- toast container -->
        <section id="toast-container"></section>

        <!-- JavaScript -->
        <!-- initial script -->
        <script>
            // set the id..
            const problemId = <?= $id ?>;
        </script>

        <!-- problem script -->
        <script type="module" src="/php_easy/scripts/user/problem.js" defer></script>
    </body>
</html>
