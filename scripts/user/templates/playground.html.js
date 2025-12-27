// structure of playground view..
export const playgroundHTML = `
<div class="info-container">
    <h2 class="info-heading">PHP Playground 🧪</h2>
    <p class="info-description">Write PHP code, execute it instantly, and learn by experimenting.</p>
</div>

<div class="playground-container">
    <!-- Code editor -->
    <div class="playground-editor">
        <div class="editor-header">
            <h3>Code Editor</h3>
            <button class="run-btn js-run-code">▶ Run</button>
        </div>

        <textarea class="code-editor js-code-input" placeholder="Write your PHP code here..."></textarea>
    </div>

    <!-- Output -->
    <div class="playground-output">
        <div class="output-header">
            <h3>Output</h3>
            <button class="run-btn clear-btn js-clear-output">Clear</button>
        </div>

        <pre class="output-box js-output">
        </pre>
    </div>
</div>

`;