// --- 1. Global State (Gamification) ---
let xp = 35;
let lessonsDone = 0;

// --- 2. Theme Management (Dark/Cute Mode) ---
function toggleTheme() {
    const isLight = document.body.classList.contains('light-mode');
    
    if (isLight) {
        document.body.classList.remove('light-mode');
        localStorage.setItem('theme', 'dark');
        console.log("🌙 Dark Mode Activated");
    } else {
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
        console.log("🌸 Cute Mode Activated");
    }
}

// Run immediately to load saved theme
(function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
})();

// --- 3. The "Brain" Connection (AI Fetch) ---
async function fetchLesson(topic) {
    const display = document.getElementById('lesson-display');
    const loading = document.getElementById('loading');
    
    loading.style.display = 'block';
    display.style.display = 'none';
    
    // Smooth scroll to loading cat
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

    try {
        const response = await fetch('https://c-learning-backend.onrender.com/api/get-lesson', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: topic })
        });

        if (!response.ok) throw new Error("Server is sleeping.");

        const data = await response.json();

        // Convert Markdown to HTML
        display.innerHTML = marked.parse(data.lessonContent);
        
        display.style.display = 'block';
        loading.style.display = 'none';

        // Highlight C Code
        Prism.highlightAll();
        
        // Update stats
        updateProgress();
        
        // Transform text quiz into clickable buttons
        makeQuizInteractive();

    } catch (error) {
        loading.innerHTML = "❌ The cat is napping. Try again in 30 seconds!";
        console.error("Fetch Error:", error);
    }
}

// --- 4. Quiz Logic (The "Nerves") ---
function makeQuizInteractive() {
    const display = document.getElementById('lesson-display');
    let html = display.innerHTML;

    // Detects patterns like A) text, B) text...
    const quizRegex = /([A-D])\)\s*([^<]+)/g;
    
    display.innerHTML = html.replace(quizRegex, (match, letter, answer) => {
        return `<button class="quiz-btn" onclick="checkAnswer('${letter}')">${letter}) ${answer}</button>`;
    });
}

function checkAnswer(selected) {
    // Basic logic: Most AI intro quizzes use 'C' for headers or 'A' for basics
    // For a real challenge, we can make the AI tell us the answer later!
    if (selected === 'C' || selected === 'A') {
        alert("🎉 Purr-fect! Correct Answer! +10 Bonus XP");
        xp += 10;
        updateProgress();
    } else {
        alert("😿 Not quite! Review the cat metaphor and try again.");
    }
}

// --- 5. Progress System ---
function updateProgress() {
    lessonsDone += 1;
    xp += 15;
    
    if (xp > 100) xp = 100; // Cap at 100 for Lv 1

    const xpBar = document.getElementById('xp-bar');
    const xpText = document.getElementById('xp-text');
    const totalXpDisplay = document.getElementById('total-xp');
    const lessonsDisplay = document.getElementById('lessons-count');

    if (xpBar) xpBar.style.width = xp + '%';
    if (xpText) xpText.innerText = `${xp}/100 XP`;
    if (totalXpDisplay) totalXpDisplay.innerText = xp;
    if (lessonsDisplay) lessonsDisplay.innerText = lessonsDone;
}
