// html (structure) for (preparation/ problem sets view)
export const prepHTML = `
<!-- TOP: Intro Section -->
<section class="prep-hero">
    <h1 class="prep-title">PHP Interview Preparation</h1>
    <p class="prep-description">
        Practice real-world PHP problems asked in interviews. Strengthen your fundamentals, logic, and confidence.
    </p>

    <div class="prep-stats">
        <span>🟢 Easy: 12</span>
        <span>🟡 Medium: 18</span>
        <span>🔴 Hard: 6</span>
    </div>
</section>

<!-- FILTER BAR -->
<section class="prep-filters">
    <div class="filter-left">
        <button class="filter-btn active">All</button>
        <button class="filter-btn easy">Easy</button>
        <button class="filter-btn medium">Medium</button>
        <button class="filter-btn hard">Hard</button>
    </div>

    <div class="filter-right">
        <input type="text" class="filter-search" placeholder="Search problems..." />
    </div>
</section>

<!-- PROBLEM LIST -->
<section class="prep-problems">
    <!-- Problem Card -->
    <div class="problem-card">
        <div class="problem-info">
            <h3 class="problem-title">PHP Variables</h3>
            <p class="problem-topic">Basics • Variables</p>
        </div>

        <div class="problem-meta">
            <span class="difficulty easy">Easy</span>
            <button class="solve-btn">Solve →</button>
        </div>
    </div>

    <div class="problem-card">
        <div class="problem-info">
            <h3 class="problem-title">Associative Arrays</h3>
            <p class="problem-topic">Arrays</p>
        </div>

        <div class="problem-meta">
            <span class="difficulty medium">Medium</span>
            <button class="solve-btn">Solve →</button>
        </div>
    </div>
</section>
`;